import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, XCircle } from 'lucide-react';

interface SearchFilterBarProps {
  searchTerm: string;
  onSearch: (value: string) => void;
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  placeholder?: string;
  children?: ReactNode;
}

export const SearchFilterBar = ({
  searchTerm, onSearch, selectedPeriod, onPeriodChange,
  showFilters, onToggleFilters, hasActiveFilters, onClearFilters,
  placeholder = 'Buscar...', children
}: SearchFilterBarProps) => (
  <div className="p-4 border-b border-white/10">
    <div className="flex flex-col lg:flex-row gap-3">
      <div className="relative flex-1">
        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#F05984] focus:ring-1 focus:ring-[#F05984] transition-all"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <select
          value={selectedPeriod}
          onChange={(e) => onPeriodChange(e.target.value)}
          className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
        >
          <option value="todos" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Todos</option>
          <option value="este-mes" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Este mes</option>
          <option value="este-semana" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Esta semana</option>
          <option value="este-ano" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Este año</option>
        </select>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleFilters}
          className={`p-2 rounded-lg transition-colors ${
            showFilters ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
          }`}
        >
          <Filter size={18} />
        </motion.button>
        {hasActiveFilters && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={onClearFilters}
            className="flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-red-400 hover:text-red-300 text-sm"
          >
            <XCircle size={16} />
            <span>Limpiar filtros</span>
          </motion.button>
        )}
      </div>
    </div>
    <AnimatePresence>
      {showFilters && children && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-white/10 overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);
