'use client';

import { useMemo } from 'react';
import { KPICard } from '../molecules/KPICard';
import { formatCurrency, calculateGrowth } from '@/lib/utils';

interface KPISummaryProps {
  data: Array<{ month: string; sales: number }>;
  previousPeriodData?: Array<{ month: string; sales: number }>;
  className?: string;
}

export function KPISummary({ data, previousPeriodData, className = '' }: KPISummaryProps) {
  const { totalSales, averageSale, bestMonth } = useMemo(() => {
    if (!data || data.length === 0) {
      return { totalSales: 0, averageSale: 0, bestMonth: { month: '', sales: 0 } };
    }

    const total = data.reduce((sum, item) => sum + item.sales, 0);
    const average = total / data.length;
    const best = [...data].sort((a, b) => b.sales - a.sales)[0];

    return {
      totalSales: total,
      averageSale: average,
      bestMonth: best || { month: '', sales: 0 }
    };
  }, [data]);

  const { previousTotalSales, salesGrowth, avgSaleGrowth } = useMemo(() => {
    if (!previousPeriodData || previousPeriodData.length === 0) {
      return { previousTotalSales: 0, salesGrowth: 0, avgSaleGrowth: 0 };
    }

    const prevTotal = previousPeriodData.reduce((sum, item) => sum + item.sales, 0);
    const prevAvg = prevTotal / previousPeriodData.length;
    
    return {
      previousTotalSales: prevTotal,
      salesGrowth: calculateGrowth(totalSales, prevTotal),
      avgSaleGrowth: calculateGrowth(averageSale, prevAvg)
    };
  }, [previousPeriodData, totalSales, averageSale]);

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      <KPICard 
        title="Total Sales"
        value={totalSales}
        change={salesGrowth}
        icon="revenue"
      />
      
      <KPICard 
        title="Avg. Monthly Sales"
        value={averageSale}
        change={avgSaleGrowth}
        icon="growth"
      />
      
      <KPICard 
        title="Best Month"
        value={bestMonth.sales}
        change={calculateGrowth(bestMonth.sales, averageSale)}
        icon="orders"
        description={bestMonth.month}
      />
      
      <KPICard 
        title="Total Transactions"
        value={Math.round(totalSales / 150)} // Assuming average transaction value of $150
        change={salesGrowth * 0.8} // Assuming transaction count grows at 80% of revenue growth
        icon="users"
      />
    </div>
  );
}
