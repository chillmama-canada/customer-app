import axios from 'axios';

// TODO: point at the backend's /api/mobile/ base URL once it exists.
export const api = axios.create({
  baseURL: '',
  timeout: 10000,
});
