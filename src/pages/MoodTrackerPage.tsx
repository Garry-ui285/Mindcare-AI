import React, { useState, useEffect } from "react";
import {
  Smile,
  Plus,
  Trash2,
  Calendar,
  Zap,
  Moon,
  TrendingUp,
  BarChart2,
  Filter,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { MoodEntry, MoodType } from "../types";
import { getMoodEntries, deleteMoodEntry } from "../services/firebase";
import { MOOD_OPTIONS } from "../components/MoodLogModal";

interface MoodTrackerPageProps {
  onOpenMoodLog: () => void;
}

export const MoodTrackerPage: React.FC<MoodTrackerPageProps> = ({ onOpenMoodLog }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "all">("7d");
  const [filterMood, setFilterMood] = useState<string>("all");

  const loadEntries = async () => {
    if (!user) return;
    try {
      const data = await getMoodEntries(user.uid);
      setMoods(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadEntries();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!user) return;
    if (window.confirm("Are you sure you want to delete this mood check-in?")) {
      try {
        await deleteMoodEntry(user.uid, id);
        setMoods((prev) => prev.filter((m) => m.id !== id));
        showToast("Mood check-in deleted.", "info");
      } catch {
        showToast("Failed to delete entry.", "error");
      }
    }
  };

  // Filter logic
  const now = new Date();
  const filteredByRange = moods.filter((m) => {
    if (timeRange === "all") return true;
    const entryDate = new Date(m.date);
    const diffDays = (now.getTime() - entryDate.getTime()) / (1000 * 3600 * 24);
    if (timeRange === "7d") return diffDays <= 7;
    if (timeRange === "30d") return diffDays <= 30;
    return true;
  });

  const finalFiltered = filteredByRange.filter((m) => {
    if (filterMood === "all") return true;
    return m.mood === filterMood;
  });

  // Mood counts calculation
  const moodDistribution: Record<string, number> = {};
  filteredByRange.forEach((m) => {
    moodDistribution[m.mood] = (moodDistribution[m.mood] || 0) + 1;
  });

  // Calculate averages
  const avgSleep =
    filteredByRange.length > 0
      ? (
          filteredByRange.reduce((acc, curr) => acc + curr.sleepHours, 0) /
          filteredByRange.length
        ).toFixed(1)
      : "0";
  const avgEnergy =
    filteredByRange.length > 0
      ? (
          filteredByRange.reduce((acc, curr) => acc + curr.energyLevel, 0) /
          filteredByRange.length
        ).toFixed(1)
      : "0";

  return (
    <div id="mood-tracker-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
            <TrendingUp className="w-4 h-4" />
            Emotional Awareness & Trends
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
            Daily Mood Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Observe patterns between your sleep, daily energy, and mental states.
          </p>
        </div>

        <button
          id="log-mood-page-btn"
          onClick={onOpenMoodLog}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Log Today's Mood
        </button>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Check-ins</span>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">
              {moods.length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
            <Smile className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Average Sleep</span>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">
              {avgSleep} <span className="text-xs text-slate-400 font-normal">hrs</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center">
            <Moon className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Average Energy</span>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">
              {avgEnergy} <span className="text-xs text-slate-400 font-normal">/ 5</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* FILTER & TIMEFRAME BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Time Window:</span>
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {(["7d", "30d", "all"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  timeRange === range
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                {range === "7d" ? "Past 7 Days" : range === "30d" ? "Past 30 Days" : "All Time"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterMood}
            onChange={(e) => setFilterMood(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Mood Types</option>
            {MOOD_OPTIONS.map((opt) => (
              <option key={opt.type} value={opt.type}>
                {opt.emoji} {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* MOOD DISTRIBUTION BARS */}
      {filteredByRange.length > 0 && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-indigo-500" />
              Emotional Frequency Distribution
            </h3>
            <span className="text-xs text-slate-400">
              {filteredByRange.length} total entries in range
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {MOOD_OPTIONS.map((opt) => {
              const count = moodDistribution[opt.type] || 0;
              const percent =
                filteredByRange.length > 0
                  ? Math.round((count / filteredByRange.length) * 100)
                  : 0;

              return (
                <div
                  key={opt.type}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{opt.emoji}</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {count} ({percent}%)
                    </span>
                  </div>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    {opt.label}
                  </span>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 dark:bg-indigo-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MOOD HISTORY LIST */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
          Check-in Log ({finalFiltered.length})
        </h3>

        {finalFiltered.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400">
            <Smile className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-medium">No check-ins match your current filter.</p>
            <button
              onClick={onOpenMoodLog}
              className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
            >
              Log Today's Mood
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {finalFiltered.map((entry) => {
              const moodOpt = MOOD_OPTIONS.find((o) => o.type === entry.mood);
              return (
                <div
                  key={entry.id}
                  id={`mood-entry-${entry.id}`}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-2xl border border-slate-100 dark:border-slate-800">
                        {moodOpt?.emoji || "😊"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">
                            {entry.mood}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(entry.date).toLocaleDateString(undefined, {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="text-slate-300 hover:text-rose-500 p-1.5 rounded-lg transition-colors"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {entry.notes && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 leading-relaxed italic">
                      "{entry.notes}"
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      Energy: {entry.energyLevel}/5
                    </span>
                    <span className="flex items-center gap-1">
                      <Moon className="w-3.5 h-3.5 text-indigo-500" />
                      Sleep: {entry.sleepHours} hrs
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
