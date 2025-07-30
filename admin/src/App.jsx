import React, { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import AddItems from './components/AddItems';
import ItemsList from './components/ItemsList';
import Orders from './components/Orders';
import UsersList from './components/UsersList';
import AdminLogin from './components/AdminLogin';
import OrderDetail from './components/OrderDetail';
import Dashboard from './components/Dashboard';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import axiosInstance from './axiosInstance';

// Admin authentication check
const isAdminLoggedIn = () => {
  return localStorage.getItem('isAdmin') === 'true';
};

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAdminAuth = async () => {
      if (!isAdminLoggedIn()) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        // Verify admin token with server
        await axiosInstance.get('/api/v1/users/me');
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Admin authentication failed:', error);
        localStorage.removeItem('isAdmin');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAdminAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  // Listen for login/logout changes
  const [admin, setAdmin] = useState(isAdminLoggedIn());
  useEffect(() => {
    const handler = () => setAdmin(isAdminLoggedIn());
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
      <div className="flex ">
                <Sidebar />
        <div className="w-px bg-gray-600 h-screen"></div>
        <div className="p-6 w-full">
          <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/additems" element={<AddItems />} />
                    <Route path="/itemlist" element={<ItemsList />} />
            <Route path="/orders" element={<Orders />} />
                    <Route path="/orders/:id" element={<OrderDetail />} />
                    <Route path="/userslist" element={<UsersList />} />
          </Routes>
        </div>
      </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App
