const REVIEWS_URL = "https://functions.poehali.dev/496fa42d-3878-4361-8ea7-9d1145b80a69";

export interface ApiReview {
  id: number;
  userId: number;
  userName: string;
  userLevel: "novice" | "amateur" | "expert" | "guru";
  userXp: number;
  rating: number;
  text: string;
  criteria: { graphics: number; gameplay: number; story: number; sound: number };
  date: string;
  helpful: number;
  notHelpful: number;
  myVote: "helpful" | "not" | null;
  isMine: boolean;
}

function getToken(): string {
  return localStorage.getItem("gr_token") || "";
}

export async function fetchReviews(gameId: number): Promise<ApiReview[]> {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${REVIEWS_URL}?action=list&gameId=${gameId}`, { headers });
  if (!res.ok) return [];
  const data = await res.json();
  return data.reviews || [];
}

export async function createReview(
  gameId: number,
  rating: number,
  text: string,
  criteria: Record<string, number>,
): Promise<{ ok: boolean; xpGained: number; isNew: boolean }> {
  const token = getToken();
  if (!token) throw new Error("Войдите, чтобы оставлять отзывы");
  const res = await fetch(`${REVIEWS_URL}?action=create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ gameId, rating, text, criteria }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка");
  return data;
}

export async function voteReview(
  reviewId: number,
  isHelpful: boolean,
): Promise<{ helpful: number; notHelpful: number }> {
  const token = getToken();
  if (!token) throw new Error("Войдите, чтобы голосовать");
  const res = await fetch(`${REVIEWS_URL}?action=vote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ reviewId, isHelpful }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка");
  return data;
}
