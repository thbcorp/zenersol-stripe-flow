
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Calendar, User, Mail, FileText, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface InvoiceDetailsProps {
  invoice: any;
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ invoice }) => {
  const [customerEmail, setCustomerEmail] = useState(invoice.customer_email || '');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: currency || 'AED',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePayment = async () => {
    if (!customerEmail.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address for payment receipt",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          invoiceId: invoice.id,
          customerEmail: customerEmail.trim(),
          customerName: invoice.customer_name,
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

  const isPaid = invoice.status === 'paid';

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Invoice {invoice.invoice_number}
            </CardTitle>
            <CardDescription>
              Created on {formatDate(invoice.created_at)}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(invoice.status)}>
            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Invoice Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <div>
                <div className="font-semibold">Customer</div>
                <div className="text-gray-600">{invoice.customer_name}</div>
              </div>
            </div>
            
            {invoice.customer_email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="font-semibold">Email</div>
                  <div className="text-gray-600">{invoice.customer_email}</div>
                </div>
              </div>
            )}
            
            {invoice.due_date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="font-semibold">Due Date</div>
                  <div className="text-gray-600">{formatDate(invoice.due_date)}</div>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <div>
                <div className="font-semibold">Amount</div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(invoice.amount, invoice.currency)}
                </div>
              </div>
            </div>
            
            {invoice.description && (
              <div>
                <div className="font-semibold">Description</div>
                <div className="text-gray-600">{invoice.description}</div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Payment Section */}
        {!isPaid ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address (for receipt)
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="max-w-md"
              />
            </div>
            
            <Button
              onClick={handlePayment}
              disabled={loading}
              size="lg"
              className="w-full md:w-auto"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              {loading ? 'Setting up payment...' : `Pay ${formatCurrency(invoice.amount, invoice.currency)}`}
            </Button>
            
            <p className="text-sm text-gray-600">
              You will be redirected to Stripe's secure payment page
            </p>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="text-green-600 font-semibold text-lg">
              ✓ This invoice has been paid
            </div>
            <p className="text-gray-600">Thank you for your payment!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvoiceDetails;
