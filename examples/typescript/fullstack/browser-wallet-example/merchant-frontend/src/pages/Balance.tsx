import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown,
  Download,
  Send,
  Plus,
  Eye,
  EyeOff
} from 'lucide-react';
import { mockBalances } from '@/data/mockData';
import { useState } from 'react';

export function Balance() {
  const [showBalances, setShowBalances] = useState(true);
  
  const totalUSDValue = mockBalances.reduce((sum, balance) => sum + balance.usdValue, 0);
  const totalChange24h = mockBalances.reduce((sum, balance) => 
    sum + (balance.usdValue * balance.change24h / 100), 0
  );
  const totalChangePercent = (totalChange24h / totalUSDValue) * 100;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Balance</h1>
          <p className="text-gray-600 mt-2">
            Manage your cryptocurrency holdings and wallet balances.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="border-amber-300 hover:bg-amber-50">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Funds
          </Button>
        </div>
      </div>

      {/* Total Balance Overview */}
      <Card className="border-amber-100 bg-gradient-to-br from-white to-amber-50/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Wallet className="h-5 w-5 mr-2 text-amber-600" />
              Total Portfolio Value
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBalances(!showBalances)}
            >
              {showBalances ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {showBalances ? `$${totalUSDValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••'}
              </p>
              <div className="flex items-center mt-2">
                {totalChangePercent >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  totalChangePercent >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {totalChangePercent >= 0 ? '+' : ''}{totalChangePercent.toFixed(2)}% 
                  (${totalChange24h >= 0 ? '+' : ''}${totalChange24h.toFixed(2)})
                </span>
                <span className="text-gray-500 text-sm ml-2">24h change</span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white">
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
              <Button variant="outline" className="border-amber-300 hover:bg-amber-50">
                <Download className="h-4 w-4 mr-2" />
                Receive
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Balances */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockBalances.map((balance) => (
          <Card key={balance.currency} className="border-amber-100 bg-gradient-to-br from-white to-amber-50/30 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  {balance.currency}
                </CardTitle>
                <Badge variant="outline" className="text-xs">
                  {balance.symbol}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {showBalances ? balance.amount.toFixed(4) : '••••'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {showBalances ? `$${balance.usdValue.toLocaleString()}` : '••••••'}
                  </p>
                </div>
                
                <div className="flex items-center">
                  {balance.change24h >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                  )}
                  <span className={`text-xs font-medium ${
                    balance.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {balance.change24h >= 0 ? '+' : ''}{balance.change24h}%
                  </span>
                  <span className="text-gray-500 text-xs ml-1">24h</span>
                </div>
                
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1 border-amber-300 hover:bg-amber-50">
                    Send
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 border-amber-300 hover:bg-amber-50">
                    Receive
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="border-amber-100 bg-gradient-to-br from-white to-amber-50/30">
        <CardHeader>
          <CardTitle>Recent Balance Changes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No recent balance changes to display.</p>
            <p className="text-sm mt-1">Balance changes will appear here as they occur.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}