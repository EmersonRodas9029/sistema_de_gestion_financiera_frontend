import { motion } from 'framer-motion';
import { FileText, BarChart3 } from 'lucide-react';

interface ViewModeToggleProps {
  viewMode: 'table' | 'grid';
  onToggle: (mode: 'table' | 'grid') => void;
}

export const ViewModeToggle = ({ viewMode, onToggle }: ViewModeToggleProps) => (
  <div className="flex gap-1">
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onToggle('table')}
      className={`p-2 rounded-lg transition-colors ${
        viewMode === 'table' ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
      }`}
    >
      <FileText size={20} />
    </motion.button>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onToggle('grid')}
      className={`p-2 rounded-lg transition-colors ${
        viewMode === 'grid' ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
      }`}
    >
      <BarChart3 size={20} />
    </motion.button>
  </div>
);
