export interface ApiPage<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  orgId: string;
  org: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  user: AuthUser;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';
let accessToken: string | null = null;
let unauthorizedHandler: (() => void) | null = null;

export function setApiAccessToken(token: string | null) {
  accessToken = token;
}

export function setUnauthorizedHandler(fn: () => void) {
  unauthorizedHandler = fn;
}

function toCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

function camelizeKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(camelizeKeys);
  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>).map(([k, v]) => [toCamel(k), camelizeKeys(v)])
    );
  }
  return obj;
}

export function sanitizeApiError(status: number, rawMessage: string): string {
  if (status === 401) return 'Your session has expired. Please sign in again.';
  if (status === 403) return 'You do not have permission to perform this action.';
  if (status === 404) return 'The requested resource was not found.';
  if (status === 422) return 'The submitted data is invalid. Please check your input.';
  if (status >= 500) return 'A server error occurred. Please try again later.';
  return rawMessage || 'An unexpected error occurred.';
}

async function apiFetch<T>(path: string, init: RequestInit = {}, allowPassthrough = false): Promise<T> {
  const headers = new Headers(init.headers);
  if (!(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    if (response.status === 401 && path !== '/auth/login') {
      localStorage.removeItem('genque_access_token');
      localStorage.removeItem('genque_user');
      accessToken = null;
      if (unauthorizedHandler) unauthorizedHandler();
    }
    const error = await response.json().catch(() => ({}));
    const rawMessage = (error as Record<string, string>).detail ?? (error as Record<string, string>).message ?? '';
    throw new Error(allowPassthrough ? (rawMessage || sanitizeApiError(response.status, rawMessage)) : sanitizeApiError(response.status, rawMessage));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json().then(camelizeKeys) as Promise<T>;
}

export const api = {
  login: (email: string, password: string) =>
    apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }, true),
  refresh: () => apiFetch<AuthResponse>('/auth/refresh', { method: 'POST' }),
  logout: () => apiFetch<{ status: string }>('/auth/logout', { method: 'POST' }),
  me: () => apiFetch<AuthUser>('/auth/me'),
  page: <T>(path: string) => apiFetch<ApiPage<T>>(path),
  get: <T>(path: string) => apiFetch<T>(path),
  post: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};
