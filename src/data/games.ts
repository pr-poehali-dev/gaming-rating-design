export interface Game {
  id: number;
  title: string;
  genre: string;
  year: number;
  publisher: string;
  platform: string[];
  rating: number;
  ratingsCount: number;
  cover: string;
  description: string;
  tags: string[];
  ratingDistribution: number[];
  systemRequirements?: {
    min: string;
    rec: string;
  };
}

export interface Review {
  id: number;
  gameId: number;
  userId: number;
  userName: string;
  userLevel: 'novice' | 'amateur' | 'expert' | 'guru';
  userXp: number;
  rating: number;
  text: string;
  date: string;
  helpful: number;
  notHelpful: number;
  criteria: { graphics: number; gameplay: number; story: number; sound: number };
}

export interface User {
  id: number;
  name: string;
  level: 'novice' | 'amateur' | 'expert' | 'guru';
  xp: number;
  xpMax: number;
  coins: number;
  ratingsCount: number;
  reviewsCount: number;
  helpfulPercent: number;
  voteWeight: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: number;
  name: string;
  icon: string;
  description: string;
  earned: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
  goal: string;
  progress: number;
  progressMax: number;
  xpReward: number;
  coinsReward: number;
  badgeName: string;
  endDate: string;
  participants: number;
  genre: string;
}

export interface LeaderEntry {
  position: number;
  userId: number;
  name: string;
  level: 'novice' | 'amateur' | 'expert' | 'guru';
  xp: number;
  reviewsCount: number;
  achievements: number;
  isCurrentUser?: boolean;
}

export const GAMES: Game[] = [
  {
    id: 1,
    title: "Хроники Пустоты",
    genre: "RPG",
    year: 2024,
    publisher: "Dark Nexus Studios",
    platform: ["PC", "PS5", "Xbox"],
    rating: 4.8,
    ratingsCount: 12400,
    cover: "https://cdn.poehali.dev/projects/22300a62-6b08-4ac2-a525-b8bb5fc1cfac/files/3ceba7a9-0802-4e2c-b3ab-681805d2463b.jpg",
    description: "Эпическая RPG в тёмном фэнтезийном мире, где каждое решение имеет последствия. Исследуй Пустоту, собирай артефакты и раскрывай тайны древних богов.",
    tags: ["Открытый мир", "Тёмное фэнтези", "Одиночная игра"],
    ratingDistribution: [2, 3, 5, 22, 68],
    systemRequirements: {
      min: "Intel Core i5-8400, 8 ГБ RAM, GTX 1060",
      rec: "Intel Core i7-10700K, 16 ГБ RAM, RTX 3070"
    }
  },
  {
    id: 2,
    title: "Нова-7",
    genre: "Шутер",
    year: 2024,
    publisher: "Stellar Works",
    platform: ["PC", "PS5"],
    rating: 4.5,
    ratingsCount: 8700,
    cover: "https://cdn.poehali.dev/projects/22300a62-6b08-4ac2-a525-b8bb5fc1cfac/files/3a9f6906-a0cf-4f2f-9475-09970930431f.jpg",
    description: "Космический шутер нового поколения с процедурно генерируемыми галактиками. Командуй флотом и завоёвывай звёздные системы.",
    tags: ["Sci-Fi", "Кооператив", "Тактика"],
    ratingDistribution: [3, 5, 10, 35, 47],
    systemRequirements: {
      min: "AMD Ryzen 5 3600, 8 ГБ RAM, RX 580",
      rec: "AMD Ryzen 7 5800X, 32 ГБ RAM, RX 6700 XT"
    }
  },
  {
    id: 3,
    title: "Дикие Земли",
    genre: "Приключения",
    year: 2023,
    publisher: "Nomad Game Co.",
    platform: ["PC", "PS5", "Xbox", "Switch"],
    rating: 4.7,
    ratingsCount: 21300,
    cover: "https://cdn.poehali.dev/projects/22300a62-6b08-4ac2-a525-b8bb5fc1cfac/files/b34cffe6-443a-4f34-80d4-bb4f78dd84ec.jpg",
    description: "Открытый мир с живой экосистемой. Охоть, строй и выживай в суровых дикой природе вместе с друзьями или в одиночку.",
    tags: ["Выживание", "Кооператив", "Строительство"],
    ratingDistribution: [1, 2, 8, 28, 61],
  },
  {
    id: 4,
    title: "Последний Рассвет",
    genre: "Хоррор",
    year: 2024,
    publisher: "Nightmare Inc.",
    platform: ["PC", "PS5"],
    rating: 4.3,
    ratingsCount: 5600,
    cover: "https://cdn.poehali.dev/projects/22300a62-6b08-4ac2-a525-b8bb5fc1cfac/files/568bc1f6-0dd3-48c4-9408-22539e75f482.jpg",
    description: "Психологический хоррор в заброшенном городе. Ты — последний выживший, и рассвет кажется недостижимым.",
    tags: ["Психологический", "Атмосфера", "Одиночная игра"],
    ratingDistribution: [5, 8, 15, 40, 32],
  },
  {
    id: 5,
    title: "Кибер-Токио",
    genre: "Экшен",
    year: 2023,
    publisher: "Neon Pulse",
    platform: ["PC", "PS5", "Xbox"],
    rating: 4.6,
    ratingsCount: 16800,
    cover: "https://cdn.poehali.dev/projects/22300a62-6b08-4ac2-a525-b8bb5fc1cfac/files/1c2f1b07-1636-4ffe-b1ab-ff3fee58361b.jpg",
    description: "Киберпанк-экшен в мегаполисе будущего. Взламывай системы, модифицируй тело и борись с корпорациями.",
    tags: ["Киберпанк", "Открытый мир", "RPG-элементы"],
    ratingDistribution: [2, 4, 10, 30, 54],
  },
  {
    id: 6,
    title: "Империи и Драконы",
    genre: "Стратегия",
    year: 2023,
    publisher: "Crown Games",
    platform: ["PC"],
    rating: 4.4,
    ratingsCount: 9200,
    cover: "https://cdn.poehali.dev/projects/22300a62-6b08-4ac2-a525-b8bb5fc1cfac/files/2ebdafb7-b4ba-4710-822a-e6f2b53f7ea3.jpg",
    description: "Глобальная стратегия в мире высокого фэнтези. Управляй королевством, дипломатией и армиями драконов.",
    tags: ["Глобальная стратегия", "Фэнтези", "Многопользовательская"],
    ratingDistribution: [3, 6, 12, 38, 41],
  },
];

