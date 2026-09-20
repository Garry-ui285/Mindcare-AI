import React from "react";
import {
  PhoneCall,
  ShieldAlert,
  Users,
  CheckCircle2,
  ExternalLink,
  AlertTriangle,
  Heart,
  HelpCircle,
} from "lucide-react";
import { EMERGENCY_CONTACTS } from "../data/mentalHealthResources";

interface ProfessionalHelpPageProps {
  onOpenSafetyAlert: () => void;
}

export const ProfessionalHelpPage: React.FC<ProfessionalHelpPageProps> = ({
  onOpenSafetyAlert,
}) => {
  return (
    <div id="professional-help-page" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Emergency Action Header */}
      <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-rose-900 dark:text-rose-200">
              Immediate Crisis or Emergency Support
            </h2>
            <p className="text-xs text-rose-700 dark:text-rose-300/90 mt-0.5 max-w-xl leading-relaxed">
              If you or someone you know is in immediate danger or experiencing thoughts of self-harm, confidential free help is available 24 hours a day, 7 days a week.
            </p>
          </div>
        </div>

        <button
          id="pro-help-crisis-btn"
          onClick={onOpenSafetyAlert}
          className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 shrink-0 self-start md:self-auto"
        >
          <PhoneCall className="w-4 h-4" />
          Access Crisis Helplines
        </button>
      </div>

      {/* Main Educational Overview */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <Users className="w-4 h-4" />
          Navigating Mental Health Care
        </div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
          Understanding Professional Support Roles
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
          Reaching out to a mental health professional is a courageous and effective step toward long-term healing. Here is an objective guide to the different types of providers and what they do.
        </p>
      </div>

      {/* Provider Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Psychologist */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Psychologist (PhD / PsyD)
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full">
              Psychotherapy & Testing
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Experts trained in cognitive, behavioral, and emotional processes. They specialize in psychometric assessments and evidence-based talk therapy modalities (such as CBT, ACT, and DBT). In most jurisdictions, they do not prescribe medication.
          </p>
          <div className="text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2.5">
            <strong>Best for:</strong> In-depth psychological evaluation, recurring mood patterns, trauma processing, and structured cognitive behavioral therapy.
          </div>
        </div>

        {/* Psychiatrist */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Psychiatrist (MD / DO)
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded-full">
              Medical & Pharmacology
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Medical doctors who have completed medical school and psychiatric residency. They assess the biological, neurological, and physical dimensions of mental health, can order lab work, and can prescribe and manage medications.
          </p>
          <div className="text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2.5">
            <strong>Best for:</strong> Severe depression, bipolar disorders, ADHD evaluations, psychiatric medication evaluation, and complex medical-mental conditions.
          </div>
        </div>

        {/* Licensed Therapist */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Licensed Therapist (LMFT, LCSW, LPC)
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
              Talk Therapy & Relationships
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Master's level clinical professionals with thousands of supervised clinical hours. They facilitate individual, couples, and family therapy sessions, helping clients develop practical coping mechanisms and navigate relational difficulties.
          </p>
          <div className="text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2.5">
            <strong>Best for:</strong> Everyday stress, relationship conflicts, life transitions, grief, anxiety management, and family dynamics.
          </div>
        </div>

        {/* Counselor */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Specialized Counselor / Life Coach
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-1 rounded-full">
              Focused Guidance
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Professionals who often focus on a specific area of human functioning, such as career counseling, academic advising, addiction recovery support, or grief processing.
          </p>
          <div className="text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2.5">
            <strong>Best for:</strong> Goal setting, career stress, substance use recovery support groups, and academic pressure.
          </div>
        </div>
      </div>

      {/* Checklist: When Should I Seek Professional Help? */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <HelpCircle className="w-5 h-5" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            When Should I Consider Seeking Professional Help?
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          You don't have to wait for a crisis to speak with a mental health professional. Therapy is also preventive and enriching. However, consider scheduling a consultation if you experience any of the following:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300">
          {[
            "Feelings of overwhelming sadness or anxiety that persist for more than 2 weeks",
            "Difficulty maintaining work, academic coursework, or basic hygiene",
            "Significant changes in sleep (insomnia or severe hypersomnia) or appetite",
            "Feeling continuously detached, emotionally numb, or unable to find joy",
            "Intrusive thoughts, flashbacks, or severe unprovoked panic attacks",
            "Withdrawing completely from trusted family members and close friends",
            "Relying increasingly on alcohol, drugs, or compulsive behaviors to cope",
            "Feeling that everyday challenges are simply too heavy to carry alone",
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Directory of Verified Global Helplines */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          Global Emergency & Crisis Contacts
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {EMERGENCY_CONTACTS.map((contact, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 text-xs"
            >
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                {contact.country}
              </h4>
              <p className="text-slate-500 dark:text-slate-400">
                Emergency: <strong className="text-rose-600 dark:text-rose-400 font-bold">{contact.emergencyNumber}</strong>
              </p>
              <p className="text-slate-700 dark:text-slate-300 font-medium">
                {contact.crisisLine}
              </p>
              <a
                href={contact.crisisWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline pt-1"
              >
                Website Portal <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
