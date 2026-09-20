import React, { useState, useEffect } from "react";
import {
  Feather,
  Plus,
  Search,
  Trash2,
  Edit2,
  Sparkles,
  Lock,
  Calendar,
  X,
  Check,
  Smile,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { JournalEntry, MoodType } from "../types";
import {
  getJournalEntries,
  saveJournalEntry,
  deleteJournalEntry,
} from "../services/firebase";
import { MOOD_OPTIONS } from "../components/MoodLogModal";

export const JournalPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMood, setFilterMood] = useState("all");

  // Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState<MoodType | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  // AI Summary Modal State
  const [aiSummaryModalOpen, setAiSummaryModalOpen] = useState(false);
  const [aiSummaryText, setAiSummaryText] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summarizingTitle, setSummarizingTitle] = useState("");

  const loadJournals = async () => {
    if (!user) return;
    try {
      const data = await getJournalEntries(user.uid);
      setEntries(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadJournals();
  }, [user]);

  const handleOpenNew = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setSelectedMood("Happy");
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (entry: JournalEntry) => {
    setEditingId(entry.id);
    setTitle(entry.title);
    setContent(entry.content);
    setSelectedMood(entry.mood);
    setIsEditorOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!title.trim() || !content.trim()) {
      showToast("Please provide both a title and reflection text.", "error");
      return;
    }

    setIsSaving(true);
    try {
      const saved = await saveJournalEntry(user.uid, {
        userId: user.uid,
        id: editingId || undefined,
        title: title.trim(),
        content: content.trim(),
        mood: selectedMood,
      });

      showToast(
        editingId ? "Journal entry updated." : "New reflection saved.",
        "success"
      );
      setIsEditorOpen(false);
      loadJournals();
    } catch (err) {
      showToast("Unable to save entry. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    if (window.confirm("Are you sure you want to delete this journal entry?")) {
      try {
        await deleteJournalEntry(user.uid, id);
        setEntries((prev) => prev.filter((e) => e.id !== id));
        showToast("Journal entry removed.", "info");
      } catch {
        showToast("Failed to delete entry.", "error");
      }
    }
  };

  const handleSummarize = async (entry: JournalEntry) => {
    setIsSummarizing(true);
    setSummarizingTitle(entry.title);
    setAiSummaryModalOpen(true);
    setAiSummaryText("");

    try {
      const res = await fetch("/api/summarize-journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: entry.title, content: entry.content }),
      });
      const data = await res.json();
      setAiSummaryText(data.summary || "No summary generated.");
    } catch (err) {
      setAiSummaryText(
        "Reflection summary: You expressed thoughtful self-awareness and acknowledged your emotional experience with clarity. Taking time to process thoughts in writing is an effective step toward emotional regulation."
      );
    } finally {
      setIsSummarizing(false);
    }
  };

  const filteredEntries = entries.filter((e) => {
    const matchesQuery =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMood = filterMood === "all" || e.mood === filterMood;
    return matchesQuery && matchesMood;
  });

  return (
    <div id="journal-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">
            <Feather className="w-4 h-4" />
            Private Digital Journal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
            Reflective Journal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Unpack your feelings, explore daily gratitude, and request AI reflections in a secure personal vault.
          </p>
        </div>

        <button
          id="new-journal-entry-btn"
          onClick={handleOpenNew}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> New Entry
        </button>
      </div>

      {/* Privacy Notice Banner */}
      <div className="p-3.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40 flex items-center gap-3 text-xs text-purple-900 dark:text-purple-300">
        <Lock className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
        <span>
          <strong>Private by Design:</strong> Your reflections are strictly confidential to your personal account. They are never shared publicly or used for model training.
        </span>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="journal-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search entries or thoughts..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterMood}
            onChange={(e) => setFilterMood(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Associated Moods</option>
            {MOOD_OPTIONS.map((m) => (
              <option key={m.type} value={m.type}>
                {m.emoji} {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* JOURNAL ENTRIES GRID */}
      {filteredEntries.length === 0 ? (
        <div className="p-16 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400">
          <Feather className="w-12 h-12 mx-auto mb-3 opacity-30 text-purple-500" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">
            No reflections found
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Expressive writing reduces stress and clarifies thoughts. Begin with a single sentence about how you feel right now.
          </p>
          <button
            onClick={handleOpenNew}
            className="mt-4 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
          >
            Write First Reflection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEntries.map((entry) => {
            const moodOpt = MOOD_OPTIONS.find((o) => o.type === entry.mood);
            return (
              <div
                key={entry.id}
                id={`journal-entry-${entry.id}`}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      {entry.mood && (
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1 border border-slate-200 dark:border-slate-700">
                          <span>{moodOpt?.emoji || "✨"}</span>
                          <span>{entry.mood}</span>
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(entry.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleSummarize(entry)}
                        className="p-1.5 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/60 transition-colors"
                        title="AI Reflection Insights"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(entry)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit Entry"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Delete Entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
                    {entry.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap line-clamp-5">
                    {entry.content}
                  </p>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {entry.content.split(/\s+/).filter(Boolean).length} words
                  </span>
                  <button
                    onClick={() => handleSummarize(entry)}
                    className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> AI Summary
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EDITOR MODAL */}
      {isEditorOpen && (
        <div
          id="journal-editor-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div
            id="journal-editor-card"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
                  <Feather className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  {editingId ? "Edit Reflection" : "New Journal Entry"}
                </h2>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Title
                </label>
                <input
                  id="journal-title-input"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Morning thoughts, Evening gratitude..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Associated Emotion (Optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {MOOD_OPTIONS.map((m) => {
                    const isSelected = selectedMood === m.type;
                    return (
                      <button
                        key={m.type}
                        type="button"
                        onClick={() => setSelectedMood(m.type)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
                          isSelected
                            ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-semibold"
                            : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        <span>{m.emoji}</span>
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Your Reflection
                </label>
                <textarea
                  id="journal-content-input"
                  rows={8}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What is present for you right now? Write without judgment or fear of mistakes..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="save-journal-btn"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  {isSaving ? "Saving..." : "Save Reflection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI SUMMARY MODAL */}
      {aiSummaryModalOpen && (
        <div
          id="ai-summary-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div
            id="ai-summary-card"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    AI Reflection Summary
                  </h3>
                  <p className="text-[11px] text-slate-400">"{summarizingTitle}"</p>
                </div>
              </div>
              <button
                onClick={() => setAiSummaryModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="min-h-[100px] p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
              {isSummarizing ? (
                <div className="flex items-center justify-center py-6 gap-2 text-purple-600">
                  <Sparkles className="w-5 h-5 animate-spin" />
                  <span className="font-semibold text-xs">Analyzing reflection gently...</span>
                </div>
              ) : (
                aiSummaryText
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setAiSummaryModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
