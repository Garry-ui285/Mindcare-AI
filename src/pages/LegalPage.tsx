import React, { useState, useEffect } from "react";
import { ShieldCheck, AlertTriangle, FileText, Lock, Heart } from "lucide-react";

interface LegalPageProps {
  initialTab?: string;
}

export const LegalPage: React.FC<LegalPageProps> = ({ initialTab = "disclaimer" }) => {
  const [activeTab, setActiveTab] = useState<"disclaimer" | "privacy" | "terms">(
    (initialTab as any) || "disclaimer"
  );

  useEffect(() => {
    if (initialTab === "privacy" || initialTab === "terms" || initialTab === "disclaimer") {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  return (
    <div id="legal-page" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
          <ShieldCheck className="w-4 h-4" />
          Transparency, Ethics & Compliance
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
          Legal & Ethical Framework
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          MindCare AI was developed under strict bioethical guidelines ensuring user safety, clinical disclaimer visibility, and data privacy.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveTab("disclaimer")}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "disclaimer"
              ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
              : "text-slate-600 dark:text-slate-400"
          }`}
        >
          Medical Disclaimer
        </button>
        <button
          onClick={() => setActiveTab("privacy")}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "privacy"
              ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
              : "text-slate-600 dark:text-slate-400"
          }`}
        >
          Privacy Policy
        </button>
        <button
          onClick={() => setActiveTab("terms")}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "terms"
              ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
              : "text-slate-600 dark:text-slate-400"
          }`}
        >
          Terms of Service
        </button>
      </div>

      {/* TAB 1: DISCLAIMER */}
      {activeTab === "disclaimer" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-base font-bold text-amber-900 dark:text-amber-200">
                Official Wellness Disclaimer
              </h2>
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mt-1 italic">
                "MindCare AI provides general wellness information and emotional support. It does not replace professional medical or psychological care."
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              1. Not Medical, Psychiatric, or Emergency Advice
            </h3>
            <p>
              MindCare AI is an interactive educational and wellness tool. The platform, its automated algorithms, and conversational AI are <strong>not</strong> intended to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li>Diagnose clinical mental health conditions or psychiatric disorders (e.g. Major Depressive Disorder, Generalized Anxiety Disorder, Bipolar Disorder).</li>
              <li>Prescribe, recommend, or adjust dosages of pharmaceutical medications.</li>
              <li>Deliver licensed psychotherapy, cognitive counseling, or formal crisis intervention.</li>
              <li>Act as an emergency reporting channel or dispatch system for law enforcement or emergency medical services.</li>
            </ul>

            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 pt-2">
              2. Emergency Protocol
            </h3>
            <p>
              If you are feeling hopeless, having thoughts of harming yourself or others, or are in immediate physical peril, please immediately contact your local emergency authority (e.g., 911 in the USA, 999/111 in the UK, 112 in the EU, or 988 Suicide & Crisis Lifeline).
            </p>

            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 pt-2">
              3. Independent Clinical Judgment
            </h3>
            <p>
              Always seek the advice of your physician, licensed psychologist, psychiatrist, or other qualified healthcare provider regarding any mental health or medical condition. Never disregard professional medical counsel because of information read on MindCare AI.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: PRIVACY POLICY */}
      {activeTab === "privacy" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                User Privacy and Data Protection
              </h2>
              <p className="text-xs text-slate-400">Effective Date: Academic Capstone Release 2026</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              1. Strict Data Confidentiality
            </h3>
            <p>
              We recognize that journaling, mood records, and emotional reflections represent deeply private aspects of human life. In MindCare AI:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li><strong>Zero Model Training:</strong> Your private journal entries, mood check-ins, and personal reflections are never stored or sold to train third-party foundation models.</li>
              <li><strong>User-Isolated Schemas:</strong> Firestore security rules strictly prohibit any user from reading or modifying the entries of another user.</li>
              <li><strong>Local Resilient Storage:</strong> For guest or demo users, data is kept strictly inside your local browser storage and never broadcasted.</li>
            </ul>

            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 pt-2">
              2. Data Portability & Deletion
            </h3>
            <p>
              You maintain total ownership of your wellness data. You can download a full JSON archive of your mood logs and journal reflections at any moment from the Settings page, or purge your records entirely.
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: TERMS OF SERVICE */}
      {activeTab === "terms" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Terms of Service & Usage
              </h2>
              <p className="text-xs text-slate-400">Academic Capstone Project Deployment</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              1. Acceptance of Terms
            </h3>
            <p>
              By accessing or using MindCare AI, you agree to these Terms of Service. If you do not agree with any part of these terms, you should refrain from using the platform.
            </p>

            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 pt-2">
              2. Educational & Project Context
            </h3>
            <p>
              MindCare AI is developed as an advanced software engineering and human-computer interaction college project demonstrating safe AI integration, responsive design, and full-stack mental health technologies.
            </p>

            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 pt-2">
              3. Permissible Use
            </h3>
            <p>
              Users agree to engage with the AI Assistant respectfully and refrain from attempting to bypass built-in safety boundaries or using the platform to generate harmful, harassing, or illegal content.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
