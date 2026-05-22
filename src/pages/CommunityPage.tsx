import { useState } from "react";
import Icon from "@/components/ui/icon";
import LevelBadge from "@/components/LevelBadge";
import { LEADERBOARD } from "@/data/games";

const TABS = ["Глобальный топ", "Этот месяц", "По жанрам"];
const GENRES_FILTER = ["Все жанры", "RPG", "Шутер", "Стратегия", "Хоррор", "Экшен"];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("Глобальный топ");
  const [genreFilter, setGenreFilter] = useState("Все жанры");

  const podium = LEADERBOARD.slice(0, 3);
  const rest = LEADERBOARD.slice(3);

  const MEDAL_ICONS = ["🥇", "🥈", "🥉"];
  const MEDAL_BG = [
    "bg-amber-400/10 border-amber-400/40",
    "bg-gray-300/10 border-gray-400/40",
    "bg-amber-700/10 border-amber-700/30",
  ];

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-1">Сообщество</h1>
        <p className="text-muted-foreground">Лучшие рецензенты платформы. Твоё место в рейтинге — в твоих руках.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <div className="flex gap-1 bg-secondary p-1 rounded-xl">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "По жанрам" && (
          <div className="flex gap-1 flex-wrap">
            {GENRES_FILTER.map((g) => (
              <button
                key={g}
                onClick={() => setGenreFilter(g)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  genreFilter === g ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {podium.map((entry, i) => (
          <div
            key={entry.userId}
            className={`border rounded-2xl p-5 text-center ${MEDAL_BG[i]} ${entry.isCurrentUser ? "ring-2 ring-primary" : ""}`}
          >
            <div className="text-4xl mb-2">{MEDAL_ICONS[i]}</div>
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary text-xl font-bold font-display mx-auto mb-3">
              {entry.name[0]}
            </div>
            <h3 className="font-display font-bold text-lg">{entry.name}</h3>
            {entry.isCurrentUser && <span className="text-xs text-primary font-medium">Это ты!</span>}
            <div className="mt-2 mb-3">
              <LevelBadge level={entry.level} size="md" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-background/60 rounded-xl p-2">
                <p className="font-display font-bold">{(entry.xp / 1000).toFixed(1)}k</p>
                <p className="text-xs text-muted-foreground">XP</p>
              </div>
              <div className="bg-background/60 rounded-xl p-2">
                <p className="font-display font-bold">{entry.reviewsCount}</p>
                <p className="text-xs text-muted-foreground">Отзывов</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <Icon name="List" size={16} className="text-muted-foreground" />
          <h2 className="font-display font-bold">Топ рецензентов</h2>
        </div>
        <div className="divide-y divide-border">
          {rest.map((entry) => (
            <div
              key={entry.userId}
              className={`flex items-center gap-4 px-6 py-4 hover:bg-secondary/40 transition-all ${entry.isCurrentUser ? "bg-primary/5" : ""}`}
            >
              <span className="font-display font-bold text-muted-foreground w-6 text-center">{entry.position}</span>
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary font-bold">
                {entry.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{entry.name}</span>
                  {entry.isCurrentUser && <span className="text-xs text-primary font-medium">(ты)</span>}
                  <LevelBadge level={entry.level} />
                </div>
                <p className="text-xs text-muted-foreground">{entry.reviewsCount} отзывов · {entry.achievements} достижений</p>
              </div>
              <div className="text-right">
                <p className="font-display font-bold text-sm">{entry.xp.toLocaleString()} XP</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
            <span>📚</span> Тематические подборки
          </h3>
          <div className="space-y-3">
            {[
              { title: "10 игр с открытым миром", author: "DragonSlayer_X", likes: 234 },
              { title: "Лучшие инди 2024", author: "NightRaider_Pro", likes: 187 },
              { title: "Хорроры, которые реально пугают", author: "QuantumGhost", likes: 156 },
            ].map((list, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary transition-all cursor-pointer">
                <div>
                  <p className="text-sm font-medium">{list.title}</p>
                  <p className="text-xs text-muted-foreground">от {list.author}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Icon name="Heart" size={13} />
                  {list.likes}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
            <span>🗓️</span> Календарь релизов
          </h3>
          <div className="space-y-3">
            {[
              { title: "Тени Прошлого", date: "28 мая 2025", genre: "RPG" },
              { title: "Звёздный Рубеж 2", date: "15 июня 2025", genre: "Шутер" },
              { title: "Последний Оплот", date: "3 июля 2025", genre: "Стратегия" },
            ].map((rel, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-all">
                <div className="bg-primary/10 text-primary rounded-xl p-2 text-center min-w-12">
                  <Icon name="Calendar" size={16} className="mx-auto" />
                </div>
                <div>
                  <p className="text-sm font-medium">{rel.title}</p>
                  <p className="text-xs text-muted-foreground">{rel.date} · {rel.genre}</p>
                </div>
                <button className="ml-auto text-xs text-primary font-medium hover:underline">
                  Напомнить
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
