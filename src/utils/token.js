import { appConfig } from '../config/appConfig';
export const getToken = () => localStorage.getItem(appConfig.storageTokenKey);
export const setToken = (token) => localStorage.setItem(appConfig.storageTokenKey, token);
export const clearToken = () => localStorage.removeItem(appConfig.storageTokenKey);
export const setUser = (user) => localStorage.setItem(appConfig.storageUserKey, JSON.stringify(user || {}));
export const getUser = () => {
  try { return JSON.parse(localStorage.getItem(appConfig.storageUserKey) || '{}'); } catch { return {}; }
};
export const clearUser = () => localStorage.removeItem(appConfig.storageUserKey);
