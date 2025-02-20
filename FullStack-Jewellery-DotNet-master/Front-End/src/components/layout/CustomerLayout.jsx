import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '../../context/AuthContext';
import './layout.css';

const CustomerLayout = ({ children }) => {
  const { user } = useAuth();

  // Don't show customer layout for admin users
  if (user?.role === 'Admin') {
    return <>{children}</>;
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default CustomerLayout;