import React, { useState } from "react";
import {
  Heart,
  Lock,
  Mail,
  User as UserIcon,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

interface AuthPageProps {
  initialMode?: "login" | "register";
  onSuccess: () => void;
  onNavigateToLegal: (tab: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = "login",
  onSuccess,
  onNavigateToLegal,
}) => {
  const { login, register } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    if (mode === "register") {
      if (!name.trim()) {
        setErrorMessage("Please enter your name.");
        return;
      }
      if (password.length < 6) {
        setErrorMessage("Password should be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }
      if (!acceptTerms) {
        setErrorMessage("Please accept the terms of service and wellness disclaimer.");
        return;
      }
    }

    setIsLoading(true);
    try {
      if (mode === "register") {
        await register(name.trim(), email.trim(), password);
        showToast(`Welcome to MindCare AI, ${name.trim()}!`, "success");
      } else {
        await login(email.trim(), password);
        showToast("Welcome back! Signed in successfully.", "success");
      }
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      await login("alex.wellness@mindcare.demo", "demo123456");
      showToast("Signed in with demo student account.", "success");
      onSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || "Demo login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="auth-page" className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center mx-auto shadow-md shadow-indigo-500/20">
            <Heart className="w-6 h-6 fill-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
            {mode === "login" ? "Welcome Back" : "Create Your Sanctuary"}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            {mode === "login"
              ? "Sign in to access your private mood log and journal"
              : "Start your private, non-clinical mental wellness journey today"}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <button
            id="auth-tab-login"
            type="button"
            onClick={() => {
              setMode("login");
              setErrorMessage("");
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
              mode === "login"
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Sign In
          </button>
          <button
            id="auth-tab-register"
            type="button"
            onClick={() => {
              setMode("register");
              setErrorMessage("");
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
              mode === "register"
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error message alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label
                htmlFor="register-name"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1"
              >
                Your Preferred Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="register-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Alex Rivera"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="auth-email"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="auth-password"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 absolute right-3 top-1/2 -translate-y-1/2 p-0.5"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === "register" && (
            <div>
              <label
                htmlFor="register-confirm-password"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="register-confirm-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {mode === "register" && (
            <div className="flex items-start gap-2 pt-1">
              <input
                id="terms-checkbox"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-0.5 rounded accent-indigo-600"
              />
              <label htmlFor="terms-checkbox" className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                I understand that MindCare AI provides general wellness support and does not replace professional medical or psychiatric care.
              </label>
            </div>
          )}

          <button
            type="submit"
            id="auth-submit-btn"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Login Option */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 text-center">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Sign In with Demo Student Profile
          </button>
        </div>
      </div>
    </div>
  );
};
