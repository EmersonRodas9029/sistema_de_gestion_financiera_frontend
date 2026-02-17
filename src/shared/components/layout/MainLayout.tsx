import { type ReactNode } from 'react';
import { MobileLeftBar } from './LeftBar/MobileLeftBar';

interface MainLayoutProps {
  children: ReactNode;
  userRole: 'admin' | 'client';
  userName?: string;
}

export const MainLayout = ({ children, userRole, userName }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <MobileLeftBar userRole={userRole} userName={userName} />
      <main className="lg:ml-64 p-4 lg:p-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
