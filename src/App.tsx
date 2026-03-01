import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Login from './components/Login';

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {token ? <Dashboard onLogout={() => setToken(null)} token={token} /> : <Login onLogin={setToken} />}
    </div>
  );
}
