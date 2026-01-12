import { ReactNode } from 'react';

interface TableProps {
  children: ReactNode;
  className?: string;
}

export const Table = ({ children, className = '' }: TableProps) => (
  <div className="w-full overflow-x-auto">
    <table className={`min-w-full divide-y divide-gray-200 ${className}`}>
      {children}
    </table>
  </div>
);

export const TableHeader = ({ children }: { children: ReactNode }) => (
  <thead className="bg-gray-50">
    {children}
  </thead>
);

export const TableBody = ({ children }: { children: ReactNode }) => (
  <tbody className="bg-white divide-y divide-gray-200">
    {children}
  </tbody>
);

export const TableRow = ({ children }: { children: ReactNode }) => (
  <tr>{children}</tr>
);

interface TableHeadProps {
  children: ReactNode;
  className?: string;
}

export const TableHead = ({ children, className = '' }: TableHeadProps) => (
  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}>
    {children}
  </th>
);

export const TableCell = ({ children, className = '' }: { children: ReactNode, className?: string }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${className}`}>
    {children}
  </td>
);
