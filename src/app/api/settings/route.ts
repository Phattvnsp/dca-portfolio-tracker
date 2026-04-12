import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/settings?key=xxx
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return Response.json({ error: 'Key is required' }, { status: 400 });
    }

    const db = getDb();

    if (key === 'valuationHistory') {
       const rows = db.prepare('SELECT date, value FROM valuation_history ORDER BY date ASC').all() as { date: string, value: number }[];
       return Response.json(rows);
    }

    const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as { value: string } | undefined;

    return Response.json({ value: row?.value ?? null });
  } catch (error) {
    console.error('GET /api/settings error:', error);
    return Response.json({ error: 'Failed to get setting' }, { status: 500 });
  }
}

// POST /api/settings — upsert a setting
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key, value, date } = body;

    if (!key) {
      return Response.json({ error: 'Key is required' }, { status: 400 });
    }

    const db = getDb();
    db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(key, String(value));

    // Special: If saving currentPortfolioValue, also record to history
    if (key === 'currentPortfolioValue') {
      const recordDate = date || new Date().toISOString().split('T')[0];
      // Keep only one record per day to avoid bloating
      db.prepare('INSERT OR REPLACE INTO valuation_history (date, value) VALUES (?, ?)')
        .run(recordDate, parseFloat(value));
    }

    return Response.json({ message: 'Setting saved', key, value });
  } catch (error) {
    console.error('POST /api/settings error:', error);
    return Response.json({ error: 'Failed to save setting' }, { status: 500 });
  }
}
