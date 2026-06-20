import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { formatCurrency } from '../../utils';

interface CategoryProgressBarProps {
  name: string;
  amount: number;
  percentage: number;
  color: string;
  icon: ReactNode;
  count: number;
  index?: number;
}

export const CategoryProgressBar = ({
  name, amount, percentage, color, icon, count, index = 0
}: CategoryProgressBarProps) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
    className="bg-white/5 rounded-lg p-2.5 hover:bg-white/10 transition-all"
  >
    <div className="flex items-center justify-between mb-1.5">
      <div className="flex items-center gap-2">
        <div className={`p-1 rounded-lg bg-gradient-to-r ${color} bg-opacity-20`}>
          {icon}
        </div>
        <span className="text-white text-xs font-medium">{name}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-white/50 text-xs">{percentage.toFixed(1)}%</span>
        <span className="text-white text-xs font-semibold">{formatCurrency(amount)}</span>
      </div>
    </div>
    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, delay: index * 0.1 }}
        className={`h-full bg-gradient-to-r ${color} rounded-full`}
      />
    </div>
    <p className="text-white/30 text-[10px] mt-1">{count} transacciones</p>
  </motion.div>
);
