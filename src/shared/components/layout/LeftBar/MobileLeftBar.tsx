import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { LeftBar } from './LeftBar';

interface MobileLeftBarProps {
  userRole: 'admin' | 'client';
  userName?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const MobileLeftBar = ({ userRole, userName, isOpen, onClose }: MobileLeftBarProps) => {
  // Prevenir scroll cuando el menú está abierto
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

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Menú lateral móvil */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="relative h-full">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>
          <LeftBar userRole={userRole} userName={userName} />
        </div>
      </div>
      
      {/* Versión desktop */}
      <div className="hidden lg:block">
        <LeftBar userRole={userRole} userName={userName} />
      </div>
    </>
  );
};
