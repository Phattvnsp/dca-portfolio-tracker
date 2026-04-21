'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Save, AlertCircle } from 'lucide-react';
import { z } from 'zod';
import { transactionSchema } from '@/types/transaction';

const AddRecordPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    symbol: '',
    action: 'BUY' as 'BUY' | 'SELL',
    target_price: '',
    actual_value: '',
    quantity: '',
    profit_loss: '',
    note: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculatePL = () => {
    if (formData.action !== 'SELL' || !formData.actual_value || !formData.target_price) return;
    const actual = parseFloat(formData.actual_value);
    const target = parseFloat(formData.target_price);
    const qty = parseFloat(formData.quantity);
    if (!isNaN(actual) && !isNaN(target) && !isNaN(qty)) {
      // Basic P/L calculation for reference: (Sell Price - Buy Price) * Qty
      // Wait, in this schema, actual_value is total value. So P/L is entered manually or computed if we knew average cost.
      // Let's just leave it manual for now.
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare data
      const dataToSubmit = {
        date: new Date(`1970-01-01T${formData.time}:00`).getTime() > 0 ? formData.date : new Date().toISOString(), // Fallback
        time: formData.time,
        symbol: formData.symbol.toUpperCase(),
        action: formData.action,
        target_price: parseFloat(formData.target_price) || 0,
        actual_value: parseFloat(formData.actual_value),
        quantity: parseFloat(formData.quantity),
        profit_loss: parseFloat(formData.profit_loss) || 0,
        note: formData.note || '',
      };

      // Client-side validation
      transactionSchema.parse(dataToSubmit);

      // API Call
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to add transaction');
      }

      // Success
      router.push('/history');
      router.refresh();
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0].message);
      } else {
        setError(err.message || 'An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add Record</h1>
        <p className="text-sm text-muted-foreground">
          Log a new investment transaction
        </p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Transaction Details</CardTitle>
          <CardDescription>Fields marked with * are required.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Date & Time */}
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  required
                  value={formData.time}
                  onChange={handleChange}
                />
              </div>

              {/* Symbol & Action */}
              <div className="space-y-2">
                <Label htmlFor="symbol">Symbol *</Label>
                <Input
                  id="symbol"
                  name="symbol"
                  placeholder="e.g. AAPL"
                  required
                  value={formData.symbol}
                  onChange={handleChange}
                  className="uppercase"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="action">Action *</Label>
                <Select
                  value={formData.action}
                  onValueChange={(value: 'BUY' | 'SELL' | null) => {
                    if (value) setFormData((prev) => ({ ...prev, action: value }));
                  }}
                >
                  <SelectTrigger id="action">
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BUY" className="font-medium text-green-600">
                      BUY
                    </SelectItem>
                    <SelectItem value="SELL" className="font-medium text-red-600">
                      SELL
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Financials */}
              <div className="space-y-2">
                <Label htmlFor="actual_value">Total Value (฿) *</Label>
                <Input
                  id="actual_value"
                  name="actual_value"
                  type="number"
                  step="any"
                  min="0.01"
                  placeholder="0.00"
                  required
                  value={formData.actual_value}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  step="any"
                  min="0.00000001"
                  placeholder="0.00"
                  required
                  value={formData.quantity}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target_price">Target Price (Optional)</Label>
                <Input
                  id="target_price"
                  name="target_price"
                  type="number"
                  step="any"
                  min="0"
                  placeholder="0.00"
                  value={formData.target_price}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profit_loss">Profit/Loss (Optional)</Label>
                <Input
                  id="profit_loss"
                  name="profit_loss"
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={formData.profit_loss}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Note */}
            <div className="space-y-2">
              <Label htmlFor="note">Note (Optional)</Label>
              <Textarea
                id="note"
                name="note"
                placeholder="Add any specific details about this transaction..."
                className="resize-none"
                rows={3}
                value={formData.note}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                id="submit-record-btn"
                disabled={loading}
                className="w-full gap-2 bg-mint text-foreground hover:bg-mint-dark sm:w-auto"
              >
                <Save className="h-4 w-4" />
                {loading ? 'Saving...' : 'Save Record'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddRecordPage;
