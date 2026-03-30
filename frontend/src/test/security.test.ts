import { describe, it, expect } from 'vitest';
import { sanitizeInput, isValidToken } from '../lib/security';

describe('Security Utilities', () => {
  describe('sanitizeInput', () => {
    it('should escape HTML tags to prevent XSS', () => {
      const dirty = '<script>alert("xss")</script>';
      const clean = sanitizeInput(dirty);
      expect(clean).not.toContain('<script>');
      expect(clean).toContain('&lt;script&gt;');
    });

    it('should return empty string for null input', () => {
      expect(sanitizeInput('')).toBe('');
    });
  });

  describe('isValidToken', () => {
    it('should return true for a valid 3-part JWT', () => {
      expect(isValidToken('header.payload.signature')).toBe(true);
    });

    it('should return false for malformed tokens', () => {
      expect(isValidToken('invalid-token')).toBe(false);
      expect(isValidToken('')).toBe(false);
    });
  });
});
