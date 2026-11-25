/**
 * Format currency amount
 * @param {number} amount - Amount in cents or smallest currency unit
 * @param {string} currency - Currency code (e.g., 'USD', 'EUR', 'INR')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return '-';
  
  try {
    // Convert cents to dollars/rupees/etc
    const value = amount / 100;
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(value);
  } catch {
    // Fallback if currency code is invalid
    return `${currency} ${(amount / 100).toFixed(2)}`;
  }
};

/**
 * Parse currency string to cents
 * @param {string} currencyString - Currency string like "$10.50"
 * @returns {number} Amount in cents
 */
export const parseCurrency = (currencyString) => {
  if (!currencyString) return 0;
  
  // Remove currency symbols and spaces, parse as float, convert to cents
  const cleanString = currencyString.replace(/[^0-9.]/g, '');
  const amount = parseFloat(cleanString);
  
  return Math.round(amount * 100);
};

/**
 * Check if a resource is free
 * @param {number} price - Price in cents
 * @returns {boolean}
 */
export const isFree = (price) => {
  return price === 0 || price === null || price === undefined;
};
