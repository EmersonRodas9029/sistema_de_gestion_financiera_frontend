import { useEffect } from 'react';
import { LeftBar } from './LeftBar';

interface MobileLeftBarProps {
  userRole: 'admin' | 'client';
  userName?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const MobileLeftBar = ({ userRole, userName, isOpen, onClose }: MobileLeftBarProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Solo renderizar si está abierto
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay oscuro - sin cerrar al hacer click */}
      <div
        className="fixed inset-0 bg-black/70 z-40 transition-opacity duration-300"
      />

      {/* Menú lateral que se desliza desde la izquierda */}
      <div className="fixed top-0 left-0 z-50 h-full transition-transform duration-300 ease-in-out animate-slide-in">
        <LeftBar userRole={userRole} userName={userName} onNavigate={onClose} />
      </div>
    </>
  );
};
