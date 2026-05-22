import { useState } from "react";
import StarRating from "@/components/StarRating";
import Icon from "@/components/ui/icon";
import { GAMES } from "@/data/games";

const COMPARE_CRITERIA = ["Графика", "Геймплей", "Сюжет", "Звук", "Атмосфера"];

const GAME_CRITERIA_SCORES: Record<number, number[]> = {
  1: [5, 5, 5, 4, 5],
  2: [5, 4, 3, 4, 4],
  3: [4, 5, 3, 4, 5],
  4: [3, 4, 4, 5, 5],
  5: [5, 4, 4, 4, 5],
  6: [3, 5, 4, 3, 3],
};

export default function RatingsPage() {
  const [compareA, setCompareA] = useState<number | null>(1);
  const [compareB, setCompareB] = useState<number | null>(5);
  const [compareC, setCompareC] = useState<number | null>(null);

  const gameA = GAMES.find((g) => g.id === compareA);
  const gameB = GAMES.find((g) => g.id === compareB);
  const gameC = compareC ? GAMES.find((g) => g.id === compareC) : null;

  const sorted = [...GAMES].sort((a, b) => b.rating - a.rating);

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-1">Рейтинги</h1>
        <p className="text-muted-foreground">Топ игр платформы и режим сравнения.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div>
          <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
            <span>📊</span> Топ игр всех времён
          </h2>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {sorted.map((game, i) => (
              <div key={game.id} className={`flex items-center gap-4 px-5 py-4 hover:bg-secondary/40 transition-all ${i < sorted.length - 1 ? "border-b border-border" : ""}`}>
                <span className={`font-display font-black text-2xl w-8 text-center ${
                  i === 0 ? "text-amber-400" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-700" : "text-muted-foreground"
                }`}>
                  {i + 1}
                </span>
                <img src={game.cover} alt={game.title} className="w-14 h-14 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{game.title}</p>
                  <p className="text-xs text-muted-foreground">{game.genre} · {game.year}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={game.rating} size="sm" />
                    <span className="text-xs text-muted-foreground">{(game.ratingsCount / 1000).toFixed(1)}k оценок</span>
                  </div>
                </div>
                <span className="font-display font-bold text-xl">{game.rating}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
            <span>⚖️</span> Сравнение игр
          </h2>

          <div className="bg-card border border-border rounded-2xl p-5 mb-4">
            <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider">Выбери игры для сравнения</p>
            <div className="flex gap-2 flex-wrap">
              {[
                { label: "Игра A", value: compareA, set: setCompareA },
                { label: "Игра B", value: compareB, set: setCompareB },
                { label: "+ Добавить C", value: compareC, set: setCompareC },
              ].map(({ label, value, set }) => (
                <div key={label} className="flex-1 min-w-36">
                  <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
                  <select
                    value={value ?? ""}
                    onChange={(e) => set(e.target.value ? Number(e.target.value) : null)}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">—</option>
                    {GAMES.map((g) => (
                      <option key={g.id} value={g.id}>{g.title}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {(gameA || gameB || gameC) && (
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="grid border-b border-border" style={{ gridTemplateColumns: `140px repeat(${[gameA, gameB, gameC].filter(Boolean).length}, 1fr)` }}>
                <div className="p-3"></div>
                {[gameA, gameB, gameC].filter(Boolean).map((g) => (
                  <div key={g!.id} className="p-3 text-center border-l border-border">
                    <img src={g!.cover} alt={g!.title} className="w-12 h-12 rounded-xl object-cover mx-auto mb-1.5" />
                    <p className="text-xs font-semibold leading-tight">{g!.title}</p>
                    <p className="text-xs text-amber-400 font-bold mt-0.5">{g!.rating} ★</p>
                  </div>
                ))}
              </div>

              {COMPARE_CRITERIA.map((criterion, ci) => (
                <div
                  key={criterion}
                  className={`grid border-b border-border ${ci % 2 === 0 ? "" : "bg-secondary/30"}`}
                  style={{ gridTemplateColumns: `140px repeat(${[gameA, gameB, gameC].filter(Boolean).length}, 1fr)` }}
                >
                  <div className="p-3 text-xs font-medium text-muted-foreground flex items-center">{criterion}</div>
                  {[gameA, gameB, gameC].filter(Boolean).map((g) => {
                    const score = GAME_CRITERIA_SCORES[g!.id]?.[ci] ?? 3;
                    return (
                      <div key={g!.id} className="p-3 border-l border-border flex flex-col items-center gap-1">
                        <span className="font-display font-bold text-sm">{score}/5</span>
                        <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${score / 5 * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}

              <div
                className="grid"
                style={{ gridTemplateColumns: `140px repeat(${[gameA, gameB, gameC].filter(Boolean).length}, 1fr)` }}
              >
                <div className="p-3 text-xs font-bold text-muted-foreground flex items-center">Итого</div>
                {[gameA, gameB, gameC].filter(Boolean).map((g) => (
                  <div key={g!.id} className="p-3 border-l border-border flex items-center justify-center">
                    <span className="font-display font-black text-xl text-primary">{g!.rating}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
          <span>🗺️</span> Интерактивная карта жанров
        </h2>
        <p className="text-sm text-muted-foreground mb-5">Визуализация связей между жанрами по отзывам пользователей</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { genre: "RPG", related: ["Экшен", "Приключения"], gamesCount: 12, avgRating: 4.6, color: "bg-purple-500/10 border-purple-500/30 text-purple-600" },
            { genre: "Шутер", related: ["Экшен", "Стратегия"], gamesCount: 8, avgRating: 4.3, color: "bg-orange-500/10 border-orange-500/30 text-orange-600" },
            { genre: "Приключения", related: ["RPG", "Хоррор"], gamesCount: 15, avgRating: 4.4, color: "bg-green-500/10 border-green-500/30 text-green-600" },
            { genre: "Хоррор", related: ["Приключения"], gamesCount: 6, avgRating: 4.1, color: "bg-red-500/10 border-red-500/30 text-red-600" },
            { genre: "Экшен", related: ["RPG", "Шутер"], gamesCount: 10, avgRating: 4.5, color: "bg-blue-500/10 border-blue-500/30 text-blue-600" },
            { genre: "Стратегия", related: ["Шутер"], gamesCount: 7, avgRating: 4.2, color: "bg-cyan-500/10 border-cyan-500/30 text-cyan-600" },
            { genre: "Инди", related: ["Приключения", "RPG"], gamesCount: 20, avgRating: 4.4, color: "bg-pink-500/10 border-pink-500/30 text-pink-600" },
            { genre: "Симулятор", related: ["Стратегия"], gamesCount: 5, avgRating: 4.0, color: "bg-yellow-500/10 border-yellow-500/30 text-yellow-600" },
          ].map((item) => (
            <div key={item.genre} className={`border rounded-2xl p-4 cursor-pointer hover:scale-105 transition-all ${item.color}`}>
              <h3 className="font-display font-bold mb-1">{item.genre}</h3>
              <p className="text-xs opacity-70 mb-2">{item.gamesCount} игр</p>
              <p className="text-lg font-display font-black">{item.avgRating} ★</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {item.related.map((r) => (
                  <span key={r} className="text-xs bg-background/60 px-1.5 py-0.5 rounded-full opacity-80">{r}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
