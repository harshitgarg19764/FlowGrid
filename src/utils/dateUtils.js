import { format, parseISO, isBefore, addMinutes, startOfDay } from 'date-fns';

/**
 * Format a date to a readable string
 */
export const formatDate = (date, formatStr = 'PPP') => {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch {
    return '';
  }
};

/**
 * Format time only
 */
export const formatTime = (date) => {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'p');
  } catch {
    return '';
  }
};

/**
 * Format date and time
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'PPp');
  } catch {
    return '';
  }
};

/**
 * Convert to ISO string for API submission
 */
export const toISOString = (date) => {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return dateObj.toISOString();
  } catch {
    return '';
  }
};

/**
 * Check if time range is valid (start < end)
 */
export const isValidTimeRange = (startTime, endTime) => {
  if (!startTime || !endTime) return false;
  try {
    const start = typeof startTime === 'string' ? parseISO(startTime) : startTime;
    const end = typeof endTime === 'string' ? parseISO(endTime) : endTime;
    return isBefore(start, end);
  } catch {
    return false;
  }
};

/**
 * Generate time slots for a given date
 */
export const generateTimeSlots = (date, intervalMinutes = 30, startHour = 8, endHour = 22) => {
  const slots = [];
  const start = startOfDay(date);
  
  let current = addMinutes(start, startHour * 60);
  const lastSlot = addMinutes(start, endHour * 60);
  
  while (isBefore(current, lastSlot)) {
    slots.push({
      start: current,
      end: addMinutes(current, intervalMinutes),
      label: format(current, 'h:mm a'),
    });
    current = addMinutes(current, intervalMinutes);
  }
  
  return slots;
};

/**
 * Format duration between two times
 */
export const formatDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return '';
  try {
    const start = typeof startTime === 'string' ? parseISO(startTime) : startTime;
    const end = typeof endTime === 'string' ? parseISO(endTime) : endTime;
    
    const diffMinutes = Math.floor((end - start) / (1000 * 60));
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    
    if (hours === 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  } catch {
    return '';
  }
};

/**
 * Format a date input value (yyyy-MM-dd)
 */
export const formatDateInput = (date) => {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'yyyy-MM-dd');
  } catch {
    return '';
  }
};

/**
 * Format a datetime-local input value (yyyy-MM-ddTHH:mm)
 */
export const formatDateTimeInput = (date) => {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, "yyyy-MM-dd'T'HH:mm");
  } catch {
    return '';
  }
};
