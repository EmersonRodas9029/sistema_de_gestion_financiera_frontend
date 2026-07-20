import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { Search, Filter, XCircle, ChevronDown } from 'lucide-react';

const PERIOD_OPTIONS = [
  { value: 'todos', label: 'Todos' },
  { value: 'este-mes', label: 'Este mes' },
  { value: 'este-semana', label: 'Esta semana' },
  { value: 'este-ano', label: 'Este año' },
];

interface SearchFilterBarProps {
  searchTerm: string;
  onSearch: (value: string) => void;
  selectedPeriod?: string;
  onPeriodChange?: (period: string) => void;
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
        {onPeriodChange && (
          // ponytail: reemplaza el <select> nativo — su lista de opciones es un popup del
          // navegador/SO que ignora el viewport emulado en DevTools/dispositivos y se
          // desbordaba de la pantalla. Listbox renderiza el panel como DOM normal, así que
          // `anchor` lo mantiene dentro del viewport real.
          <Listbox value={selectedPeriod} onChange={onPeriodChange}>
            <div className="relative">
              <ListboxButton className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm">
                <span>{PERIOD_OPTIONS.find(o => o.value === selectedPeriod)?.label ?? 'Todos'}</span>
                <ChevronDown size={14} className="text-white/50" />
              </ListboxButton>
              <ListboxOptions
                anchor="bottom start"
                className="z-50 mt-1 w-40 rounded-lg bg-[#1a0f14] border border-white/10 shadow-xl focus:outline-none [--anchor-gap:4px]"
              >
                {PERIOD_OPTIONS.map(({ value, label }) => (
                  <ListboxOption
                    key={value}
                    value={value}
                    className="px-3 py-2 text-sm text-white/80 data-[focus]:bg-white/10 data-[focus]:text-white cursor-pointer"
                  >
                    {label}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </div>
          </Listbox>
        )}
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
