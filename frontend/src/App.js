import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import PrivateRoute from './components/PrivateRoute';
import setupAxios from './axiosConfig';
import Dashboard from './pages/Dashboard';
import AuditDetail from './pages/AuditDetail';
import Findings from './pages/Findings';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import LayoutComponent from './components/Layout';

function Login() {
  const { login, loading } = useAuth();  // ← ADD THIS LINE
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  const handleLogin = async (e) => {
    e.preventDefault();
    
    const success = await login(email, password);
    
    if (success) {
      setMessage("Login successful!");
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500);
    } else {
      setMessage("Login failed: Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold text-blue-600 mb-2">QMSAuditor</h1>
        <p className="text-gray-500 mb-6">Sign in to your account</p>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border p-2 rounded mb-4"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded mb-4"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-red-600">{message}</p>
        )}
      </div>
    </div>
  );
}


function App() {
  setupAxios();
  const token = localStorage.getItem('access');
  
  // If no token, show login form
  if (!token) {
    return <Login />;
  }
  
  // If token exists, show protected routes
  return (
  <AuthProvider>
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute element={<LayoutComponent><Dashboard /></LayoutComponent>} />} />
          <Route path="/audit/:id" element={<PrivateRoute element={<LayoutComponent><AuditDetail /></LayoutComponent>} />} />
          <Route path="/findings" element={<PrivateRoute element={<LayoutComponent><Findings /></LayoutComponent>} />} />
          <Route path="/reports" element={<PrivateRoute element={<LayoutComponent><Reports /></LayoutComponent>} />} />
          <Route path="/settings" element={<PrivateRoute element={<LayoutComponent><Settings /></LayoutComponent>} />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </AuthProvider>
);

}


export default App;
