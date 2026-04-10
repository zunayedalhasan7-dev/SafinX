import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';
  const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && !isDashboard && <Navbar />}
      <main className={`flex-grow ${!isAuthPage && !isDashboard ? 'pt-24' : ''}`}>
        {children}
      </main>
      {!isAuthPage && !isDashboard && <Footer />}
    </div>
  );
}
