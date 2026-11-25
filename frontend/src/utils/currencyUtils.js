/**
 * Currency formatting configuration by currency code.
 */
const CURRENCY_CONFIG = {
  INR: { locale: 'en-IN', currency: 'INR' },
  USD: { locale: 'en-US', currency: 'USD' },
  EUR: { locale: 'en-DE', currency: 'EUR' },
  GBP: { locale: 'en-GB', currency: 'GBP' },
};

/**
 * Formats a numeric amount as a localized currency string.
 *
 * @param {number} amount - The monetary amount to format
 * @param {string} [currency='INR'] - ISO 4217 currency code
 * @returns {string} Formatted currency string (e.g., "₹1,500.00")
 */
export const formatCurrency = (amount, currency = 'INR') => {
  if (amount == null || isNaN(amount)) return '';

  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.INR;

  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Formats a resource's price for display.
 * Returns "Free" if the price is zero, null, or undefined.
 *
 * @param {Object} resource - The resource object
 * @param {number} [resource.price] - The resource price
 * @param {string} [resource.currency='INR'] - The resource currency code
 * @returns {string} Formatted price string or "Free"
 */
export const formatPrice = (resource) => {
  if (!resource || !resource.price || resource.price === 0) {
    return 'Free';
  }

  return formatCurrency(resource.price, resource.currency || 'INR');
};
