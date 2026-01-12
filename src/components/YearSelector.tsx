'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Year } from '@/hooks/useSalesData';

interface YearSelectorProps {
  selectedYear: Year;
  onYearChange: (year: Year) => void;
}

export default function YearSelector({ selectedYear, onYearChange }: YearSelectorProps) {
  const years = [2022, 2023, 2024] as const;
  const currentYearIndex = years.indexOf(selectedYear as typeof years[number]);
  const isCurrentYear = new Date().getFullYear() === selectedYear;

  const handlePrevYear = () => {
    if (currentYearIndex > 0) {
      onYearChange(years[currentYearIndex - 1]);
    }
  };

  const handleNextYear = () => {
    if (currentYearIndex < years.length - 1) {
      onYearChange(years[currentYearIndex + 1]);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handlePrevYear}
        disabled={currentYearIndex === 0}
        className={`p-1.5 rounded-full ${
          currentYearIndex === 0
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        aria-label="Previous year"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <span className="font-medium text-gray-700 w-16 text-center">
        {selectedYear}
      </span>
      
      <button
        onClick={handleNextYear}
        disabled={currentYearIndex === years.length - 1}
        className={`p-1.5 rounded-full ${
          currentYearIndex === years.length - 1
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        aria-label="Next year"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
      
      {isCurrentYear && (
        <span className="ml-2 text-sm font-medium text-gray-500">
          Current Year
        </span>
      )}
    </div>
  );
}
