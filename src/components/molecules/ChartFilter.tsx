'use client';

import { useState } from 'react';
import { Button } from '../atoms/Button';

type ChartType = 'line' | 'bar' | 'pie';

interface ChartFilterProps {
  selectedType: ChartType;
  onTypeChange: (type: ChartType) => void;
  years: number[];
  selectedYear: number;
  onYearChange: (year: number) => void;
}

export const ChartFilter = ({
  selectedType,
  onTypeChange,
  years,
  selectedYear,
  onYearChange,
}: ChartFilterProps) => {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-md">
        {(['line', 'bar', 'pie'] as const).map((type) => (
          <Button
            key={type}
            variant={selectedType === type ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onTypeChange(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        ))}
      </div>
      
      <select
        className="px-3 py-1 border rounded-md text-sm"
        value={selectedYear}
        onChange={(e) => onYearChange(Number(e.target.value))}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};
