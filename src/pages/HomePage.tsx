import React from "react";
import {
  Sparkles,
  Heart,
  Smile,
  Feather,
  Wind,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  PhoneCall,
  Activity,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface HomePageProps {
  onNavigate: (route: string, state?: any) => void;
  onOpenAuth: (mode?: "login" | "register") => void;
  onOpenSafetyAlert: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenAuth,
  onOpenSafetyAlert,
}) => {
  const { user } = useAuth();

  return (
    <div id="home-page" className="flex flex-col space-y-20 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-10 sm:pt-16 pb-12 lg:pb-20">
        {/* Soft background ambient gradient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-200/50 via-purple-200/40 to-sky-200/40 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-sky-950/30 blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                <Sparkles className="w-3.5 h-3.5" />
                Evidence-Informed Mental Wellness Companion
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 leading-[1.15]">
                Your Mental Wellness,{" "}
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-600 dark:from-indigo-400 dark:via-purple-300 dark:to-sky-400 bg-clip-text text-transparent">
                  Powered by AI
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                A calm, private space to track your mood, reflect with a supportive AI assistant, and discover daily self-care habits designed to nurture emotional balance.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                {user ? (
                  <button
                    id="hero-go-to-dashboard-btn"
                    onClick={() => onNavigate("dashboard")}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all flex items-center justify-center gap-2"
                  >
                    Open Your Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    id="hero-get-started-btn"
                    onClick={() => onOpenAuth("register")}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all flex items-center justify-center gap-2"
                  >
                    Get Started Free
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  id="hero-explore-activities-btn"
                  onClick={() => onNavigate("self-care")}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4 text-indigo-500" />
                  Explore Self-Care Activities
                </button>
              </div>

              {/* Trust & Privacy Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-emerald-500" /> Private & Confidential
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-500" /> Safe AI Boundaries
                </span>
                <span className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-purple-500" /> Non-Diagnostic
                </span>
              </div>
            </div>

            {/* Right Hero Interactive Showcase Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-white/90 dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 backdrop-blur-md space-y-5">
                {/* Visual Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        MindCare AI Companion
                      </h2>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                        Active & Compassionate
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                    Today
                  </span>
                </div>

                {/* Interactive Mini Chat Preview */}
                <div className="space-y-3 text-xs">
                  <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-2xl rounded-tl-sm text-slate-700 dark:text-slate-300">
                    "I had a really busy morning with classes and felt scattered. How can I regain my focus?"
                  </div>
                  <div className="bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/40 p-3 rounded-2xl rounded-tr-sm text-indigo-950 dark:text-indigo-200 leading-relaxed">
                    "It is completely understandable to feel scattered after intense focus. Let's do a 4-minute box breathing cycle, or take a quiet 5-minute walk to give your senses a rest."
                  </div>
                </div>

                {/* Mood Quick Glance Widget */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border border-indigo-100/60 dark:border-indigo-900/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">😊</span>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Weekly Streak
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        5 days of mindful reflection
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate("breathing")}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    Breathe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW MINDCARE AI WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
            Simple, Thoughtful Framework
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            How MindCare AI Works
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Designed as an everyday companion to help you cultivate awareness and calm in three intuitive steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-base flex items-center justify-center mb-4">
              1
            </div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2">
              Log Your Feelings
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Check in with yourself daily by recording your mood, energy levels, sleep hours, and reflections in seconds.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 font-bold text-base flex items-center justify-center mb-4">
              2
            </div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2">
              Reflect with Gentle AI
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Share what's on your mind with our empathetic assistant, and receive personalized coping suggestions and journal summaries.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 font-bold text-base flex items-center justify-center mb-4">
              3
            </div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2">
              Practice Guided Self-Care
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Complete evidence-based breathing exercises, mindfulness timers, and curated wellness habits to build lasting resilience.
            </p>
          </div>
        </div>
      </section>

      {/* COMPREHENSIVE FEATURES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
            Holistic Toolkit
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            Everything You Need for Daily Emotional Health
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div
            onClick={() => onNavigate("mood-tracker")}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800/80 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Smile className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Daily Mood Tracking
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Track 8 nuanced emotional states, energy levels, and sleep patterns. Uncover weekly trends with clear visual analytics.
            </p>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              Explore Mood Tracker <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Feature 2 */}
          <div
            onClick={() => onNavigate("journal")}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800/80 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Feather className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Private Reflective Journal
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              A secure space to write your thoughts with mood tagging, search filtering, and one-click AI reflection summaries.
            </p>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              Start Writing <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Feature 3 */}
          <div
            onClick={() => onNavigate("ai-assistant")}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800/80 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              AI Wellness Assistant
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Compassionate non-clinical conversation with built-in safety boundaries that never diagnoses and always supports.
            </p>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              Chat with Assistant <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Feature 4 */}
          <div
            onClick={() => onNavigate("self-care")}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800/80 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Curated Self-Care Library
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Explore 16+ guided exercises across 8 categories: Stress Relief, Better Sleep, Focus, Relaxation, and Social Connection.
            </p>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              Browse Activities <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Feature 5 */}
          <div
            onClick={() => onNavigate("breathing")}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800/80 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Wind className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Paced Breathing & Timers
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Calm your autonomic nervous system with animated 4-4 and Box Breathing circles and customizable meditation bells.
            </p>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              Start Breathing <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Feature 6 */}
          <div
            onClick={() => onNavigate("resources")}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800/80 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Mental Health Resources
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Educational guides on stress, anxiety, burnout, sleep, and emotional regulation with direct professional help access.
            </p>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              Read Guides <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </section>

      {/* PROFESSIONAL HELP CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 text-xs font-bold">
              <PhoneCall className="w-3.5 h-3.5" />
              Professional & Emergency Support
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Knowing When to Seek Professional Guidance
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              While MindCare AI offers emotional support and reflection, it is never a substitute for licensed clinical care. If you feel overwhelmed, persistent sadness, or need crisis counseling, confidential support is available 24/7.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="home-professional-guide-btn"
                onClick={() => onNavigate("professional-help")}
                className="px-5 py-2.5 rounded-xl bg-white text-slate-900 font-semibold text-xs hover:bg-slate-100 transition-colors"
              >
                Learn About Professional Care
              </button>
              <button
                id="home-open-safety-alert-btn"
                onClick={onOpenSafetyAlert}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                View 24/7 Crisis Hotlines
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
