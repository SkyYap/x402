import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Monitor, Smartphone, Tablet, Zap } from 'lucide-react';

export function Terminal() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Terminal</h1>
        <p className="text-gray-600 mt-2">
          Point-of-sale crypto payment terminal for in-person transactions.
        </p>
      </div>

      {/* Coming Soon Card */}
      <Card className="border-amber-100 bg-gradient-to-br from-white to-amber-50/30">
        <CardContent className="text-center py-16">
          <div className="mb-8">
            <Monitor className="h-24 w-24 mx-auto text-amber-600 opacity-50" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Coming Soon
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Our crypto payment terminal is currently in development. Soon you'll be able to accept 
            cryptocurrency payments in-person with our sleek POS solution.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8">
            <div className="text-center p-6 bg-white rounded-lg border border-amber-100">
              <Monitor className="h-12 w-12 mx-auto text-amber-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Desktop Terminal</h3>
              <p className="text-sm text-gray-600">Full-featured POS system for countertop use</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg border border-amber-100">
              <Tablet className="h-12 w-12 mx-auto text-amber-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Tablet Solution</h3>
              <p className="text-sm text-gray-600">Portable tablet-based payment processing</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg border border-amber-100">
              <Smartphone className="h-12 w-12 mx-auto text-amber-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Mobile App</h3>
              <p className="text-sm text-gray-600">Accept payments anywhere with your smartphone</p>
            </div>
          </div>

          <div className="space-y-4">
            <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white">
              <Zap className="h-4 w-4 mr-2" />
              Join Waitlist
            </Button>
            
            <p className="text-sm text-gray-500">
              Be the first to know when our terminal solution launches
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Features Preview */}
      <Card className="border-amber-100 bg-gradient-to-br from-white to-amber-50/30">
        <CardHeader>
          <CardTitle>Planned Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Payment Processing</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Multi-cryptocurrency support (BTC, ETH, USDC, USDT)</li>
                <li>• Real-time exchange rate conversion</li>
                <li>• QR code payment generation</li>
                <li>• Lightning Network support</li>
                <li>• Instant transaction confirmation</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Business Features</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Inventory management integration</li>
                <li>• Real-time sales reporting</li>
                <li>• Customer receipt generation</li>
                <li>• Tax calculation and reporting</li>
                <li>• Multi-store management</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}