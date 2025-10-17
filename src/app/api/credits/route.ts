import { NextRequest, NextResponse } from 'next/server';
import { getAllKeyStatus, refreshAllKeyStatus } from '@/lib/openrouter-key-manager';

export const dynamic = 'force-dynamic';

/**
 * Check OpenRouter API credits for all configured keys
 * This endpoint is intentionally sanitized to not expose API keys
 */
export async function GET(_request: NextRequest) {
  try {
    // Get current status from cache
    let keyStatus = getAllKeyStatus();

    // If cache is empty (cold start), refresh all keys
    if (Object.keys(keyStatus).length === 0) {
      console.log('[Credits] Cache empty, refreshing all key statuses...');
      await refreshAllKeyStatus();
      keyStatus = getAllKeyStatus();
    }

    // Sanitize response to remove sensitive data
    const sanitizedStatus = Object.entries(keyStatus).map(([name, status]) => ({
      name,
      isAvailable: status.isAvailable,
      credits: status.credits,
      rateLimitRemaining: status.rateLimitRemaining,
      lastChecked: new Date(status.lastChecked).toISOString(),
      error: status.error,
      // Never include the actual key
    }));

    return NextResponse.json({
      success: true,
      keys: sanitizedStatus,
      totalKeys: sanitizedStatus.length,
      availableKeys: sanitizedStatus.filter(k => k.isAvailable).length,
      timestamp: new Date().toISOString(),
      note: 'API keys are not exposed for security'
    });

  } catch (error: unknown) {
    console.error('Credits check error:', error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    return NextResponse.json({
      error: 'Failed to check API credits',
      details: errorMessage
    }, { status: 500 });
  }
}
