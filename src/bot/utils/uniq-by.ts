import { keyBy } from "./key-by";

export function uniqBy<T>(array: T[], by: (el: T) => string): T[] {
  return Object.values(keyBy(array, by));
}