export const REVIEWS: Review[] = [
  {
    id: 1, gameId: 1, userId: 2, userName: "ShadowHunter_88", userLevel: "guru", userXp: 4850,
    rating: 5, date: "12 мая 2025",
    text: "Безусловный шедевр года. Мир проработан до мелочей, каждый NPC имеет свою историю. Прошёл 3 раза и каждый раз открывал что-то новое. Боевая система — лучшее, что я видел в жанре за последние 5 лет.",
    helpful: 342, notHelpful: 12,
    criteria: { graphics: 5, gameplay: 5, story: 5, sound: 4 }
  },
  {
    id: 2, gameId: 1, userId: 3, userName: "NightOwl_Pro", userLevel: "expert", userXp: 2340,
    rating: 4, date: "8 мая 2025",
    text: "Отличная игра, но с некоторыми техническими проблемами на старте. Теперь, после патчей, всё работает гладко. История захватывает с первых минут.",
    helpful: 187, notHelpful: 23,
    criteria: { graphics: 5, gameplay: 4, story: 5, sound: 4 }
  },
  {
    id: 3, gameId: 1, userId: 4, userName: "RetroGamer99", userLevel: "amateur", userXp: 780,
    rating: 5, date: "3 мая 2025",
    text: "Впервые за долгое время RPG, которая заставила меня забыть о времени. Рекомендую всем любителям жанра!",
    helpful: 94, notHelpful: 5,
    criteria: { graphics: 4, gameplay: 5, story: 5, sound: 5 }
  },
];

export const CURRENT_USER: User = {
  id: 1,
  name: "PixelKnight",
  level: "expert",
  xp: 245,
  xpMax: 500,
  coins: 125,
  ratingsCount: 89,
  reviewsCount: 34,
  helpfulPercent: 85,
  voteWeight: 1.5,
  achievements: [
    { id: 1, name: "Первый отзыв", icon: "✍️", description: "Написал первый отзыв", earned: true, rarity: "common" },
    { id: 2, name: "Аналитик", icon: "🔍", description: "10 подробных отзывов", earned: true, rarity: "rare" },
    { id: 3, name: "Критик", icon: "⭐", description: "50 оценок игр", earned: true, rarity: "rare" },
    { id: 4, name: "Гуру жанра", icon: "🏆", description: "100 оценок в одном жанре", earned: false, rarity: "epic" },
    { id: 5, name: "Легенда", icon: "👑", description: "Топ-10 лидерборда", earned: false, rarity: "legendary" },
    { id: 6, name: "Открыватель", icon: "🗺️", description: "Оценил 5 новинок в день выхода", earned: true, rarity: "common" },
    { id: 7, name: "Инсайдер", icon: "🎯", description: "Бета-тестер", earned: false, rarity: "epic" },
    { id: 8, name: "Хоррор-маньяк", icon: "👻", description: "30 игр в жанре хоррор", earned: false, rarity: "rare" },
  ]
};

