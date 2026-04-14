'use client';

import { TrendingUp, TrendingDown, Wallet, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { PortfolioSummary } from '@/types/transaction';

interface DashboardCardsProps {
  summary: PortfolioSummary;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(value));
};

const DashboardCards = ({ summary }: DashboardCardsProps) => {
  const isGain = summary.totalGainLoss >= 0;

  const cards = [
    {
      id: 'total-invested',
      title: 'Total Invested',
      value: `฿${formatCurrency(summary.totalInvested)}`,
      icon: Wallet,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      subtitle: 'Lifetime investment',
    },
    {
      id: 'current-value',
      title: 'Current Value',
      value: `฿${formatCurrency(summary.currentValue)}`,
      icon: DollarSign,
      iconBg: 'bg-mint/10',
      iconColor: 'text-mint-dark',
      subtitle: summary.lastUpdated ? `Last updated: ${new Date(summary.lastUpdated).toLocaleDateString('en-GB')}` : 'Portfolio valuation'
    },
    {
      id: 'total-gain-loss',
      title: 'Total Gain / Loss',
      value: `${isGain ? '+' : '-'}฿${formatCurrency(summary.totalGainLoss)}`,
      icon: isGain ? TrendingUp : TrendingDown,
      iconBg: isGain ? 'bg-green-50' : 'bg-red-50',
      iconColor: isGain ? 'text-gain' : 'text-loss',
      subtitle: `${isGain ? '+' : ''}${summary.gainLossPercentage.toFixed(2)}%`,
      subtitleColor: isGain ? 'text-gain' : 'text-loss',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.id}
            id={card.id}
            className="group overflow-hidden border-0 bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold tracking-tight">{card.value}</p>
                  <p className={`text-xs font-medium ${card.subtitleColor || 'text-muted-foreground'}`}>
                    {card.subtitle}
                  </p>
                </div>
                <div className={`rounded-xl p-2.5 ${card.iconBg} transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardCards;
