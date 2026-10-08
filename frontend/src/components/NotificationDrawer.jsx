import React, { useEffect, useState } from 'react';
import { notificationApi } from '../services/api';
import { X, Bell, CheckCheck, Clock, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

const NotificationDrawer = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationApi.getAll();
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
    } catch (e) {
      // ignore
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (e) {
      // ignore
    }
  };

  if (!isOpen) return null;

  const getTypeIcon = (type) => {
    switch (type) {
      case 'PICKUP_REQUEST':
        return <Bell className="w-4 h-4 text-[#f97316]" />;
      case 'REQUEST_ACCEPTED':
      case 'FOOD_COLLECTED':
        return <CheckCircle2 className="w-4 h-4 text-[#16a34a]" />;
      case 'EXPIRING_ALERT':
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'VERIFICATION_UPDATE':
        return <ShieldCheck className="w-4 h-4 text-blue-500" />;
      default:
        return <Bell className="w-4 h-4 text-[#e23744]" />;
    }
  };

  const formatRelativeTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);
    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#f1ede6] flex items-center justify-between bg-[#faf7f2]">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[#e23744]/10 text-[#e23744] flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-[#1e293b]">Activity & Alerts</h3>
          </div>
          <div className="flex items-center space-x-2">
            {notifications.some(n => !n.isRead) && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-semibold text-[#e23744] hover:underline flex items-center"
              >
                <CheckCheck className="w-3.5 h-3.5 mr-1" />
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#94a3b8] hover:bg-white hover:text-[#1e293b] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="text-center py-12 text-sm text-[#94a3b8]">Loading alerts...</div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#faf7f2] flex items-center justify-center mx-auto text-xl">
                🔕
              </div>
              <p className="text-sm font-semibold text-[#1e293b]">No notifications yet</p>
              <p className="text-xs text-[#94a3b8] max-w-xs mx-auto">
                Notifications only generate from actual platform events like pickup requests or status updates.
              </p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => !item.isRead && handleMarkAsRead(item.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  item.isRead
                    ? 'bg-white border-[#f1ede6] text-[#64748b]'
                    : 'bg-[#faf7f2] border-[#e2d9cd] shadow-2xs text-[#1e293b]'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5 p-2 rounded-xl bg-white border border-[#e2d9cd] shrink-0">
                    {getTypeIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-bold truncate pr-2">{item.title}</h4>
                      <span className="text-[10px] text-[#94a3b8] shrink-0 flex items-center">
                        <Clock className="w-3 h-3 mr-0.5" />
                        {formatRelativeTime(item.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-[#64748b] leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default NotificationDrawer;
