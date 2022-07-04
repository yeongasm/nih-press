import { Response, NextFunction } from 'express';
import { API } from './../routes/api.impl';
import multer from 'multer';
import fs from 'fs';
import sharp from 'sharp';
import * as firebase from './firebase';
import { TEMP_DIR } from './paths';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, TEMP_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const storeFile = multer({ storage: storage });

export function deleteFiles(files: any) {
  for (const file of files) {
    fs.stat(file.path, (err, stat) => {
      if (err)
        throw err;
      fs.unlink(file.path, (err) => {
        if (err)
          throw err;
      });
    });
  }
};

interface UploadedFile {
  filename: string,
  url: string
};
type UploadedFiles = UploadedFile[];

interface ImgResizeDim {
  width: number,
  height: number
};

export interface FileUploadOption {
  resize?: boolean,
  dstPath?: string,
  resizeDimension?: ImgResizeDim,
  quality?: number
};

export interface FileUploadInfo {
  file: any,
  option?: FileUploadOption
};

export interface FileUploadRawInfo {
  content: string,
  filename: string,
  dstPath: string
};

export function getFileExtension(file: any): string {
  const nameSections: string[] = file.originalname.split(".");
  return nameSections[nameSections.length - 1].toLowerCase();
};

export function processImageFile(
  file: any,
  resize: boolean = false,
  dimension: ImgResizeDim = { width: 1000, height: 1000 },
  quality: number = 80): Promise<Buffer>
{
  return new Promise((resolve, reject) => {
    const extension: string = getFileExtension(file);
    const sharpInstance = sharp(file.path);
    if (resize) {
      sharpInstance.resize(dimension.width, dimension.height, {
        kernel: sharp.kernel.nearest,
        fit: "inside",
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      });
    }
    sharpInstance.withMetadata();

    switch(extension) {
      case 'png':
        sharpInstance.png({ quality: quality });
        break
      case 'gif':
        sharpInstance.gif();
        break;
      case 'jpg':
      case 'jpeg':
      default:
        sharpInstance.jpeg({ quality: quality });
        break;
    }

    sharpInstance.toBuffer()
    .then(data => resolve(data))
    .catch(err => reject(err));
  });
};

export function upload(uploadInfo: FileUploadInfo[]): Promise<UploadedFiles> {
  return new Promise((resolve, reject) => {
    let uploadedFiles: UploadedFiles = [];
    for (const _upload of uploadInfo) {
      const file = _upload.file;
      const dstPath = (_upload?.option?.dstPath || "") + "/" + file.filename;
      if (file.mimetype.startsWith("image")) {
        processImageFile(file, _upload?.option?.resize, _upload?.option?.resizeDimension, _upload?.option?.quality)
          .then(data => {
            firebase.uploadBlob(dstPath, data)
              .then(url => {
                uploadedFiles.push({ filename: file.filename , url: url });
                (uploadedFiles.length == uploadInfo.length) && resolve(uploadedFiles);
              })
              .catch(err => reject(err))
              .finally(() => deleteFiles([ file ]))
          })
          .catch(err => reject(err));
      } else {
        fs.readFile(file.path, (err, data) => {
          if (err)
            return reject(err);

          firebase.uploadBlob(dstPath, Buffer.from(data))
            .then(url => {
              uploadedFiles.push({ filename: file.filename, url: url });
              (uploadedFiles.length == uploadInfo.length) && resolve(uploadedFiles);
            })
            .catch(err => reject(err))
            .finally(() => deleteFiles([ file ]))
        });
      }
    }
  });
};

export function uploadRaw(uploadInfo: FileUploadRawInfo[]): Promise<UploadedFiles> {
  return new Promise((resolve, reject) => {
    let uploadedFiles: UploadedFiles = [];
    for (const _upload of uploadInfo) {
      firebase.uploadBlob(_upload.dstPath, Buffer.from(_upload.content, 'utf8'))
      .then(url => {
        uploadedFiles.push({ filename: _upload.filename, url: url });
        (uploadedFiles.length == uploadInfo.length) && resolve(uploadedFiles);
      })
      .catch(err => reject(err))
    }
  });
};

export function remove(path: string): Promise<boolean> {
  return firebase.deleteBlob(path);
};

export function onlyAllowFilesWithExtension(extensions: string[]) {
  return (req: any, res: Response, next: NextFunction) => {
    if (req.files != undefined && Object.entries(req.files).length) {
      // flatten object into array.
      if (!Array.isArray(req.files))
        req.files = Array.from(Object.entries(req.files), ([k, v]) => v).flat();

      let count: number = req.files.length;

      for (let file of req.files) {
        if (!extensions.includes(getFileExtension(file)))
          break;
        count--;
      }

      if (count) {
        deleteFiles(req.files);
        return next(
          API.badRequest(`INVALID_FILE_TYPE:PERMISSABLE_EXTENSIONS:${extensions.join("_").toUpperCase()}`)
        );
      }
    }
    next();
  };
};

export default {
  storeFile,
  processImageFile,
  getFileExtension,
  deleteFiles,
  upload,
  uploadRaw,
  remove,
  onlyAllowFilesWithExtension
};
