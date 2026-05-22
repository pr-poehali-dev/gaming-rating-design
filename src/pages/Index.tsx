import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HomePage from "./HomePage";
import GamesPage from "./GamesPage";
import GamePage from "./GamePage";
import ProfilePage from "./ProfilePage";
import CommunityPage from "./CommunityPage";
import ChallengesPage from "./ChallengesPage";
import RatingsPage from "./RatingsPage";

export default function Index() {
  const [page, setPage] = useState("home");
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showNotification, setShowNotification] = useState(true);

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

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header
        currentPage={page}
        onNavigate={handleNavigate}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(!darkMode)}
        showNotification={showNotification}
        onNotificationDismiss={() => setShowNotification(false)}
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
        {page === "profile" && <ProfilePage />}
      </main>

      <footer className="border-t border-border mt-16 py-8 text-center text-sm text-muted-foreground">
        <p className="font-display font-bold text-foreground mb-1">🎮 GameRate</p>
        <p>Рейтинговая платформа для геймеров · 2025</p>
      </footer>
    </div>
  );
}
