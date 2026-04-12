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
    const { key, value } = body;

    if (!key) {
      return Response.json({ error: 'Key is required' }, { status: 400 });
    }

    const db = getDb();
    db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(key, String(value));

    return Response.json({ message: 'Setting saved', key, value });
  } catch (error) {
    console.error('POST /api/settings error:', error);
    return Response.json({ error: 'Failed to save setting' }, { status: 500 });
  }
}
