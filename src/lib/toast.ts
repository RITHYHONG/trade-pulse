import { toast } from 'sonner';
import { ZodError } from 'zod';

interface ToastOptions {
  duration?: number;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const showSuccess = (message: string, options?: ToastOptions) => {
  return toast.success(message, {
    duration: options?.duration ?? 4000,
    description: options?.description,
    action: options?.action,
  });
};

export const showError = (message: string, options?: ToastOptions) => {
  return toast.error(message, {
    duration: options?.duration ?? 5000,
    description: options?.description,
    action: options?.action,
  });
};


export const showWarning = (message: string, options?: ToastOptions) => {
  return toast.warning(message, {
    duration: options?.duration ?? 4500,
    description: options?.description,
    action: options?.action,
  });
};


export const showInfo = (message: string, options?: ToastOptions) => {
  return toast.info(message, {
    duration: options?.duration ?? 4000,
    description: options?.description,
    action: options?.action,
  });
};

export const showLoading = (message: string = 'Loading...') => {
  return toast.loading(message);
};

export const dismissToast = (toastId: string | number) => {
  toast.dismiss(toastId);
};


export const dismissAllToasts = () => {
  toast.dismiss();
};

export const showValidationError = (error: ZodError) => {
  const firstError = error.issues[0];
  const fieldName = firstError.path.join('.');
  const message = firstError.message;

  return toast.error('Validation Error', {
    description: fieldName ? `${fieldName}: ${message}` : message,
    duration: 5000,
  });
};

export const showValidationErrors = (errors: Record<string, string | string[]>) => {
  const errorMessages = Object.entries(errors)
    .map(([field, messages]) => {
      const errorText = Array.isArray(messages) ? messages.join(', ') : messages;
      return `${field}: ${errorText}`;
    })
    .join('\n');

  return toast.error('Validation Failed', {
    description: errorMessages,
    duration: 6000,
  });
};

export const showFieldError = (fieldName: string, message: string) => {
  return toast.error(`Invalid ${fieldName}`, {
    description: message,
    duration: 4500,
  });
};

export const showPromise = <T,>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: Error) => string);
  }
) => {
  return toast.promise(promise, messages);
};

export const showCustom = (content: (t: string | number) => React.ReactElement, options?: ToastOptions) => {
  return toast.custom(content, {
    duration: options?.duration,
  });
};

export const handleApiError = (error: unknown, fallbackMessage: string = 'An error occurred') => {
  if (error instanceof ZodError) {
    return showValidationError(error);
  }

  if (error instanceof Error) {
    return showError(error.message || fallbackMessage);
  }

  if (typeof error === 'string') {
    return showError(error);
  }

  // Handle API response errors
  if (typeof error === 'object' && error !== null) {
    const err = error as { message?: string; error?: string };
    if (err.message) {
      return showError(err.message);
    }
    if (err.error) {
      return showError(err.error);
    }
  }

  return showError(fallbackMessage);
};

export const validation = {
  required: (fieldName: string) => 
    showFieldError(fieldName, 'This field is required'),
  
  email: (email: string) => 
    showFieldError('Email', `"${email}" is not a valid email address`),
  
  minLength: (fieldName: string, minLength: number) => 
    showFieldError(fieldName, `Must be at least ${minLength} characters`),
  
  maxLength: (fieldName: string, maxLength: number) => 
    showFieldError(fieldName, `Must be no more than ${maxLength} characters`),
  
  passwordMismatch: () => 
    showError('Passwords do not match', {
      description: 'Please ensure both password fields match',
    }),
  
  invalidFormat: (fieldName: string, format?: string) => 
    showFieldError(fieldName, format ? `Invalid format. Expected: ${format}` : 'Invalid format'),
  
  uploadFailed: (fileName?: string) => 
    showError('Upload Failed', {
      description: fileName ? `Failed to upload "${fileName}"` : 'Failed to upload file',
    }),
  
  uploadSuccess: (fileName?: string) => 
    showSuccess('Upload Successful', {
      description: fileName ? `"${fileName}" uploaded successfully` : 'File uploaded successfully',
    }),
};

export const auth = {
  loginSuccess: (username?: string) => 
    showSuccess('Login Successful', {
      description: username ? `Welcome back, ${username}!` : 'Welcome back!',
    }),
  
  loginError: (message?: string) => 
    showError('Login Failed', {
      description: message || 'Invalid credentials. Please try again.',
    }),
  
  logoutSuccess: () => 
    showInfo('', {
      description: 'You have been successfully logged out',
    }),
  
  registrationSuccess: () => 
    showSuccess('', {
      description: 'Your account has been created. You can now log in.',
    }),
  
  sessionExpired: () => 
    showWarning('Session Expired', {
      description: 'Your session has expired. Please log in again.',
      duration: 6000,
    }),
  
  unauthorized: () => 
    showError('Unauthorized', {
      description: 'You do not have permission to perform this action',
    }),
};

export const crud = {
  createSuccess: (entityName: string) => 
    showSuccess(`${entityName} Created`, {
      description: `${entityName} has been successfully created`,
    }),
  
  updateSuccess: (entityName: string) => 
    showSuccess(`${entityName} Updated`, {
      description: `${entityName} has been successfully updated`,
    }),
  
  deleteSuccess: (entityName: string) => 
    showSuccess(`${entityName} Deleted`, {
      description: `${entityName} has been successfully deleted`,
    }),
  
  createError: (entityName: string, error?: string) => 
    showError(`Failed to Create ${entityName}`, {
      description: error || `An error occurred while creating ${entityName}`,
    }),
  
  updateError: (entityName: string, error?: string) => 
    showError(`Failed to Update ${entityName}`, {
      description: error || `An error occurred while updating ${entityName}`,
    }),
  
  deleteError: (entityName: string, error?: string) => 
    showError(`Failed to Delete ${entityName}`, {
      description: error || `An error occurred while deleting ${entityName}`,
    }),
};

export { toast };
