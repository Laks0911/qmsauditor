import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import PrivateRoute from './components/PrivateRoute';
import setupAxios from './axiosConfig';
import Dashboard from './pages/Dashboard';
import AuditDetail from './pages/AuditDetail';
import Findings from './pages/Findings';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Layout from './components/Layout';

// Setup Axios with JWT interceptor
setupAxios();

/**
 * Login Component - Wrapped inside AuthProvider
 * Uses useAuth hook which is safe within AuthProvider context
 */
function Login() {
  const { login, loading, error: authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const success = await login(email, password);

    if (success) {
      setMessage('Login successful!');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500);
    } else {
      setError(authError || 'Login failed: Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">QMSAuditor</h1>
        <p className="text-gray-500 mb-6">Sign in to your account</p>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        {error && (
          <p className="mt-4 text-center text-sm text-red-600">{error}</p>
        )}
        {message && (
          <p className="mt-4 text-center text-sm text-green-600">{message}</p>
        )}
      </div>
    </div>
  );
}

/**
 * AppContent - Routes and navigation logic
 * This is inside AuthProvider, so all child components can use useAuth
 */
function AppContent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Navigate to="/dashboard" />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute
                element={
                  <Layout>
                    <Dashboard />
                  </Layout>
                }
              />
            }
          />
          <Route
            path="/audit/:id"
            element={
              <PrivateRoute
                element={
                  <Layout>
                    <AuditDetail />
                  </Layout>
                }
              />
            }
          />
          <Route
            path="/findings"
            element={
              <PrivateRoute
                element={
                  <Layout>
                    <Findings />
                  </Layout>
                }
              />
            }
          />
          <Route
            path="/reports"
            element={
              <PrivateRoute
                element={
                  <Layout>
                    <Reports />
                  </Layout>
                }
              />
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute
                element={
                  <Layout>
                    <Settings />
                  </Layout>
                }
              />
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

/**
 * Main App Component
 * AuthProvider wraps everything so all components have access to auth context
 */
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
