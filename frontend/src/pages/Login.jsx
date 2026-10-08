import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UtensilsCrossed, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectUrl = new URLSearchParams(location.search).get('redirect') || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const authData = await login(email, password);
      if (authData.role === 'ADMIN') {
        navigate('/dashboard');
      } else {
        navigate(redirectUrl);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#e23744] to-[#f97316] text-white flex items-center justify-center mx-auto shadow-md">
          <UtensilsCrossed className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#1e293b] font-serif">
          Welcome to Foodie Findings
        </h1>
        <p className="text-xs text-[#64748b]">
          Sign in to coordinate surplus food pickups and manage donations.
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e2d9cd] shadow-xs space-y-5">
        
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#faf7f2] border border-[#e2d9cd] rounded-xl text-sm focus:outline-none focus:border-[#e23744]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-[#475569]">Password</label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Contact administrator or reset via registration."); }} className="text-[11px] text-[#e23744] hover:underline font-semibold">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#faf7f2] border border-[#e2d9cd] rounded-xl text-sm focus:outline-none focus:border-[#e23744]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-[#e23744] focus:ring-[#e23744] w-3.5 h-3.5"
              />
              <span className="text-xs text-[#64748b]">Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#e23744] to-[#f97316] text-white font-bold text-sm shadow-md hover:opacity-95 transition-all flex items-center justify-center space-x-1 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </form>

        {/* Demo Fast Login Pills */}
        <div className="pt-4 border-t border-[#f1ede6] space-y-2">
          <p className="text-[10px] uppercase font-bold text-[#94a3b8] text-center">Fast Login Presets</p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => handleQuickDemoFill('donor@foodiefindings.org', 'donor123')}
              className="p-2 rounded-lg bg-[#faf7f2] border border-[#e2d9cd] hover:border-[#e23744] text-[#1e293b] font-medium text-left truncate"
            >
              🍱 Donor Hall
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoFill('volunteer@foodiefindings.org', 'volunteer123')}
              className="p-2 rounded-lg bg-[#faf7f2] border border-[#e2d9cd] hover:border-[#f97316] text-[#1e293b] font-medium text-left truncate"
            >
              🤝 Volunteer
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoFill('ngo@hopefoundation.org', 'ngo123')}
              className="p-2 rounded-lg bg-[#faf7f2] border border-[#e2d9cd] hover:border-[#16a34a] text-[#1e293b] font-medium text-left truncate"
            >
              🏢 Verified NGO
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoFill('admin@foodiefindings.org', 'admin123')}
              className="p-2 rounded-lg bg-[#faf7f2] border border-[#e2d9cd] hover:border-blue-600 text-[#1e293b] font-medium text-left truncate"
            >
              🛡️ Admin HQ
            </button>
          </div>
        </div>

      </div>

      {/* Footer link */}
      <p className="text-center text-xs text-[#64748b]">
        Don't have an account?{' '}
        <Link to="/register" className="font-bold text-[#e23744] hover:underline">
          Register here
        </Link>
      </p>

    </div>
  );
};

export default Login;
