const AUTH_URL = "https://functions.poehali.dev/07358a34-50b9-4ed0-a5d7-14ebcb21e1c1";

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  level: "novice" | "amateur" | "expert" | "guru";
  xp: number;
  coins: number;
  ratingsCount: number;
  reviewsCount: number;
}

function getToken(): string {
  return localStorage.getItem("gr_token") || "";
}

function setToken(token: string) {
  localStorage.setItem("gr_token", token);
}

function clearToken() {
  localStorage.removeItem("gr_token");
}

export async function register(username: string, email: string, password: string): Promise<{ user: AuthUser; token: string }> {
  const res = await fetch(`${AUTH_URL}?action=register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка регистрации");
  setToken(data.token);
  return data;
}

export async function login(email: string, password: string): Promise<{ user: AuthUser; token: string }> {
  const res = await fetch(`${AUTH_URL}?action=login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка входа");
  setToken(data.token);
  return data;
}

export async function getMe(): Promise<AuthUser | null> {
  const token = getToken();
  if (!token) return null;
  const res = await fetch(`${AUTH_URL}?action=me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    clearToken();
    return null;
  }
  const data = await res.json();
  return data.user;
}

export async function logout(): Promise<void> {
  const token = getToken();
  if (token) {
    await fetch(`${AUTH_URL}?action=logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  clearToken();
}
