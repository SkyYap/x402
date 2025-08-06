import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/common/StatCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  CreditCard, 
  Users, 
  TrendingUp,
  ArrowUpRight,
  Activity,
  Clock
} from 'lucide-react';
import { mockDashboardStats, mockTransactions, mockChartData } from '@/data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function Home() {
  const recentTransactions = mockTransactions.slice(0, 5);
  const chartData = mockChartData.slice(-7); // Last 7 days

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's an overview of your crypto payment activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${mockDashboardStats.totalRevenue.toLocaleString()}`}
          change={mockDashboardStats.revenueChange}
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatCard
          title="Transactions"
          value={mockDashboardStats.totalTransactions.toLocaleString()}
          change={mockDashboardStats.transactionChange}
          icon={<CreditCard className="h-5 w-5" />}
        />
        <StatCard
          title="Active Customers"
          value={mockDashboardStats.activeCustomers.toLocaleString()}
          change={mockDashboardStats.customerChange}
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          title="Conversion Rate"
          value={`${mockDashboardStats.conversionRate}%`}
          change={mockDashboardStats.conversionChange}
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 border-amber-100 bg-gradient-to-br from-white to-amber-50/30">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Revenue Trend</span>
              <Activity className="h-5 w-5 text-amber-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#fbbf24" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#92400e"
                    fontSize={12}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis 
                    stroke="#92400e"
                    fontSize={12}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value: number) => [`$${value}`, 'Revenue']}
                    contentStyle={{
                      backgroundColor: '#fffbeb',
                      border: '1px solid #fbbf24',
                      borderRadius: '8px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#d97706"
                    strokeWidth={3}
                    dot={{ fill: '#d97706', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#d97706', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="border-amber-100 bg-gradient-to-br from-white to-amber-50/30">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Transactions</span>
              <Button variant="ghost" size="sm">
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {transaction.customer.name}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(transaction.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      ${transaction.amount}
                    </p>
                    <StatusBadge status={transaction.status} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-amber-100 bg-gradient-to-br from-white to-amber-50/30">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white">
              Create Payment Link
            </Button>
            <Button variant="outline" className="border-amber-300 hover:bg-amber-50">
              View All Transactions
            </Button>
            <Button variant="outline" className="border-amber-300 hover:bg-amber-50">
              Download Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}