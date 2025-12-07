// Returns integer that in diapason [min, max] (including `min` and `max` values)
export function randomInteger(min: number, max: number) {
  const rand = min + Math.random() * (max + 1 - min);

  return Math.floor(rand);
}
