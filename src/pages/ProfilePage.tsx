import Icon from "@/components/ui/icon";
import LevelBadge from "@/components/LevelBadge";
import { CURRENT_USER, GAMES } from "@/data/games";
import { AuthUser } from "@/lib/auth";

const LEVEL_LABELS = {
  novice: "Новичок",
  amateur: "Любитель",
  expert: "Эксперт",
  guru: "Гуру",
};

const RARITY_LABELS: Record<string, string> = {
  common: "Обычное",
  rare: "Редкое",
  epic: "Эпическое",
  legendary: "Легендарное",
};

const RARITY_COLORS: Record<string, string> = {
  common: "border-gray-300 dark:border-gray-600",
  rare: "border-blue-400",
  epic: "border-purple-400",
  legendary: "border-amber-400",
};

const ACTIVITY = [
  { type: "rated", text: "Оценил «Хроники Пустоты»", rating: 5, date: "Сегодня", xp: 10 },
  { type: "review", text: "Написал отзыв на «Кибер-Токио»", date: "Вчера", xp: 25 },
  { type: "badge", text: "Получил значок «Аналитик»", date: "3 дня назад", xp: 50 },
  { type: "rated", text: "Оценил «Дикие Земли»", rating: 4, date: "5 дней назад", xp: 10 },
  { type: "challenge", text: "Прошёл 2/3 челленджа «Неделя хорроров»", date: "Неделю назад", xp: 0 },
];

interface ProfilePageProps {
  user: AuthUser | null;
  onOpenAuth: () => void;
}

export default function ProfilePage({ user: authUser, onOpenAuth }: ProfilePageProps) {
  if (!authUser) {
    return (
      <div className="container mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="text-5xl mb-4">🎮</div>
        <h2 className="font-display text-2xl font-bold mb-2">Войдите, чтобы увидеть профиль</h2>
        <p className="text-muted-foreground mb-6">Отслеживайте прогресс, достижения и историю оценок</p>
        <button
          onClick={onOpenAuth}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all"
        >
          Войти / Зарегистрироваться
        </button>
      </div>
    );
  }

  // Мёрджим данные реального пользователя с демо-данными (достижения, активность)
  const user = {
    ...CURRENT_USER,
    name: authUser.username,
    level: authUser.level,
    xp: authUser.xp,
    xpMax: 500,
    coins: authUser.coins,
    ratingsCount: authUser.ratingsCount,
    reviewsCount: authUser.reviewsCount,
  };
  const xpProgress = (user.xp / user.xpMax) * 100;

  const recentGames = GAMES.slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="bg-gradient-to-br from-primary/5 to-background rounded-3xl p-6 md:p-8 mb-8 border border-border">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center text-primary text-3xl font-bold font-display">
              {user.name[0]}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-7 h-7 flex items-center justify-center font-bold">
              💰
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="font-display text-2xl font-bold">{user.name}</h1>
              <LevelBadge level={user.level} size="md" />
            </div>

            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Опыт: {user.xp}/{user.xpMax} XP</span>
                <span>До уровня «Гуру» — {user.xpMax - user.xp} XP</span>
              </div>
              <div className="h-2 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="bg-background/70 rounded-xl px-4 py-2 text-center">
                <p className="text-xl font-display font-bold">{user.ratingsCount}</p>
                <p className="text-xs text-muted-foreground">Оценок</p>
              </div>
              <div className="bg-background/70 rounded-xl px-4 py-2 text-center">
                <p className="text-xl font-display font-bold">{user.reviewsCount}</p>
                <p className="text-xs text-muted-foreground">Отзывов</p>
              </div>
              <div className="bg-background/70 rounded-xl px-4 py-2 text-center">
                <p className="text-xl font-display font-bold">{user.helpfulPercent}%</p>
                <p className="text-xs text-muted-foreground">Полезность</p>
              </div>
              <div className="bg-background/70 rounded-xl px-4 py-2 text-center">
                <p className="text-xl font-display font-bold">×{user.voteWeight}</p>
                <p className="text-xs text-muted-foreground">Вес голоса</p>
              </div>
              <div className="bg-amber-400/15 rounded-xl px-4 py-2 text-center">
                <p className="text-xl font-display font-bold text-amber-600">{user.coins}</p>
                <p className="text-xs text-muted-foreground">Монеты</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="font-display text-lg font-bold mb-4">Достижения ({user.achievements.filter(a => a.earned).length}/{user.achievements.length})</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {user.achievements.map((ach) => (
                <div
                  key={ach.id}
                  title={`${ach.name}: ${ach.description}\n${RARITY_LABELS[ach.rarity]}`}
                  className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all cursor-default ${
                    ach.earned
                      ? `${RARITY_COLORS[ach.rarity]} bg-card`
                      : "border-border bg-secondary/50 opacity-40 grayscale"
                  }`}
                >
                  <span className="text-2xl mb-1">{ach.icon}</span>
                  <span className="text-xs font-medium text-center leading-tight">{ach.name}</span>
                  <span className="text-xs text-muted-foreground mt-0.5">{RARITY_LABELS[ach.rarity]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="font-display text-lg font-bold mb-4">История активности</h2>
            <div className="space-y-3">
              {ACTIVITY.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-secondary transition-all">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                    {item.type === "rated" && <Icon name="Star" size={14} />}
                    {item.type === "review" && <Icon name="MessageSquare" size={14} />}
                    {item.type === "badge" && <Icon name="Award" size={14} />}
                    {item.type === "challenge" && <Icon name="Zap" size={14} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{item.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.date}</p>
                  </div>
                  {item.xp > 0 && (
                    <span className="text-xs text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded-full">+{item.xp} XP</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-4">
            <h3 className="font-display font-semibold mb-4 text-sm">Недавно оцененные игры</h3>
            <div className="space-y-3">
              {recentGames.map((g) => (
                <div key={g.id} className="flex items-center gap-3">
                  <img src={g.cover} alt={g.title} className="w-10 h-10 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{g.title}</p>
                    <p className="text-xs text-muted-foreground">{g.genre}</p>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-400 text-sm">
                    ★ <span className="text-foreground text-xs ml-0.5">4.5</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="TrendingUp" size={16} className="text-primary" />
              <h3 className="font-display font-semibold text-sm">Твой прогресс</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Уровень</span>
                <span className="font-semibold">{LEVEL_LABELS[user.level]}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Ранг на платформе</span>
                <span className="font-semibold">#247</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Любимый жанр</span>
                <span className="font-semibold">RPG</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Среднее время</span>
                <span className="font-semibold">8 мин/отзыв</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}