import React, { useState } from "react";
import { AlertTriangle, PhoneCall, Globe, X, ExternalLink, ShieldAlert } from "lucide-react";
import { EMERGENCY_CONTACTS } from "../data/mentalHealthResources";

interface SafetyAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToProfessionalHelp: () => void;
}

export const SafetyAlertModal: React.FC<SafetyAlertModalProps> = ({
  isOpen,
  onClose,
  onNavigateToProfessionalHelp,
}) => {
  const [selectedCountryIndex, setSelectedCountryIndex] = useState(0);

  if (!isOpen) return null;

  const currentContact = EMERGENCY_CONTACTS[selectedCountryIndex] || EMERGENCY_CONTACTS[0];

  return (
    <div
      id="safety-alert-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="safety-alert-title"
    >
      <div
        id="safety-alert-card"
        className="bg-white dark:bg-slate-900 border-2 border-rose-500/80 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden transition-all transform scale-100"
      >
        {/* Header with emergency alert banner */}
        <div className="bg-rose-50 dark:bg-rose-950/40 p-5 border-b border-rose-200 dark:border-rose-900/60 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h2 id="safety-alert-title" className="text-xl font-bold text-rose-800 dark:text-rose-200">
              Your Safety and Life Matter
            </h2>
            <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-0.5">
              Immediate Crisis & Emergency Support Available
            </p>
          </div>
          <button
            id="close-safety-alert"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg transition-colors"
            aria-label="Close safety alert"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl text-sm leading-relaxed text-amber-900 dark:text-amber-200">
            "Your safety matters. If you may be in immediate danger or may hurt yourself, please contact your local emergency service, go to the nearest emergency department, or reach out to a trusted person who can stay with you."
          </div>

          <div>
            <label
              htmlFor="country-emergency-select"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2"
            >
              Select Your Region for Verified Hotlines:
            </label>
            <select
              id="country-emergency-select"
              value={selectedCountryIndex}
              onChange={(e) => setSelectedCountryIndex(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none"
            >
              {EMERGENCY_CONTACTS.map((c, i) => (
                <option key={c.country} value={i}>
                  {c.country}
                </option>
              ))}
            </select>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Emergency Number:</span>
              <span className="font-bold text-rose-600 dark:text-rose-400 text-base">
                {currentContact.emergencyNumber}
              </span>
            </div>
            <div className="flex items-start justify-between gap-2 border-t border-slate-200 dark:border-slate-700 pt-2.5">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Crisis Helpline:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-100 text-right">
                {currentContact.crisisLine}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 border-t border-slate-200 dark:border-slate-700 pt-2.5">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Online Resource:</span>
              <a
                href={currentContact.crisisWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium hover:underline text-xs"
              >
                Visit Verified Portal <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3 justify-end">
          <button
            id="emergency-guidance-btn"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Emergency Guidance
          </button>
          <button
            id="find-professional-help-btn"
            onClick={() => {
              onClose();
              onNavigateToProfessionalHelp();
            }}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <PhoneCall className="w-4 h-4" />
            Find Professional Help
          </button>
        </div>
      </div>
    </div>
  );
};
