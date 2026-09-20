import React, { useState } from "react";
import {
  Heart,
  Moon,
  Sun,
  Search,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  ShieldAlert,
  Sparkles,
  Smile,
  BookOpen,
  Feather,
  Wind,
  PhoneCall,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string, state?: any) => void;
  onOpenSearch: () => void;
  onOpenSafetyAlert: () => void;
  onOpenAuth: (mode?: "login" | "register") => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  onOpenSearch,
  onOpenSafetyAlert,
  onOpenAuth,
}) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navLinks = [
    { id: "home", label: "Home", icon: Heart },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "ai-assistant", label: "AI Assistant", icon: Sparkles },
    { id: "mood-tracker", label: "Mood Tracker", icon: Smile },
    { id: "journal", label: "Journal", icon: Feather },
    { id: "self-care", label: "Self-Care", icon: Heart },
    { id: "breathing", label: "Relaxation", icon: Wind },
    { id: "resources", label: "Resources", icon: BookOpen },
    { id: "professional-help", label: "Professional Help", icon: PhoneCall },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  return (
    <header
      id="main-header"
      className="sticky top-0 z-40 w-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-6">
          <button
            id="brand-logo-btn"
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-2.5 group text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-indigo-700 via-purple-700 to-sky-600 dark:from-indigo-400 dark:via-purple-300 dark:to-sky-400 bg-clip-text text-transparent">
                MindCare AI
              </span>
              <span className="hidden sm:block text-[10px] font-semibold uppercase tracking-wider text-slate-400 -mt-1">
                Mental Wellness
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main Navigation">
            {navLinks.slice(0, 7).map((item) => {
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs xl:text-sm font-medium transition-all ${
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 font-semibold"
                      : "text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Action Icons & Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Emergency / Crisis trigger */}
          <button
            id="crisis-helpline-trigger"
            onClick={onOpenSafetyAlert}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 text-xs font-semibold hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors"
            title="Immediate Crisis & Emergency Support"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Helpline</span>
          </button>

          {/* Global Search Button */}
          <button
            id="open-search-btn"
            onClick={onOpenSearch}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Search resources and journals"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Dark Mode Toggle */}
          <button
            id="toggle-dark-mode-btn"
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* User Auth Section */}
          {user ? (
            <div className="relative">
              <button
                id="user-profile-menu-btn"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                  {user.name}
                </span>
              </button>

              {/* Profile dropdown */}
              {profileDropdownOpen && (
                <div
                  id="profile-dropdown"
                  className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-fadeIn"
                >
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  </div>

                  <button
                    onClick={() => handleNavClick("dashboard")}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4 text-slate-400" /> Dashboard
                  </button>
                  <button
                    onClick={() => handleNavClick("profile")}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-slate-400" /> My Profile
                  </button>
                  <button
                    onClick={() => handleNavClick("settings")}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4 text-slate-400" /> Settings & Privacy
                  </button>

                  <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                    <button
                      id="logout-btn"
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                id="sign-in-nav-btn"
                onClick={() => onOpenAuth("login")}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 transition-colors"
              >
                Sign In
              </button>
              <button
                id="get-started-nav-btn"
                onClick={() => onOpenAuth("register")}
                className="px-3.5 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition-all"
              >
                Get Started
              </button>
            </div>
          )}

          {/* Mobile menu hamburger button */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-1 shadow-xl animate-fadeIn"
        >
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-3 transition-colors ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="w-4 h-4 text-slate-400 shrink-0" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
