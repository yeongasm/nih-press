import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

/**
 * Returns today's date in UTC.
 * @returns Date
 */
const getCurrentDateUTC = (): Date => dayjs().utc(true).toDate();

/**
 * Returns date after adding today's date with some amount in UTC.
 * @param value number
 * @param unit string
 * @returns Date
 */
const dateAfter = (value: number, unit: string): Date => dayjs().add(value, unit).utc(true).toDate();

/**
 * Compares date "a" with date "b" and return true if "a" > "b" else false.
 * @param a Date
 * @param b Date
 * @returns boolean
 */
const isDateAfter = (a: Date, b: Date): boolean => (dayjs(a).utc(true) > dayjs(b).utc(true));

export default {
  dayjs,
  getCurrentDateUTC,
  dateAfter,
  isDateAfter
};
