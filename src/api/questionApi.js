import httpClient from './httpClient';
export const bulkCreateQuestionsApi = (questions) => httpClient.post('/questions/bulk', { questions });
export const fetchBulkQuestionsApi = (question_ids) => httpClient.post('/questions/fetchBulk', { question_ids });
