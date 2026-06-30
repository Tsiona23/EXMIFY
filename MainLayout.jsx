import React from 'react';
import Header from './Header';

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#070B14] font-['Inter']">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      {/* You can add a <Footer /> component here later */}
    </div>
  );
};

export default MainLayout;