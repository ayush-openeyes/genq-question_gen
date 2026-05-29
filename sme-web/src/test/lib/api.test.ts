import { describe, it, expect } from 'vitest';
import { sanitizeApiError } from '../../lib/api';

describe('sanitizeApiError', () => {
  it('returns session-expired message for 401', () => {
    expect(sanitizeApiError(401, 'Unauthorized')).toBe('Your session has expired. Please sign in again.');
  });

  it('returns permission message for 403', () => {
    expect(sanitizeApiError(403, 'Forbidden')).toBe('You do not have permission to perform this action.');
  });

  it('returns not-found message for 404', () => {
    expect(sanitizeApiError(404, 'Not found')).toBe('The requested resource was not found.');
  });

  it('returns validation message for 422', () => {
    expect(sanitizeApiError(422, 'Validation error')).toBe('The submitted data is invalid. Please check your input.');
  });

  it('returns server error message for 500', () => {
    expect(sanitizeApiError(500, 'Internal server error')).toBe('A server error occurred. Please try again later.');
  });

  it('returns server error message for 503', () => {
    expect(sanitizeApiError(503, 'Service unavailable')).toBe('A server error occurred. Please try again later.');
  });

  it('returns raw message for unknown non-error status', () => {
    expect(sanitizeApiError(409, 'Conflict')).toBe('Conflict');
  });

  it('falls back to generic message when rawMessage is empty', () => {
    expect(sanitizeApiError(409, '')).toBe('An unexpected error occurred.');
  });
});
