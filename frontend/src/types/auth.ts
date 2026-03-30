export interface User {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface ApiError {
  detail: string | Array<{ loc: string[]; msg: string; type: string }>;
}

/**
 * Helper type for handling ApiError detail union type
 * Extracts string message from ApiError.detail
 */
export function getApiErrorMessage(error: ApiError): string {
  if (typeof error.detail === 'string') {
    return error.detail;
  }
  // If detail is an array, extract messages
  if (Array.isArray(error.detail)) {
    return error.detail.map(item => item.msg).join(', ');
  }
  return 'Error desconocido';
}
