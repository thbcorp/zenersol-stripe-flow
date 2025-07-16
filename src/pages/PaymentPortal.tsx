
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Search, CreditCard, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import InvoiceDetails from '@/components/InvoiceDetails';
import ManualPayment from '@/components/ManualPayment';

const PaymentPortal = () => {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showManualPayment, setShowManualPayment] = useState(false);
  const { toast } = useToast();

  const searchInvoice = async () => {
    if (!invoiceNumber.trim()) {
      setError('Please enter an invoice number');
      return;
    }

    setLoading(true);
    setError('');
    setInvoice(null);

    try {
      const { data, error: supabaseError } = await supabase
        .from('invoices')
        .select('*')
        .eq('invoice_number', invoiceNumber.trim())
        .single();

      if (supabaseError) {
        throw new Error('Invoice not found');
      }

      setInvoice(data);
      toast({
        title: "Invoice Found",
        description: `Invoice ${data.invoice_number} loaded successfully`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to find invoice';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchInvoice();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">THB Payment Systems</h1>
          <p className="text-lg text-gray-600">Secure invoice payment system</p>
        </div>

        {/* Invoice Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Find Your Invoice
            </CardTitle>
            <CardDescription>
              Enter your invoice number to view details and make payment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter invoice number (e.g., INV-001)"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={searchInvoice} disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Invoice Details */}
        {invoice && <InvoiceDetails invoice={invoice} />}

        {/* Alternative Payment Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Alternative Payment Options
            </CardTitle>
            <CardDescription>
              Can't find your invoice? Make a manual payment or contact us
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => setShowManualPayment(!showManualPayment)}
                className="h-auto p-4 text-left"
              >
                <div>
                  <div className="font-semibold">Manual Payment Entry</div>
                  <div className="text-sm text-gray-600">Enter payment details manually</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto p-4 text-left"
                onClick={() => window.open('mailto:thehalalbros@hotmail.com', '_blank')}
              >
                <div>
                  <div className="font-semibold">Contact Support</div>
                  <div className="text-sm text-gray-600">Get help with your payment</div>
                </div>
              </Button>
            </div>

            {showManualPayment && (
              <div className="mt-4">
                <Separator className="mb-4" />
                <ManualPayment />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>© 2025 THB Payment Systems. All rights reserved.</p>
          <p>Secure payments powered by Stripe</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPortal;
