import axios from 'axios';

export class ApiRequestError extends Error {
  constructor(message, { status = 0, errors = [], isCanceled = false } = {}) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.errors = errors;
    this.isCanceled = isCanceled;
  }
}

const FALLBACK_MESSAGES = {
  network: 'Unable to reach Brew & Bean right now. Please check your connection and try again.',
  timeout: 'The server is taking too long to respond. It may be waking up, so please try again in a moment.',
  server: 'Something went wrong on our side. Please try again shortly.',
  unreachable: 'The Brew & Bean server is not responding. Please make sure the API is running and try again.',
  misconfigured: 'Received an unexpected response from the server. Please check the API URL configuration.',
  generic: 'Something went wrong. Please try again.',
};

const isApiPayload = (data) => data !== null && typeof data === 'object' && 'success' in data;

const normalizeApiError = (error) => {
  if (axios.isCancel(error)) {
    return new ApiRequestError('Request cancelled', { isCanceled: true });
  }

  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return new ApiRequestError(FALLBACK_MESSAGES.timeout);
  }

  if (!error.response) {
    return new ApiRequestError(FALLBACK_MESSAGES.network);
  }

  const { status, data } = error.response;
  if (!isApiPayload(data)) {
    return new ApiRequestError(status >= 500 ? FALLBACK_MESSAGES.unreachable : FALLBACK_MESSAGES.misconfigured, {
      status,
    });
  }
  const fallback = status >= 500 ? FALLBACK_MESSAGES.server : FALLBACK_MESSAGES.generic;

  return new ApiRequestError(data?.message || fallback, {
    status,
    errors: Array.isArray(data?.errors) ? data.errors : [],
  });
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.response.use(
  (response) =>
    isApiPayload(response.data)
      ? response.data
      : Promise.reject(new ApiRequestError(FALLBACK_MESSAGES.misconfigured, { status: response.status })),
  (error) => Promise.reject(normalizeApiError(error)),
);

export const withManagementKey = (managementKey, config = {}) =>
  managementKey ? { ...config, headers: { ...config.headers, 'x-api-key': managementKey } } : config;

export default api;
