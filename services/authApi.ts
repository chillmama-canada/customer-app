import type { AxiosError } from 'axios';
import { api } from './api';

export interface AuthCustomer {
  id: string;
  name: string;
  email: string;
}

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  customer: AuthCustomer;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface RegisterResult {
  email: string;
  otpExpiresAt: string;
  // Only present outside the backend's production environment — lets the
  // app self-test registration without a real email provider configured.
  debugOtp?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface ResendOtpPayload {
  email: string;
}

export interface ResendOtpResult {
  email: string;
  otpExpiresAt: string;
  debugOtp?: string;
}

export interface LogoutPayload {
  refreshToken: string;
}

interface ApiSuccessBody<T> {
  success: true;
  data: T;
  message?: string;
}

interface ApiErrorBody {
  success: false;
  error: string;
}

export class AuthApiError extends Error {}

const FALLBACK_ERROR_MESSAGE = 'Something went wrong. Please try again.';

async function post<T>(path: string, payload: unknown): Promise<T> {
  try {
    const response = await api.post<ApiSuccessBody<T>>(path, payload);
    return response.data.data;
  } catch (err) {
    const axiosError = err as AxiosError<ApiErrorBody>;
    const message = axiosError.response?.data?.error ?? FALLBACK_ERROR_MESSAGE;
    throw new AuthApiError(message);
  }
}

// Step 1 of registration — creates a pending registration and emails a
// 6-digit OTP. No account exists yet, so this doesn't return tokens.
export function register(payload: RegisterPayload): Promise<RegisterResult> {
  return post<RegisterResult>('/api/mobile/auth/register', payload);
}

// Step 2 — confirming the OTP is what actually creates the account.
export function verifyOtp(payload: VerifyOtpPayload): Promise<AuthResult> {
  return post<AuthResult>('/api/mobile/auth/verify-otp', payload);
}

export function resendOtp(payload: ResendOtpPayload): Promise<ResendOtpResult> {
  return post<ResendOtpResult>('/api/mobile/auth/resend-otp', payload);
}

export function login(payload: LoginPayload): Promise<AuthResult> {
  return post<AuthResult>('/api/mobile/auth/login', payload);
}

// Always succeeds server-side, even for an already-revoked/unknown token.
export function logout(payload: LogoutPayload): Promise<null> {
  return post<null>('/api/mobile/auth/logout', payload);
}
