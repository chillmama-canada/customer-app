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
}

export interface HelperDetail extends HelperRecommendation {
  bio: string | null;
  completionRate: number;
  serviceId: string;
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

// Not yet filtered by anything the AI chat parses beyond category (service
// date/exclusions/etc.) — see the route's own comment.
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
