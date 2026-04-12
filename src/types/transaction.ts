import { z } from 'zod';

// ─── Transaction Interface ───
export interface Transaction {
  id: number;
  date: string;       // ISO format from pd.to_datetime (e.g. "2024-01-15 00:00:00")
  time: string;
  symbol: string;
  action: 'BUY' | 'SELL';
  target_price: number;
  actual_value: number;
  quantity: number;
  profit_loss: number;
  note: string | null;
}

// ─── Zod Schema for Add Record validation ───
export const transactionSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  symbol: z.string().min(1, 'Symbol is required').toUpperCase(),
  action: z.enum(['BUY', 'SELL'], { error: 'Action is required' }),
  target_price: z.number().optional().default(0),
  actual_value: z.number({ message: 'Actual value is required' }).positive('Must be positive'),
  quantity: z.number({ message: 'Quantity is required' }).positive('Must be positive'),
  profit_loss: z.number().optional().default(0),
  note: z.string().optional().default(''),
});

export type TransactionInput = z.infer<typeof transactionSchema>;

// ─── Dashboard summary types ───
export interface PortfolioSummary {
  totalInvested: number;
  currentValue: number;
  totalGainLoss: number;
  gainLossPercentage: number;
}

export interface StockAllocation {
  symbol: string;
  totalInvested: number;
  quantity: number;
  percentage: number;
}

export interface PerformanceDataPoint {
  date: string;
  cumulativeInvested: number;
}
