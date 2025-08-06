import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Receipt, CreditCard, Calendar, Star, Zap } from 'lucide-react';

export function Billing() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Billing</h1>
        <p className="text-gray-600 mt-2">
          Manage your subscription, billing, and payment processing fees.
        </p>
      </div>

      {/* Coming Soon Card */}
      <Card className="border-amber-100 bg-gradient-to-br from-white to-amber-50/30">
        <CardContent className="text-center py-16">
          <div className="mb-8">
            <Receipt className="h-24 w-24 mx-auto text-amber-600 opacity-50" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Coming Soon
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Our comprehensive billing and subscription management system is under development. 
            Soon you'll have complete control over your account billing and payment processing costs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8">
            <div className="text-center p-6 bg-white rounded-lg border border-amber-100">
              <CreditCard className="h-12 w-12 mx-auto text-amber-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Payment Methods</h3>
              <p className="text-sm text-gray-600">Manage your payment methods and billing info</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg border border-amber-100">
              <Calendar className="h-12 w-12 mx-auto text-amber-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Billing History</h3>
              <p className="text-sm text-gray-600">View and download your billing statements</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg border border-amber-100">
              <Star className="h-12 w-12 mx-auto text-amber-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Plan Management</h3>
              <p className="text-sm text-gray-600">Upgrade or modify your subscription plan</p>
            </div>
          </div>

          <div className="space-y-4">
            <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white">
              <Zap className="h-4 w-4 mr-2" />
              Get Notified
            </Button>
            
            <p className="text-sm text-gray-500">
              We'll notify you when billing features become available
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Current Plan Preview */}
      <Card className="border-amber-100 bg-gradient-to-br from-white to-amber-50/30">
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-6 bg-white rounded-lg border border-amber-100">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">Starter Plan</h3>
                <Badge className="bg-amber-100 text-amber-800">Active</Badge>
              </div>
              <p className="text-gray-600">2.5% processing fee per transaction</p>
              <p className="text-sm text-gray-500 mt-1">No monthly fee, pay as you go</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">$0</p>
              <p className="text-sm text-gray-500">per month</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Preview */}
      <Card className="border-amber-100 bg-gradient-to-br from-white to-amber-50/30">
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-lg border border-amber-100">
              <h4 className="font-semibold text-gray-900 mb-2">Starter</h4>
              <p className="text-2xl font-bold text-gray-900 mb-4">$0<span className="text-sm font-normal text-gray-500">/month</span></p>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li>• 2.5% processing fee</li>
                <li>• Up to $10k monthly volume</li>
                <li>• Basic reporting</li>
                <li>• Email support</li>
              </ul>
              <Badge variant="outline">Current Plan</Badge>
            </div>
            
            <div className="p-6 bg-white rounded-lg border border-amber-400 relative">
              <Badge className="absolute -top-2 left-6 bg-amber-100 text-amber-800">Popular</Badge>
              <h4 className="font-semibold text-gray-900 mb-2">Professional</h4>
              <p className="text-2xl font-bold text-gray-900 mb-4">$99<span className="text-sm font-normal text-gray-500">/month</span></p>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li>• 1.5% processing fee</li>
                <li>• Up to $100k monthly volume</li>
                <li>• Advanced analytics</li>
                <li>• Priority support</li>
                <li>• API access</li>
              </ul>
              <Badge className="bg-amber-100 text-amber-800">Coming Soon</Badge>
            </div>
            
            <div className="p-6 bg-white rounded-lg border border-amber-100">
              <h4 className="font-semibold text-gray-900 mb-2">Enterprise</h4>
              <p className="text-2xl font-bold text-gray-900 mb-4">Custom</p>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li>• Custom processing fees</li>
                <li>• Unlimited volume</li>
                <li>• White-label solution</li>
                <li>• Dedicated support</li>
                <li>• Custom integrations</li>
              </ul>
              <Badge variant="outline">Contact Sales</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}