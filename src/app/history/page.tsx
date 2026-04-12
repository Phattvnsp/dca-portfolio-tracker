'use client';

import { useState, useEffect } from 'react';
import TransactionTable from '@/components/shared/TransactionTable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from 'lucide-react';
import type { Transaction } from '@/types/transaction';

const HistoryPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const url = new URL('/api/transactions', window.location.origin);
        if (actionFilter !== 'ALL') {
          url.searchParams.append('action', actionFilter);
        }
        
        const res = await fetch(url.toString());
        const data = await res.json();
        setTransactions(data);
      } catch (error) {
        console.error('Failed to fetch history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [actionFilter]); // Refetch when action filter changes

  // Client-side search filtering for Symbol
  const filteredTransactions = transactions.filter((tx) => 
    tx.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Transaction History</h1>
        <p className="text-sm text-muted-foreground">
          View and filter all your past investments
        </p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">All Records</CardTitle>
              <CardDescription>Historical buy and sell logs</CardDescription>
            </div>
            
            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search symbol..."
                  className="w-full pl-9 sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={actionFilter} onValueChange={(val) => {if(val) setActionFilter(val)}}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Actions</SelectItem>
                  <SelectItem value="BUY">Buy Only</SelectItem>
                  <SelectItem value="SELL">Sell Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : (
            <TransactionTable transactions={filteredTransactions} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoryPage;
