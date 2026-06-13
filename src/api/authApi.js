import httpClient from './httpClient';
export const loginApi = (payload) => httpClient.post('/auth/login', payload);
