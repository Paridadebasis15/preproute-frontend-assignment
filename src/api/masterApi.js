import httpClient from './httpClient';
export const getSubjectsApi = () => httpClient.get('/subjects');
export const getTopicsBySubjectApi = (subjectId) => httpClient.get(`/topics/subject/${subjectId}`);
export const getSubTopicsByTopicApi = (topicId) => httpClient.get(`/sub-topics/topic/${topicId}`);
export const getSubTopicsByMultiTopicsApi = (topicIds) => httpClient.post('/sub-topics/multi-topics', { topicIds });
