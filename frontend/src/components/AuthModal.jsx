import { useState } from 'react';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register, demoLogin } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('ROLE_DONOR');
  const [locationName, setLocationName] = useState('New Delhi, India');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        const user = await login(email, password);
        showToast(`Welcome back, ${user.name}!`, 'success');
      } else {
        const user = await register({
          name: name.trim(),
          email: email.trim(),
          password,
          phone: phone.trim(),
          role,
          locationName,
          latitude: 28.6139,
          longitude: 77.2090,
        });
        showToast(`Account created! Welcome, ${user.name}`, 'success');
      }
      onClose();
    } catch (err) {
      showToast(err.message || 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSelect = async (demoEmail) => {
    setLoading(true);
    try {
      const user = await demoLogin(demoEmail);
      showToast(`Logged in as ${user.name}`, 'success');
      onClose();
    } catch (err) {
      showToast(err.message || 'Demo login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-amber-50 to-[#FFFDF9] border-b border-[#F2E8DC] text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#E04F36] to-[#F28C38] flex items-center justify-center text-white mx-auto shadow-md shadow-[#E04F36]/20 mb-3">
            <Lock className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h3 className="text-xl font-black text-stone-900 font-['Outfit']">
            {mode === 'login' ? 'Welcome to Foodie Findings' : 'Join the Food Rescue Net'}
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            {mode === 'login'
              ? 'Sign in to post surplus or claim community pickups'
              : 'Sign up to rescue food, reduce waste, and feed your community'}
          </p>
        </div>

        {/* Quick 1-Click Demo Profiles */}
        <div className="p-4 bg-stone-50/80 border-b border-stone-200/80">
          <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Instant Demo Logins (1-Click)</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleDemoSelect(acc.email)}
                className="flex items-center gap-2 p-2 rounded-xl border border-stone-200 bg-white hover:border-amber-400 hover:bg-amber-50/40 text-left transition-all"
              >
                <span className="text-base">{acc.icon}</span>
                <div className="truncate">
                  <p className="text-xs font-bold text-stone-900 truncate">{acc.label}</p>
                  <p className="text-[10px] text-stone-500">{acc.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tab switch between Login and Register */}
        <div className="flex border-b border-stone-100 text-xs font-bold text-stone-500">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-3 text-center transition-colors ${
              mode === 'login' ? 'text-[#E04F36] border-b-2 border-[#E04F36]' : 'hover:text-stone-900'
            }`}
          >
            Sign In with Email
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-3 text-center transition-colors ${
              mode === 'register' ? 'text-[#E04F36] border-b-2 border-[#E04F36]' : 'hover:text-stone-900'
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Full / Business Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Green Leaf Cafe or Jane Doe"
                    className="w-full text-xs p-2.5 pl-9 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#E04F36]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (415) 555-0199"
                    className="w-full text-xs p-2.5 pl-9 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#E04F36]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Primary Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#E04F36] bg-white"
                >
                  <option value="ROLE_DONOR">🍲 Food Donor (Restaurant, Baker, Grocery, Caterer)</option>
                  <option value="ROLE_VOLUNTEER">🚲 Rescue Courier / Volunteer</option>
                  <option value="ROLE_NGO">🤝 Community Food Bank / Shelter / Charity</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.com"
                className="w-full text-xs p-2.5 pl-9 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#E04F36]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs p-2.5 pl-9 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#E04F36]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-[#E04F36] hover:bg-[#C93F27] text-white font-bold text-xs sm:text-sm shadow-md transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create My Account'}
          </button>

        </form>

      </div>
    </div>
  );
}
