'use client';

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Transaction } from '@/types/transaction';

interface TransactionTableProps {
  transactions: Transaction[];
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(value));
};

const formatDate = (dateStr: string): string => {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
};

const TransactionTable = ({ transactions }: TransactionTableProps) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border">
        <p className="text-sm text-muted-foreground">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border bg-muted/30 hover:bg-muted/30">
            <TableHead className="text-xs font-semibold uppercase tracking-wider">Date</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider">Time</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider">Symbol</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider">Action</TableHead>
            <TableHead className="text-right text-xs font-semibold uppercase tracking-wider">Target Price</TableHead>
            <TableHead className="text-right text-xs font-semibold uppercase tracking-wider">Value</TableHead>
            <TableHead className="text-right text-xs font-semibold uppercase tracking-wider">Qty</TableHead>
            <TableHead className="text-right text-xs font-semibold uppercase tracking-wider">P/L</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider">Note</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx, index) => (
            <TableRow
              key={tx.id}
              className="transition-colors duration-150 hover:bg-muted/20"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <TableCell className="text-sm font-medium">{formatDate(tx.date)}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{tx.time || '—'}</TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-semibold">
                  {tx.symbol}
                </span>
              </TableCell>
              <TableCell>
                <Badge
                  variant={tx.action === 'BUY' ? 'default' : 'destructive'}
                  className={`text-[11px] font-semibold ${
                    tx.action === 'BUY'
                      ? 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200'
                      : 'bg-red-50 text-red-700 hover:bg-red-100 border-red-200'
                  }`}
                >
                  {tx.action}
                </Badge>
              </TableCell>
              <TableCell className="text-right text-sm tabular-nums">
                {tx.target_price ? `฿${formatCurrency(tx.target_price)}` : '—'}
              </TableCell>
              <TableCell className="text-right text-sm font-medium tabular-nums">
                ฿{formatCurrency(tx.actual_value)}
              </TableCell>
              <TableCell className="text-right text-sm tabular-nums">
                {Math.abs(tx.quantity).toLocaleString('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 5 })}
              </TableCell>
              <TableCell className={`text-right text-sm font-medium tabular-nums ${
                tx.profit_loss > 0 ? 'text-gain' : tx.profit_loss < 0 ? 'text-loss' : 'text-muted-foreground'
              }`}>
                {tx.profit_loss !== 0 ? `${tx.profit_loss > 0 ? '+' : '-'}฿${formatCurrency(tx.profit_loss)}` : '—'}
              </TableCell>
              <TableCell className="max-w-[150px] truncate text-xs text-muted-foreground">
                {tx.note || '—'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionTable;
