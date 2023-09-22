/**
 * Make the first letter of a string uppercase.
 *
 * @param str - The string to modify
 */
export function capitaliseFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
