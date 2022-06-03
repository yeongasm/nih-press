import { credential } from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { FIREBASE_CRED_PATH } from '../util/paths';
import path from 'path';

const firebaseApp = initializeApp({
  credential: credential.cert(FIREBASE_CRED_PATH),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

const storage = getStorage(firebaseApp);
const bucket = storage.bucket();

type UploadUrl = string;

export function uploadFileFromPath(srcPath: string, destination: string = '/'): Promise<UploadUrl> {
  return new Promise((resolve, reject) => {

    const pathSections: string[] = srcPath.split("/");
    const filename: string = pathSections[pathSections.length - 1];

    const storagePath = path.join(destination, filename);
    bucket.upload(srcPath, { destination: destination }, (err, file, apiResponse) => {
      if (err)
        reject(err);
      resolve(`https://storage.googleapis.com/${bucket.id}/${storagePath}`);
    });
  });
};

export function uploadBlob(dstPath: string, blob: string | Buffer): Promise<UploadUrl> {
  return new Promise((resolve, reject) => {
    const file = bucket.file(dstPath);
    file.save(blob, (err) => {
      if (err)
        return reject(err);
      resolve(`https://storage.googleapis.com/${bucket.id}/${dstPath}`);
    });
  });
};

export function deleteBlob(dstPath: string): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    const file = bucket.file(dstPath);
    file.delete({ ignoreNotFound: true }, (err) => {
      if (err)
        return reject(false);
      resolve(true);
    });
  });
};

export default {
  uploadFileFromPath,
  uploadBlob,
  deleteBlob
};
