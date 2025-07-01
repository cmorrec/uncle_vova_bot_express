import { DateTime } from "luxon";

const formats = [
  "yyyy-MM-dd",
  "MM/dd/yyyy hh:mm:ss.SSS a",
  "M/dd/yyyy hh:mm:ss.SSS a",
  "M/dd/yyyy",
  "MM/dd/yyyy hh:mm:ss a",
  "MM/dd/yyyy",
  "M/dd/yyyy hh:mm:ss a",
  "M/dd/yyyy h:mm:ss a",
  "M/d/yyyy hh:mm:ss a",
];

export function getDateTime(
  date: string | Date | null | undefined | number,
  opts?: { setZone?: boolean }
): DateTime | undefined {
  if (!date) {
    return undefined;
  }

  if (date instanceof Date) {
    const fromDate = DateTime.fromJSDate(date);

    return fromDate.isValid ? fromDate : undefined;
  }

  if (typeof date === "number") {
    const timestampDate = DateTime.fromSeconds(date);

    return timestampDate.isValid ? timestampDate : undefined;
  }

  const dateISO = DateTime.fromISO(date, opts ? opts : undefined);
  if (dateISO.isValid) {
    return dateISO;
  }

  for (const format of formats) {
    const dateFormat = DateTime.fromFormat(
      date,
      format,
      opts ? opts : undefined
    );
    if (dateFormat.isValid) {
      return dateFormat;
    }
  }
}
