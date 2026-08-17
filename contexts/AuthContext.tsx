import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getAccessToken, getRefreshToken, clearTokens } from '../services/tokenStorage';
import { saveCustomer, getCustomer, clearCustomer } from '../services/customerStorage';
import { logout as logoutApi, type AuthCustomer } from '../services/authApi';
import { queryClient } from '../services/queryClient';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextValue {
  status: AuthStatus;
  customer: AuthCustomer | null;
  signIn: (customer: AuthCustomer) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Bottom tabs (Chat/Bookings/Profile) only mount once this resolves to
// 'authenticated' — see App.tsx. Presence of a stored token is treated as
// "logged in" since there's no token-refresh-on-expiry flow yet; that's a
// tracked follow-up (WEBAPP-CHANGES-NEEDED.md).
const MIN_SPLASH_MS = 1500;

async function loadSession(): Promise<{ loggedIn: boolean; customer: AuthCustomer | null }> {
  const [accessToken, refreshToken, customer] = await Promise.all([
    getAccessToken(),
    getRefreshToken(),
    getCustomer(),
  ]);
  return { loggedIn: Boolean(accessToken || refreshToken), customer };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [customer, setCustomer] = useState<AuthCustomer | null>(null);

  useEffect(() => {
    let cancelled = false;
    const minDelay = new Promise((resolve) => setTimeout(resolve, MIN_SPLASH_MS));

    Promise.all([loadSession(), minDelay]).then(([session]) => {
      if (!cancelled) {
        setCustomer(session.customer);
        setStatus(session.loggedIn ? 'authenticated' : 'unauthenticated');
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      customer,
      signIn: (nextCustomer: AuthCustomer) => {
        setCustomer(nextCustomer);
        saveCustomer(nextCustomer).catch(() => {
          // Best-effort persistence — the customer stays in memory for this
          // session either way (see customerStorage.ts's in-memory fallback).
        });
        setStatus('authenticated');
      },
      signOut: async () => {
        const refreshToken = await getRefreshToken();
        if (refreshToken) {
          await logoutApi({ refreshToken }).catch(() => {
            // Logout is best-effort server-side (refresh token may already be
            // expired/revoked) — always clear local state regardless.
          });
        }
        await Promise.all([clearTokens(), clearCustomer()]);
        // Drop any cached/in-flight queries fetched under the old session —
        // otherwise a stale query can refetch in the background using the
        // token that was just cleared (harmless today, but on a shared
        // device a next login could otherwise briefly see cached data from
        // the previous account once endpoints return personalized data).
        queryClient.clear();
        setCustomer(null);
        setStatus('unauthenticated');
      },
    }),
    [status, customer]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
