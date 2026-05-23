import { useState, useEffect } from "react";
import Header from "@/components/Header";
import AuthModal from "@/components/AuthModal";
import HomePage from "./HomePage";
import GamesPage from "./GamesPage";
import GamePage from "./GamePage";
import ProfilePage from "./ProfilePage";
import CommunityPage from "./CommunityPage";
import ChallengesPage from "./ChallengesPage";
import RatingsPage from "./RatingsPage";
import { getMe, logout as authLogout, AuthUser } from "@/lib/auth";

export default function Index() {
  const [page, setPage] = useState("home");
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    getMe().then((u) => {
      setUser(u);
      setAuthChecked(true);
      if (u) setShowNotification(false);
    });
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleGameClick = (id: number) => {
    setSelectedGameId(id);
    setPage("game");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigate = (target: string) => {
    setPage(target);
    setSelectedGameId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setPage("games");
    setSelectedGameId(null);
  };

  const handleLogout = async () => {
    await authLogout();
    setUser(null);
    setShowNotification(true);
    setPage("home");
  };

  const handleAuthSuccess = (u: AuthUser) => {
    setUser(u);
    setShowNotification(false);
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header
        currentPage={page}
        onNavigate={handleNavigate}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(!darkMode)}
        showNotification={showNotification}
        onNotificationDismiss={() => setShowNotification(false)}
        user={user}
        onOpenAuth={() => setShowAuth(true)}
        onLogout={handleLogout}
      />

      <main>
        {page === "home" && (
          <HomePage onGameClick={handleGameClick} onNavigate={handleNavigate} />
        )}
        {page === "games" && (
          <GamesPage onGameClick={handleGameClick} />
        )}
        {page === "game" && selectedGameId !== null && (
          <GamePage gameId={selectedGameId} onBack={handleBack} onGameClick={handleGameClick} />
        )}
        {page === "ratings" && <RatingsPage />}
        {page === "community" && <CommunityPage />}
        {page === "challenges" && <ChallengesPage />}
        {page === "profile" && <ProfilePage user={user} onOpenAuth={() => setShowAuth(true)} />}
      </main>

      <footer className="border-t border-border mt-16 py-8 text-center text-sm text-muted-foreground">
        <p className="font-display font-bold text-foreground mb-1">🎮 GameRate</p>
        <p>Рейтинговая платформа для геймеров · 2025</p>
      </footer>

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}
