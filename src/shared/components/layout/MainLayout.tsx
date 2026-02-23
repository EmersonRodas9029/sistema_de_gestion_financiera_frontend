import { type ReactNode, useState } from 'react';
import { MobileLeftBar } from './LeftBar/MobileLeftBar';
import { NavBar } from './NavBar/NavBar';

interface MainLayoutProps {
  children: ReactNode;
  userRole: 'admin' | 'client';
  userName?: string;
  pageTitle?: string;
}

export const MainLayout = ({ children, userRole, userName, pageTitle }: MainLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <MobileLeftBar 
        userRole={userRole} 
        userName={userName} 
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
      <NavBar 
        userName={userName} 
        userRole={userRole}
        pageTitle={pageTitle}
        onMenuClick={() => setMobileMenuOpen(true)}
      />
      <main className="lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-24 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
