import { useEffect, useRef } from 'react';
import { FieldErrors } from 'react-hook-form';
import { toast } from 'sonner';

// Small module-level guard to prevent duplicate toasts in quick succession.
// Keeps the last shown message and timestamp; suppresses identical messages within 2s.
const _lastToast: { msg: string | null; t: number } = { msg: null, t: 0 };
function showUniqueError(message: string) {
  const now = Date.now();
  if (_lastToast.msg === message && now - _lastToast.t < 2000) return;
  _lastToast.msg = message;
  _lastToast.t = now;
  toast.error(message);
}

/**
 * Custom hook to display form validation errors as Sonner toasts.
 * 
 * @param errors - Form errors object from react-hook-form's formState.errors
 * 
 * @example
 * ```tsx
 * const form = useForm<FormSchema>({ ... });
 * useFormErrorToasts(form.formState.errors);
 * 
 * // Use with onError handler for submit validation
 * <form onSubmit={form.handleSubmit(onSubmit, handleFormErrors)} noValidate>
 * ```
 */
export function useFormErrorToasts(errors: FieldErrors) {
  // Track the last error key we showed so we only show one toast at a time
  const lastShownKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const entries = Object.entries(errors);

    // No errors -> clear the tracker so next error will show
    if (entries.length === 0) {
      lastShownKeyRef.current = null;
      return;
    }

    // Only show the first error's message (by object entry order)
    const [firstKey, firstError] = entries[0];
    const message = firstError?.message;

    if (message && typeof message === 'string') {
      if (lastShownKeyRef.current !== firstKey) {
        showUniqueError(message);
        lastShownKeyRef.current = firstKey;
      }
    }
  }, [errors]);
}

/**
 * Error handler for react-hook-form's handleSubmit.
 * Displays all validation errors as Sonner toasts when form submission fails.
 * 
 * @param errors - Form errors object
 * 
 * @example
 * ```tsx
 * <form onSubmit={form.handleSubmit(onSubmit, handleFormErrors)} noValidate>
 * ```
 */
export function handleFormErrors(errors: FieldErrors) {
  // Show only the first validation error on submit
  const entries = Object.entries(errors);
  if (entries.length === 0) return;
  const message = entries[0][1]?.message;
  if (message && typeof message === 'string') {
    showUniqueError(message);
  }
}
