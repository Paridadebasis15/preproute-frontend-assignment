export const unwrapData = (response) => response?.data ?? response;
export const getApiErrorMessage = (error, fallback = 'Something went wrong') =>
  error?.message || error?.error || error?.data?.message || fallback;
