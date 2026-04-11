/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import ProductDetails from './pages/ProductDetails';
import UserDashboard from './pages/UserDashboard';
import Auth from './pages/Auth';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import Downloads from './pages/Downloads';
import Admin from './pages/Admin';
import About from './pages/About';
import Careers from './pages/Careers';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import ScrollToTop from './components/ScrollToTop';
import CookieConsent from './components/CookieConsent';

const PrivateRoute = ({ children, role }: { children: React.ReactNode, role?: string }) => {
  const { user, profile, loading, isAdmin } = useAuth();

  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-black text-white">Loading...</div>;
  if (!user) return <Navigate to="/auth" />;
  
  if (role === 'admin' && !isAdmin) return <Navigate to="/" />;

  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <Toaster 
            position="top-center"
            toastOptions={{
              style: {
                background: '#0a0a0a',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              },
            }}
          />
          <Layout>
            <CookieConsent />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/cart" element={<Cart />} />
              
              <Route path="/dashboard/*" element={
                <PrivateRoute>
                  <UserDashboard />
                </PrivateRoute>
              } />
              
              <Route path="/checkout/:id" element={
                <PrivateRoute>
                  <Checkout />
                </PrivateRoute>
              } />
              
              <Route path="/wishlist" element={
                <PrivateRoute>
                  <Wishlist />
                </PrivateRoute>
              } />
              
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              
              <Route path="/downloads" element={
                <PrivateRoute>
                  <Downloads />
                </PrivateRoute>
              } />
              
              <Route path="/admin/*" element={
                <PrivateRoute role="admin">
                  <Admin />
                </PrivateRoute>
              } />
              <Route path="/about" element={<About />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
            </Routes>
          </Layout>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

