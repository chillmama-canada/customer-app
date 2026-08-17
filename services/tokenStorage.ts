import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'chillmama_access_token';
const REFRESH_TOKEN_KEY = 'chillmama_refresh_token';

// expo-secure-store has no web implementation at all (every call throws) —
// the app only ships on Android/iOS, but without a fallback that means
// tokens saved on web vanish immediately and every authenticated request
// silently drops its Authorization header for the rest of the session, not
// just across reloads. This in-memory cache keeps a web session usable
// (matches what a real web build would want anyway); on native it's just a
// redundant mirror of SecureStore, which remains the durable store there.
const memoryCache = new Map<string, string>();

async function safeGet(key: string): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (err) {
    console.warn(`SecureStore read failed for "${key}", using in-memory fallback`, err);
    return memoryCache.get(key) ?? null;
  }
}

async function safeSet(key: string, value: string): Promise<void> {
  memoryCache.set(key, value);
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (err) {
    console.warn(`SecureStore write failed for "${key}", kept in memory only`, err);
  }
}

async function safeDelete(key: string): Promise<void> {
  memoryCache.delete(key);
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (err) {
    console.warn(`SecureStore delete failed for "${key}"`, err);
  }
}

export async function saveTokens(accessToken: string, refreshToken: string): Promise<void> {
  await Promise.all([safeSet(ACCESS_TOKEN_KEY, accessToken), safeSet(REFRESH_TOKEN_KEY, refreshToken)]);
}

export function getAccessToken(): Promise<string | null> {
  return safeGet(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): Promise<string | null> {
  return safeGet(REFRESH_TOKEN_KEY);
}

export async function clearTokens(): Promise<void> {
  await Promise.all([safeDelete(ACCESS_TOKEN_KEY), safeDelete(REFRESH_TOKEN_KEY)]);
}
