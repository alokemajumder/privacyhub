/**
 * OpenRouter API Key Manager
 * Handles intelligent key rotation and fallback logic
 */

interface KeyStatus {
  key: string;
  name: string;
  isAvailable: boolean;
  lastChecked: number;
  credits?: number;
  rateLimitRemaining?: number;
  error?: string;
}

interface KeyUsageCache {
  [keyName: string]: KeyStatus;
}

// In-memory cache for key status (resets on serverless function restart)
const keyStatusCache: KeyUsageCache = {};
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Get all available API keys from environment
 */
function getAllKeys(): Array<{ name: string; key: string }> {
  const keys: Array<{ name: string; key: string }> = [];

  const primaryKey = process.env.OPENROUTER_API;
  const fallbackKey = process.env.OPENROUTER_API_1;

  if (primaryKey) {
    keys.push({ name: 'primary', key: primaryKey });
  }

  if (fallbackKey) {
    keys.push({ name: 'fallback', key: fallbackKey });
  }

  return keys;
}

/**
 * Check if cached status is still valid
 */
function isCacheValid(lastChecked: number): boolean {
  return Date.now() - lastChecked < CACHE_DURATION;
}

/**
 * Check key credits and availability via OpenRouter API
 */
async function checkKeyCredits(apiKey: string): Promise<{
  credits: number;
  rateLimitRemaining: number;
  isAvailable: boolean;
  error?: string;
}> {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/key', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      return {
        credits: 0,
        rateLimitRemaining: 0,
        isAvailable: false,
        error: `HTTP ${response.status}`,
      };
    }

    const data = await response.json();

    return {
      credits: data.limit || 0,
      rateLimitRemaining: data.rate_limit?.remaining || 100,
      isAvailable: true,
    };
  } catch (error) {
    return {
      credits: 0,
      rateLimitRemaining: 0,
      isAvailable: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get the best available API key based on current status
 */
export async function getBestAvailableKey(): Promise<{
  key: string;
  name: string;
} | null> {
  const allKeys = getAllKeys();

  if (allKeys.length === 0) {
    console.error('[KeyManager] No API keys configured');
    return null;
  }

  // Check each key's status
  for (const { name, key } of allKeys) {
    const cached = keyStatusCache[name];

    // Use cached status if valid
    if (cached && isCacheValid(cached.lastChecked) && cached.isAvailable) {
      console.log(`[KeyManager] Using cached ${name} key`);
      return { key, name };
    }

    // Check key status if cache is stale or unavailable
    console.log(`[KeyManager] Checking ${name} key status...`);
    const status = await checkKeyCredits(key);

    // Update cache
    keyStatusCache[name] = {
      key,
      name,
      isAvailable: status.isAvailable,
      lastChecked: Date.now(),
      credits: status.credits,
      rateLimitRemaining: status.rateLimitRemaining,
      error: status.error,
    };

    // Return first available key
    if (status.isAvailable && status.rateLimitRemaining > 0) {
      console.log(`[KeyManager] Using ${name} key (${status.rateLimitRemaining} rate limit remaining)`);
      return { key, name };
    }
  }

  console.error('[KeyManager] No available keys found');
  return null;
}

/**
 * Mark a key as failed (for immediate rotation)
 */
export function markKeyAsFailed(keyName: string, error: string): void {
  if (keyStatusCache[keyName]) {
    keyStatusCache[keyName].isAvailable = false;
    keyStatusCache[keyName].error = error;
    keyStatusCache[keyName].lastChecked = Date.now();
    console.log(`[KeyManager] Marked ${keyName} key as failed: ${error}`);
  }
}

/**
 * Get status of all keys for monitoring
 */
export function getAllKeyStatus(): KeyUsageCache {
  return keyStatusCache;
}

/**
 * Force refresh all key statuses
 */
export async function refreshAllKeyStatus(): Promise<void> {
  const allKeys = getAllKeys();

  for (const { name, key } of allKeys) {
    const status = await checkKeyCredits(key);

    keyStatusCache[name] = {
      key,
      name,
      isAvailable: status.isAvailable,
      lastChecked: Date.now(),
      credits: status.credits,
      rateLimitRemaining: status.rateLimitRemaining,
      error: status.error,
    };
  }

  console.log('[KeyManager] Refreshed all key statuses:', keyStatusCache);
}
