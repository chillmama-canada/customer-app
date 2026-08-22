import type { AxiosError } from 'axios';
import { api } from './api';

export interface HelperRecommendation {
  id: string;
  name: string;
  photoUrl: string | null;
  rating: number;
  jobsCompleted: number;
  fee: number;
  serviceTitle: string;
  serviceId: string;
  isLiked: boolean;
}

export interface HelperDetail extends HelperRecommendation {
  bio: string | null;
  completionRate: number;
  serviceDescription: string;
  areaName: string | null;
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

export class HelpersApiError extends Error {}

const FALLBACK_ERROR_MESSAGE = 'Something went wrong. Please try again.';

async function get<T>(path: string): Promise<T> {
  try {
    const response = await api.get<ApiSuccessBody<T>>(path);
    return response.data.data;
  } catch (err) {
    const axiosError = err as AxiosError<ApiErrorBody>;
    const message = axiosError.response?.data?.error ?? FALLBACK_ERROR_MESSAGE;
    throw new HelpersApiError(message);
  }
}

async function post<T>(path: string, payload: unknown): Promise<T> {
  try {
    const response = await api.post<ApiSuccessBody<T>>(path, payload);
    return response.data.data;
  } catch (err) {
    const axiosError = err as AxiosError<ApiErrorBody>;
    throw new HelpersApiError(axiosError.response?.data?.error ?? FALLBACK_ERROR_MESSAGE);
  }
}

async function del<T>(path: string): Promise<T> {
  try {
    const response = await api.delete<ApiSuccessBody<T>>(path);
    return response.data.data;
  } catch (err) {
    const axiosError = err as AxiosError<ApiErrorBody>;
    throw new HelpersApiError(axiosError.response?.data?.error ?? FALLBACK_ERROR_MESSAGE);
  }
}

// Not yet filtered by anything the AI chat parses beyond category (service
// date/exclusions/etc.) — see the route's own comment. Liked helpers are
// boosted to the front server-side.
export function getRecommendedHelpers(categoryId?: string): Promise<HelperRecommendation[]> {
  const query = categoryId ? `?categoryId=${categoryId}` : '';
  return get<HelperRecommendation[]>(`/api/mobile/helpers/recommended${query}`);
}

// Helpers this customer has a COMPLETED booking with, for a given category —
// empty means no previous helper, so the chat flow falls through to
// getRecommendedHelpers instead.
export function getPreviousHelpers(categoryId: string): Promise<HelperRecommendation[]> {
  return get<HelperRecommendation[]>(`/api/mobile/helpers/previous?categoryId=${categoryId}`);
}

export function getHelperDetail(id: string): Promise<HelperDetail> {
  return get<HelperDetail>(`/api/mobile/helpers/${id}`);
}

// "Liked helpers" — swiping right on the recommendation deck saves the
// helper's currently-shown service here.
export function getLikedHelpers(): Promise<HelperRecommendation[]> {
  return get<HelperRecommendation[]>('/api/mobile/favourites');
}

export function likeHelperService(serviceId: string): Promise<null> {
  return post<null>('/api/mobile/favourites', { serviceId });
}

export function unlikeHelperService(serviceId: string): Promise<null> {
  return del<null>(`/api/mobile/favourites/${serviceId}`);
}
