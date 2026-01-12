import { useState, useEffect, useMemo, useCallback } from 'react';

export type Year = 2022 | 2023 | 2024;

export interface SalesDataItem {
  month: string;
  sales: number;
  orders: number;
  revenue: number;
  profit: number;
  customers: number;
  year: Year;
  region?: string;
  productCategory?: string;
  monthIndex?: number;
}

interface UseSalesDataReturn {
  salesData: SalesDataItem[];
  isLoading: boolean;
  refreshData: () => void;
  error: Error | null;
  fetchSalesData: (year: Year) => void;
  getAvailableYears: () => Year[];
  getYearlySummary: (year: Year) => {
    totalSales: number;
    totalRevenue: number;
    totalProfit: number;
    totalOrders: number;
    totalCustomers: number;
    averageOrderValue: number;
  } | null;
  getFilteredData: (filters: {
    year: Year;
    region?: string;
    category?: string;
    minSales?: number;
  }) => SalesDataItem[];
  regions: string[];
  productCategories: string[];
}

// Mock data for different years
const mockData: Record<Year, Omit<SalesDataItem, 'year'>[]> = {
  2022: [
    { month: 'Jan', sales: 1200, orders: 240, revenue: 120000, profit: 40000, customers: 180, monthIndex: 1 },
    { month: 'Feb', sales: 1500, orders: 280, revenue: 150000, profit: 50000, customers: 220, monthIndex: 2 },
    { month: 'Mar', sales: 1800, orders: 320, revenue: 180000, profit: 60000, customers: 250, monthIndex: 3 },
    { month: 'Apr', sales: 2000, orders: 350, revenue: 200000, profit: 70000, customers: 280, monthIndex: 4 },
    { month: 'May', sales: 2200, orders: 380, revenue: 220000, profit: 75000, customers: 310, monthIndex: 5 },
    { month: 'Jun', sales: 2500, orders: 400, revenue: 250000, profit: 85000, customers: 350, monthIndex: 6 },
    { month: 'Jul', sales: 2800, orders: 420, revenue: 280000, profit: 90000, customers: 380, monthIndex: 7 },
    { month: 'Aug', sales: 3000, orders: 450, revenue: 300000, profit: 100000, customers: 400, monthIndex: 8 },
    { month: 'Sep', sales: 2800, orders: 420, revenue: 280000, profit: 95000, customers: 380, monthIndex: 9 },
    { month: 'Oct', sales: 3200, orders: 480, revenue: 320000, profit: 110000, customers: 420, monthIndex: 10 },
    { month: 'Nov', sales: 3500, orders: 500, revenue: 350000, profit: 120000, customers: 450, monthIndex: 11 },
    { month: 'Dec', sales: 4000, orders: 600, revenue: 400000, profit: 140000, customers: 500, monthIndex: 12 },
  ],
  2023: [
    { month: 'Jan', sales: 1500, orders: 300, revenue: 150000, profit: 50000, customers: 220, monthIndex: 1 },
    { month: 'Feb', sales: 1800, orders: 330, revenue: 180000, profit: 60000, customers: 250, monthIndex: 2 },
    { month: 'Mar', sales: 2100, orders: 360, revenue: 210000, profit: 70000, customers: 280, monthIndex: 3 },
    { month: 'Apr', sales: 2300, orders: 390, revenue: 230000, profit: 75000, customers: 310, monthIndex: 4 },
    { month: 'May', sales: 2500, orders: 420, revenue: 250000, profit: 80000, customers: 340, monthIndex: 5 },
    { month: 'Jun', sales: 2800, orders: 450, revenue: 280000, profit: 90000, customers: 380, monthIndex: 6 },
    { month: 'Jul', sales: 3100, orders: 480, revenue: 310000, profit: 100000, customers: 410, monthIndex: 7 },
    { month: 'Aug', sales: 3300, orders: 510, revenue: 330000, profit: 110000, customers: 440, monthIndex: 8 },
    { month: 'Sep', sales: 3500, orders: 540, revenue: 350000, profit: 115000, customers: 470, monthIndex: 9 },
    { month: 'Oct', sales: 3800, orders: 570, revenue: 380000, profit: 125000, customers: 500, monthIndex: 10 },
    { month: 'Nov', sales: 4200, orders: 630, revenue: 420000, profit: 140000, customers: 550, monthIndex: 11 },
    { month: 'Dec', sales: 5000, orders: 750, revenue: 500000, profit: 170000, customers: 650, monthIndex: 12 },
  ],
  2024: [
    { month: 'Jan', sales: 2000, orders: 400, revenue: 200000, profit: 70000, customers: 300, monthIndex: 1 },
    { month: 'Feb', sales: 2300, orders: 430, revenue: 230000, profit: 80000, customers: 330, monthIndex: 2 },
    { month: 'Mar', sales: 2600, orders: 460, revenue: 260000, profit: 90000, customers: 360, monthIndex: 3 },
    { month: 'Apr', sales: 2900, orders: 490, revenue: 290000, profit: 100000, customers: 390, monthIndex: 4 },
    { month: 'May', sales: 3200, orders: 520, revenue: 320000, profit: 110000, customers: 420, monthIndex: 5 },
    { month: 'Jun', sales: 3500, orders: 550, revenue: 350000, profit: 120000, customers: 450, monthIndex: 6 },
  ],
};

