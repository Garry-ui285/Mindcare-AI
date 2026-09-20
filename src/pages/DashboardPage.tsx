import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Smile,
  Heart,
  Feather,
  Wind,
  Plus,
  ArrowRight,
  TrendingUp,
  Moon,
  Zap,
  Calendar,
  CheckCircle2,
  Clock,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  getMoodEntries,
  getJournalEntries,
  getActivityProgress,
} from "../services/firebase";
import { MoodEntry, JournalEntry } from "../types";
import { MOOD_OPTIONS } from "../components/MoodLogModal";
import { SELF_CARE_ACTIVITIES } from "../data/selfCareActivities";

interface DashboardPageProps {
  onNavigate: (route: string, state?: any) => void;
  onOpenMoodLog: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onOpenMoodLog,
}) => {
  const { user } = useAuth();
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [activityMap, setActivityMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([
      getMoodEntries(user.uid),
      getJournalEntries(user.uid),
      getActivityProgress(user.uid),
    ])
      .then(([m, j, a]) => {
        setMoods(m);
        setJournals(j);
        setActivityMap(a);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  // Greeting based on time of day
  const hour = new Date().getHours();
  const timeGreeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  // Today's mood entry
  const todayStr = new Date().toISOString().split("T")[0];
  const todayMood = moods.find((m) => m.date === todayStr);

  // Completed activities count
  const completedActivitiesCount = Object.values(activityMap).filter(Boolean).length;

  // Streak calculation
  const calculateStreak = () => {
    if (moods.length === 0) return 0;
    const sortedDates = [...new Set(moods.map((m) => m.date))].sort().reverse();
    let streak = 0;
    let checkDate = new Date();

    // If today is logged, start streak; if yesterday is logged, start streak
    for (const dStr of sortedDates) {
      const d = new Date(dStr);
      const diffDays = Math.floor(
        (checkDate.getTime() - d.getTime()) / (1000 * 3600 * 24)
      );
      if (diffDays <= 1) {
        streak++;
        checkDate = d;
      } else {
        break;
      }
    }
    return streak || (todayMood ? 1 : 0);
  };

  const streak = calculateStreak();

  // Sleep & energy averages
  const recentWeekMoods = moods.slice(0, 7);
  const avgSleep =
    recentWeekMoods.length > 0
      ? (
          recentWeekMoods.reduce((acc, curr) => acc + curr.sleepHours, 0) /
          recentWeekMoods.length
        ).toFixed(1)
      : "0";
  const avgEnergy =
    recentWeekMoods.length > 0
      ? (
          recentWeekMoods.reduce((acc, curr) => acc + curr.energyLevel, 0) /
          recentWeekMoods.length
        ).toFixed(1)
      : "0";

  // Dynamic AI recommendation based on today's or most recent mood
  const latestMood = todayMood || moods[0];
  const getWellnessSuggestion = () => {
    if (!latestMood) {
      return {
        title: "Welcome to MindCare AI",
        text: "Begin your wellness journey by logging how you feel today and setting a gentle intention.",
        actionRoute: "mood-tracker",
        actionText: "Log First Mood",
      };
    }
    if (latestMood.mood === "Stressed" || latestMood.mood === "Anxious") {
      return {
        title: "Gentle Nervous System Reset",
        text: `You noted feeling ${latestMood.mood.toLowerCase()}. Try 4-4 paced breathing or the 5-4-3-2-1 sensory grounding exercise to invite calm into your body.`,
        actionRoute: "breathing",
        actionText: "Try 4-4 Breathing",
      };
    }
    if (latestMood.mood === "Tired") {
      return {
        title: "Restore and Recharge",
        text: `You logged ${latestMood.sleepHours} hours of sleep and lower energy. Consider a brief digital sunset before bed or a gentle warm beverage savoring ritual.`,
        actionRoute: "self-care",
        actionText: "Sleep Wind-Down",
      };
    }
    if (latestMood.mood === "Sad") {
      return {
        title: "Space for Self-Compassion",
        text: "It is okay to have low-energy or sad days. Expressive journaling or a compassionate hand-on-heart pause can offer gentle relief.",
        actionRoute: "journal",
        actionText: "Reflect in Journal",
      };
    }
    return {
      title: "Keep the Momentum Going",
      text: "You are experiencing positive emotional energy! Channel this clarity into mindful gratitude journaling or sharing a kind note with someone you value.",
      actionRoute: "journal",
      actionText: "Write Gratitude Note",
    };
  };

  const suggestion = getWellnessSuggestion();

  return (
    <div id="dashboard-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-sky-50/80 dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-sky-950/30 p-6 sm:p-8 rounded-3xl border border-indigo-100 dark:border-indigo-900/40">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
            <Sparkles className="w-4 h-4" />
            Personal Wellness Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
            {timeGreeting}, {user ? user.name : "Friend"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            {todayMood
              ? `You've checked in today feeling ${todayMood.mood}. Here is your wellness snapshot.`
              : "You haven't logged your mood today yet. Take a mindful 30 seconds to check in."}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="dash-log-mood-btn"
            onClick={onOpenMoodLog}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5"
          >
            <Smile className="w-4 h-4" />
            {todayMood ? "Update Today's Mood" : "Log Today's Mood"}
          </button>
          <button
            id="dash-talk-ai-btn"
            onClick={() => onNavigate("ai-assistant")}
            className="px-4 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 font-semibold text-xs sm:text-sm transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            Talk to AI
          </button>
        </div>
      </div>

      {/* METRIC OVERVIEW CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Streak */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Check-in Streak
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">
              {streak} <span className="text-xs font-normal text-slate-400">days</span>
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">
              {streak > 0 ? "Consistency builds habit" : "Start your streak today"}
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center text-xl">
            🔥
          </div>
        </div>

        {/* Today's Mood */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Today's Mood
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-1 truncate max-w-[120px]">
              {todayMood ? todayMood.mood : "Not Logged"}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {todayMood ? `${todayMood.sleepHours}h sleep` : "Click log to check in"}
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl">
            {todayMood
              ? MOOD_OPTIONS.find((m) => m.type === todayMood.mood)?.emoji || "✨"
              : "🤍"}
          </div>
        </div>

        {/* Avg Sleep */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Avg Sleep (7d)
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">
              {avgSleep} <span className="text-xs font-normal text-slate-400">hrs</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Target: 7–9 hours
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-500 flex items-center justify-center">
            <Moon className="w-6 h-6" />
          </div>
        </div>

        {/* Activities Completed */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Self-Care Done
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">
              {completedActivitiesCount}{" "}
              <span className="text-xs font-normal text-slate-400">
                / {SELF_CARE_ACTIVITIES.length}
              </span>
            </div>
            <p className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-0.5 font-medium">
              {completedActivitiesCount > 0 ? "Great dedication!" : "Explore 16+ exercises"}
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* DYNAMIC AI WELLNESS RECOMMENDATION */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-sky-500/10 border border-indigo-200/80 dark:border-indigo-800/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Personalized AI Insight
            </span>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">
              {suggestion.title}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {suggestion.text}
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate(suggestion.actionRoute)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shrink-0 shadow-sm transition-all flex items-center gap-1.5"
        >
          {suggestion.actionText}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* WEEKLY MOOD TRENDS SVG CHART & QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Chart */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-500" />
                Recent Mood Overview
              </h3>
              <p className="text-xs text-slate-400">Logged entries over past days</p>
            </div>
            <button
              onClick={() => onNavigate("mood-tracker")}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              View Full History <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {moods.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Smile className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-xs">No mood entries recorded yet.</p>
              <button
                onClick={onOpenMoodLog}
                className="mt-3 px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
              >
                Log First Mood
              </button>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
                {recentWeekMoods.slice(0, 7).reverse().map((m) => {
                  const moodInfo = MOOD_OPTIONS.find((opt) => opt.type === m.mood);
                  return (
                    <div
                      key={m.id}
                      className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col items-center text-center gap-1"
                    >
                      <span className="text-xs font-medium text-slate-400">
                        {m.date.split("-").slice(1).join("/")}
                      </span>
                      <span className="text-2xl my-1" title={m.mood}>
                        {moodInfo?.emoji || "😊"}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate w-full">
                        {m.mood}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {m.sleepHours}h sleep
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Quick Launch Panel */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
            Daily Wellness Rituals
          </h3>
          <p className="text-xs text-slate-400 mb-4">Quick access to mindful moments</p>

          <button
            id="dash-quick-breathe"
            onClick={() => onNavigate("breathing")}
            className="w-full p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-between text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center">
                <Wind className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  4-4 Breathing Circle
                </p>
                <p className="text-[10px] text-slate-400">4-minute calming cycle</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </button>

          <button
            id="dash-quick-journal"
            onClick={() => onNavigate("journal")}
            className="w-full p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-between text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
                <Feather className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Reflective Journal
                </p>
                <p className="text-[10px] text-slate-400">{journals.length} entries written</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </button>

          <button
            id="dash-quick-selfcare"
            onClick={() => onNavigate("self-care")}
            className="w-full p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-between text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Self-Care Exercises
                </p>
                <p className="text-[10px] text-slate-400">16+ guided practices</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
};
