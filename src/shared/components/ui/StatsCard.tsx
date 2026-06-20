import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
  iconBg?: string;
  gradient?: boolean;
  progressBar?: number; // 0-100, renders a thin progress bar below value
}

export const StatsCard = ({
  title, value, subtitle, icon, iconBg = 'bg-white/10', gradient = false, progressBar
}: StatsCardProps) => (
  <motion.div
    whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}
    className={`rounded-xl p-5 border border-white/10 shadow-lg ${
      gradient
        ? 'bg-gradient-to-br from-[#321D28] to-[#6E4068]'
        : 'bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all'
    }`}
  >
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-white/60 text-sm">{title}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
        {progressBar !== undefined && (
          <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#F05984] to-[#BC455F] rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progressBar, 100)}%` }}
            />
          </div>
        )}
        <p className="text-white/40 text-xs mt-1">{subtitle}</p>
      </div>
      <div className={`p-3 rounded-xl ${iconBg} ml-3`}>
        {icon}
      </div>
    </div>
  </motion.div>
);