const REGIONS = ['North', 'South', 'East', 'West'];
const PRODUCT_CATEGORIES = ['Electronics', 'Clothing', 'Home & Garden', 'Sports'];

export const useSalesData = () => {
  const [salesData, setSalesData] = useState<SalesDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const generateMockData = useCallback((year: Year): SalesDataItem[] => {
    const baseData = mockData[year] || [];
    const enhancedData: SalesDataItem[] = [];

    baseData.forEach(item => {
      REGIONS.forEach(region => {
        PRODUCT_CATEGORIES.forEach(category => {
          // Add some randomness to the data
          const variation = 0.9 + Math.random() * 0.2; // 0.9 to 1.1
          enhancedData.push({
            ...item,
            year,
            region,
            productCategory: category,
            sales: Math.round(item.sales * variation),
            revenue: Math.round(item.revenue * variation),
            profit: Math.round(item.profit * variation),
            orders: Math.round(item.orders * variation),
            customers: Math.round(item.customers * variation)
          });
        });
      });
    });

    return enhancedData;
  }, []);

  const fetchSalesData = useCallback(async (year: Year) => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const data = generateMockData(year);
      setSalesData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch sales data'));
      setSalesData([]);
    } finally {
      setIsLoading(false);
    }
  }, [generateMockData]);

  const refreshData = useCallback(() => {
    const currentYear = new Date().getFullYear() as Year;
    fetchSalesData(currentYear);
  }, [fetchSalesData]);

  const getAvailableYears = useCallback((): Year[] => {
    return [2022, 2023, 2024];
  }, []);

  const getYearlySummary = useCallback((year: Year) => {
    const yearData = salesData.filter(item => item.year === year);
    if (yearData.length === 0) return null;

    return {
      totalSales: yearData.reduce((sum, item) => sum + item.sales, 0),
      totalRevenue: yearData.reduce((sum, item) => sum + item.revenue, 0),
      totalProfit: yearData.reduce((sum, item) => sum + item.profit, 0),
      totalOrders: yearData.reduce((sum, item) => sum + item.orders, 0),
      totalCustomers: yearData.reduce((sum, item) => sum + item.customers, 0),
      averageOrderValue: yearData.reduce((sum, item) => sum + item.revenue, 0) / 
                         (yearData.reduce((sum, item) => sum + item.orders, 0) || 1)
    };
  }, [salesData]);

  const getFilteredData = useCallback((filters: { 
    year: Year; 
    region?: string; 
    category?: string;
    minSales?: number;
  }): SalesDataItem[] => {
    return salesData.filter(item => {
      const matchesYear = item.year === filters.year;
      const matchesRegion = !filters.region || item.region === filters.region;
      const matchesCategory = !filters.category || item.productCategory === filters.category;
      const matchesMinSales = !filters.minSales || item.sales >= (filters.minSales || 0);
      
      return matchesYear && matchesRegion && matchesCategory && matchesMinSales;
    });
  }, [salesData]);

  // Load initial data
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    salesData,
    isLoading,
    error,
    refreshData,
    fetchSalesData,
    getAvailableYears,
    getYearlySummary,
    getFilteredData,
    regions: REGIONS,
    productCategories: PRODUCT_CATEGORIES
  };
};
