import Database from 'better-sqlite3';
import path from 'path';

// ─── Singleton pattern for SQLite connection ───
let db: Database.Database | null = null;

export const getDb = (): Database.Database => {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'portfolio.db');
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');

    // Create table if it doesn't exist (for fresh starts without migration)
    db.exec(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,
        time TEXT,
        symbol TEXT,
        action TEXT,
        target_price REAL,
        actual_value REAL,
        quantity REAL,
        profit_loss REAL,
        note TEXT
      )
    `);

    // Create settings table for storing current portfolio value
    db.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `);

    // Create valuation history table
    db.exec(`
      CREATE TABLE IF NOT EXISTS valuation_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT DEFAULT CURRENT_DATE,
        value REAL
      )
    `);
  }
  return db;
};
