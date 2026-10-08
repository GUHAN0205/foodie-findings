import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';
import {
  Utensils,
  MapPin,
  HeartHandshake,
  BarChart3,
  ShieldCheck,
  PlusCircle,
  Bell,
  LogOut,
  ChevronDown,
  User,
  Sparkles,
  Menu,
  X,
  Compass,
  CheckCircle2,
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  onOpenPostModal,
  onOpenAuthModal,
  onOpenSafetyModal,
}) {
  const { user, logout, demoLogin, notifications, unreadCount } = useAuth();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRoleSwitch = async (email) => {
    setRoleDropdownOpen(false);
    try {
      await demoLogin(email);
    } catch (err) {
      console.error('Role switch failed:', err);
    }
  };

  const navLinks = [
    { id: 'feed', label: 'DISCOVER', icon: Compass },
    { id: 'map', label: 'MAP', icon: MapPin },
    { id: 'pickups', label: 'MISSIONS', icon: HeartHandshake },
    { id: 'impact', label: 'IMPACT', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-3 z-50 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full transition-all duration-300">
      <div
        className={`w-full rounded-[26px] px-4 sm:px-6 py-2.5 transition-all duration-300 flex items-center justify-between border ${
          isScrolled
            ? 'bg-[#FFFDF9]/92 backdrop-blur-xl border-[#EDE3D5] shadow-[0_12px_32px_-8px_rgba(24,22,20,0.1)]'
            : 'bg-[#FFFDF9]/80 backdrop-blur-md border-[#EDE3D5]/70 shadow-[0_4px_20px_-4px_rgba(24,22,20,0.04)]'
        }`}
      >
        {/* Brand Logo & Wordmark */}
        <div
          className="flex items-center gap-3 cursor-pointer select-none group"
          onClick={() => setActiveTab('feed')}
        >
          {/* Custom Ceramic Plate / Fork Icon */}
          <div className="relative w-10 h-10 rounded-[14px_6px_14px_6px] bg-gradient-to-tr from-[#E03E26] via-[#F26419] to-[#F59E0B] p-[2px] shadow-sm group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-[#181614] rounded-[12px_4px_12px_4px] flex items-center justify-center text-white">
              <span className="text-lg">🍴</span>
            </div>
            {/* Small decorative dot */}
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#16A34A] rounded-full border-2 border-white"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#181614] font-['Outfit'] uppercase">
                Foodie <span className="text-[#E03E26]">Findings</span>
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2 rounded-full text-[11px] sm:text-xs font-black tracking-wider transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'text-[#E03E26]'
                    : 'text-[#645F5B] hover:text-[#181614] hover:bg-stone-100/60'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-[#F5EFEB] rounded-full"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon
                  className={`w-3.5 h-3.5 transition-colors relative z-10 ${
                    isActive ? 'text-[#E03E26]' : 'text-[#8C827A]'
                  }`}
                />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Area */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Post Surplus Button */}
          <button
            onClick={onOpenPostModal}
            className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-black tracking-tight text-white bg-gradient-to-r from-[#E03E26] to-[#F26419] hover:from-[#C8321C] hover:to-[#E04F36] active:scale-95 shadow-[0_4px_16px_-2px_rgba(224,62,38,0.35)] transition-all cursor-pointer"
          >
            <span className="text-base sm:text-lg">🍲</span>
            <span className="hidden sm:inline">SHARE FOOD</span>
            <span className="sm:hidden">SHARE</span>
          </button>

          {/* User Logged In / Out State */}
          {user ? (
            <div className="flex items-center gap-2">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="p-2 rounded-full text-[#645F5B] hover:text-[#181614] hover:bg-stone-100/80 transition-colors relative cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#E03E26] rounded-full ring-2 ring-white"></span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-[#EDE3D5] p-3 z-50">
                    <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                      <span className="text-xs font-bold text-[#181614]">Notifications</span>
                      <span className="text-[10px] text-[#8C827A] font-semibold">
                        {unreadCount} unread
                      </span>
                    </div>
                    <div className="max-h-60 overflow-y-auto divide-y divide-stone-50 py-1">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-[#8C827A] py-4 text-center">No notifications</p>
                      ) : (
                        notifications.slice(0, 5).map((n) => (
                          <div key={n.id} className="py-2 text-xs">
                            <p className="font-semibold text-stone-800">{n.title || n.message}</p>
                            <p className="text-[10px] text-stone-400 mt-0.5">
                              {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Role Switcher & User Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-[#F5EFEB] hover:bg-stone-200/70 border border-[#EDE3D5] text-xs font-bold text-[#181614] transition-all cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-[#181614] text-white flex items-center justify-center text-[11px] font-bold">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown className="w-3 h-3 text-[#8C827A]" />
                </button>

                {roleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#EDE3D5] p-2.5 z-50 space-y-2">
                    <div className="p-2 bg-[#FFFDF9] rounded-xl border border-stone-100">
                      <p className="text-xs font-bold text-[#181614]">{user.name}</p>
                      <p className="text-[11px] text-[#8C827A] truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D]">
                        {user.role?.replace('ROLE_', '')}
                      </span>
                    </div>

                    <div className="pt-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#8C827A] px-2 mb-1">
                        Switch Demo Role
                      </p>
                      {DEMO_ACCOUNTS.map((acc) => (
                        <button
                          key={acc.email}
                          onClick={() => handleRoleSwitch(acc.email)}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                            user.email === acc.email
                              ? 'bg-[#F5EFEB] font-bold text-[#181614]'
                              : 'hover:bg-stone-50 text-[#645F5B]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{acc.icon}</span>
                            <div>
                              <p className="font-semibold text-xs leading-none">{acc.label}</p>
                              <p className="text-[10px] text-[#8C827A]">{acc.desc}</p>
                            </div>
                          </div>
                          {user.email === acc.email && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-stone-100">
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold text-[#181614] bg-[#F5EFEB] hover:bg-[#EADFCF] border border-[#EDE3D5] transition-all cursor-pointer"
            >
              Sign In
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[#181614] hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-4 bg-[#FFFDF9] rounded-2xl border border-[#EDE3D5] shadow-xl space-y-2">
          {navLinks.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#F5EFEB] text-[#E03E26]'
                    : 'text-[#645F5B] hover:bg-stone-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}

          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-[#8C827A] px-2">
            <button
              onClick={() => {
                onOpenSafetyModal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1 hover:text-[#181614]"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Good Samaritan Safety</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
