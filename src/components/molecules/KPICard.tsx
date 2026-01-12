import { ArrowUp, ArrowDown, TrendingUp, DollarSign, Users, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '../atoms/Card';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: number;
  change: number;
  icon?: React.ReactNode;
  formatAsCurrency?: boolean;
  className?: string;
  description?: string;
}

const iconMap = {
  revenue: <DollarSign className="h-5 w-5 text-blue-500" />,
  users: <Users className="h-5 w-5 text-green-500" />,
  orders: <ShoppingCart className="h-5 w-5 text-purple-500" />,
  growth: <TrendingUp className="h-5 w-5 text-amber-500" />,
};

export function KPICard({
  title,
  value,
  change,
  icon = 'revenue',
  formatAsCurrency = true,
  className = '',
  description,
}: KPICardProps) {
  const isPositive = change >= 0;
  const IconComponent = typeof icon === 'string' ? iconMap[icon as keyof typeof iconMap] : icon;

  return (
    <Card className={`h-full ${className}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="mt-1 text-2xl font-bold text-gray-900">
              {formatAsCurrency ? formatCurrency(value) : value}
            </h3>
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
          </div>
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            {IconComponent}
          </div>
        </div>
        <div className={`mt-4 flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? (
            <ArrowUp className="h-4 w-4 mr-1" />
          ) : (
            <ArrowDown className="h-4 w-4 mr-1" />
          )}
          <span>{formatPercentage(Math.abs(change))} vs last period</span>
        </div>
      </CardContent>
    </Card>
  );
}
