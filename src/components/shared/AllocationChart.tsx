'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { StockAllocation } from '@/types/transaction';

interface AllocationChartProps {
  data: StockAllocation[];
}

const COLORS = [
  '#52F2D0', '#6366F1', '#F59E0B', '#EC4899',
  '#14B8A6', '#8B5CF6', '#F97316', '#06B6D4',
  '#84CC16', '#E11D48',
];

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(value));
};

interface TooltipPayloadItem {
  name: string;
  value: number;
  payload: StockAllocation & { fill: string };
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="rounded-lg border border-border bg-card px-4 py-3 shadow-lg">
        <p className="text-sm font-semibold">{data.name}</p>
        <p className="text-xs text-muted-foreground">
          ฿{formatCurrency(data.value)} ({data.payload.percentage.toFixed(1)}%)
        </p>
        <p className="text-xs text-muted-foreground">
          {Math.abs(data.payload.quantity).toFixed(0)} shares
        </p>
      </div>
    );
  }
  return null;
};

const AllocationChart = ({ data }: AllocationChartProps) => {
  if (!data || data.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-foreground">Investment Allocation</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center">
          <p className="text-sm text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    ...item,
    totalInvested: Math.abs(item.totalInvested),
  }));

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-foreground">Investment Allocation</CardTitle>
        <p className="text-xs text-muted-foreground">Distribution by individual stock</p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={110}
                paddingAngle={3}
                dataKey="totalInvested"
                nameKey="symbol"
                strokeWidth={2}
                stroke="#fff"
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    className="transition-opacity duration-200 hover:opacity-80"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AllocationChart;
