import { NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { transactionSchema } from '@/types/transaction';

export const dynamic = 'force-dynamic';

// GET /api/transactions — fetch all transactions
export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = request.nextUrl;

    const symbol = searchParams.get('symbol');
    const action = searchParams.get('action');

    let query = 'SELECT * FROM transactions';
    const conditions: string[] = [];
    const params: string[] = [];

    if (symbol) {
      conditions.push('symbol = ?');
      params.push(symbol);
    }
    if (action) {
      conditions.push('action = ?');
      params.push(action);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY date DESC, time DESC';

    const transactions = db.prepare(query).all(...params);
    return Response.json(transactions);
  } catch (error) {
    console.error('GET /api/transactions error:', error);
    return Response.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

// POST /api/transactions — add a new transaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = transactionSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const db = getDb();

    // For SELL actions, make quantity and actual_value negative
    const quantity = data.action === 'SELL' ? -Math.abs(data.quantity) : Math.abs(data.quantity);
    const actualValue = data.action === 'SELL' ? -Math.abs(data.actual_value) : Math.abs(data.actual_value);

    const stmt = db.prepare(`
      INSERT INTO transactions (date, time, symbol, action, target_price, actual_value, quantity, profit_loss, note)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      data.date,
      data.time,
      data.symbol,
      data.action,
      data.target_price,
      actualValue,
      quantity,
      data.profit_loss,
      data.note || null
    );

    return Response.json(
      { message: 'Transaction added', id: result.lastInsertRowid },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/transactions error:', error);
    return Response.json(
      { error: 'Failed to add transaction' },
      { status: 500 }
    );
  }
}
