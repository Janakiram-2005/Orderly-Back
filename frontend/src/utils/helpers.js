/**
 * Formats a number as Indian Rupees (e.g., 45000 => ₹45,000)
 * @param {number} amount - The amount to format
 * @returns {string} - The formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

/**
 * Formtas a date string into a more readable format
 * @param {string} dateString - The ISO date string
 * @returns {string} - The formatted date (e.g., Nov 6, 2025, 10:30 AM)
 */
export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

// You can add more helper functions here as your app grows