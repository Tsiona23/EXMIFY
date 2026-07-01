import React from 'react';
import Header from './Header';

const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-['Inter'] dark:bg-[#070B14]">
      <Header />
      <main className="container mx-auto flex-grow px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
