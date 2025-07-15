
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ManualPayment = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    amount: '',
    currency: 'AED',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleManualPayment = async () => {
    // Validate form
    if (!formData.customerName || !formData.customerEmail || !formData.amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Create a temporary invoice for manual payment
      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          invoice_number: `MANUAL-${Date.now()}`,
          customer_name: formData.customerName,
          customer_email: formData.customerEmail,
          amount: amount,
          currency: formData.currency,
          description: formData.description || 'Manual payment entry',
          status: 'pending',
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // Create checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          invoiceId: invoice.id,
          customerEmail: formData.customerEmail,
          customerName: formData.customerName,
        },
      });

      if (error) throw error;

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment setup failed';
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Manual Payment Entry</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="customerName">Customer Name *</Label>
          <Input
            id="customerName"
            placeholder="Enter your name"
            value={formData.customerName}
            onChange={(e) => handleInputChange('customerName', e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="customerEmail">Email Address *</Label>
          <Input
            id="customerEmail"
            type="email"
            placeholder="your@email.com"
            value={formData.customerEmail}
            onChange={(e) => handleInputChange('customerEmail', e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="amount">Amount *</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="currency">Currency</Label>
          <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AED">AED (درهم)</SelectItem>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="EUR">EUR (€)</SelectItem>
              <SelectItem value="GBP">GBP (£)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Payment description or reference"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
        />
      </div>
      
      <Button
        onClick={handleManualPayment}
        disabled={loading}
        size="lg"
        className="w-full md:w-auto"
      >
        <CreditCard className="h-4 w-4 mr-2" />
        {loading ? 'Setting up payment...' : 'Proceed to Payment'}
      </Button>
    </div>
  );
};

export default ManualPayment;
