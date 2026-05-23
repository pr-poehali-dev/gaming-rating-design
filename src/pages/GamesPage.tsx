import { useState } from "react";
import Icon from "@/components/ui/icon";
import GameCard from "@/components/GameCard";
import { useGames } from "@/contexts/GamesContext";

const GENRES = ["Все", "RPG", "Шутер", "Приключения", "Хоррор", "Экшен", "Стратегия"];
const PLATFORMS = ["Все", "PC", "PS5", "Xbox", "Switch"];
const YEARS = ["Все годы", "2024", "2023", "2022", "До 2020"];
const RATINGS = ["Любой рейтинг", "4.5+", "4.0+", "3.0+"];

interface GamesPageProps {
  onGameClick: (id: number) => void;
}

export default function GamesPage({ onGameClick }: GamesPageProps) {
  const { games } = useGames();
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("Все");
  const [platform, setPlatform] = useState("Все");
  const [year, setYear] = useState("Все годы");
  const [minRating, setMinRating] = useState("Любой рейтинг");
  const [sort, setSort] = useState("По рейтингу");

  const filtered = games
    .filter((g) => {
      const matchSearch = g.title.toLowerCase().includes(search.toLowerCase());
      const matchGenre = genre === "Все" || g.genre === genre;
      const matchPlatform = platform === "Все" || g.platform.includes(platform);
      const matchYear =
        year === "Все годы" ||
        (year === "2024" && g.year === 2024) ||
        (year === "2023" && g.year === 2023) ||
        (year === "2022" && g.year === 2022) ||
        (year === "До 2020" && g.year < 2020);
      const matchRating =
        minRating === "Любой рейтинг" ||
        (minRating === "4.5+" && g.rating >= 4.5) ||
        (minRating === "4.0+" && g.rating >= 4.0) ||
        (minRating === "3.0+" && g.rating >= 3.0);
      return matchSearch && matchGenre && matchPlatform && matchYear && matchRating;
    })
    .sort((a, b) => {
      if (sort === "По рейтингу") return b.rating - a.rating;
      if (sort === "По популярности") return b.ratingsCount - a.ratingsCount;
      return b.year - a.year;
    });

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-1">Каталог игр</h1>
        <p className="text-muted-foreground">Все оцененные игры платформы</p>
      </div>

      <div className="flex gap-3 mb-6 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Icon name="Search" size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по названию..."
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            { label: "Жанр", value: genre, options: GENRES, set: setGenre },
            { label: "Платформа", value: platform, options: PLATFORMS, set: setPlatform },
            { label: "Год", value: year, options: YEARS, set: setYear },
            { label: "Рейтинг", value: minRating, options: RATINGS, set: setMinRating },
            { label: "Сортировка", value: sort, options: ["По рейтингу", "По популярности", "По новизне"], set: setSort },
          ].map(({ value, options, set }) => (
            <select
              key={value + options[0]}
              value={value}
              onChange={(e) => set(e.target.value)}
              className="bg-card border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {options.map((o) => <option key={o}>{o}</option>)}
            </select>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">Найдено: {filtered.length} игр</p>
        {(genre !== "Все" || platform !== "Все" || year !== "Все годы" || minRating !== "Любой рейтинг") && (
          <button
            onClick={() => { setGenre("Все"); setPlatform("Все"); setYear("Все годы"); setMinRating("Любой рейтинг"); }}
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            <Icon name="X" size={13} /> Сбросить фильтры
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filtered.map((game, i) => (
          <GameCard key={game.id} game={game} onClick={() => onGameClick(game.id)} index={i} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 text-muted-foreground">
            <Icon name="Search" size={48} className="mx-auto mb-3 opacity-30" />
            <p>По вашему запросу ничего не найдено</p>
            <button onClick={() => setSearch("")} className="text-primary text-sm mt-2 hover:underline">
              Сбросить поиск
            </button>
          </div>
        )}
      </div>
    </div>
  );
}