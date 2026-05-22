import Icon from "@/components/ui/icon";
import { CHALLENGES } from "@/data/games";

export default function ChallengesPage() {
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-1">Челленджи</h1>
        <p className="text-muted-foreground">Выполняй задания, зарабатывай XP и уникальные значки.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {CHALLENGES.map((ch, i) => {
          const pct = (ch.progress / ch.progressMax) * 100;
          const done = ch.progress >= ch.progressMax;
          const GENRE_COLORS: Record<string, string> = {
            "Хоррор": "from-red-900/30 to-red-800/5",
            "Ретро": "from-amber-900/20 to-amber-800/5",
            "Инди": "from-purple-900/20 to-purple-800/5",
          };

          return (
            <div
              key={ch.id}
              className={`bg-card border border-border rounded-2xl overflow-hidden animate-slide-up opacity-0 stagger-${i + 1}`}
              style={{ animationFillMode: 'forwards' }}
            >
              <div className={`bg-gradient-to-br ${GENRE_COLORS[ch.genre] || "from-primary/10 to-background"} p-6 border-b border-border`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{ch.genre}</span>
                    <h3 className="font-display text-xl font-bold mt-0.5">{ch.title}</h3>
                  </div>
                  {done && <span className="text-2xl">✅</span>}
                </div>
                <p className="text-sm text-muted-foreground">{ch.description}</p>
              </div>

              <div className="p-5">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Target" size={14} className="text-primary" />
                    <span className="text-sm font-medium">{ch.goal}</span>
                  </div>
                  <div className="h-2 bg-border rounded-full overflow-hidden mb-1">
                    <div
                      className={`h-full rounded-full transition-all ${done ? "bg-green-500" : "bg-primary"}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Прогресс: {ch.progress}/{ch.progressMax}</span>
                    <span>{Math.round(pct)}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-secondary rounded-xl p-2.5 text-center">
                    <p className="text-sm font-display font-bold text-primary">+{ch.xpReward}</p>
                    <p className="text-xs text-muted-foreground">XP</p>
                  </div>
                  <div className="bg-secondary rounded-xl p-2.5 text-center">
                    <p className="text-sm font-display font-bold text-amber-500">+{ch.coinsReward}</p>
                    <p className="text-xs text-muted-foreground">Монеты</p>
                  </div>
                  <div className="bg-secondary rounded-xl p-2.5 text-center">
                    <p className="text-xs font-bold leading-tight">{ch.badgeName}</p>
                    <p className="text-xs text-muted-foreground">Значок</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Icon name="Users" size={13} />
                    {ch.participants.toLocaleString()} участников
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="Clock" size={13} />
                    до {ch.endDate}
                  </div>
                </div>

                <button
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    done
                      ? "bg-green-500/15 text-green-600 cursor-default"
                      : "bg-primary text-primary-foreground hover:opacity-90"
                  }`}
                >
                  {done ? "✓ Выполнено!" : "Участвовать"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 mb-8">
        <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
          <span>🏆</span> Сезонные лиги
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "Бронзовая лига", players: 1240, minXp: 0, maxXp: 1000, color: "text-amber-700 border-amber-700/30 bg-amber-700/5" },
            { name: "Серебряная лига", players: 543, minXp: 1000, maxXp: 5000, color: "text-gray-400 border-gray-400/30 bg-gray-400/5" },
            { name: "Золотая лига", players: 89, minXp: 5000, maxXp: null, color: "text-amber-400 border-amber-400/30 bg-amber-400/5" },
          ].map((league) => (
            <div key={league.name} className={`border rounded-2xl p-4 ${league.color}`}>
              <h3 className="font-display font-bold mb-1">{league.name}</h3>
              <p className="text-xs mb-2">{league.players} игроков</p>
              <p className="text-xs opacity-70">
                {league.minXp.toLocaleString()}+ XP
                {league.maxXp && ` — до ${league.maxXp.toLocaleString()} XP`}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <span className="text-4xl">🗳️</span>
          <div>
            <h2 className="font-display text-xl font-bold mb-1">Голосование за тему месяца</h2>
            <p className="text-sm text-muted-foreground mb-4">Выбери жанр следующего месяца — победитель получит двойные XP!</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { genre: "Выживание", votes: 342, pct: 38 },
                { genre: "JRPG", votes: 287, pct: 32 },
                { genre: "Метроидвания", votes: 176, pct: 20 },
                { genre: "Визуальная новелла", votes: 89, pct: 10 },
              ].map((opt) => (
                <button key={opt.genre} className="text-left p-3 bg-background border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all">
                  <p className="text-sm font-semibold mb-1">{opt.genre}</p>
                  <div className="h-1 bg-border rounded-full overflow-hidden mb-1">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${opt.pct}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground">{opt.votes} голосов</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
