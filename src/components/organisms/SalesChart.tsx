'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import { Card } from '../atoms/Card';
import { ChartFilter } from '../molecules/ChartFilter';
import { SalesDataItem } from '../../types/sales';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface SalesChartProps {
  data: SalesDataItem[];
  chartType: 'line' | 'bar' | 'pie';
  onChartTypeChange: (type: 'line' | 'bar' | 'pie') => void;
  years: number[];
  selectedYear: number;
  onYearChange: (year: number) => void;
}

export const SalesChart = ({
  data,
  chartType,
  onChartTypeChange,
  years,
  selectedYear,
  onYearChange,
}: SalesChartProps) => {
  const chartData = useMemo(() => {
    return data.filter(item => item.year === selectedYear);
  }, [data, selectedYear]);

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" />
            <YAxis />
            <RechartsTooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="sales"
              name="Sales"
              stroke="#0088FE"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#00C49F"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" />
            <YAxis />
            <RechartsTooltip />
            <Legend />
            <Bar dataKey="sales" name="Sales" fill="#0088FE" radius={[4, 4, 0, 0]}>
              <LabelList dataKey="sales" position="top" formatter={(value: number) => `$${value.toLocaleString()}`} />
            </Bar>
          </BarChart>
        );

      case 'pie':
        const pieData = chartData.map(month => ({
          name: new Date(selectedYear, month.month - 1).toLocaleString('default', { month: 'short' }),
          value: month.sales,
        }));

        return (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <RechartsTooltip formatter={(value) => [`$${value}`, 'Sales']} />
            <Legend />
          </PieChart>
        );
    }
  };

  return (
    <Card>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Sales Overview</h3>
          <ChartFilter
            selectedType={chartType}
            onTypeChange={onChartTypeChange}
            years={years}
            selectedYear={selectedYear}
            onYearChange={onYearChange}
          />
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};
