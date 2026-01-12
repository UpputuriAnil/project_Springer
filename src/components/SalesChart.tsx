'use client';

import React, { useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  TooltipProps, LabelList
} from 'recharts';
import { RefreshCw, BarChart2, PieChart as PieChartIcon, LineChart as LineChartIcon } from 'lucide-react';

// Custom UI components with proper TypeScript types
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 border-b border-gray-100 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-lg font-medium text-gray-900 ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

// Custom Button component with TypeScript types
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'sm' | 'default' | 'lg' | 'icon';
  className?: string;
  children: React.ReactNode;
  title?: string;
}

const Button = ({
  children,
  variant = 'default',
  size = 'default',
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50',
    ghost: 'hover:bg-gray-100',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  };
  
  const sizes = {
    sm: 'h-8 px-3 text-xs',
    default: 'h-10 py-2 px-4 text-sm',
    lg: 'h-11 px-8 text-base',
    icon: 'h-9 w-9',
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Custom Select component with TypeScript types
interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

const Select = ({ value, onValueChange, children, className = '' }: SelectProps) => {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
      >
        {children}
      </select>
    </div>
  );
};

const SelectTrigger = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={className}>
    {children}
  </div>
);

const SelectContent = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

const SelectItem = ({ value, children }: { value: string; children: React.ReactNode }) => (
  <option value={value}>{children}</option>
);

const SelectValue = ({ placeholder }: { placeholder: string }) => (
  <>{placeholder}</>
);

// Define the SalesDataItem type
interface SalesDataItem {
  month: string;
  sales: number;
  orders: number;
  revenue: number;
  profit: number;
  customers: number;
}

