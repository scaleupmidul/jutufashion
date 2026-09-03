/**
 * Bangladeshi Taka Currency Formatter Utilities
 */

export const CURRENCY_SYMBOL = '৳';
export const CURRENCY_CODE = 'BDT';

/**
 * Format amount as Bangladeshi Taka string with ৳ symbol and localized digit grouping
 * Example: 2450 -> "৳2,450"
 */
export const formatTaka = (amount: number, options?: { showDecimals?: boolean; space?: boolean }): string => {
  const { showDecimals = false, space = false } = options || {};
  
  const formattedNumber = showDecimals
    ? amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : Math.round(amount).toLocaleString('en-IN');

  return space ? `৳ ${formattedNumber}` : `৳${formattedNumber}`;
};

/**
 * Format simple Taka string
 */
export const formatPrice = (price: number): string => {
  return `৳${Math.round(price).toLocaleString('en-IN')}`;
};
