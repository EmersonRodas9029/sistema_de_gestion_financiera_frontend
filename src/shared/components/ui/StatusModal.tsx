import { motion } from 'framer-motion';
import { Edit, X } from 'lucide-react';
import { formatCurrency } from '../../utils';

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemLabel: string;
  itemName: string;
  itemAmount: number;
  currentStatus: string;
  onStatusChange: (status: string) => void;
  onConfirm: () => void;
}

export const StatusModal = ({
  isOpen, onClose, itemLabel, itemName, itemAmount,
  currentStatus, onStatusChange, onConfirm
}: StatusModalProps) => {
  if (!isOpen) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-[#1a0f14] rounded-xl border border-white/10 max-w-md w-full shadow-2xl"
      >
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Edit size={20} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Editar Estado</h2>
              <p className="text-white/40 text-sm">Cambia el estado del {itemLabel}</p>
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X size={20} className="text-white/60" />
          </motion.button>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="text-white/60 text-sm mb-1.5 block capitalize">{itemLabel}</label>
              <p className="text-white font-medium">{itemName}</p>
              <p className="text-white/40 text-sm mt-1">{formatCurrency(itemAmount)}</p>
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Nuevo Estado</label>
              <select
                value={currentStatus}
                onChange={(e) => onStatusChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
              >
                <option value="completado" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Completado</option>
                <option value="pendiente" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Pendiente</option>
                <option value="programado" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Programado</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onClose}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all">
                Cancelar
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onConfirm}
                className="px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-all">
                Actualizar Estado
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
