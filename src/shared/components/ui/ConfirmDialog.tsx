import { AlertTriangle } from 'lucide-react';
import { ModalOverlay } from './ModalOverlay';

interface ConfirmDialogProps {
  isOpen: boolean;
  message: string;
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = ({
  isOpen, message, title = 'Confirmar acción', confirmLabel = 'Confirmar', cancelLabel = 'Cancelar',
  danger = true, onConfirm, onCancel
}: ConfirmDialogProps) => (
  <ModalOverlay
    isOpen={isOpen}
    onClose={onCancel}
    title={title}
    icon={<AlertTriangle size={20} className={danger ? 'text-red-400' : 'text-white'} />}
    maxWidth="max-w-sm"
  >
    <p className="text-white/70 text-sm mb-6">{message}</p>
    <div className="flex justify-end gap-3">
      <button
        onClick={onCancel}
        className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all font-medium"
      >
        {cancelLabel}
      </button>
      <button
        onClick={onConfirm}
        className={`px-4 py-2 rounded-lg text-white transition-all font-medium ${
          danger ? 'bg-red-500/80 hover:bg-red-500' : 'bg-gradient-to-r from-[#F05984] to-[#BC455F] hover:opacity-90'
        }`}
      >
        {confirmLabel}
      </button>
    </div>
  </ModalOverlay>
);
