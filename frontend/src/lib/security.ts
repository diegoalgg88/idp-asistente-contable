/**
 * Security utilities for the IDP Asistente Contable application.
 * Focused on input sanitization and secure token handling.
 */

/**
 * Sanitizes a string to prevent basic XSS attacks by escaping HTML entities.
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validates a JWT or similar token format.
 */
export const isValidToken = (token: string): boolean => {
  if (!token) return false;
  const parts = token.split('.');
  return parts.length === 3;
};

/**
 * Security Headers suggestion for next.config.js
 */
export const SECURITY_HEADERS = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];
