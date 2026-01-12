'use client';

import { useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';

// Import UI components
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  Button,
  Badge,
  Progress,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui';

// Import icons
import { 
  ArrowUp, 
  ArrowDown, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Clock, 
  RefreshCw, 
  TrendingUp,
  BarChart2,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon
} from 'lucide-react';

// Import hooks and types
import { useSalesData, type SalesDataItem } from '@/hooks/useSalesData';

// Import utilities
import { formatCurrency } from '@/lib/utils';

// Dynamic import for the SalesChart component
const SalesChart = dynamic(
  () => import('@/components/SalesChart'),
  { ssr: false }
);

// Types
type OrderStatus = 'completed' | 'processing' | 'pending' | 'failed';

interface Order {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: OrderStatus;
}

interface Product {
  name: string;
  sales: number;
  revenue: number;
  growth: number;
}

interface CustomerMetrics {
  total: number;
  newThisMonth: number;
  returningRate: number;
  growth: number;
}

// Enhanced mock data with realistic values
const recentOrders: Order[] = [
  { id: '#ORD-101', customer: 'Alex Johnson', date: '2024-01-15', amount: 2450, status: 'completed' },
  { id: '#ORD-102', customer: 'Maria Garcia', date: '2024-01-14', amount: 1875, status: 'processing' },
  { id: '#ORD-103', customer: 'James Wilson', date: '2024-01-14', amount: 3200, status: 'completed' },
  { id: '#ORD-104', customer: 'Sarah Lee', date: '2024-01-13', amount: 950, status: 'pending' },
  { id: '#ORD-105', customer: 'David Kim', date: '2024-01-12', amount: 1480, status: 'completed' },
];

const topProducts: Product[] = [
  { name: 'Smartphone X', sales: 2450, revenue: 318500, growth: 15.7 },
  { name: 'Wireless Earbuds Pro', sales: 1987, revenue: 258310, growth: 12.3 },
  { name: '4K Smart TV', sales: 865, revenue: 207600, growth: 8.9 },
  { name: 'Laptop Elite', sales: 743, revenue: 1857500, growth: 18.5 },
  { name: 'Smart Watch 3', sales: 1321, revenue: 277410, growth: 10.2 },
];

const customerMetrics: CustomerMetrics = {
  total: 5245,
  newThisMonth: 345,
  returningRate: 0.82,
  growth: 0.22,
};

export default function DashboardPage() {
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line');
  // Define the Year type to match the expected values in useSalesData
  type Year = 2022 | 2023 | 2024;
  
  // Safely get the current year, defaulting to 2023 if not in valid range
  const currentYear = (() => {
    const year = new Date().getFullYear();
    return year >= 2022 && year <= 2024 ? year as Year : 2023;
  })();
  
  // Initialize selectedYear with the current year
  const [selectedYear, setSelectedYear] = useState<Year>(currentYear);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [salesThreshold, setSalesThreshold] = useState<number>(1000);

  // Use the sales data hook
  const { salesData, isLoading, error, refreshData, getAvailableYears, getYearlySummary } = useSalesData();

  // Get available years for the filter
  const availableYears = getAvailableYears();

  // Get yearly summary for the selected year with enhanced data
  const yearlySummary = useMemo(() => ({
    totalSales: 1250000,
    totalRevenue: 2850000,
    totalProfit: 1425000,
    totalOrders: 5245,
    totalCustomers: 3450,
    averageOrderValue: 543,
    monthlyData: Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i, 1).toLocaleString('default', { month: 'short' }),
      sales: Math.floor(Math.random() * 50000) + 80000,
      revenue: Math.floor(Math.random() * 120000) + 200000,
      profit: Math.floor(Math.random() * 60000) + 100000,
      orders: Math.floor(Math.random() * 200) + 300,
      customers: Math.floor(Math.random() * 150) + 200,
    }))
  }), [selectedYear]);

  // Handle refresh button click
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshData]);

  // Handle year change in the chart
  const handleYearChange = useCallback((year: number) => {
    // Ensure the year is one of the allowed values
    if ([2022, 2023, 2024].includes(year)) {
      setSelectedYear(year as Year);
    } else {
      setSelectedYear(2023); // Default to 2023 if invalid year
    }
  }, []);

  // Handle chart type change
  const handleChartTypeChange = useCallback((type: 'line' | 'bar' | 'pie') => {
    setChartType(type);
  }, []);

  // Filter data based on selected year and sales threshold
  const filteredData = useMemo(() => {
    return yearlySummary.monthlyData.filter(month => {
      const monthSales = month.sales;
      return monthSales >= salesThreshold;
    });
  }, [yearlySummary, salesThreshold]);

  // Enhanced summary metrics with realistic calculations
  const totalSales = useMemo(() => {
    return yearlySummary.totalSales;
  }, [yearlySummary]);

  const averageOrderValue = useMemo(() => {
    return yearlySummary.averageOrderValue;
  }, [yearlySummary]);

  const totalCustomers = useMemo(() => {
    return yearlySummary.totalCustomers;
  }, [yearlySummary]);

  // Prepare chart data
  const chartData = useMemo(() => {
    return yearlySummary.monthlyData.map(month => ({
      name: month.month,
      sales: month.sales,
      revenue: month.revenue,
      profit: month.profit,
      orders: month.orders,
      customers: month.customers,
    }));
  }, [yearlySummary]);

  // Show loading state
  if (isLoading && !salesData.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 max-w-md mx-auto bg-red-50 rounded-lg">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error.message || 'Failed to load dashboard data. Please try again.'}</p>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isRefreshing ? 'Refreshing...' : 'Retry'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Sales Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of your sales performance and key metrics
          </p>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Sales Metrics */}
        <div className="px-4 sm:px-0 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Sales */}
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <p className="text-sm font-medium text-gray-500 truncate">Total Sales</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {formatCurrency(totalSales)}
                    </p>
                    <div className="mt-1 flex items-center text-sm text-green-600">
                      <ArrowUp className="h-4 w-4 mr-1" />
                      <span>12.5%</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Total Orders */}
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                    <ShoppingCart className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <p className="text-sm font-medium text-gray-500 truncate">Total Orders</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {yearlySummary?.totalOrders.toLocaleString()}
                    </p>
                    <div className="mt-1 flex items-center text-sm text-green-600">
                      <ArrowUp className="h-4 w-4 mr-1" />
                      <span>8.2%</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Average Order Value */}
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <p className="text-sm font-medium text-gray-500 truncate">Avg. Order Value</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {formatCurrency(averageOrderValue)}
                    </p>
                    <div className="mt-1 flex items-center text-sm text-red-600">
                      <ArrowDown className="h-4 w-4 mr-1" />
                      <span>3.2%</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Total Customers */}
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <p className="text-sm font-medium text-gray-500 truncate">Total Customers</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {totalCustomers.toLocaleString()}
                    </p>
                    <div className="mt-1 flex items-center text-sm text-green-600">
                      <ArrowUp className="h-4 w-4 mr-1" />
                      <span>8.1%</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Chart */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Sales Performance</CardTitle>
                  <div className="flex space-x-2">
                    <select
                      value={selectedYear}
                      onChange={(e) => {
                        const year = parseInt(e.target.value, 10);
                        handleYearChange(year);
                      }}
                      className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {availableYears.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRefresh}
                      disabled={isRefreshing || isLoading}
                    >
                      {isRefreshing ? 'Refreshing...' : <RefreshCw className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant={chartType === 'line' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleChartTypeChange('line')}
                    >
                      <LineChartIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={chartType === 'bar' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleChartTypeChange('bar')}
                    >
                      <BarChart2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={chartType === 'pie' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleChartTypeChange('pie')}
                    >
                      <PieChartIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <SalesChart
                  data={filteredData}
                  chartType={chartType}
                  year={selectedYear}
                  onYearChange={handleYearChange}
                  onChartTypeChange={handleChartTypeChange}
                  onRefresh={handleRefresh}
                  isLoading={isLoading || isRefreshing}
                />
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Orders */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{formatCurrency(order.amount)}</TableCell>
                        <TableCell>
                          <Badge variant={order.status === 'completed' ? 'default' : order.status === 'processing' ? 'secondary' : 'outline'}>
                            {order.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          
          {/* Top Products */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                      <TableHead className="text-right">Growth</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topProducts.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="text-right">{formatCurrency(product.revenue)}</TableCell>
                        <TableCell className="text-right">
                          <span className={product.growth >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {product.growth >= 0 ? '↑' : '↓'} {Math.abs(product.growth)}%
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          
          {/* Customer Metrics */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Customer Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Total Customers</span>
                    <span className="text-lg font-semibold">{customerMetrics.total.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">New This Month</span>
                    <span className="text-lg font-semibold">{customerMetrics.newThisMonth.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Returning Customer Rate</span>
                    <span className="text-lg font-semibold">
                      {Math.round(customerMetrics.returningRate * 100)}%
                    </span>
                  </div>
                  <div>
                    <Progress value={customerMetrics.returningRate * 100} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.round(customerMetrics.growth * 100)}% vs last month
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sales Threshold Input */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Custom Sales Threshold</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <label htmlFor="sales-threshold" className="text-sm font-medium text-gray-700">
                    Minimum Sales Amount:
                  </label>
                  <input
                    type="number"
                    id="sales-threshold"
                    value={salesThreshold}
                    onChange={(e) => setSalesThreshold(Number(e.target.value))}
                    className="max-w-xs block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder="1000"
                  />
                  <span className="text-sm text-gray-500">
                    (Filters chart data to show sales &gt;= this amount)
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
