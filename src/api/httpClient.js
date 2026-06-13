import axios from 'axios';
import { appConfig } from '../config/appConfig';
import { clearToken, clearUser, getToken } from '../utils/token';

const httpClient = axios.create({
  baseURL: appConfig.apiBaseUrl,
  timeout: appConfig.requestTimeout,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

httpClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error?.response?.status === 401) {
      clearToken();
      clearUser();
      if (window.location.pathname !== '/login') window.location.href = '/login';
    }
    return Promise.reject(error?.response?.data || error);
  }
);

export default httpClient;
