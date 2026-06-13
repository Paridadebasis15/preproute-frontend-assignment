import httpClient from './httpClient';
export const getTestsApi = () => httpClient.get('/tests');
export const getTestByIdApi = (id) => httpClient.get(`/tests/${id}`);
export const createTestApi = (payload) => httpClient.post('/tests', payload);
export const updateTestApi = (id, payload) => httpClient.put(`/tests/${id}`, payload);
export const publishTestApi = (id) => httpClient.put(`/tests/${id}`, { status: 'live' });
export const deleteTestApi = (id) => httpClient.delete(`/tests/${id}`);
