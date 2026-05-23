const GAMES_URL = "https://functions.poehali.dev/82ea7e79-1cb9-4bef-bd1c-3188a005d76f";

export interface ApiGame {
  id: number;
  title: string;
  genre: string;
  year: number;
  publisher: string;
  cover: string;
  description: string;
  rating: number;
  ratingsCount: number;
}

export interface RateResponse {
  ok: boolean;
  xpGained: number;
  gameRating: number;
  ratingsCount: number;
  isNew: boolean;
}

function getToken(): string {
  return localStorage.getItem("gr_token") || "";
}

export async function fetchGames(): Promise<ApiGame[]> {
  const res = await fetch(`${GAMES_URL}?action=list`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.games || [];
}

export async function fetchMyRatings(): Promise<{ gameId: number; rating: number; comment: string }[]> {
  const token = getToken();
  if (!token) return [];
  const res = await fetch(`${GAMES_URL}?action=userRatings`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.ratings || [];
}

export async function rateGame(
  gameId: number,
  rating: number,
  criteria: Record<string, number>,
  comment: string,
): Promise<RateResponse> {
  const token = getToken();
  if (!token) throw new Error("Войдите, чтобы оценивать");
  const res = await fetch(`${GAMES_URL}?action=rate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ gameId, rating, criteria, comment }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка");
  return data;
}
