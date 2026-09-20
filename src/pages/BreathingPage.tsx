import React, { useState } from "react";
import { Wind, Clock, Sparkles, Heart } from "lucide-react";
import { BreathingExercise } from "../components/BreathingExercise";
import { MindfulnessTimer } from "../components/MindfulnessTimer";

export const BreathingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"breathing" | "timer">("breathing");

  return (
    <div id="breathing-page" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 text-xs font-semibold">
          <Wind className="w-3.5 h-3.5" />
          Physiological Regulation
        </div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
          Breathing & Relaxation Sanctuary
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Slow, paced respiration stimulates the vagus nerve and activates your parasympathetic nervous system, lowering heart rate and quieting mental turbulence.
        </p>
      </div>

      {/* Switcher Tabs */}
      <div className="flex justify-center">
        <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center gap-1 border border-slate-200 dark:border-slate-700">
          <button
            id="tab-breathing-view"
            onClick={() => setActiveTab("breathing")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "breathing"
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            <Wind className="w-4 h-4" />
            Paced Breathing Exercise
          </button>
          <button
            id="tab-timer-view"
            onClick={() => setActiveTab("timer")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "timer"
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            <Clock className="w-4 h-4" />
            Mindfulness Meditation Timer
          </button>
        </div>
      </div>

      {/* Content View */}
      <div className="pt-2">
        {activeTab === "breathing" ? (
          <BreathingExercise />
        ) : (
          <MindfulnessTimer />
        )}
      </div>

      {/* Scientific Benefits Note */}
      <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-xs text-slate-500 dark:text-slate-400 space-y-2">
        <h4 className="font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-rose-500" />
          The Science of Paced Respiration
        </h4>
        <p className="leading-relaxed">
          When we experience anxiety or mental pressure, our breathing rhythm automatically quickens, signaling to the brain that danger is present. By deliberately extending our exhalations and pausing between breaths, we manually signal to the nervous system that we are safe.
        </p>
      </div>
    </div>
  );
};
