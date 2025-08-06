import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Search, 
  UserPlus, 
  Mail, 
  Calendar,
  DollarSign,
  CreditCard,
  MoreVertical,
  Eye
} from 'lucide-react';
import { mockCustomers } from '@/data/mockData';

export function Customers() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatLastSeen = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-2">
            Manage your customer relationships and payment history.
          </p>
        </div>
        <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 border-amber-100 bg-gradient-to-br from-white to-amber-50/30">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search customers by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-amber-200 focus:border-amber-400"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-amber-100 bg-gradient-to-br from-white to-amber-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{mockCustomers.length}</p>
            <p className="text-sm text-green-600 mt-1">
              {mockCustomers.filter(c => c.status === 'active').length} active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="border-amber-100 bg-gradient-to-br from-white to-amber-50/30 hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-r from-amber-400 to-orange-400 text-white font-medium">
                      {getInitials(customer.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                    <StatusBadge status={customer.status} />
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {customer.email}
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Last seen {formatLastSeen(customer.lastSeen)}
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-amber-100">
                  <div>
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                      <DollarSign className="h-3 w-3 mr-1" />
                      Total Spent
                    </div>
                    <p className="font-semibold text-gray-900">
                      ${customer.totalSpent.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                      <CreditCard className="h-3 w-3 mr-1" />
                      Orders
                    </div>
                    <p className="font-semibold text-gray-900">
                      {customer.totalTransactions}
                    </p>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full border-amber-300 hover:bg-amber-50">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <Card className="border-amber-100 bg-gradient-to-br from-white to-amber-50/30">
          <CardContent className="text-center py-8 text-gray-500">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No customers found matching your search.</p>
            <p className="text-sm mt-1">Try adjusting your search criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}