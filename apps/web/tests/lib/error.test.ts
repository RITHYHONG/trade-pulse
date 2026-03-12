/**
 * Unit tests for error handling utilities
 */

import { describe, it, expect } from 'vitest';
import { mapToAppError, getUserMessage } from '../../src/lib/error';

describe('mapToAppError', () => {
  it('maps Firebase auth/email-already-in-use error', () => {
    const error = new Error('Firebase: Error (auth/email-already-in-use).');
    const result = mapToAppError(error);

    expect(result.code).toBe('AUTH_EMAIL_EXISTS');
    expect(result.userMessage).toBe('An account with this email already exists. Try signing in instead.');
    expect(result.severity).toBe('warn');
  });

  it('maps Firebase auth/wrong-password error', () => {
    const error = new Error('Firebase: Error (auth/wrong-password).');
    const result = mapToAppError(error);

    expect(result.code).toBe('AUTH_INVALID_CREDENTIALS');
    expect(result.userMessage).toBe('Invalid email or password. Please check and try again.');
    expect(result.severity).toBe('error');
  });

  it('maps Firebase auth/weak-password error', () => {
    const error = new Error('Firebase: Error (auth/weak-password).');
    const result = mapToAppError(error);

    expect(result.code).toBe('AUTH_WEAK_PASSWORD');
    expect(result.userMessage).toBe('Password is too weak. Please use at least 6 characters.');
    expect(result.severity).toBe('warn');
  });

  it('maps Firebase storage/unauthorized error', () => {
    const error = new Error('Firebase: Error (storage/unauthorized).');
    const result = mapToAppError(error);

    expect(result.code).toBe('STORAGE_UNAUTHORIZED');
    expect(result.userMessage).toBe('You do not have permission to upload files. Please sign in again.');
    expect(result.severity).toBe('error');
  });

  it('maps network errors', () => {
    const error = new Error('Network request failed');
    const result = mapToAppError(error);

    expect(result.code).toBe('NETWORK_ERROR');
    expect(result.userMessage).toBe('Network error. Please check your connection and try again.');
    expect(result.severity).toBe('error');
  });

  it('maps file validation errors', () => {
    const error = new Error('Invalid file type. Please upload a JPEG, PNG, or WebP image.');
    const result = mapToAppError(error);

    expect(result.code).toBe('FILE_INVALID_TYPE');
    expect(result.userMessage).toBe('Invalid file type. Please upload a JPEG, PNG, or WebP image.');
    expect(result.severity).toBe('warn');
  });

  it('maps file size errors', () => {
    const error = new Error('File size too large. Please upload an image smaller than 5MB.');
    const result = mapToAppError(error);

    expect(result.code).toBe('FILE_TOO_LARGE');
    expect(result.userMessage).toBe('File is too large. Please upload a smaller image.');
    expect(result.severity).toBe('warn');
  });

  it('maps unknown errors', () => {
    const error = new Error('Some unknown error');
    const result = mapToAppError(error);

    expect(result.code).toBe('GENERIC_ERROR');
    expect(result.userMessage).toBe('Something went wrong. Please try again.');
    expect(result.severity).toBe('error');
  });

  it('maps null/undefined', () => {
    const result = mapToAppError(null);

    expect(result.code).toBe('UNKNOWN_ERROR');
    expect(result.userMessage).toBe('An unexpected error occurred. Please try again.');
    expect(result.severity).toBe('error');
  });

  it('maps string errors', () => {
    const result = mapToAppError('Custom error message');

    expect(result.code).toBe('STRING_ERROR');
    expect(result.userMessage).toBe('Custom error message');
    expect(result.severity).toBe('error');
  });
});

describe('getUserMessage', () => {
  it('extracts user message from error', () => {
    const error = new Error('Firebase: Error (auth/wrong-password).');
    const message = getUserMessage(error);

    expect(message).toBe('Invalid email or password. Please check and try again.');
  });

  it('returns default message for unknown errors', () => {
    const message = getUserMessage('unknown error');

    expect(message).toBe('unknown error');
  });
});