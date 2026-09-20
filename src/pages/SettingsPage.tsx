import React, { useState } from "react";
import {
  Settings,
  Moon,
  Sun,
  Download,
  Trash2,
  Bell,
  Shield,
  FileText,
  AlertTriangle,
  RefreshCw,
  Info,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import {
  getMoodEntries,
  getJournalEntries,
  getActivityProgress,
} from "../services/firebase";

interface SettingsPageProps {
  onNavigateToLegal: (tab: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigateToLegal }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const [dailyReminders, setDailyReminders] = useState(true);
  const [breathingNudge, setBreathingNudge] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportData = async () => {
    if (!user) return;
    setIsExporting(true);
    try {
      const [moods, journals, activities] = await Promise.all([
        getMoodEntries(user.uid),
        getJournalEntries(user.uid),
        getActivityProgress(user.uid),
      ]);

      const exportObject = {
        exportedAt: new Date().toISOString(),
        user: {
          uid: user.uid,
          name: user.name,
          email: user.email,
        },
        moodEntries: moods,
        journalEntries: journals,
        completedActivities: activities,
      };

      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(exportObject, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute(
        "download",
        `mindcare-wellness-data-${new Date().toISOString().split("T")[0]}.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      showToast("Wellness data exported successfully as JSON.", "success");
    } catch {
      showToast("Failed to export data.", "error");
    } finally {
      setIsExporting(false);
    }
  };

  const handleResetData = () => {
    if (
      window.confirm(
        "Are you sure you want to reset demo wellness records? This will clear your local demo history."
      )
    ) {
      localStorage.removeItem("mindcare_demo_moods");
      localStorage.removeItem("mindcare_demo_journals");
      localStorage.removeItem("mindcare_demo_activities");
      localStorage.removeItem("mindcare_demo_chat");
      showToast("Demo wellness records have been reset.", "info");
      setTimeout(() => window.location.reload(), 800);
    }
  };

  return (
    <div id="settings-page" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
          <Settings className="w-4 h-4" />
          Application Preferences
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
          Settings & Privacy
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage visual preferences, export private data, and review safety compliance.
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
            Display & Appearance
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200">
                {theme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Theme Preference
                </p>
                <p className="text-[11px] text-slate-400">
                  Currently set to {theme === "dark" ? "Gentle Dark Mode" : "Clean Light Mode"}
                </p>
              </div>
            </div>

            <button
              id="settings-theme-toggle"
              type="button"
              onClick={toggleTheme}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Switch to {theme === "dark" ? "Light" : "Dark"}
            </button>
          </div>
        </div>

        {/* Data Ownership & Privacy */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
            Data Portability & Management
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  Export My Personal Data (JSON)
                </p>
                <p className="text-slate-400 text-[11px]">
                  Download a complete backup of your mood logs, journal entries, and progress.
                </p>
              </div>
              <button
                id="export-data-btn"
                onClick={handleExportData}
                disabled={isExporting}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1.5 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                {isExporting ? "Exporting..." : "Export"}
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  Reset Demo Records
                </p>
                <p className="text-slate-400 text-[11px]">
                  Clear local demo check-ins, journal reflections, and completed self-care items.
                </p>
              </div>
              <button
                id="reset-demo-data-btn"
                onClick={handleResetData}
                className="px-3.5 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Legal & Medical Compliance */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
            Compliance & Disclaimers
          </h3>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-300 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Mandatory Health Disclaimer
              </p>
              <p className="leading-relaxed text-[11px]">
                "MindCare AI provides general wellness information and emotional support. It does not replace professional medical or psychological care."
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => onNavigateToLegal("disclaimer")}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Full Medical Disclaimer
              </button>
              <button
                onClick={() => onNavigateToLegal("privacy")}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => onNavigateToLegal("terms")}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
