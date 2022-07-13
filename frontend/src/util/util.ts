import * as dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
// import sharp from 'sharp';
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
  if (route.charAt(0) == "/" || route.charAt(0) == "\\")
    route = route.slice(1);
  urlPath = import.meta.env.VITE_ROOT_API_URL + route;
  return urlPath;
};

export const toStorage: Function = (key: string, value: any): void => localStorage.setItem(key, JSON.stringify(value));
export const fromStorage: Function = (key: string): any => JSON.parse(localStorage.getItem(key) || "{}");
export const delStorage: Function = (key: string): void => localStorage.removeItem(key);

export const formatDateAs = (date: Date, format: string): string => {
  return dayjs.utc(date).format(format);
};

export const getRandomInt = (): number => {
  return Math.floor(Math.random() * 999999999999999);
};

const getFileExtension = (file: any): string => {
  const nameSections: string[] = file.originalname.split(".");
  return nameSections[nameSections.length - 1].toLowerCase();
};

// Taken from: https://stackoverflow.com/a/8831937
/**
 * Returns a hash code from a string
 * @param  {String} str The string to hash.
 * @return {Number}    A 32bit integer
 * @see http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
 */
 export const hashString: Function = (str: string): number => {
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
      let chr = str.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

// interface ImgResizeDim {
//   width: number,
//   height: number
// };

// export const processImageFile = (
//   file: any,
//   resize: boolean = false,
//   dimension: ImgResizeDim = { width: 1000, height: 1000 },
//   quality: number = 80): Promise<Buffer> =>
// {
//   return new Promise((resolve, reject) => {
//     const extension: string = getFileExtension(file);
//     const sharpInstance = sharp(file.path);
//     if (resize) {
//       sharpInstance.resize(dimension.width, dimension.height, {
//         kernel: sharp.kernel.nearest,
//         fit: "inside",
//         background: { r: 255, g: 255, b: 255, alpha: 1 },
//       });
//     }
//     sharpInstance.withMetadata();

//     switch(extension) {
//       case 'png':
//         sharpInstance.png({ quality: quality });
//         break
//       case 'gif':
//         sharpInstance.gif();
//         break;
//       case 'jpg':
//       case 'jpeg':
//       default:
//         sharpInstance.jpeg({ quality: quality });
//         break;
//     }

//     sharpInstance.toBuffer()
//       .then(data => resolve(data))
//       .catch(err => reject(err));
//   });
// };

export default {
  queryStringFromObj,
  apiUrl,
  toStorage,
  fromStorage,
  delStorage,
  hashString,
  formatDateAs,
  getRandomInt//,
  // processImageFile
};
