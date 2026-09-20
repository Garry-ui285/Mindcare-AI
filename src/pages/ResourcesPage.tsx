import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Search,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  X,
  Sparkles,
} from "lucide-react";
import { MENTAL_HEALTH_RESOURCES } from "../data/mentalHealthResources";
import { ResourceArticle } from "../types";

interface ResourcesPageProps {
  initialArticleId?: string;
}

export const ResourcesPage: React.FC<ResourcesPageProps> = ({ initialArticleId }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [readingArticle, setReadingArticle] = useState<ResourceArticle | null>(null);

  const topics = [
    "All",
    ...new Set(MENTAL_HEALTH_RESOURCES.map((r) => r.topic)),
  ];

  useEffect(() => {
    if (initialArticleId) {
      const found = MENTAL_HEALTH_RESOURCES.find((r) => r.id === initialArticleId);
      if (found) setReadingArticle(found);
    }
  }, [initialArticleId]);

  const filtered = MENTAL_HEALTH_RESOURCES.filter((r) => {
    const matchesTopic = selectedTopic === "All" || r.topic === selectedTopic;
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  return (
    <div id="resources-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
          <BookOpen className="w-4 h-4" />
          Evidence-Based Mental Health Literacy
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
          Mental Health Resources & Education
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
          Learn about common emotional states, identify warning signs, and explore evidence-informed coping strategies backed by psychological literature.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="resource-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics (e.g. anxiety, burnout, sleep)..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedTopic === t
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((art) => (
          <div
            key={art.id}
            id={`resource-card-${art.id}`}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4"
          >
            <div>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 mb-3 inline-block">
                {art.topic}
              </span>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2">
                {art.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                {art.summary}
              </p>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                {art.copingStrategies.length} Coping strategies
              </span>
              <button
                onClick={() => setReadingArticle(art)}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                Read Guide <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ARTICLE READER MODAL */}
      {readingArticle && (
        <div
          id="article-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div
            id="article-modal-card"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-md">
                  {readingArticle.topic}
                </span>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1.5">
                  {readingArticle.title}
                </h2>
              </div>
              <button
                onClick={() => setReadingArticle(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs uppercase tracking-wider mb-2">
                  Overview
                </h4>
                <p className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed">
                  {readingArticle.summary}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs uppercase tracking-wider mb-2">
                  Common Signs & Indicators:
                </h4>
                <ul className="list-disc pl-5 space-y-1.5">
                  {readingArticle.commonSigns.map((sign, idx) => (
                    <li key={idx}>{sign}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs uppercase tracking-wider mb-2">
                  Evidence-Informed Coping Strategies:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {readingArticle.copingStrategies.map((strat, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/40 dark:bg-indigo-950/20 text-xs"
                    >
                      {strat}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
                <h4 className="font-bold text-amber-900 dark:text-amber-300 text-xs uppercase tracking-wider mb-1">
                  When to Seek Professional Support:
                </h4>
                <p className="text-amber-800 dark:text-amber-200 text-xs">
                  {readingArticle.whenToSeekHelp}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs uppercase tracking-wider mb-2">
                  Verified External Resources:
                </h4>
                <div className="space-y-1.5">
                  {readingArticle.reliableResources.map((res, idx) => (
                    <a
                      key={idx}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-indigo-600 dark:text-indigo-400 font-medium text-xs"
                    >
                      <span>{res.title}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setReadingArticle(null)}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
