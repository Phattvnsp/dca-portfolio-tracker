'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PerformanceDataPoint } from '@/types/transaction';

interface PerformanceChartProps {
  data: PerformanceDataPoint[];
}

const formatCurrency = (value: number): string => {
  if (value >= 1000000) return `฿${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `฿${(value / 1000).toFixed(1)}K`;
  return `฿${value.toFixed(0)}`;
};

interface TooltipPayloadItem {
  value: number;
  dataKey: string;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadItem[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card px-4 py-3 shadow-lg">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground">
          ฿{new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2 }).format(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const PerformanceChart = ({ data }: PerformanceChartProps) => {
  if (!data || data.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-foreground">Portfolio Performance</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center">
          <p className="text-sm text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-foreground">Portfolio Performance</CardTitle>
        <p className="text-xs text-muted-foreground">Cumulative investment over time</p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="mintGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#52F2D0" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#52F2D0" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.005 90)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: 'oklch(0.5 0.01 260)' }}
                axisLine={false}
                tickLine={false}
                dy={8}
              />
              <YAxis
                tickFormatter={formatCurrency}
                tick={{ fontSize: 11, fill: 'oklch(0.5 0.01 260)' }}
                axisLine={false}
                tickLine={false}
                dx={-8}
                width={65}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="cumulativeInvested"
                stroke="#52F2D0"
                strokeWidth={2.5}
                fill="url(#mintGradient)"
                dot={false}
                activeDot={{ r: 5, fill: '#52F2D0', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
