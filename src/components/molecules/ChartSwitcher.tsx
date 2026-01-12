import { BarChart2, LineChart, PieChart } from 'lucide-react';
import { Button } from '../atoms/Button';

type ChartType = 'bar' | 'line' | 'pie';

interface ChartSwitcherProps {
  activeChart: ChartType;
  onChartChange: (chartType: ChartType) => void;
  className?: string;
}

export function ChartSwitcher({ activeChart, onChartChange, className = '' }: ChartSwitcherProps) {
  return (
    <div className={`flex space-x-2 ${className}`}>
      <Button
        variant={activeChart === 'bar' ? 'primary' : 'outline'}
        size="sm"
        onClick={() => onChartChange('bar')}
        className="flex items-center"
        aria-label="Bar Chart"
      >
        <BarChart2 className="h-4 w-4 mr-1" />
        <span>Bar</span>
      </Button>
      <Button
        variant={activeChart === 'line' ? 'primary' : 'outline'}
        size="sm"
        onClick={() => onChartChange('line')}
        className="flex items-center"
        aria-label="Line Chart"
      >
        <LineChart className="h-4 w-4 mr-1" />
        <span>Line</span>
      </Button>
      <Button
        variant={activeChart === 'pie' ? 'primary' : 'outline'}
        size="sm"
        onClick={() => onChartChange('pie')}
        className="flex items-center"
        aria-label="Pie Chart"
      >
        <PieChart className="h-4 w-4 mr-1" />
        <span>Pie</span>
      </Button>
    </div>
  );
}
