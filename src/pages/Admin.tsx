import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../components/Admin/AdminLayout';
import AdminDashboard from './Admin/Dashboard';
import AdminUsers from './Admin/Users';
import AdminProducts from './Admin/Products';
import AdminOrders from './Admin/Orders';
import AdminPayments from './Admin/Payments';
import AdminReviews from './Admin/Reviews';
import AdminAnalytics from './Admin/Analytics';
import AdminSettings from './Admin/Settings';

export default function Admin() {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="settings" element={<AdminSettings />} />
        {/* Fallback for other routes */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
}
