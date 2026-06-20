import { ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface SortField {
  key: string;
  label: string;
  icon: ReactNode;
}

interface SortBarProps {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (field: string) => void;
  fields: SortField[];
  totalResults: number;
}

export const SortBar = ({ sortBy, sortOrder, onSort, fields, totalResults }: SortBarProps) => (
  <div className="px-4 py-2 bg-white/5 border-t border-white/10 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <span className="text-white/40 text-sm">Ordenar por:</span>
      {fields.map(({ key, label, icon }) => (
        <button
          key={key}
          onClick={() => onSort(key)}
          className={`flex items-center gap-1 text-sm transition-colors ${
            sortBy === key ? 'text-[#F05984]' : 'text-white/60 hover:text-white'
          }`}
        >
          {icon}
          <span>{label}</span>
          {sortBy === key && (sortOrder === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />)}
        </button>
      ))}
    </div>
    <span className="text-white/40 text-sm">{totalResults} resultados</span>
  </div>
);
