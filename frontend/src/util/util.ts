import * as dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export const queryStringFromObj: Function = (obj: any): string => {
  let output: string = "?";
  Object.keys(obj).forEach((key) => {
    output += `${encodeURI(key)}=${encodeURI(obj[key])}&`
  });
  output = output.slice(0, -1); // Remove last "&".
  return output;
}

export const apiUrl: Function = (route: string): string => {
  let urlPath = route;
  if (import.meta.env.VITE_ENV == "development") {
    if (route.charAt(0) == "/" || route.charAt(0) == "\\")
      route = route.slice(1);
    urlPath = import.meta.env.VITE_ROOT_API_URL + route;
  }
  return urlPath;
};

export const toStorage: Function = (key: string, value: any): void => localStorage.setItem(key, JSON.stringify(value));
export const fromStorage: Function = (key: string): any => JSON.parse(localStorage.getItem(key) || "{}");
export const delStorage: Function = (key: string): void => localStorage.removeItem(key);

export const formatDateAs = (date: Date, format: string): string => {
  return dayjs.utc(date).format(format);
}

export const getRandomInt = (): number => {
  return Math.floor(Math.random() * 999999999999999);
}

export default {
  queryStringFromObj,
  apiUrl,
  toStorage,
  fromStorage,
  delStorage,
  formatDateAs,
  getRandomInt
}
