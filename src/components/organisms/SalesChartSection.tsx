'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardHeader, CardContent } from '../atoms/Card';
import { Button } from '../atoms/Button';
import { ChartSwitcher } from '../molecules/ChartSwitcher';
import { SlidersHorizontal, RefreshCw } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

// Dynamically import the chart components with no SSR
const DynamicLineChart = dynamic(
  () => import('recharts').then((mod) => {
    const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = mod;
    return function LineChartWrapper({ data }: { data: any[] }) {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tick={{ fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={{ stroke: '#e5e7eb' }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip 
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Sales']}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="sales" 
              name="Sales"
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    };
  }),
  { ssr: false }
);

const DynamicBarChart = dynamic(
  () => import('recharts').then((mod) => {
    const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = mod;
    return function BarChartWrapper({ data }: { data: any[] }) {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tick={{ fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={{ stroke: '#e5e7eb' }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip 
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Sales']}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Bar 
              dataKey="sales" 
              name="Sales"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              isAnimationActive={true}
            />
          </BarChart>
        </ResponsiveContainer>
      );
    };
  }),
  { ssr: false }
);

const DynamicPieChart = dynamic(
  () => import('recharts').then((mod) => {
    const { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } = mod;
    return function PieChartWrapper({ data }: { data: any[] }) {
      const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
      
      return (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="sales"
              nameKey="month"
              animationDuration={500}
              animationEasing="ease-out"
              label={({ name, percent }) => `${name}: $${data.find(d => d.month === name)?.sales?.toLocaleString() || 0}`}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  stroke="#fff"
                  strokeWidth={1}
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Sales']}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              itemStyle={{ color: '#111827' }}
              labelStyle={{ color: '#4f46e5', fontWeight: '500' }}
            />
            <Legend 
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{
                paddingTop: '1rem',
                fontSize: '0.875rem',
                color: '#6b7280'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      );
    };
  }),
  { ssr: false }
);

interface SalesChartSectionProps {
  data: Array<{ month: string; sales: number }>;
  isLoading?: boolean;
  onRefresh?: () => void;
  className?: string;
}

export function SalesChartSection({ 
  data, 
  isLoading = false, 
  onRefresh,
  className = '' 
}: SalesChartSectionProps) {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('line');
  const [threshold, setThreshold] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);

  const filteredData = useMemo(() => {
    return data.filter(item => item.sales >= threshold);
  }, [data, threshold]);

  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-8 bg-blue-200 rounded-full mb-2"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      );
    }

    if (filteredData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-center p-8">
          <div className="bg-gray-100 p-4 rounded-full mb-4">
            <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">No data available</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your filters to see more results.</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4"
            onClick={() => setThreshold(0)}
          >
            Reset filters
          </Button>
        </div>
      );
    }

    switch (chartType) {
      case 'bar':
        return <DynamicBarChart data={filteredData} />;
      case 'pie':
        return <DynamicPieChart data={filteredData} />;
      case 'line':
      default:
        return <DynamicLineChart data={filteredData} />;
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Sales Overview</h2>
          <p className="text-sm text-gray-500 mt-1">Visualize your sales performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <ChartSwitcher 
            activeChart={chartType} 
            onChartChange={setChartType} 
            className="hidden sm:flex"
          />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center"
          >
            <SlidersHorizontal className="h-4 w-4 mr-1.5" />
            <span>Filters</span>
          </Button>
          {onRefresh && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center"
            >
              <RefreshCw className={`h-4 w-4 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
          )}
        </div>
      </CardHeader>
      
      {showFilters && (
        <div className="px-6 pb-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-64">
              <label htmlFor="threshold" className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Sales: ${threshold.toLocaleString()}
              </label>
              <input
                id="threshold"
                type="range"
                min="0"
                max={Math.max(...data.map(item => item.sales))}
                step={1000}
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
          <div className="sm:hidden mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Chart Type</p>
            <ChartSwitcher 
              activeChart={chartType} 
              onChartChange={setChartType}
            />
          </div>
        </div>
      )}
      
      <CardContent className="p-0">
        <div className="h-96">
          {renderChart()}
        </div>
      </CardContent>
    </Card>
  );
}
