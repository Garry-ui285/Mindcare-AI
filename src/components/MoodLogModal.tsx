import React, { useState } from "react";
import { X, Smile, Meh, Frown, Zap, Moon, Heart, Sparkles } from "lucide-react";
import { MoodType, MoodEntry } from "../types";
import { saveMoodEntry } from "../services/firebase";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

interface MoodLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (entry: MoodEntry) => void;
  initialEntry?: MoodEntry | null;
}

export const MOOD_OPTIONS: { type: MoodType; label: string; emoji: string; color: string; bgColor: string }[] = [
  { type: "Very Happy", label: "Very Happy", emoji: "✨", color: "text-amber-500", bgColor: "bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700" },
  { type: "Happy", label: "Happy", emoji: "😊", color: "text-emerald-500", bgColor: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700" },
  { type: "Neutral", label: "Neutral", emoji: "😐", color: "text-sky-500", bgColor: "bg-sky-50 dark:bg-sky-950/30 border-sky-300 dark:border-sky-700" },
  { type: "Tired", label: "Tired", emoji: "🥱", color: "text-indigo-400", bgColor: "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-700" },
  { type: "Sad", label: "Sad", emoji: "😔", color: "text-blue-500", bgColor: "bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700" },
  { type: "Stressed", label: "Stressed", emoji: "😣", color: "text-orange-500", bgColor: "bg-orange-50 dark:bg-orange-950/30 border-orange-300 dark:border-orange-700" },
  { type: "Anxious", label: "Anxious", emoji: "😰", color: "text-purple-500", bgColor: "bg-purple-50 dark:bg-purple-950/30 border-purple-300 dark:border-purple-700" },
  { type: "Angry", label: "Angry", emoji: "😠", color: "text-rose-500", bgColor: "bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-700" },
];

export const MoodLogModal: React.FC<MoodLogModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  initialEntry,
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [date, setDate] = useState(
    initialEntry?.date || new Date().toISOString().split("T")[0]
  );
  const [selectedMood, setSelectedMood] = useState<MoodType>(
    initialEntry?.mood || "Happy"
  );
  const [energyLevel, setEnergyLevel] = useState<number>(
    initialEntry?.energyLevel || 3
  );
  const [sleepHours, setSleepHours] = useState<number>(
    initialEntry?.sleepHours || 7
  );
  const [notes, setNotes] = useState(initialEntry?.notes || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast("Please log in to record your mood.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const saved = await saveMoodEntry(user.uid, {
        userId: user.uid,
        date,
        mood: selectedMood,
        energyLevel,
        sleepHours,
        notes: notes.trim(),
        createdAt: new Date().toISOString(),
      });

      showToast("Your mood has been saved.", "success");
      if (onSaved) onSaved(saved);
      onClose();
    } catch (err) {
      console.error(err);
      showToast("Unable to save your mood. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="mood-log-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mood-modal-title"
    >
      <div
        id="mood-log-card"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 id="mood-modal-title" className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Log Today's Mood
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Take a gentle pause to notice how you feel
              </p>
            </div>
          </div>
          <button
            id="close-mood-modal"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg transition-colors"
            aria-label="Close mood modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Date Selector */}
          <div>
            <label
              htmlFor="mood-date-input"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5"
            >
              Date of Check-in
            </label>
            <input
              id="mood-date-input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Mood Options Grid */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2.5">
              Select Your Dominant Emotion
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {MOOD_OPTIONS.map((m) => {
                const isSelected = selectedMood === m.type;
                return (
                  <button
                    key={m.type}
                    type="button"
                    id={`mood-option-${m.type.toLowerCase().replace(/\s+/g, "-")}`}
                    onClick={() => setSelectedMood(m.type)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all ${
                      isSelected
                        ? `${m.bgColor} ring-2 ring-indigo-500 shadow-sm font-semibold`
                        : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span className="text-2xl" role="img" aria-label={m.label}>
                      {m.emoji}
                    </span>
                    <span className="text-xs">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Energy Level Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                <Zap className="w-4 h-4 text-amber-500" />
                Energy Level
              </span>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full">
                {energyLevel === 1 && "1 - Very Low"}
                {energyLevel === 2 && "2 - Mild"}
                {energyLevel === 3 && "3 - Balanced"}
                {energyLevel === 4 && "4 - Energetic"}
                {energyLevel === 5 && "5 - High Vitality"}
              </span>
            </div>
            <input
              id="mood-energy-slider"
              type="range"
              min="1"
              max="5"
              step="1"
              value={energyLevel}
              onChange={(e) => setEnergyLevel(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 px-1">
              <span>Low</span>
              <span>Balanced</span>
              <span>Vibrant</span>
            </div>
          </div>

          {/* Sleep Hours Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                <Moon className="w-4 h-4 text-indigo-500" />
                Sleep Duration
              </span>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full">
                {sleepHours} Hours
              </span>
            </div>
            <input
              id="mood-sleep-slider"
              type="range"
              min="0"
              max="14"
              step="0.5"
              value={sleepHours}
              onChange={(e) => setSleepHours(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 px-1">
              <span>0h</span>
              <span>7h</span>
              <span>14h</span>
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label
              htmlFor="mood-notes-input"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5"
            >
              Optional Reflections or Triggers
            </label>
            <textarea
              id="mood-notes-input"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What factors contributed to your state of mind today? (e.g., rested well, productive workday, busy morning...)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              id="cancel-mood-btn"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-mood-btn"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <Heart className="w-4 h-4 fill-white" />
              {isSubmitting ? "Saving..." : "Save Today's Mood"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
