import { NextRequest, NextResponse } from 'next/server';
import { refreshAllKeyStatus, getAllKeyStatus } from '@/lib/openrouter-key-manager';

export const dynamic = 'force-dynamic';

/**
 * Cron endpoint to refresh OpenRouter API key statuses
 * Runs daily to check credits and rate limits
 *
 * To enable on Vercel:
 * Add to vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/refresh-keys",
 *     "schedule": "0 0 * * *"  (daily at midnight UTC)
 *   }]
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Verify this is actually a cron request from Vercel
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // If CRON_SECRET is set, verify it matches
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({
        error: 'Unauthorized'
      }, { status: 401 });
    }

    console.log('[Cron] Refreshing OpenRouter API key statuses...');

    // Refresh all key statuses
    await refreshAllKeyStatus();

    // Get updated status
    const keyStatus = getAllKeyStatus();

    // Sanitize response
    const sanitizedStatus = Object.entries(keyStatus).map(([name, status]) => ({
      name,
      isAvailable: status.isAvailable,
      credits: status.credits,
      rateLimitRemaining: status.rateLimitRemaining,
      lastChecked: new Date(status.lastChecked).toISOString(),
      error: status.error,
    }));

    console.log('[Cron] Key status refresh complete:', sanitizedStatus);

    return NextResponse.json({
      success: true,
      message: 'API key statuses refreshed successfully',
      keys: sanitizedStatus,
      timestamp: new Date().toISOString()
    });

  } catch (error: unknown) {
    console.error('[Cron] Key refresh error:', error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    return NextResponse.json({
      error: 'Failed to refresh key statuses',
      details: errorMessage
    }, { status: 500 });
  }
}
