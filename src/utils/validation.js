export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  // At least 8 characters, one uppercase, one lowercase, one number
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  return {
    isValid: minLength && hasUpperCase && hasLowerCase && hasNumber,
    errors: {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
    }
  };
};

export const validateTimeRange = (startTime, endTime) => {
  if (!startTime || !endTime) {
    return { isValid: false, error: 'Both start and end times are required' };
  }
  
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  if (start >= end) {
    return { isValid: false, error: 'End time must be after start time' };
  }
  
  if (start < new Date()) {
    return { isValid: false, error: 'Start time cannot be in the past' };
  }
  
  return { isValid: true };
};

export const generateIdempotencyKey = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
