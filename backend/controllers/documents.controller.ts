import { Response, NextFunction } from 'express';
import { API } from './../routes/api.impl';
import { processImageFile, upload, deleteFiles, type FileUploadInfo, type FileUploadOption } from '../util/files';
import documentService, { type DocumentModel, type UploadDocumentModel } from '../services/documents.services';
import { getFileExtension } from '../util/files';

export function compressImage(req: any, res: Response, next: NextFunction): void {

  const file = req.files.shift();
  const resizeDim = { width: parseInt(req.body.width || 0), height: parseInt(req.body.height || 0) };
  const resizeImg: boolean = (resizeDim.width > 0 && resizeDim.height > 0);

  processImageFile(file, resizeImg, resizeDim, parseInt(req.body.quality))
  .then(data => {
    const result = API.ok("Success!");
    res.status(result.statusCode()).send(`data:${file.mimetype};base64,${data.toString('base64')}`);
  })
  .catch(() => {
    next(API.badRequest("BAD_REQUEST:COMPRESS_IMAGE_FAILED"));
  })
  .finally(() => deleteFiles([ file ]));
};

export function newDocument(req: any, res: Response, next: NextFunction): void {
  const option: FileUploadOption = { dstPath: `${process.env.NODE_ENV}/user_account_id_${req._passport.user_profile.user_account.id}/${req.body.type}` };
  const uploads: FileUploadInfo[] = [];

  for (const file of req.files) {
    const uploadInfo: FileUploadInfo = { file: file, option: option };
    uploads.push(uploadInfo);
  };

  upload(uploads)
  .then(files => {
    if (!files.length)
      return next(API.badRequest("BAD_REQUEST:NO_DOCUMENT_HAVE_BEEN_UPLOADED"));

    const file: any = files.shift();

    const params: UploadDocumentModel = {
      original_filename: file.filename,
      type: req.body.type,
      extension: getFileExtension(file),
      url: file.url
    };

    documentService.uploadOne(params, req.body.__tag__.id, req._passport.user_profile.user_account.id)
    .then((document) => {
      const result = API.ok("Success!");
      result.attach(document);
      res.status(result.statusCode()).json(result);
    })
    .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:FAILED_TO_STORE_DOCUMENT")));
  })
  .catch(err => next(API.badRequest("BAD_REQUEST:DOCUMENT_UPLOAD_ERROR")));
};

export function uploadImage(req: any, res: Response, next: NextFunction): void {
  const tag: any = req.body.__tag__;
  const option: FileUploadOption = { dstPath: `${process.env.NODE_ENV}/user_account_id_${req._passport.user_profile.user_account.id}/image/tag_id_${tag.id}` };
  const uploads: FileUploadInfo[] = [];

  for (const file of req.files) {
    const uploadInfo: FileUploadInfo = { file: file, option: option };
    uploads.push(uploadInfo);
  };


  upload(uploads)
  .then(files => {
    if (!files.length)
      return next(API.badRequest("BAD_REQUEST:NO_DOCUMENT_HAVE_BEEN_UPLOADED"));

    const file: any = files.shift();
    req.body.__file__ = file;
    next();
  })
  .catch(err => next(API.badRequest("BAD_REQUEST:IMAGE_UPLOAD_ERROR")));
};

export function storeImage(req: any, res: Response, next: NextFunction): void {
  // Taken from the previous middleware.
  const file: any = req.body.__file__;
  const params: UploadDocumentModel = {
    original_filename: file.filename,
    type: "image",
    extension: (file.filename.split(".")).pop(),
    url: file.url
  };

  documentService.uploadOne(params, req.body.__tag__.id, req._passport.user_profile.user_account.id)
  .then(document => {
    const result = API.ok("Success!");
    result.attach(document);
    res.status(result.statusCode()).json(result);
  })
  .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:FAILED_TO_STORE_DOCUMENT")));
};

export function getImages(req: any, res: Response, next: NextFunction): void {
  const { tagId, limit, cursorId, order } = req.query;
  const properties: DocumentModel = {
    type: 'image',
    uploaded_by: req._passport.user_profile.user_account.id,
    deleted_at: null
  };
  documentService.get(properties, parseInt(tagId), {
    ...(limit != undefined && { limit: parseInt(limit) }),
    ...(cursorId != undefined && { cursorId: parseInt(cursorId) }),
    ...(order != undefined && { order: order }),
   })
  .then(documents => {
    const result = API.ok("Success!");
    result.attach(documents);
    res.status(result.statusCode()).json(result);
  })
  .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:FAILED_TO_GET_DOCUMENT_LIST")));
};

export function deleteDocument(req: any, res: Response, next: NextFunction): void {
  documentService.deleteOne(parseInt(req.params.id))
  .then(() => {
    const result = API.ok("Success!");
    res.status(result.statusCode()).json(result);
  })
  .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:DELETE_DOCUMENT_FAILED")));
};
