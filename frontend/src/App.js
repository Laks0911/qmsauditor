import Reports from './pages/Reports';
import Settings from './pages/Settings';
import LayoutComponent from './components/Layout';
import AuditList from './components/AuditList';
import Findings from './pages/Findings';
import AuditDetail from './pages/AuditDetail';
import { useState } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import setupAxios from './axiosConfig';
import Dashboard from './pages/Dashboard';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
  `${process.env.REACT_APP_API_URI}/api/auth/login/`,
  { username, password }
);
// Only store token if it's valid

      if (res.data.access && res.data.refresh) {
  console.log("✅ Tokens received:", {
    access: res.data.access.substring(0, 20) + "...",
    refresh: res.data.refresh.substring(0, 20) + "..."
  });
  
  localStorage.setItem('access', res.data.access);
  localStorage.setItem('refresh', res.data.refresh);
  
  console.log("✅ Tokens stored in localStorage");
  console.log("✅ localStorage contents:", {
    access: localStorage.getItem('access')?.substring(0, 20),
    refresh: localStorage.getItem('refresh')?.substring(0, 20)
  });
  
  // Add small delay before redirect
  setTimeout(() => {
    window.location.href = '/dashboard';
  }, 500);
} else {
  console.error("❌ No tokens in response:", res.data);
  setMessage('Login failed: Invalid response from server');
}


      window.location.href = '/dashboard';
    } catch (err) {
  console.error("❌ Login error:", err.message);
  console.error("❌ Full error:", err);
  if (err.response) {
    console.error("❌ Response status:", err.response.status);
    console.error("❌ Response data:", err.response.data);
  }
  setMessage("Login failed ❌");
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
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded mb-4"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Sign In
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm">{message}</p>
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
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<LayoutComponent><Dashboard /></LayoutComponent>} />
        <Route path="/audits" element={<LayoutComponent><AuditList /></LayoutComponent>} />
        <Route path="/audit/:id" element={<LayoutComponent><AuditDetail /></LayoutComponent>} />
        <Route path="/findings" element={<LayoutComponent><Findings /></LayoutComponent>} />
        <Route path="/reports" element={<LayoutComponent><Reports /></LayoutComponent>} />
        <Route path="/settings" element={<LayoutComponent><Settings /></LayoutComponent>} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
