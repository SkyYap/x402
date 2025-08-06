import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  className?: string;
  loading?: boolean;
}

export function StatCard({
  title,
  value,
  change,
  changeLabel = 'vs last month',
  icon,
  className,
  loading = false
}: StatCardProps) {
  if (loading) {
    return (
      <Card className={cn('relative overflow-hidden', className)}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            {icon && <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />}
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <Card className={cn(
      'relative overflow-hidden border-amber-100 bg-gradient-to-br from-white to-amber-50/30',
      className
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-600">
            {title}
          </CardTitle>
          {icon && (
            <div className="text-amber-600 opacity-75">
              {icon}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 mb-1">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {change !== undefined && (
          <div className="flex items-center text-sm">
            {isPositive && <TrendingUp className="h-3 w-3 text-green-600 mr-1" />}
            {isNegative && <TrendingDown className="h-3 w-3 text-red-600 mr-1" />}
            <span className={cn(
              'font-medium',
              isPositive && 'text-green-600',
              isNegative && 'text-red-600',
              change === 0 && 'text-gray-500'
            )}>
              {change > 0 ? '+' : ''}{change}%
            </span>
            <span className="text-gray-500 ml-1">{changeLabel}</span>
          </div>
        )}
      </CardContent>
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-amber-50/20 pointer-events-none" />
    </Card>
  );
}