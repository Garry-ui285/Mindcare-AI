import React from "react";
import { Heart, ShieldAlert, Sparkles, ExternalLink } from "lucide-react";

interface FooterProps {
  onNavigate: (route: string, state?: any) => void;
  onOpenSafetyAlert: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenSafetyAlert }) => {
  return (
    <footer
      id="main-footer"
      className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors mt-auto"
    >
      {/* Top Disclaimer Banner */}
      <div className="bg-amber-50/70 dark:bg-amber-950/20 border-b border-amber-200/60 dark:border-amber-900/40 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs text-amber-900 dark:text-amber-200/90 font-medium">
          <p className="leading-relaxed">
            <strong className="font-semibold">Medical Disclaimer:</strong> MindCare AI provides general wellness information and emotional support. It does not replace professional medical or psychological care.
          </p>
          <button
            id="footer-emergency-alert-btn"
            onClick={onOpenSafetyAlert}
            className="shrink-0 px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-[11px] flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Immediate Crisis Support
          </button>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Heart className="w-4 h-4 fill-white" />
              </div>
              <span className="text-base font-bold text-slate-800 dark:text-slate-100">
                MindCare AI
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Empowering self-reflection, mindfulness, and everyday emotional balance with gentle AI guidance.
            </p>
            <div className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full">
              <Sparkles className="w-3 h-3" />
              Academic Innovation Project
            </div>
          </div>

          {/* Quick Features */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              Wellness Tools
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li>
                <button onClick={() => onNavigate("ai-assistant")} className="hover:text-indigo-600 transition-colors">
                  AI Wellness Assistant
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("mood-tracker")} className="hover:text-indigo-600 transition-colors">
                  Daily Mood Tracker
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("journal")} className="hover:text-indigo-600 transition-colors">
                  Private Reflective Journal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("self-care")} className="hover:text-indigo-600 transition-colors">
                  Self-Care Activities
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("breathing")} className="hover:text-indigo-600 transition-colors">
                  Breathing & Meditation
                </button>
              </li>
            </ul>
          </div>

          {/* Educational Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              Education & Support
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li>
                <button onClick={() => onNavigate("resources")} className="hover:text-indigo-600 transition-colors">
                  Mental Health Guides
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("professional-help")} className="hover:text-indigo-600 transition-colors">
                  Finding Professional Care
                </button>
              </li>
              <li>
                <button onClick={onOpenSafetyAlert} className="text-rose-600 dark:text-rose-400 font-semibold hover:underline flex items-center gap-1">
                  24/7 Crisis Helplines
                </button>
              </li>
              <li>
                <a
                  href="https://findahelpline.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-600 transition-colors flex items-center gap-1 text-slate-500"
                >
                  Find A Helpline Worldwide <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Transparency & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              Trust & Transparency
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li>
                <button onClick={() => onNavigate("legal", { tab: "disclaimer" })} className="hover:text-indigo-600 transition-colors">
                  AI Limitations & Safety
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("legal", { tab: "privacy" })} className="hover:text-indigo-600 transition-colors">
                  Privacy Policy & Data Security
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("legal", { tab: "terms" })} className="hover:text-indigo-600 transition-colors">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-200 dark:border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-500">
          <p>© {new Date().getFullYear()} MindCare AI. Built for wellness, reflection, and academic demonstration.</p>
          <p className="text-[11px]">Designed with compassion & modern AI safeguards.</p>
        </div>
      </div>
    </footer>
  );
};
