const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/v1';

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  let token: string | null = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('access_token');
  }

  const headers = new Headers(options.headers);
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && typeof window !== 'undefined') {
    // Handling unauthorized - could trigger logout or refresh
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(errorData.detail || 'API Request failed');
  }

  return response.json();
}
