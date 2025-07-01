export function keyBy<T>(
  array: T[],
  by: (el: T) => string
): { [p: string]: T } {
  const dict: { [p: string]: T } = {};
  for (const elem of array) {
    const key = by(elem);
    const existingElem = dict[key];
    if (!existingElem) {
      dict[key] = elem;
    }
  }

  return dict;
}
