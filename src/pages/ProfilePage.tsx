import React, { useState } from "react";
import { User, Mail, Heart, Sparkles, Check, Bell, Shield, Calendar } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

const WELLNESS_GOAL_OPTIONS = [
  "Manage Daily Academic / Work Stress",
  "Improve Sleep Quality & Routine",
  "Practice Mindfulness & Breathing",
  "Build Resilient Emotional Habits",
  "Foster Self-Compassion & Gratitude",
  "Reduce Social Anxiety",
];

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || "");
  const [ageRange, setAgeRange] = useState(user?.ageRange || "18-24");
  const [dailyGoal, setDailyGoal] = useState(
    user?.dailyGoal || "Take 5 mindful minutes for myself"
  );
  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    user?.wellnessGoals || ["Manage Daily Academic / Work Stress"]
  );
  const [isSaving, setIsSaving] = useState(false);

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      await updateProfile({
        name: name.trim(),
        ageRange,
        dailyGoal: dailyGoal.trim(),
        wellnessGoals: selectedGoals,
      });
      showToast("Your wellness profile has been updated.", "success");
    } catch {
      showToast("Failed to update profile.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div id="profile-page" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
          <User className="w-4 h-4" />
          Personal Account & Goals
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
          My Wellness Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Personalize your experience to receive relevant suggestions from MindCare AI.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Details Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
            Identity & Contact
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="profile-name-input"
                className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1"
              >
                Preferred Name
              </label>
              <input
                id="profile-name-input"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label
                htmlFor="profile-email-input"
                className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1"
              >
                Email Address
              </label>
              <input
                id="profile-email-input"
                type="email"
                disabled
                value={user?.email || ""}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 text-xs font-medium text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="profile-age-select"
              className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1"
            >
              Age Demographic
            </label>
            <select
              id="profile-age-select"
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value)}
              className="w-full sm:w-60 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
            >
              <option value="Under 18">Under 18</option>
              <option value="18-24">18–24 (College / Early Career)</option>
              <option value="25-34">25–34</option>
              <option value="35-49">35–49</option>
              <option value="50+">50+</option>
            </select>
          </div>
        </div>

        {/* Daily Goal & Intentions */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
            Daily Wellness Intention
          </h3>

          <div>
            <label
              htmlFor="profile-daily-goal"
              className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1"
            >
              Personal Micro-Goal
            </label>
            <input
              id="profile-daily-goal"
              type="text"
              value={dailyGoal}
              onChange={(e) => setDailyGoal(e.target.value)}
              placeholder="e.g., Take 5 mindful minutes away from screens..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
              Primary Wellness Focus Areas
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {WELLNESS_GOAL_OPTIONS.map((goal) => {
                const isSelected = selectedGoals.includes(goal);
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleGoal(goal)}
                    className={`p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 text-indigo-800 dark:text-indigo-200 font-semibold"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span>{goal}</span>
                    {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            id="save-profile-btn"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            {isSaving ? "Updating..." : "Save Profile Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};
