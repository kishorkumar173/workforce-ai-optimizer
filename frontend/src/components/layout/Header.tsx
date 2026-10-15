import React, { useState, useEffect } from 'react';
import { Search, Bell, Menu, ChevronDown, Shield, Briefcase, User, Sparkles, Command, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { NotificationItem, UserRole } from '../../types';
import { LoginModal } from '../auth/LoginModal';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const { user, switchRole } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(3);
  const [showNotifDropdown, setShowNotifDropdown] = useState<boolean>(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch {
      // Fallback
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      // ignore
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch {
      // ignore
    }
  };

  const roleConfigs: Record<UserRole, { title: string; color: string; badgeBg: string }> = {
    EMPLOYER: {
      title: 'Project Manager',
      color: 'text-cyan-400',
      badgeBg: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300',
    },
    ADMIN: {
      title: 'System Administrator',
      color: 'text-purple-400',
      badgeBg: 'bg-purple-500/15 border-purple-500/30 text-purple-300',
    },
    EMPLOYEE: {
      title: 'Developer',
      color: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
    },
  };

  const currentRoleConfig = roleConfigs[user.role];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-6 bg-[#070A11]/85 backdrop-blur-2xl border-b border-white/[0.07] transition-all">
      {/* Left: Mobile Toggle & Futuristic Command Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 text-slate-400 rounded-xl hover:bg-white/[0.06] hover:text-white lg:hidden transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects, candidates, competencies, workloads..."
            className="w-full pl-10 pr-16 py-2.5 text-xs rounded-xl border border-white/[0.08] bg-[#0E1424]/90 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 shadow-inner transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white/[0.06] border border-white/[0.08] text-[10px] text-slate-400 font-mono">
            <span>⌘</span>
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right: Dynamic Role Switcher Pill, Notifications & User Info */}
      <div className="flex items-center gap-3 md:gap-5">
        {/* Dynamic Role Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRoleDropdown(!showRoleDropdown);
              setShowNotifDropdown(false);
            }}
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all shadow-sm ${currentRoleConfig.badgeBg}`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-glow-cyan" />
            <span>Role: {user.role}</span>
            {user.employeeCode && (
              <span className="font-mono text-[10px] opacity-80">({user.employeeCode})</span>
            )}
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-[#0E1424] rounded-2xl shadow-2xl border border-white/10 py-2 z-50 animate-in fade-in slide-in-from-top-2 backdrop-blur-xl">
              <div className="px-4 py-2 border-b border-white/[0.06]">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Switch Active Role (RBAC Demo)
                </p>
              </div>

              <button
                onClick={() => switchRole('EMPLOYER')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs text-left font-semibold hover:bg-white/[0.05] transition-colors ${
                  user.role === 'EMPLOYER' ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-300'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold">Sarah Johnson</p>
                  <span className="text-[10px] text-slate-400">Employer • Project Manager</span>
                </div>
              </button>

              <button
                onClick={() => switchRole('ADMIN')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs text-left font-semibold hover:bg-white/[0.05] transition-colors ${
                  user.role === 'ADMIN' ? 'text-purple-400 bg-purple-500/10' : 'text-slate-300'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold">Alex Rivera</p>
                  <span className="text-[10px] text-slate-400">Admin • Full Oversight</span>
                </div>
              </button>

              <button
                onClick={() => switchRole('EMPLOYEE')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs text-left font-semibold hover:bg-white/[0.05] transition-colors ${
                  user.role === 'EMPLOYEE' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-300'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold">John Doe</p>
                  <span className="text-[10px] text-slate-400">Employee • EMP-1001</span>
                </div>
              </button>

              <div className="pt-2 mt-1 border-t border-white/[0.08] px-2">
                <button
                  onClick={() => {
                    setShowRoleDropdown(false);
                    setShowLoginModal(true);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-xl transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" /> Sign In with ID / Email
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifDropdown(!showNotifDropdown);
              setShowRoleDropdown(false);
            }}
            className="relative p-2.5 text-slate-300 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:text-white transition-all"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex items-center justify-center min-w-[17px] h-[17px] px-1 text-[9px] font-black text-black bg-cyan-400 rounded-full shadow-glow-cyan">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0E1424] rounded-2xl shadow-2xl border border-white/10 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between px-4 py-3 bg-white/[0.03] border-b border-white/[0.06]">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Live Notifications ({unreadCount} new)
                </span>
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-[11px] text-cyan-400 font-semibold cursor-pointer hover:underline"
                >
                  Mark all as read
                </button>
              </div>
              <div className="divide-y divide-white/[0.06] max-h-80 overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">No active alerts</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3.5 hover:bg-white/[0.04] transition-colors flex items-start gap-3 ${
                        !n.is_read ? 'bg-cyan-500/10' : ''
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full mt-1.5 bg-cyan-400 shadow-glow-cyan flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-100">{n.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                      </div>
                      {!n.is_read && (
                        <button
                          onClick={() => handleMarkAsRead(n.id)}
                          className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold"
                        >
                          Read
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar with Luminous Ring */}
        <div className="flex items-center gap-3 pl-2 border-l border-white/[0.08]">
          <div className="relative">
            <img
              src={user.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
              alt={user.full_name}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-cyan-500/40 shadow-glow-cyan"
            />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-white leading-tight flex items-center gap-1.5">
              <span>{user.full_name}</span>
              {user.employeeCode && (
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {user.employeeCode}
                </span>
              )}
            </p>
            <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{currentRoleConfig.title}</p>
          </div>
        </div>
      </div>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </header>
  );
};
