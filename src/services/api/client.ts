import type { ApiError } from '../../types/api';

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '/api/v1').replace(
  /\/$/,
  '',
);

export class ApiClientError extends Error {
  readonly code: string;
  readonly retryable: boolean;
  readonly details: unknown;
  readonly status: number;

  constructor(status: number, body: ApiError) {
    super(body.error_message || 'Request failed');
    this.name = 'ApiClientError';
    this.code = body.error_code;
    this.retryable = body.retryable;
    this.details = body.error_details;
    this.status = status;
  }
}

type RequestOptions = RequestInit & {
  token?: string | null;
  query?: Record<string, string | number | boolean | null | undefined>;
};

function buildUrl(path: string, query?: RequestOptions['query']) {
  const joined = path.startsWith('http')
    ? path
    : `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;

  // Relative base (/api/v1) needs an origin so URL() works in the browser
  const url = joined.startsWith('http')
    ? new URL(joined)
    : new URL(joined, window.location.origin);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

export async function api<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { token, query, headers: initHeaders, ...init } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(initHeaders as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(buildUrl(path, query), { ...init, headers });
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiClientError(res.status, {
      error_code: body.error_code ?? `HTTP-${res.status}`,
      error_message: body.error_message ?? res.statusText,
      retryable: Boolean(body.retryable),
      error_details: body.error_details ?? null,
    });
  }

  return (body.data !== undefined ? body.data : body) as T;
}

export function getErrorMessage(err: unknown, fallback = 'Something went wrong') {
  if (err instanceof ApiClientError) return err.message;
  if (err instanceof Error) return err.message;
  return fallback;
}
