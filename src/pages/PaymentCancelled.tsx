
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

const PaymentCancelled = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
          <p className="text-lg text-gray-600">Your payment was not completed</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payment Cancelled</CardTitle>
            <CardDescription>
              Don't worry, no charges were made to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="font-semibold text-red-800">Payment Status: Cancelled</span>
              </div>
              <p className="text-gray-700">
                Your payment session was cancelled and no charges were made.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">What can you do next?</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Try the payment process again</li>
                <li>• Contact us if you're experiencing technical difficulties</li>
                <li>• Use a different payment method</li>
                <li>• Reach out to our support team for assistance</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                onClick={() => window.location.href = '/'}
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => window.open('mailto:billing@zenersol.com', '_blank')}
                className="flex-1"
              >
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8 text-sm text-gray-600">
          <p>© 2024 Zenersol. All rights reserved.</p>
          <p>
            Need immediate help? Contact us at{' '}
            <a href="mailto:billing@zenersol.com" className="text-blue-600 hover:underline">
              billing@zenersol.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelled;
