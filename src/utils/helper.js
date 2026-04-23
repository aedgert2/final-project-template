/**
 * Parses a route param as a positive integer.
 * Returns the integer, or null if invalid.
 */
export const parseId = (param) => {
  const id = parseInt(param, 10);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
};