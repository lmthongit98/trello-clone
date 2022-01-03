/**
 *Order an array of objects based on another order array
 */
export const mapOrder = (arr, order, key) => {
  return arr.sort((a, b) => order.indexOf(a[key]) - order.indexOf(b[key]));
};
