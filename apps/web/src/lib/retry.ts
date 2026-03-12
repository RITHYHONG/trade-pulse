/**
 * Retry utility with exponential backoff for handling transient failures
 */

export interface RetryOptions {
  maxAttempts?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  jitter?: boolean;
  retryCondition?: (error: unknown) => boolean;
}

/**
 * Default retry condition - retries on network errors and some Firebase errors
 */
function defaultRetryCondition(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;

  const err = error as Error;
  const message = err.message?.toLowerCase() || '';

  // Retry on network errors
  if (message.includes('network') ||
      message.includes('timeout') ||
      message.includes('fetch') ||
      message.includes('connection')) {
    return true;
  }

  // Retry on temporary Firebase errors
  if (message.includes('unavailable') ||
      message.includes('deadline-exceeded') ||
      message.includes('resource-exhausted')) {
    return true;
  }

  // Retry on HTTP 5xx errors
  if ('status' in err && typeof err.status === 'number' && err.status >= 500 && err.status < 600) {
    return true;
  }

  return false;
}

/**
 * Sleeps for the specified number of milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Calculates delay with exponential backoff and optional jitter
 */
function calculateDelay(
  attempt: number,
  baseDelay: number,
  maxDelay: number,
  backoffFactor: number,
  jitter: boolean
): number {
  const exponentialDelay = baseDelay * Math.pow(backoffFactor, attempt - 1);
  const delay = Math.min(exponentialDelay, maxDelay);

  if (jitter) {
    // Add random jitter (±25% of delay)
    const jitterAmount = delay * 0.25;
    return delay + (Math.random() - 0.5) * 2 * jitterAmount;
  }

  return delay;
}

/**
 * Retries a function with exponential backoff
 * @param fn - Function to retry
 * @param options - Retry configuration
 * @returns Promise that resolves with the function result or rejects with the last error
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    baseDelay = 1000, // 1 second
    maxDelay = 30000, // 30 seconds
    backoffFactor = 2,
    jitter = true,
    retryCondition = defaultRetryCondition,
  } = options;

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on the last attempt
      if (attempt === maxAttempts) {
        break;
      }

      // Check if we should retry this error
      if (!retryCondition(error)) {
        break;
      }

      // Calculate delay and wait
      const delay = calculateDelay(attempt, baseDelay, maxDelay, backoffFactor, jitter);
      console.warn(`[Retry] Attempt ${attempt} failed, retrying in ${delay}ms:`, error);
      await sleep(delay);
    }
  }

  // All attempts failed
  throw lastError;
}

/**
 * Retries a function with exponential backoff, optimized for Firebase operations
 */
export async function retryFirebase<T>(fn: () => Promise<T>): Promise<T> {
  return retry(fn, {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    retryCondition: (error) => {
      if (!error || typeof error !== 'object') return false;
      const message = (error as Error).message?.toLowerCase() || '';
      return message.includes('unavailable') ||
             message.includes('deadline-exceeded') ||
             message.includes('resource-exhausted') ||
             message.includes('network');
    },
  });
}

/**
 * Retries a function with exponential backoff, optimized for external API calls
 */
export async function retryApi<T>(fn: () => Promise<T>): Promise<T> {
  return retry(fn, {
    maxAttempts: 2, // APIs often have rate limits, so fewer retries
    baseDelay: 2000,
    maxDelay: 10000,
    retryCondition: (error) => {
      if (!error || typeof error !== 'object') return false;
      const err = error as Error;
      const message = err.message?.toLowerCase() || '';

      // Retry on network errors
      if (message.includes('network') ||
          message.includes('timeout') ||
          message.includes('fetch')) {
        return true;
      }

      // Retry on HTTP 5xx (server errors)
      if ('status' in err && typeof err.status === 'number' && err.status >= 500 && err.status < 600) {
        return true;
      }

      // Don't retry on client errors (4xx) or rate limits (429)
      return false;
    },
  });
}