// Define the SalesChartProps type
type SalesChartProps = {
  data: SalesDataItem[];
  chartType: 'line' | 'bar' | 'pie';
  year: number;
  onYearChange: (year: number) => void;
  onChartTypeChange: (type: 'line' | 'bar' | 'pie') => void;
  onRefresh: () => void;
  isLoading?: boolean;
};

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg text-sm">
        <p className="font-medium mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={`tooltip-${index}`} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-700">{entry.name}:</span>
            <span className="ml-2 font-medium">
              {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const SalesChart: React.FC<SalesChartProps> = ({
  data = [],
  chartType = 'line',
  year = new Date().getFullYear(),
  onYearChange,
  onChartTypeChange,
  onRefresh,
  isLoading = false,
}) => {
  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return [];
    
    // Sort data by month order
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return [...data]
      .sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month))
      .map(item => ({
        ...item,
        name: item.month,
        sales: Math.round(item.sales || 0),
        orders: Math.round(item.orders || 0),
        revenue: Math.round(item.revenue || 0),
        profit: Math.round(item.profit || 0),
        customers: Math.round(item.customers || 0),
      }));
  }, [data]);

  // Calculate summary metrics
  const summary = useMemo(() => {
    if (chartData.length === 0) {
      return {
        totalSales: 0,
        totalRevenue: 0,
        totalProfit: 0,
        totalCustomers: 0,
        averageOrderValue: 0,
      };
    }

    const totals = chartData.reduce(
      (acc, item) => ({
        sales: acc.sales + (item.sales || 0),
        revenue: acc.revenue + (item.revenue || 0),
        profit: acc.profit + (item.profit || 0),
        customers: acc.customers + (item.customers || 0),
        orders: acc.orders + (item.orders || 0),
      }),
      { sales: 0, revenue: 0, profit: 0, customers: 0, orders: 0 }
    );

    return {
      totalSales: Math.round(totals.sales),
      totalRevenue: Math.round(totals.revenue),
      totalProfit: Math.round(totals.profit),
      totalCustomers: Math.round(totals.customers),
      averageOrderValue: totals.orders > 0 ? Math.round(totals.revenue / totals.orders) : 0,
    };
  }, [chartData]);

  // Ensure we have valid data to display
  const hasData = chartData.length > 0 && chartData.some(item => item.sales > 0);

  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-80 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-500">Loading chart data...</p>
        </div>
      );
    }

    if (!hasData) {
      return (
        <div className="flex flex-col items-center justify-center h-80 text-gray-500 space-y-4">
          <p>No data available for the selected period</p>
          <Button 
            variant="outline" 
            onClick={onRefresh}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh Data</span>
          </Button>
        </div>
      );
    }

    const colors = [
      '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', 
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'
    ];

    switch (chartType) {
      case 'bar':
        return (
          <div className="w-full h-full">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tick={{ fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={{ stroke: '#e5e7eb' }}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                />
                <Legend />
                <Bar dataKey="sales" name="Sales" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                  <LabelList 
                    dataKey="sales" 
                    position="top" 
                    formatter={(value: number) => value.toLocaleString()}
                    className="text-xs fill-gray-500"
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      
      case 'pie':
        return (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="w-full max-w-md">
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="sales"
                    nameKey="month"
                    label={({ name, percent }) => 
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={colors[index % colors.length]} 
                        stroke="#ffffff"
                        strokeWidth={1}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={<CustomTooltip />}
                    formatter={(value: number) => value.toLocaleString()}
                  />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ paddingTop: '20px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 w-full max-w-md">
              <div className="grid grid-cols-2 gap-4">
                {chartData.map((item, index) => (
                  <div key={item.month} className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-2" 
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <span className="text-sm text-gray-600">{item.month}:</span>
                    <span className="ml-1 text-sm font-medium">
                      {item.sales.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'line':
      default:
        return (
          <div className="w-full h-full">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tick={{ fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={{ stroke: '#e5e7eb' }}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  name="Sales" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#3b82f6' }}
                  activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  name="Revenue" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#10b981' }}
                  activeDot={{ r: 6, stroke: '#059669', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  name="Profit" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#8b5cf6' }}
                  activeDot={{ r: 6, stroke: '#7c3aed', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
    }
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="w-full space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm font-medium text-gray-500">Total Sales</p>
            <h3 className="text-2xl font-bold">{summary.totalSales.toLocaleString()}</h3>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-green-600 font-medium">
              +12.5% from last year
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
            <h3 className="text-2xl font-bold">{formatCurrency(summary.totalRevenue)}</h3>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-green-600 font-medium">
              +15.2% from last year
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm font-medium text-gray-500">Total Profit</p>
            <h3 className="text-2xl font-bold">{formatCurrency(summary.totalProfit)}</h3>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-green-600 font-medium">
              +8.7% from last year
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm font-medium text-gray-500">Total Customers</p>
            <h3 className="text-2xl font-bold">{summary.totalCustomers.toLocaleString()}</h3>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-green-600 font-medium">
              +5.3% from last year
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Chart Card */}
      <Card>
        <div className="p-6 border-b border-gray-100 flex flex-row items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Sales Overview</h3>
            <p className="text-sm text-gray-500">
              {chartType === 'line' 
                ? 'Monthly sales, revenue, and profit trends' 
                : chartType === 'bar' 
                  ? 'Monthly sales comparison' 
                  : 'Sales distribution by month'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={year}
              onChange={(e) => onYearChange(Number(e.target.value))}
              className="text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-1.5 pl-3 pr-8"
            >
              {[2022, 2023, 2024].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            
            <div className="flex items-center space-x-1 border rounded-md p-0.5">
              <Button
                variant={chartType === 'line' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onChartTypeChange('line')}
                title="Line Chart"
              >
                <LineChartIcon className="h-4 w-4" />
              </Button>
              <Button
                variant={chartType === 'bar' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onChartTypeChange('bar')}
                title="Bar Chart"
              >
                <BarChart2 className="h-4 w-4" />
              </Button>
              <Button
                variant={chartType === 'pie' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onChartTypeChange('pie')}
                title="Pie Chart"
              >
                <PieChartIcon className="h-4 w-4" />
              </Button>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={onRefresh}
              disabled={isLoading}
              title="Refresh Data"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="h-[500px] w-full">
            {renderChart()}
          </div>
          
          {chartData.length > 0 && (
            <div className="mt-6 text-xs text-gray-500 text-center">
              <p>Data updated {new Date().toLocaleString()}</p>
              <p className="mt-1">
                Showing {chartData.length} {chartData.length === 1 ? 'month' : 'months'} of data for {year}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

// Export the component as default
export default SalesChart;

// Export the types
export type { SalesChartProps, SalesDataItem };