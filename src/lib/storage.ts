const TOKEN_KEY = "electro-pi-token";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getStoredToken(): string | null {
  if (!isBrowser()) return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Storage full or unavailable — non-critical
  }
}

export function clearStoredToken(): void {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}
