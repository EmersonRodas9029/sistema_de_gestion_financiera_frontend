import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { LeftBar } from './LeftBar';

interface MobileLeftBarProps {
  userRole: 'admin' | 'client';
  userName?: string;
}

export const MobileLeftBar = ({ userRole, userName }: MobileLeftBarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsOpen(false)} />}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 lg:hidden`}>
        <LeftBar userRole={userRole} userName={userName} />
      </div>
      <div className="hidden lg:block">
        <LeftBar userRole={userRole} userName={userName} />
      </div>
    </>
  );
};
