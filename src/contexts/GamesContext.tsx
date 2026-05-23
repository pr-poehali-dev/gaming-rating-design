import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { fetchGames, fetchMyRatings, ApiGame } from "@/lib/games";
import { GAMES as STATIC_GAMES, Game } from "@/data/games";

interface GamesContextValue {
  games: Game[];
  myRatings: Record<number, number>;
  loading: boolean;
  refresh: () => Promise<void>;
  updateGameRating: (gameId: number, newRating: number, newCount: number) => void;
  setMyRating: (gameId: number, rating: number) => void;
}

const GamesContext = createContext<GamesContextValue | null>(null);

export function GamesProvider({ children }: { children: ReactNode }) {
  const [games, setGames] = useState<Game[]>(STATIC_GAMES);
  const [myRatings, setMyRatings] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const apiGames = await fetchGames();
      if (apiGames.length > 0) {
        // Объединяем API-данные со статическими (платформы, теги и т.п.)
        const merged: Game[] = apiGames.map((api: ApiGame) => {
          const stat = STATIC_GAMES.find((g) => g.id === api.id);
          return {
            id: api.id,
            title: api.title,
            genre: api.genre,
            year: api.year,
            publisher: api.publisher,
            cover: api.cover,
            description: api.description,
            rating: api.rating > 0 ? api.rating : (stat?.rating || 0),
            ratingsCount: api.ratingsCount > 0 ? api.ratingsCount : (stat?.ratingsCount || 0),
            platform: stat?.platform || ["PC"],
            tags: stat?.tags || [],
            ratingDistribution: stat?.ratingDistribution || [0, 0, 0, 0, 0],
            systemRequirements: stat?.systemRequirements,
          };
        });
        setGames(merged);
      }
      const myR = await fetchMyRatings();
      const map: Record<number, number> = {};
      myR.forEach((r) => { map[r.gameId] = r.rating; });
      setMyRatings(map);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateGameRating = (gameId: number, newRating: number, newCount: number) => {
    setGames((prev) => prev.map((g) =>
      g.id === gameId ? { ...g, rating: newRating, ratingsCount: newCount } : g
    ));
  };

  const setMyRating = (gameId: number, rating: number) => {
    setMyRatings((prev) => ({ ...prev, [gameId]: rating }));
  };

  return (
    <GamesContext.Provider value={{ games, myRatings, loading, refresh, updateGameRating, setMyRating }}>
      {children}
    </GamesContext.Provider>
  );
}

export function useGames() {
  const ctx = useContext(GamesContext);
  if (!ctx) throw new Error("useGames must be used inside GamesProvider");
  return ctx;
}
