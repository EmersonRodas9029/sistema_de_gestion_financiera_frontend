import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  label: string;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, totalItems, itemsPerPage, label, onPageChange }: PaginationProps) => (
  <div className="p-4 border-t border-white/10 flex items-center justify-between">
    <p className="text-white/40 text-sm">
      Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} {label}
    </p>
    <div className="flex gap-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={16} />
      </motion.button>
      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        let pageNum: number;
        if (totalPages <= 5) pageNum = i + 1;
        else if (currentPage <= 3) pageNum = i + 1;
        else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
        else pageNum = currentPage - 2 + i;
        return (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(pageNum)}
            className={`w-8 h-8 rounded flex items-center justify-center transition-all ${
              currentPage === pageNum
                ? 'bg-[#F05984] text-white shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
            }`}
          >
            {pageNum}
          </motion.button>
        );
      })}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight size={16} />
      </motion.button>
    </div>
  </div>
);
