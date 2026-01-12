export type Year = 2022 | 2023 | 2024;

export interface SalesDataItem {
  year: number;
  month: number;
  sales: number;
  revenue: number;
  profit: number;
  orders: number;
  customers: number;
}

export interface Order {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: 'completed' | 'processing' | 'pending' | 'cancelled';
}

export interface Product {
  name: string;
  sales: number;
  revenue: number;
  growth: number;
}

export interface CustomerMetrics {
  total: number;
  newThisMonth: number;
  returningRate: number;
  growth: number;
}
