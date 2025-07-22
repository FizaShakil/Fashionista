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

// Simple admin session check using localStorage
const isAdminLoggedIn = () => {
  return localStorage.getItem('isAdmin') === 'true';
};

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  if (!isAdminLoggedIn()) {
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
