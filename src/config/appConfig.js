export const appConfig = {
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'https://admin-moderator-backend-staging.up.railway.app/api',
  storageTokenKey: 'preproute_auth_token',
  storageUserKey: 'preproute_auth_user',
  requestTimeout: 20000,
};
