
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const PaymentSuccess = () => {
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const verifyPayment = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');

      if (!sessionId) {
        toast({
          title: "Error",
          description: "No payment session found",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: { sessionId },
        });

        if (error) throw error;

        setPaymentDetails(data);
        
        if (data.status === 'paid') {
          toast({
            title: "Payment Successful",
            description: "Your payment has been processed successfully",
          });
        }
      } catch (err) {
        toast({
          title: "Verification Error",
          description: "Failed to verify payment status",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-lg text-gray-600">Thank you for your payment</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payment Confirmation</CardTitle>
            <CardDescription>
              Your payment has been processed successfully
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentDetails && (
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-800">Payment Status: Paid</span>
                </div>
                {paymentDetails.invoiceNumber && (
                  <p className="text-gray-700">
                    Invoice: <span className="font-semibold">{paymentDetails.invoiceNumber}</span>
                  </p>
                )}
              </div>
            )}

            <div className="space-y-3">
              <h3 className="font-semibold">What happens next?</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• You will receive a payment confirmation email shortly</li>
                <li>• Your invoice has been marked as paid in our system</li>
                <li>• Our team has been notified of your payment</li>
                <li>• If you have any questions, please contact our support team</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Payment Portal
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => window.print()}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Print Confirmation
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8 text-sm text-gray-600">
          <p>© 2025 THB Payment Systems. All rights reserved.</p>
          <p>
            Need help? Contact us at{' '}
            <a href="mailto:thehalalbros@hotmail.com" className="text-blue-600 hover:underline">
              thehalalbros@hotmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
