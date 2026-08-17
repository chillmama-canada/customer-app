import type { AxiosError } from 'axios';
import { api } from './api';

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconUrl: string | null;
}

export interface UpcomingBooking {
  id: string;
  helperName: string;
  helperPhotoUrl: string | null;
  serviceTitle: string;
  scheduledAt: string;
  address: string | null;
  amountCad: number;
  status: string;
}

export interface SlotsResult {
  serviceId: string;
  serviceTitle: string;
  helperId: string;
  helperName: string;
  durationMinutes: number;
  slots: string[];
  offset: number;
  hasMore: boolean;
}

export interface CreateBookingPayload {
  serviceId: string;
  scheduledAt: string;
}

export interface CreatedBooking {
  id: string;
  helperName: string;
  serviceTitle: string;
  scheduledAt: string;
  endsAt: string | null;
  amountCad: number;
  status: string;
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

export class BookingsApiError extends Error {}

const FALLBACK_ERROR_MESSAGE = 'Something went wrong. Please try again.';

async function get<T>(path: string): Promise<T> {
  try {
    const response = await api.get<ApiSuccessBody<T>>(path);
    return response.data.data;
  } catch (err) {
    const axiosError = err as AxiosError<ApiErrorBody>;
    throw new BookingsApiError(axiosError.response?.data?.error ?? FALLBACK_ERROR_MESSAGE);
  }
}

async function post<T>(path: string, payload: unknown): Promise<T> {
  try {
    const response = await api.post<ApiSuccessBody<T>>(path, payload);
    return response.data.data;
  } catch (err) {
    const axiosError = err as AxiosError<ApiErrorBody>;
    throw new BookingsApiError(axiosError.response?.data?.error ?? FALLBACK_ERROR_MESSAGE);
  }
}

export function getCategories(): Promise<Category[]> {
  return get<Category[]>('/api/mobile/categories');
}

export function getUpcomingBookings(): Promise<UpcomingBooking[]> {
  return get<UpcomingBooking[]>('/api/mobile/bookings/upcoming');
}

export function getSlots(serviceId: string, offset = 0): Promise<SlotsResult> {
  return get<SlotsResult>(`/api/mobile/bookings/slots?serviceId=${serviceId}&offset=${offset}`);
}

export function createBooking(payload: CreateBookingPayload): Promise<CreatedBooking> {
  return post<CreatedBooking>('/api/mobile/bookings', payload);
}
