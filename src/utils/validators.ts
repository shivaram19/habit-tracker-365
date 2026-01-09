export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

export const isValidHourlyLogs = (logs: number[]): boolean => {
  if (!Array.isArray(logs)) return false;
  if (logs.length !== 24) return false;

  return logs.every(log => {
    return (log >= -1 && log <= 10) || log === -1;
  });
};

export const isValidCategoryId = (id: number): boolean => {
  return (id >= 0 && id <= 10) || id === -1;
};

export const isValidSpending = (amount: number): boolean => {
  return amount >= 0 && !isNaN(amount);
};

export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  if (password.length < 8) return 'weak';
  if (password.length < 12) return 'medium';

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const strengthCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;

  if (strengthCount >= 3) return 'strong';
  if (strengthCount >= 2) return 'medium';
  return 'weak';
};

export const validateLoginForm = (email: string, password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!email) {
    errors.push('Email is required');
  } else if (!isValidEmail(email)) {
    errors.push('Please enter a valid email');
  }

  if (!password) {
    errors.push('Password is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateSignupForm = (
  email: string,
  password: string,
  confirmPassword: string,
  name?: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!email) {
    errors.push('Email is required');
  } else if (!isValidEmail(email)) {
    errors.push('Please enter a valid email');
  }

  if (!password) {
    errors.push('Password is required');
  } else if (!isValidPassword(password)) {
    errors.push('Password must be at least 8 characters');
  }

  if (password !== confirmPassword) {
    errors.push('Passwords do not match');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
