export function takeRight<T>(array: T[], n = 1): T[] {
  if (!Array.isArray(array)) {
    return [];
  }

  const length = array.length;

  if (n <= 0) {
    return [];
  }

  return array.slice(Math.max(length - n, 0));
}
