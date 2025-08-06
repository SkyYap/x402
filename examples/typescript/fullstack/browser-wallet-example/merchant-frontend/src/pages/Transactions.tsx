import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Download, 
  ExternalLink,
  Calendar,
  CreditCard,
  Clock
} from 'lucide-react';
import { mockTransactions } from '@/data/mockData';
import type { Transaction } from '@/types';

export function Transactions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = transaction.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getTypeIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'payment':
        return <CreditCard className="h-4 w-4 text-green-600" />;
      case 'withdrawal':
        return <ExternalLink className="h-4 w-4 text-blue-600" />;
      case 'deposit':
        return <ExternalLink className="h-4 w-4 text-purple-600" />;
      default:
        return <CreditCard className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatCryptoAmount = (amount: number, currency: string) => {
    if (currency === 'BTC') return amount.toFixed(8);
    if (currency === 'ETH') return amount.toFixed(6);
    return amount.toFixed(2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-2">
            Track and manage all your crypto payment transactions.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="border-amber-300 hover:bg-amber-50">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button variant="outline" className="border-amber-300 hover:bg-amber-50">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-amber-100 bg-gradient-to-br from-white to-amber-50/30">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search transactions, customers, or IDs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-amber-200 focus:border-amber-400"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px] border-amber-200">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px] border-amber-200">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="payment">Payments</SelectItem>
                <SelectItem value="withdrawal">Withdrawals</SelectItem>
                <SelectItem value="deposit">Deposits</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card className="border-amber-100 bg-gradient-to-br from-white to-amber-50/30">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Transaction History</span>
            <Badge variant="outline">
              {filteredTransactions.length} {filteredTransactions.length === 1 ? 'transaction' : 'transactions'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="border border-amber-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {getTypeIcon(transaction.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {transaction.customer.name}
                          </h4>
                          <StatusBadge status={transaction.status} />
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {transaction.customer.email}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(transaction.timestamp).toLocaleString()}
                          </span>
                          <span className="flex items-center">
                            <Badge variant="outline" className="text-xs">
                              {transaction.id}
                            </Badge>
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right flex-shrink-0 ml-4">
                      <div className="text-lg font-semibold text-gray-900">
                        ${transaction.amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatCryptoAmount(transaction.cryptoAmount, transaction.cryptoCurrency)} {transaction.cryptoCurrency}
                      </div>
                      {transaction.networkFee && (
                        <div className="text-xs text-gray-500 mt-1">
                          Fee: ${transaction.networkFee.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {transaction.txHash && (
                    <div className="mt-3 pt-3 border-t border-amber-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Transaction Hash:</span>
                        <button className="text-xs text-amber-600 hover:text-amber-700 flex items-center">
                          {transaction.txHash}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </button>
                      </div>
                      {transaction.gasUsed && (
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-500">Gas Used:</span>
                          <span className="text-xs text-gray-600">{transaction.gasUsed}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No transactions found matching your filters.</p>
                <p className="text-sm mt-1">Try adjusting your search criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}