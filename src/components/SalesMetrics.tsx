'use client';

import { useSalesData } from '@/hooks/useSalesData';
import { ArrowUp, ArrowDown, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

type MetricCardProps = {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
};

const MetricCard = ({ title, value, description, icon, trend }: MetricCardProps) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">
        {icon}
      </div>
    </div>
    {trend && (
      <div className={`mt-4 flex items-center text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {trend.isPositive ? (
          <ArrowUp className="w-4 h-4 mr-1" />
        ) : (
          <ArrowDown className="w-4 h-4 mr-1" />
        )}
        <span>{trend.value}</span>
        <span className="ml-1 text-gray-500">vs last year</span>
      </div>
    )}
  </div>
);

export default function SalesMetrics() {
  const { salesData, getYearlySummary, getAvailableYears } = useSalesData();
  const currentYear = new Date().getFullYear();
  const currentYearSummary = getYearlySummary(currentYear as any);
  const prevYearSummary = getYearlySummary((currentYear - 1) as any);
  
  // Calculate growth rate
  const growthRate = prevYearSummary && currentYearSummary
    ? Math.round(((currentYearSummary.totalRevenue - prevYearSummary.totalRevenue) / prevYearSummary.totalRevenue) * 100)
    : 0;
  
  // Find the month with highest revenue
  const topMonth = salesData.length > 0
    ? salesData.reduce((max, item) => 
        item.revenue > (max?.revenue || 0) ? item : max, 
        salesData[0]
      )
    : null;

  // Calculate average monthly revenue
  const averageMonthlyRevenue = currentYearSummary
    ? Math.round(currentYearSummary.totalRevenue / 12)
    : 0;

  // Calculate month-over-month growth (simplified)
  const monthOverMonthGrowth = salesData.length > 1 
    ? Math.round(
        ((salesData[salesData.length - 1].revenue - salesData[salesData.length - 2].revenue) / 
         salesData[salesData.length - 2].revenue) * 100
      )
    : 0;

  const metrics = [
    {
      title: 'Total Revenue',
      value: currentYearSummary ? formatCurrency(currentYearSummary.totalRevenue) : '$0',
      description: `YTD ${currentYear}`,
      icon: <DollarSign className="w-6 h-6" />,
      trend: {
        value: `${growthRate > 0 ? '+' : ''}${growthRate}%`,
        isPositive: growthRate >= 0,
      },
    },
    {
      title: 'Avg. Monthly Revenue',
      value: formatCurrency(averageMonthlyRevenue),
      description: 'Per month average',
      icon: <TrendingUp className="w-6 h-6" />,
      trend: {
        value: `${monthOverMonthGrowth > 0 ? '+' : ''}${monthOverMonthGrowth}%`,
        isPositive: monthOverMonthGrowth >= 0,
      },
    },
    {
      title: 'Top Month',
      value: topMonth ? `${topMonth.month} ${topMonth.year}` : 'N/A',
      description: topMonth ? formatCurrency(topMonth.revenue) : 'No data',
      icon: <Calendar className="w-6 h-6" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric, index) => (
        <MetricCard
          key={index}
          title={metric.title}
          value={metric.value}
          description={metric.description}
          icon={metric.icon}
          trend={metric.trend}
        />
      ))}
    </div>
  );
}
