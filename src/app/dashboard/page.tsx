'use client';

import { useState, useEffect, useCallback } from 'react';
import DashboardCards from '@/components/shared/DashboardCards';
import AllocationChart from '@/components/shared/AllocationChart';
import PerformanceChart from '@/components/shared/PerformanceChart';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Save } from 'lucide-react';
import type { Transaction, PortfolioSummary, StockAllocation, PerformanceDataPoint } from '@/types/transaction';

const DashboardPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentValue, setCurrentValue] = useState<string>('');
  const [savedValue, setSavedValue] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [txRes, settingsRes] = await Promise.all([
        fetch('/api/transactions'),
        fetch('/api/settings?key=currentPortfolioValue'),
      ]);
      const txData = await txRes.json();
      const settingsData = await settingsRes.json();

      setTransactions(txData);
      if (settingsData.value) {
        setSavedValue(parseFloat(settingsData.value));
        setCurrentValue(settingsData.value);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ─── Compute Allocation ───
  const computeAllocation = (): StockAllocation[] => {
    const symbolMap = new Map<string, { totalInvested: number; quantity: number }>();

    transactions.forEach((t) => {
      const existing = symbolMap.get(t.symbol) || { totalInvested: 0, quantity: 0 };
      if (t.action === 'BUY') {
        existing.totalInvested += Math.abs(t.actual_value);
        existing.quantity += Math.abs(t.quantity);
      } else if (t.action === 'SELL') {
        existing.totalInvested -= Math.abs(t.actual_value);
        existing.quantity -= Math.abs(t.quantity);
      }
      symbolMap.set(t.symbol, existing);
    });

    const activeAllocations = Array.from(symbolMap.entries()).filter(
      ([_, data]) => data.quantity > 0.0001
    );

    const total = activeAllocations.reduce((s, [_, v]) => s + v.totalInvested, 0);

    return activeAllocations.map(([symbol, data]) => ({
      symbol,
      totalInvested: data.totalInvested,
      quantity: data.quantity,
      percentage: total > 0 ? (data.totalInvested / total) * 100 : 0,
    }));
  };

  // ─── Compute Summary ───
  const computeSummary = (): PortfolioSummary => {
    // 1. Calculate active Total Invested by summing the cost of held stocks via computeAllocation()
    const allocations = computeAllocation();
    // Re-sum the exact buy costs minus sell costs of only the active stocks, or just use the simplest Net Invested?
    // Actually, allocations already hold the net totalInvested (Buy - Sell) for active stocks!
    // But wait, if they sold halfway, the cost basis formula should be AVERAGE COST, not just (Total Buy - Total Sell cash)
    // To keep it simple, we'll use Total Cash In - Total Cash Out as Net Cash Flow.
    
    // Method: Net Cash Flow (Total Deposits - Total Withdrawals)
    const netInvested = transactions.reduce((sum, t) => {
      if (t.action === 'BUY') return sum + Math.abs(t.actual_value);
      if (t.action === 'SELL') return sum - Math.abs(t.actual_value);
      return sum;
    }, 0);

    const cv = savedValue || netInvested;
    const totalGainLoss = cv - netInvested;
    const gainLossPercentage = netInvested > 0 ? (totalGainLoss / netInvested) * 100 : 0;

    return { totalInvested: netInvested, currentValue: cv, totalGainLoss, gainLossPercentage };
  };

  // ─── Compute Performance ───
  const computePerformance = (): PerformanceDataPoint[] => {
    const sorted = [...transactions]
      .filter((t) => t.action === 'BUY')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const dateMap = new Map<string, number>();
    let cumulative = 0;

    sorted.forEach((t) => {
      const dateKey = new Date(t.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' });
      cumulative += Math.abs(t.actual_value);
      dateMap.set(dateKey, cumulative);
    });

    return Array.from(dateMap.entries()).map(([date, cumulativeInvested]) => ({
      date,
      cumulativeInvested,
    }));
  };

  // ─── Save Current Value ───
  const handleSaveValue = async () => {
    const numValue = parseFloat(currentValue);
    if (isNaN(numValue) || numValue < 0) return;

    setSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'currentPortfolioValue', value: numValue }),
      });
      setSavedValue(numValue);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
          <div className="h-4 w-72 animate-pulse rounded-md bg-muted" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-[380px] animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  const summary = computeSummary();
  const allocation = computeAllocation();
  const performance = computePerformance();

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of your DCA portfolio performance
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground/60 italic">
            * Gain/Loss is calculated using Net Cash Flow logic. Please verify official results with your broker.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchData}
          className="gap-2"
          id="refresh-dashboard"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
      </div>

      {/* ─── Summary Cards ─── */}
      <DashboardCards summary={summary} />

      {/* ─── Quick Update Current Value ─── */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Update Current Portfolio Value</CardTitle>
          <p className="text-xs text-muted-foreground">
            Enter your current portfolio valuation to track gains/losses
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">฿</span>
              <Input
                id="current-value-input"
                type="number"
                placeholder="0.00"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                className="pl-7"
                min="0"
                step="0.01"
              />
            </div>
            <Button
              id="save-value-btn"
              onClick={handleSaveValue}
              disabled={saving || !currentValue}
              className="gap-2 bg-mint text-foreground hover:bg-mint-dark"
            >
              <Save className="h-3.5 w-3.5" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ─── Charts ─── */}
      <div className="grid gap-4 lg:grid-cols-2">
        <AllocationChart data={allocation} />
        <PerformanceChart data={performance} />
      </div>
    </div>
  );
};

export default DashboardPage;
