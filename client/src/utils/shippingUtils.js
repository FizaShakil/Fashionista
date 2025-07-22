/**
 * Calculate shipping fee based on order subtotal
 * @param {number} subtotal - The order subtotal amount
 * @returns {number} - The shipping fee
 */
export const calculateShippingFee = (subtotal) => {
  return subtotal > 2500 ? 150 : 200;
};

/**
 * Calculate total order amount including shipping
 * @param {number} subtotal - The order subtotal amount
 * @returns {number} - The total amount including shipping
 */
export const calculateTotal = (subtotal) => {
  const shippingFee = calculateShippingFee(subtotal);
  return subtotal + shippingFee;
};

/**
 * Check if shipping discount is applied
 * @param {number} subtotal - The order subtotal amount
 * @returns {boolean} - True if shipping discount is applied
 */
export const hasShippingDiscount = (subtotal) => {
  return subtotal > 2500;
}; 