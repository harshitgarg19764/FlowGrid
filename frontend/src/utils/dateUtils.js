import {
  format,
  formatDistanceToNow,
  isPast,
  differenceInMinutes,
  differenceInHours,
  parseISO,
} from 'date-fns';

/**
 * Safely parses a date value into a Date object.
 * Handles Date instances, ISO strings, and timestamps.
 *
 * @param {Date|string|number} date - The date value to parse
 * @returns {Date} Parsed Date object
 */
const ensureDate = (date) => {
  if (date instanceof Date) return date;
  if (typeof date === 'string') return parseISO(date);
  return new Date(date);
};

/**
 * Formats a date using the specified format string.
 *
 * @param {Date|string|number} date - The date to format
 * @param {string} [formatStr='MMM d, yyyy'] - date-fns format string
 * @returns {string} Formatted date string
 */
export const formatDate = (date, formatStr = 'MMM d, yyyy') => {
  if (!date) return '';
  try {
    return format(ensureDate(date), formatStr);
  } catch {
    return '';
  }
};

/**
 * Formats a date with time (e.g., "Jan 15, 2025, 2:30 PM").
 *
 * @param {Date|string|number} date - The date to format
 * @returns {string} Formatted date-time string
 */
export const formatDateTime = (date) => {
  return formatDate(date, 'MMM d, yyyy, h:mm a');
};

/**
 * Formats only the time portion of a date (e.g., "2:30 PM").
 *
 * @param {Date|string|number} date - The date to extract time from
 * @returns {string} Formatted time string
 */
export const formatTime = (date) => {
  return formatDate(date, 'h:mm a');
};

/**
 * Formats a date as a relative time string (e.g., "2 hours ago", "in 3 days").
 *
 * @param {Date|string|number} date - The date to format
 * @returns {string} Relative time string
 */
export const formatRelative = (date) => {
  if (!date) return '';
  try {
    return formatDistanceToNow(ensureDate(date), { addSuffix: true });
  } catch {
    return '';
  }
};

/**
 * Checks if a date is in the past.
 *
 * @param {Date|string|number} date - The date to check
 * @returns {boolean} True if the date is in the past
 */
export const isExpired = (date) => {
  if (!date) return false;
  try {
    return isPast(ensureDate(date));
  } catch {
    return false;
  }
};

/**
 * Returns a human-readable duration between two dates
 * (e.g., "2 hours", "45 minutes", "1 hour 30 minutes").
 *
 * @param {Date|string|number} startDate - The start date
 * @param {Date|string|number} endDate - The end date
 * @returns {string} Human-readable duration
 */
export const formatDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return '';
  try {
    const start = ensureDate(startDate);
    const end = ensureDate(endDate);
    const totalMinutes = Math.abs(differenceInMinutes(end, start));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    if (minutes === 0) return `${hours} hour${hours !== 1 ? 's' : ''}`;
    return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  } catch {
    return '';
  }
};

/**
 * Returns a formatted time slot label (e.g., "10:00 AM - 12:00 PM").
 *
 * @param {Date|string|number} start - Slot start time
 * @param {Date|string|number} end - Slot end time
 * @returns {string} Formatted time slot label
 */
export const getTimeSlotLabel = (start, end) => {
  if (!start || !end) return '';
  return `${formatTime(start)} - ${formatTime(end)}`;
};
