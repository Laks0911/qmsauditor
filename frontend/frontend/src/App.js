import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AuditDetail from './pages/AuditDetail';
import AuditList from './components/AuditList';
import { useState } from "react";
import axios from "axios";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `$${process.env.REACT_APP_API_URI}/api/auth/login`,
        { username, password }
      );
      setMessage("Login successful ✅");
    } catch (err) {
      setMessage("Login failed ❌");
    }
  };
   

 // If not logged in, show login form
if (!token) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {/* existing login form code - keep lines 24-56 as is */}
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
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

// If logged in, show the app with routes
return (
  <BrowserRouter>
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/audits" element={<AuditList />} />
      <Route path="/audit/:id" element={<AuditDetail />} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  </BrowserRouter>
);
 
}

export default App;
