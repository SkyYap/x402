import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Home,
  Wallet,
  CreditCard,
  Users,
  Package,
  Shield,
  Link,
  BarChart3,
  Monitor,
  Receipt,
  Bitcoin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { NavigationItem } from '@/types';

const navigation: NavigationItem[] = [
  { name: 'Overview', href: '/', icon: Home },
  { name: 'Balance', href: '/balance', icon: Wallet },
  { name: 'Transactions', href: '/transactions', icon: CreditCard },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Radar', href: '/radar', icon: Shield },
  { name: 'Payment Links', href: '/payment-links', icon: Link },
  { name: 'Analytics', href: '/reporting', icon: BarChart3 },
  { name: 'Terminal', href: '/terminal', icon: Monitor, comingSoon: true },
  { name: 'Billing', href: '/billing', icon: Receipt, comingSoon: true },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      'flex h-full w-64 flex-col border-r bg-background',
      isCollapsed && 'w-16',
      className
    )}>
      {/* Logo */}
      <div className="flex h-14 items-center border-b px-4">
        <div className="flex items-center space-x-2">
          <Bitcoin className="h-6 w-6 text-primary" />
          {!isCollapsed && (
            <span className="font-semibold">CryptoPay</span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive: linkActive }) => cn(
                  'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  linkActive || isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground',
                  item.comingSoon && 'opacity-60 cursor-not-allowed'
                )}
              >
                <Icon className="mr-3 h-4 w-4 flex-shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{item.name}</span>
                    {item.comingSoon && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        Soon
                      </Badge>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-sm font-medium text-primary-foreground">M</span>
          </div>
          {!isCollapsed && (
            <div className="flex-1">
              <p className="text-sm font-medium">Merchant</p>
              <p className="text-xs text-muted-foreground">merchant@example.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}