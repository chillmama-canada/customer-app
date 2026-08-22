import type { AxiosError } from 'axios';
import { api } from './api';

export interface Promotion {
  id: string;
  title: string;
  description: string;
  ctaText: string;
  type: string;
  bgColor: string;
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

export class PromotionsApiError extends Error {}

const FALLBACK_ERROR_MESSAGE = 'Something went wrong. Please try again.';

export async function getPromotions(): Promise<Promotion[]> {
  try {
    const response = await api.get<ApiSuccessBody<Promotion[]>>('/api/mobile/promotions');
    return response.data.data;
  } catch (err) {
    const axiosError = err as AxiosError<ApiErrorBody>;
    throw new PromotionsApiError(axiosError.response?.data?.error ?? FALLBACK_ERROR_MESSAGE);
  }
}
