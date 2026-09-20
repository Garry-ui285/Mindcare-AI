import React, { useState, useEffect } from "react";
import {
  Heart,
  Clock,
  Sparkles,
  CheckCircle2,
  Circle,
  Search,
  ArrowRight,
  X,
  Play,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { ActivityCategory, SelfCareActivity } from "../types";
import { SELF_CARE_ACTIVITIES } from "../data/selfCareActivities";
import {
  getActivityProgress,
  toggleActivityProgress,
} from "../services/firebase";
import confetti from "canvas-confetti";

const CATEGORIES: ("All" | ActivityCategory)[] = [
  "All",
  "Stress Relief",
  "Better Sleep",
  "Focus",
  "Relaxation",
  "Physical Activity",
  "Social Connection",
  "Mindfulness",
  "Journaling",
];

interface SelfCarePageProps {
  onNavigate: (route: string, state?: any) => void;
  initialActivityId?: string;
}

export const SelfCarePage: React.FC<SelfCarePageProps> = ({
  onNavigate,
  initialActivityId,
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [selectedCategory, setSelectedCategory] = useState<"All" | ActivityCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activityMap, setActivityMap] = useState<Record<string, boolean>>({});
  const [activeModalActivity, setActiveModalActivity] = useState<SelfCareActivity | null>(null);

  useEffect(() => {
    if (user) {
      getActivityProgress(user.uid).then(setActivityMap).catch(console.error);
    }
  }, [user]);

  useEffect(() => {
    if (initialActivityId) {
      const found = SELF_CARE_ACTIVITIES.find((a) => a.id === initialActivityId);
      if (found) setActiveModalActivity(found);
    }
  }, [initialActivityId]);

  const handleToggleComplete = async (activity: SelfCareActivity) => {
    if (!user) {
      showToast("Please sign in to save your activity progress.", "info");
      return;
    }

    const currentVal = !!activityMap[activity.id];
    const newVal = !currentVal;

    try {
      await toggleActivityProgress(user.uid, activity.id, newVal);
      setActivityMap((prev) => ({ ...prev, [activity.id]: newVal }));

      if (newVal) {
        showToast(`Completed: ${activity.name}!`, "success");
        try {
          confetti({
            particleCount: 40,
            spread: 50,
            origin: { y: 0.8 },
          });
        } catch {
          // ignore
        }
      } else {
        showToast("Marked as uncompleted.", "info");
      }
    } catch {
      showToast("Failed to update progress.", "error");
    }
  };

  const filteredActivities = SELF_CARE_ACTIVITIES.filter((a) => {
    const matchesCat = selectedCategory === "All" || a.category === selectedCategory;
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const completedCount = Object.values(activityMap).filter(Boolean).length;

  return (
    <div id="self-care-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
            <Heart className="w-4 h-4" />
            Curated Well-Being Practice
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
            Self-Care Activities
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Take deliberate pauses with actionable exercises designed to relieve stress, restore focus, and ground your awareness.
          </p>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-4 py-2.5 rounded-2xl flex items-center gap-3 shrink-0 self-start sm:self-auto">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {completedCount} of {SELF_CARE_ACTIVITIES.length} Completed
            </div>
            <div className="text-[10px] text-slate-400">
              {Math.round((completedCount / SELF_CARE_ACTIVITIES.length) * 100)}% overall mastery
            </div>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Pills */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="selfcare-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exercises by name or keyword..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              id={`cat-pill-${cat.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ACTIVITIES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActivities.map((act) => {
          const isDone = !!activityMap[act.id];
          return (
            <div
              key={act.id}
              id={`activity-card-${act.id}`}
              className={`bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-4 transition-all hover:shadow-md ${
                isDone
                  ? "border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/20 dark:bg-emerald-950/10"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/40">
                    {act.category}
                  </span>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{act.duration}</span>
                    <span className="mx-1">•</span>
                    <span className="font-medium text-slate-500 dark:text-slate-400">
                      {act.difficulty}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1.5">
                  {act.name}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {act.description}
                </p>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between gap-2">
                <button
                  onClick={() => setActiveModalActivity(act)}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  View Guide
                </button>

                <button
                  id={`toggle-act-${act.id}`}
                  onClick={() => handleToggleComplete(act)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isDone
                      ? "bg-emerald-600 text-white"
                      : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {isDone ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                    </>
                  ) : (
                    <>
                      <Circle className="w-3.5 h-3.5" /> Mark Done
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ACTIVITY GUIDE MODAL */}
      {activeModalActivity && (
        <div
          id="activity-guide-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div
            id="activity-guide-card"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl p-6 space-y-5"
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {activeModalActivity.category} • {activeModalActivity.duration}
                </span>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                  {activeModalActivity.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalActivity(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {activeModalActivity.description}
            </p>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Step-by-Step Instructions:
              </h4>
              <div className="space-y-2.5">
                {activeModalActivity.instructions.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  handleToggleComplete(activeModalActivity);
                  setActiveModalActivity(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                {activityMap[activeModalActivity.id] ? "Mark as Incomplete" : "Mark as Completed"}
              </button>

              <button
                onClick={() => setActiveModalActivity(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
