import * as SecureStore from 'expo-secure-store';
import type { AuthCustomer } from './authApi';

const CUSTOMER_KEY = 'chillmama_customer';

// Mirrors tokenStorage.ts's safe-storage pattern (SecureStore + in-memory
// fallback for web, where SecureStore has no implementation at all) — kept
// as a separate small store since this holds the logged-in customer's
// name/email for display (Profile screen), not sensitive session tokens.
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

export async function saveCustomer(customer: AuthCustomer): Promise<void> {
  await safeSet(CUSTOMER_KEY, JSON.stringify(customer));
}

export async function getCustomer(): Promise<AuthCustomer | null> {
  const raw = await safeGet(CUSTOMER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthCustomer;
  } catch {
    return null;
  }
}

export async function clearCustomer(): Promise<void> {
  await safeDelete(CUSTOMER_KEY);
}
