import React, { useState, useEffect } from "react";
import { Search, X, BookOpen, Sparkles, Feather, ArrowRight } from "lucide-react";
import { MENTAL_HEALTH_RESOURCES } from "../data/mentalHealthResources";
import { SELF_CARE_ACTIVITIES } from "../data/selfCareActivities";
import { getJournalEntries } from "../services/firebase";
import { useAuth } from "../contexts/AuthContext";
import { JournalEntry } from "../types";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string, state?: any) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [userJournals, setUserJournals] = useState<JournalEntry[]>([]);

  useEffect(() => {
    if (isOpen && user) {
      getJournalEntries(user.uid).then(setUserJournals).catch(console.error);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  // Filter resources
  const filteredResources = cleanQuery
    ? MENTAL_HEALTH_RESOURCES.filter(
        (r) =>
          r.title.toLowerCase().includes(cleanQuery) ||
          r.topic.toLowerCase().includes(cleanQuery) ||
          r.summary.toLowerCase().includes(cleanQuery)
      )
    : [];

  // Filter activities
  const filteredActivities = cleanQuery
    ? SELF_CARE_ACTIVITIES.filter(
        (a) =>
          a.name.toLowerCase().includes(cleanQuery) ||
          a.category.toLowerCase().includes(cleanQuery) ||
          a.description.toLowerCase().includes(cleanQuery)
      )
    : [];

  // Filter journals
  const filteredJournals = cleanQuery
    ? userJournals.filter(
        (j) =>
          j.title.toLowerCase().includes(cleanQuery) ||
          j.content.toLowerCase().includes(cleanQuery) ||
          (j.mood && j.mood.toLowerCase().includes(cleanQuery))
      )
    : [];

  const totalResults =
    filteredResources.length + filteredActivities.length + filteredJournals.length;

  return (
    <div
      id="global-search-backdrop"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div
        id="global-search-card"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        {/* Search input header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            id="global-search-input"
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search resources, self-care exercises, or journal notes..."
            className="w-full bg-transparent border-none text-slate-800 dark:text-slate-100 text-base placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800"
            >
              Clear
            </button>
          )}
          <button
            id="close-search-modal"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="p-4 overflow-y-auto space-y-6 flex-1">
          {!cleanQuery ? (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500">
              <Search className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">Type anything to search across MindCare AI</p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 max-w-md mx-auto">
                {["Anxiety", "Sleep", "Breathing", "Gratitude", "Burnout", "Focus"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500">
              <p className="text-sm font-medium">No results found for "{query}"</p>
              <p className="text-xs mt-1 text-slate-400">Try searching for broader keywords like stress, sleep, or breathing.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Mental Health Resources */}
              {filteredResources.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                    <BookOpen className="w-4 h-4 text-indigo-500" />
                    Mental Health Resources ({filteredResources.length})
                  </div>
                  <div className="space-y-2">
                    {filteredResources.map((res) => (
                      <button
                        key={res.id}
                        onClick={() => {
                          onClose();
                          onNavigate("resources", { articleId: res.id });
                        }}
                        className="w-full text-left p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
                              {res.topic}
                            </span>
                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                              {res.title}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">
                            {res.summary}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Self Care Activities */}
              {filteredActivities.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    Self-Care Activities ({filteredActivities.length})
                  </div>
                  <div className="space-y-2">
                    {filteredActivities.map((act) => (
                      <button
                        key={act.id}
                        onClick={() => {
                          onClose();
                          onNavigate("self-care", { activityId: act.id });
                        }}
                        className="w-full text-left p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                              {act.category}
                            </span>
                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                              {act.name}
                            </span>
                            <span className="text-xs text-slate-400">({act.duration})</span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">
                            {act.description}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Journal Entries */}
              {filteredJournals.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                    <Feather className="w-4 h-4 text-purple-500" />
                    Your Private Journal Entries ({filteredJournals.length})
                  </div>
                  <div className="space-y-2">
                    {filteredJournals.map((j) => (
                      <button
                        key={j.id}
                        onClick={() => {
                          onClose();
                          onNavigate("journal", { entryId: j.id });
                        }}
                        className="w-full text-left p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            {j.mood && (
                              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-md">
                                {j.mood}
                              </span>
                            )}
                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                              {j.title}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">
                            {j.content}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
