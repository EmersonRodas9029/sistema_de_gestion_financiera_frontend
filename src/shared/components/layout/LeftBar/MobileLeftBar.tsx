import { Menu, X } from 'lucide-react';
import { LeftBar } from './LeftBar';

interface MobileLeftBarProps {
  userRole: 'admin' | 'client';
  userName?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export const MobileLeftBar = ({ userRole, userName, isOpen = false, onClose }: MobileLeftBarProps) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* LeftBar condicional para móvil */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 lg:hidden`}>
        <LeftBar userRole={userRole} userName={userName} />
      </div>

      {/* LeftBar normal para desktop */}
      <div className="hidden lg:block">
        <LeftBar userRole={userRole} userName={userName} />
      </div>
    </>
  );
};
