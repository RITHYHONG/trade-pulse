/**
 * Central error handling utilities for Trade Pulse
 * Provides consistent error mapping, logging, and user-friendly messages
 */

export interface AppError {
  code: string;
  userMessage: string;
  severity: 'info' | 'warn' | 'error';
  meta?: Record<string, unknown>;
  originalError?: unknown;
}

/**
 * Maps various error types to a standardized AppError format
 * Handles Firebase errors, network errors, validation errors, etc.
 */
export function mapToAppError(err: unknown): AppError {
  // Handle null/undefined
  if (!err) {
    return {
      code: 'UNKNOWN_ERROR',
      userMessage: 'An unexpected error occurred. Please try again.',
      severity: 'error',
    };
  }

  // Handle Error instances
  if (err instanceof Error) {
    const message = err.message.toLowerCase();

    // Firebase Auth errors
    if (message.includes('auth/email-already-in-use')) {
      return {
        code: 'AUTH_EMAIL_EXISTS',
        userMessage: 'An account with this email already exists. Try signing in instead.',
        severity: 'warn',
        originalError: err,
      };
    }

    if (message.includes('auth/weak-password')) {
      return {
        code: 'AUTH_WEAK_PASSWORD',
        userMessage: 'Password is too weak. Please use at least 6 characters.',
        severity: 'warn',
        originalError: err,
      };
    }

    if (message.includes('auth/wrong-password') || message.includes('auth/invalid-credential')) {
      return {
        code: 'AUTH_INVALID_CREDENTIALS',
        userMessage: 'Invalid email or password. Please check and try again.',
        severity: 'error',
        originalError: err,
      };
    }

    if (message.includes('auth/user-not-found')) {
      return {
        code: 'AUTH_USER_NOT_FOUND',
        userMessage: 'No account found with this email. Please sign up first.',
        severity: 'warn',
        originalError: err,
      };
    }

    if (message.includes('auth/too-many-requests')) {
      return {
        code: 'AUTH_TOO_MANY_REQUESTS',
        userMessage: 'Too many sign-in attempts. Please wait a few minutes and try again.',
        severity: 'error',
        originalError: err,
      };
    }

    if (message.includes('auth/popup-closed-by-user')) {
      return {
        code: 'AUTH_POPUP_CANCELLED',
        userMessage: 'Sign-in was cancelled.',
        severity: 'info',
        originalError: err,
      };
    }

    if (message.includes('auth/popup-blocked')) {
      return {
        code: 'AUTH_POPUP_BLOCKED',
        userMessage: 'Pop-up was blocked by your browser. Please allow pop-ups and try again.',
        severity: 'warn',
        originalError: err,
      };
    }

    if (message.includes('auth/cancelled-popup-request')) {
      return {
        code: 'AUTH_POPUP_CONFLICT',
        userMessage: 'Another sign-in is already in progress.',
        severity: 'warn',
        originalError: err,
      };
    }

    if (message.includes('auth/requires-recent-login')) {
      return {
        code: 'AUTH_RECENT_LOGIN_REQUIRED',
        userMessage: 'Please sign out and sign in again to change your password.',
        severity: 'warn',
        originalError: err,
      };
    }

    // Firebase Storage errors
    if (message.includes('storage/unauthorized')) {
      return {
        code: 'STORAGE_UNAUTHORIZED',
        userMessage: 'You do not have permission to upload files. Please sign in again.',
        severity: 'error',
        originalError: err,
      };
    }

    if (message.includes('storage/canceled')) {
      return {
        code: 'STORAGE_CANCELLED',
        userMessage: 'Upload was cancelled.',
        severity: 'info',
        originalError: err,
      };
    }

    if (message.includes('storage/quota-exceeded')) {
      return {
        code: 'STORAGE_QUOTA_EXCEEDED',
        userMessage: 'Storage quota exceeded. Please contact support.',
        severity: 'error',
        originalError: err,
      };
    }

    // Firestore permission errors
    if (message.includes('permission') || message.includes('unauthorized')) {
      return {
        code: 'FIRESTORE_PERMISSION_DENIED',
        userMessage: 'You do not have permission to access this data. Please sign in.',
        severity: 'error',
        originalError: err,
      };
    }

    // Network errors
    if (message.includes('network') || message.includes('timeout') || message.includes('fetch')) {
      return {
        code: 'NETWORK_ERROR',
        userMessage: 'Network error. Please check your connection and try again.',
        severity: 'error',
        originalError: err,
      };
    }

    // File validation errors
    if (message.includes('invalid file type')) {
      return {
        code: 'FILE_INVALID_TYPE',
        userMessage: 'Invalid file type. Please upload a JPEG, PNG, or WebP image.',
        severity: 'warn',
        originalError: err,
      };
    }

    if (message.includes('file size too large') || message.includes('too large')) {
      return {
        code: 'FILE_TOO_LARGE',
        userMessage: 'File is too large. Please upload a smaller image.',
        severity: 'warn',
        originalError: err,
      };
    }

    // Generic Firebase errors
    if (message.includes('firebase')) {
      return {
        code: 'FIREBASE_ERROR',
        userMessage: 'Service temporarily unavailable. Please try again.',
        severity: 'error',
        originalError: err,
      };
    }

    // Default for other Error instances
    return {
      code: 'GENERIC_ERROR',
      userMessage: 'Something went wrong. Please try again.',
      severity: 'error',
      originalError: err,
    };
  }

  // Handle string errors
  if (typeof err === 'string') {
    return {
      code: 'STRING_ERROR',
      userMessage: err,
      severity: 'error',
      originalError: err,
    };
  }

  // Handle unknown error types
  return {
    code: 'UNKNOWN_ERROR',
    userMessage: 'An unexpected error occurred. Please try again.',
    severity: 'error',
    originalError: err,
  };
}

/**
 * Logs errors with structured context for debugging and monitoring
 * In production, this could send to Sentry, LogRocket, etc.
 */
export function logError(error: AppError | unknown, context?: Record<string, unknown>): void {
  const appError = error instanceof Object && 'code' in error ? error as AppError : mapToAppError(error);

  const logData = {
    timestamp: new Date().toISOString(),
    code: appError.code,
    severity: appError.severity,
    message: appError.userMessage,
    context,
    originalError: appError.originalError,
    meta: appError.meta,
  };

  // Log to console with appropriate level
  switch (appError.severity) {
    case 'error':
      console.error('[TradePulse Error]', logData);
      break;
    case 'warn':
      console.warn('[TradePulse Warning]', logData);
      break;
    case 'info':
      console.info('[TradePulse Info]', logData);
      break;
  }

  // TODO: In production, send to error monitoring service
  // Example: Sentry.captureException(appError.originalError, { extra: logData });
}

/**
 * Creates a user-friendly error message from an error
 * Shortcut for mapToAppError(err).userMessage
 */
export function getUserMessage(err: unknown): string {
  return mapToAppError(err).userMessage;
}