export const LEADERBOARD: LeaderEntry[] = [
  { position: 1, userId: 10, name: "DragonSlayer_X", level: "guru", xp: 9820, reviewsCount: 312, achievements: 28 },
  { position: 2, userId: 11, name: "NightRaider_Pro", level: "guru", xp: 8650, reviewsCount: 287, achievements: 24 },
  { position: 3, userId: 12, name: "QuantumGhost", level: "guru", xp: 7940, reviewsCount: 251, achievements: 21 },
  { position: 4, userId: 13, name: "StarForger", level: "expert", xp: 4320, reviewsCount: 143, achievements: 15 },
  { position: 5, userId: 14, name: "IronWill99", level: "expert", xp: 3870, reviewsCount: 128, achievements: 13 },
  { position: 6, userId: 15, name: "CrypticEyes", level: "expert", xp: 3210, reviewsCount: 107, achievements: 11 },
  { position: 7, userId: 16, name: "NeonBlade", level: "expert", xp: 2890, reviewsCount: 95, achievements: 10 },
  { position: 8, userId: 17, name: "SkyWatcher", level: "amateur", xp: 1940, reviewsCount: 64, achievements: 7 },
  { position: 9, userId: 18, name: "RedStorm_21", level: "amateur", xp: 1670, reviewsCount: 55, achievements: 6 },
  { position: 10, userId: 1, name: "PixelKnight", level: "expert", xp: 1245, reviewsCount: 34, achievements: 3, isCurrentUser: true },
];

export const CHALLENGES: Challenge[] = [
  {
    id: 1,
    title: "Неделя хорроров",
    description: "Самое страшное испытание месяца! Окунись в мир ужасов и получи двойные XP за каждый отзыв.",
    goal: "Напиши 3 отзыва на игры в жанре хоррор",
    progress: 2,
    progressMax: 3,
    xpReward: 300,
    coinsReward: 50,
    badgeName: "Хоррор-маньяк",
    endDate: "30 мая 2025",
    participants: 1284,
    genre: "Хоррор"
  },
  {
    id: 2,
    title: "Ретро-ревью",
    description: "Вспомни классику и расскажи о ней новому поколению.",
    goal: "Оцени 5 игр, выпущенных до 2010 года",
    progress: 1,
    progressMax: 5,
    xpReward: 200,
    coinsReward: 30,
    badgeName: "Хранитель памяти",
    endDate: "1 июня 2025",
    participants: 643,
    genre: "Ретро"
  },
  {
    id: 3,
    title: "Инди-первооткрыватель",
    description: "Поддержи независимых разработчиков! Оценивай инди-игры и открывай новые бриллианты.",
    goal: "Напиши отзыв на 2 инди-игры",
    progress: 0,
    progressMax: 2,
    xpReward: 150,
    coinsReward: 25,
    badgeName: "Инди-гуру",
    endDate: "5 июня 2025",
    participants: 891,
    genre: "Инди"
  },
];

export const TOP5_WEEK = [
  { id: 1, title: "Хроники Пустоты", rating: 4.8, change: +0.3, cover: "https://cdn.poehali.dev/projects/22300a62-6b08-4ac2-a525-b8bb5fc1cfac/files/3ceba7a9-0802-4e2c-b3ab-681805d2463b.jpg" },
  { id: 5, title: "Кибер-Токио", rating: 4.6, change: +0.1, cover: "https://cdn.poehali.dev/projects/22300a62-6b08-4ac2-a525-b8bb5fc1cfac/files/1c2f1b07-1636-4ffe-b1ab-ff3fee58361b.jpg" },
  { id: 3, title: "Дикие Земли", rating: 4.7, change: -0.1, cover: "https://cdn.poehali.dev/projects/22300a62-6b08-4ac2-a525-b8bb5fc1cfac/files/b34cffe6-443a-4f34-80d4-bb4f78dd84ec.jpg" },
  { id: 2, title: "Нова-7", rating: 4.5, change: +0.2, cover: "https://cdn.poehali.dev/projects/22300a62-6b08-4ac2-a525-b8bb5fc1cfac/files/3a9f6906-a0cf-4f2f-9475-09970930431f.jpg" },
  { id: 6, title: "Империи и Драконы", rating: 4.4, change: 0, cover: "https://cdn.poehali.dev/projects/22300a62-6b08-4ac2-a525-b8bb5fc1cfac/files/2ebdafb7-b4ba-4710-822a-e6f2b53f7ea3.jpg" },
];
