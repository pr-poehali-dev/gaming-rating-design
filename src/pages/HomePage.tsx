import { useState } from "react";
import Icon from "@/components/ui/icon";
import GameCard from "@/components/GameCard";
import StarRating from "@/components/StarRating";
import LevelBadge from "@/components/LevelBadge";
import { GAMES, TOP5_WEEK, CHALLENGES, LEADERBOARD } from "@/data/games";

const GENRES = ["Все", "RPG", "Шутер", "Приключения", "Хоррор", "Экшен", "Стратегия"];
const PLATFORMS = ["Все", "PC", "PS5", "Xbox", "Switch"];
const SORT_OPTIONS = ["По рейтингу", "По популярности", "По новизне"];

interface HomePageProps {
  onGameClick: (id: number) => void;
  onNavigate: (page: string) => void;
}

export default function HomePage({ onGameClick, onNavigate }: HomePageProps) {
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Все");
  const [selectedPlatform, setSelectedPlatform] = useState("Все");
  const [sortBy, setSortBy] = useState("По рейтингу");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = GAMES
    .filter((g) => {
      const matchSearch = g.title.toLowerCase().includes(search.toLowerCase());
      const matchGenre = selectedGenre === "Все" || g.genre === selectedGenre;
      const matchPlatform = selectedPlatform === "Все" || g.platform.includes(selectedPlatform);
      return matchSearch && matchGenre && matchPlatform;
    })
    .sort((a, b) => {
      if (sortBy === "По рейтингу") return b.rating - a.rating;
      if (sortBy === "По популярности") return b.ratingsCount - a.ratingsCount;
      return b.year - a.year;
    });

  const top3 = LEADERBOARD.slice(0, 3);

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-primary/5 via-background to-background py-12 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-3 animate-fade-in">
            Оценивай. Делись. Соревнуйся.
          </h1>
          <p className="text-muted-foreground mb-8 animate-fade-in stagger-1">
            Рейтинговая платформа для настоящих геймеров — твои оценки формируют топ игр.
          </p>
          <div className="relative animate-fade-in stagger-2">
            <Icon name="Search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Найти игру..."
              className="w-full pl-12 pr-4 py-3.5 bg-card border border-border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-56 shrink-0">
            <button
              className="lg:hidden w-full flex items-center justify-between bg-secondary px-4 py-2.5 rounded-xl mb-3 text-sm font-medium"
              onClick={() => setShowFilters(!showFilters)}
            >
              <span>Фильтры</span>
              <Icon name={showFilters ? "ChevronUp" : "ChevronDown"} size={16} />
            </button>

            <div className={`${showFilters ? "block" : "hidden"} lg:block space-y-6`}>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Жанр</p>
                <div className="flex flex-wrap lg:flex-col gap-1">
                  {GENRES.map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGenre(g)}
                      className={`text-sm px-3 py-1.5 rounded-lg text-left transition-all ${
                        selectedGenre === g
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Платформа</p>
                <div className="flex flex-wrap lg:flex-col gap-1">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p}
                      onClick={() => setSelectedPlatform(p)}
                      className={`text-sm px-3 py-1.5 rounded-lg text-left transition-all ${
                        selectedPlatform === p
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Топ-5 недели</p>
                <div className="space-y-2">
                  {TOP5_WEEK.map((item, i) => (
                    <button
                      key={item.id}
                      onClick={() => onGameClick(item.id)}
                      className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-secondary transition-all text-left"
                    >
                      <span className="text-muted-foreground text-xs w-4 font-bold">{i + 1}</span>
                      <img src={item.cover} alt={item.title} className="w-8 h-8 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{item.title}</p>
                        <div className="flex items-center gap-1">
                          <span className="text-amber-400 text-xs font-bold">{item.rating}</span>
                          <span className={`text-xs font-semibold ${item.change > 0 ? "text-green-500" : item.change < 0 ? "text-red-500" : "text-muted-foreground"}`}>
                            {item.change > 0 ? `↑${item.change}` : item.change < 0 ? `↓${Math.abs(item.change)}` : "—"}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">{filtered.length} игр найдено</p>
              <div className="flex gap-2">
                {SORT_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSortBy(s)}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                      sortBy === s
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((game, i) => (
                <GameCard key={game.id} game={game} onClick={() => onGameClick(game.id)} index={i} />
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full text-center py-16 text-muted-foreground">
                  <Icon name="Search" size={48} className="mx-auto mb-3 opacity-30" />
                  <p>Игры не найдены</p>
                </div>
              )}
            </div>
          </main>

          <aside className="lg:w-64 shrink-0 space-y-6">
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">⚔️</span>
                <h3 className="font-display font-semibold text-sm">Текущие челленджи</h3>
              </div>
              <div className="space-y-3">
                {CHALLENGES.slice(0, 2).map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => onNavigate("challenges")}
                    className="w-full text-left p-3 bg-secondary rounded-xl hover:bg-primary/10 transition-all"
                  >
                    <p className="text-xs font-semibold mb-1">{ch.title}</p>
                    <p className="text-xs text-muted-foreground mb-2">{ch.goal}</p>
                    <div className="h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${(ch.progress / ch.progressMax) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{ch.progress}/{ch.progressMax}</p>
                  </button>
                ))}
              </div>
              <button
                onClick={() => onNavigate("challenges")}
                className="w-full mt-3 text-xs text-primary font-medium hover:underline"
              >
                Все челленджи →
              </button>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">🏅</span>
                <h3 className="font-display font-semibold text-sm">Лидерборд месяца</h3>
              </div>
              <div className="space-y-2">
                {top3.map((entry, i) => (
                  <div key={entry.userId} className="flex items-center gap-2 p-2 rounded-xl hover:bg-secondary transition-all">
                    <span className={`w-6 text-center text-sm font-bold ${i === 0 ? "text-amber-400" : i === 1 ? "text-gray-400" : "text-amber-700"}`}>
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-bold">
                      {entry.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{entry.name}</p>
                      <LevelBadge level={entry.level} />
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">{(entry.xp / 1000).toFixed(1)}k</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => onNavigate("community")}
                className="w-full mt-3 text-xs text-primary font-medium hover:underline"
              >
                Полный рейтинг →
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
