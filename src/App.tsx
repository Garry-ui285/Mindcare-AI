import React, { useState, useEffect } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastProvider } from "./contexts/ToastContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { SafetyAlertModal } from "./components/SafetyAlertModal";
import { MoodLogModal } from "./components/MoodLogModal";
import { GlobalSearchModal } from "./components/GlobalSearchModal";

// Pages
import { HomePage } from "./pages/HomePage";
import { DashboardPage } from "./pages/DashboardPage";
import { AIAssistantPage } from "./pages/AIAssistantPage";
import { MoodTrackerPage } from "./pages/MoodTrackerPage";
import { JournalPage } from "./pages/JournalPage";
import { SelfCarePage } from "./pages/SelfCarePage";
import { BreathingPage } from "./pages/BreathingPage";
import { ResourcesPage } from "./pages/ResourcesPage";
import { ProfessionalHelpPage } from "./pages/ProfessionalHelpPage";
import { AuthPage } from "./pages/AuthPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SettingsPage } from "./pages/SettingsPage";
import { LegalPage } from "./pages/LegalPage";

function AppContent() {
  const { user } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<string>("home");
  const [routeParams, setRouteParams] = useState<any>({});

  // Modals
  const [isSafetyAlertOpen, setIsSafetyAlertOpen] = useState(false);
  const [isMoodLogOpen, setIsMoodLogOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Navigate helper
  const navigate = (route: string, params?: any) => {
    setCurrentRoute(route);
    if (params) setRouteParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Keyboard shortcut Cmd/Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Universal Prominent Medical Disclaimer Banner */}
      <div
        id="top-health-disclaimer-banner"
        className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-amber-500/10 border-b border-amber-200/50 dark:border-amber-900/30 text-amber-900 dark:text-amber-200/90 text-[11px] sm:text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2"
      >
        <span>
          <strong>Notice:</strong> MindCare AI provides general wellness information and emotional support. It does not replace professional medical or psychological care.
        </span>
        <button
          onClick={() => setIsSafetyAlertOpen(true)}
          className="text-rose-600 dark:text-rose-400 font-bold hover:underline shrink-0 ml-1"
        >
          Helplines
        </button>
      </div>

      {/* Navigation Bar */}
      <Navbar
        currentRoute={currentRoute}
        onNavigate={navigate}
        onOpenSafetyAlert={() => setIsSafetyAlertOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAuth={(mode) => navigate("auth", { mode })}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentRoute === "home" && (
          <HomePage
            onNavigate={navigate}
            onOpenSafetyAlert={() => setIsSafetyAlertOpen(true)}
            onOpenAuth={(mode) => navigate("auth", { mode })}
          />
        )}

        {currentRoute === "dashboard" && (
          <DashboardPage
            onNavigate={navigate}
            onOpenMoodLog={() => setIsMoodLogOpen(true)}
          />
        )}

        {currentRoute === "ai-assistant" && (
          <AIAssistantPage
            onOpenSafetyAlert={() => setIsSafetyAlertOpen(true)}
            onNavigate={navigate}
          />
        )}

        {currentRoute === "mood-tracker" && (
          <MoodTrackerPage onOpenMoodLog={() => setIsMoodLogOpen(true)} />
        )}

        {currentRoute === "journal" && <JournalPage />}

        {currentRoute === "self-care" && (
          <SelfCarePage
            onNavigate={navigate}
            initialActivityId={routeParams?.activityId}
          />
        )}

        {currentRoute === "breathing" && <BreathingPage />}

        {currentRoute === "resources" && (
          <ResourcesPage initialArticleId={routeParams?.articleId} />
        )}

        {currentRoute === "professional-help" && (
          <ProfessionalHelpPage
            onOpenSafetyAlert={() => setIsSafetyAlertOpen(true)}
          />
        )}

        {currentRoute === "auth" && (
          <AuthPage
            initialMode={routeParams?.mode || "login"}
            onSuccess={() => navigate("dashboard")}
            onNavigateToLegal={(tab) => navigate("legal", { tab })}
          />
        )}

        {currentRoute === "profile" && <ProfilePage />}

        {currentRoute === "settings" && (
          <SettingsPage
            onNavigateToLegal={(tab) => navigate("legal", { tab })}
          />
        )}

        {currentRoute === "legal" && (
          <LegalPage initialTab={routeParams?.tab || "disclaimer"} />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={navigate}
        onOpenSafetyAlert={() => setIsSafetyAlertOpen(true)}
      />

      {/* Global Interactive Modals */}
      <SafetyAlertModal
        isOpen={isSafetyAlertOpen}
        onClose={() => setIsSafetyAlertOpen(false)}
        onNavigateToProfessionalHelp={() => {
          setIsSafetyAlertOpen(false);
          navigate("professional-help");
        }}
      />

      <MoodLogModal
        isOpen={isMoodLogOpen}
        onClose={() => setIsMoodLogOpen(false)}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={navigate}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
