type Enumerate<
  N extends number,
  Acc extends number[] = []
> = Acc["length"] extends N
  ? [...Acc, N][number]
  : Enumerate<N, [...Acc, Acc["length"]]>;

export type Range<End extends number> = Enumerate<End>;

// Returns integer that in diapason [min, max] (including `min` and `max` values)
export function randomInteger<T extends number>(min: number, max: T) {
  const rand = min + Math.random() * (max + 1 - min);

  return Math.min(Math.floor(rand), max) as Range<T>;
}