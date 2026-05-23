import { useState } from "react";
import Icon from "@/components/ui/icon";
import { AuthUser } from "@/lib/auth";

const LEVEL_LABELS = {
  novice: "Новичок",
  amateur: "Любитель",
  expert: "Эксперт",
  guru: "Гуру",
};

const LEVEL_BADGE_CLS = {
  novice: "badge-novice",
  amateur: "badge-amateur",
  expert: "badge-expert",
  guru: "badge-guru",
};

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  darkMode: boolean;
  onToggleDark: () => void;
  onNotificationDismiss?: () => void;
  showNotification?: boolean;
  user: AuthUser | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export default function Header({
  currentPage, onNavigate, darkMode, onToggleDark,
  showNotification, onNotificationDismiss,
  user, onOpenAuth, onLogout,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Главная" },
    { id: "games", label: "Игры" },
    { id: "ratings", label: "Рейтинги" },
    { id: "community", label: "Сообщество" },
    { id: "profile", label: "Профиль" },
  ];

  return (
    <>
      {showNotification && (
        <div className="bg-primary text-primary-foreground px-4 py-2 flex items-center justify-between text-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <span>🏆</span>
            <span>Добро пожаловать на GameRate! Оцени первую игру и получи +10 XP</span>
          </div>
          <button onClick={onNotificationDismiss} className="hover:opacity-70 transition-opacity">
            <Icon name="X" size={16} />
          </button>
        </div>
      )}

      <header className="sticky top-0 z-50 bg-background/90 glass border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => onNavigate("home")}
              className="flex items-center gap-2 font-display text-xl font-bold tracking-wide hover:text-primary transition-colors"
            >
              <span className="text-primary">🎮</span>
              <span>GameRate</span>
            </button>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentPage === item.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={onToggleDark}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
              >
                <Icon name={darkMode ? "Sun" : "Moon"} size={18} />
              </button>

              {user ? (
                <div className="relative group">
                  <button
                    onClick={() => onNavigate("profile")}
                    className="flex items-center gap-2 bg-secondary rounded-xl px-3 py-1.5 hover:bg-primary/10 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
                      {user.username[0].toUpperCase()}
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-xs font-semibold leading-tight">{user.username}</div>
                      <span className={`text-xs ${LEVEL_BADGE_CLS[user.level]} rounded px-1 leading-tight inline-block`}>
                        {LEVEL_LABELS[user.level]}
                      </span>
                    </div>
                  </button>
                  <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-lg p-1 min-w-32 hidden group-hover:block z-50">
                    <button
                      onClick={() => onNavigate("profile")}
                      className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-all flex items-center gap-2"
                    >
                      <Icon name="User" size={14} /> Профиль
                    </button>
                    <button
                      onClick={onLogout}
                      className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-all flex items-center gap-2 text-destructive"
                    >
                      <Icon name="LogOut" size={14} /> Выйти
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
                >
                  Войти
                </button>
              )}

              <button
                className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-secondary transition-all"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                <Icon name={mobileOpen ? "X" : "Menu"} size={20} />
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-background animate-fade-in">
            <div className="container mx-auto px-4 py-3 flex flex-col gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { onNavigate(item.id); setMobileOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    currentPage === item.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              {!user && (
                <button
                  onClick={() => { onOpenAuth(); setMobileOpen(false); }}
                  className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground mt-1"
                >
                  Войти / Зарегистрироваться
                </button>
              )}
              {user && (
                <button
                  onClick={() => { onLogout(); setMobileOpen(false); }}
                  className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-secondary"
                >
                  Выйти
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
