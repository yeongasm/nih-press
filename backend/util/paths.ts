import path from 'path';

export const __WORKING_DIR__: string = (process.env.NODE_ENV == "development")
  ? path.join(__dirname, "..")
  : path.join(__dirname, "..", "..");

export const KEY_PATH = path.join(__WORKING_DIR__, "keys");
export const PUBLIC_KEY_PATH: string    = path.join(KEY_PATH, process.env.PUBLIC_KEY_NAME || "");
export const PRIVATE_KEY_PATH: string   = path.join(KEY_PATH, process.env.PRIVATE_KEY_NAME || "");
export const FIREBASE_CRED_PATH: string = path.join(KEY_PATH, process.env.FIREBASE_CRED_NAME || "");
export const TEMP_DIR: string = path.join(__WORKING_DIR__, "temp");
