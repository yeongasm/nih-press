import { Request, Response, NextFunction } from 'express';
import { API } from './../routes/api.impl';
import userAccountService, { type UserAccountModel, type CreateUserAccount } from '../services/users.services';
import userProfileService from '../services/userProfile.service';
// import imageService from '../services/images.service.ts.dump.ts.dump';
import { genPasswordHash } from '../auth/auth.impl';
import { upload, type FileUploadOption, type FileUploadInfo } from '../util/files';

export function emailExist({ throwOnExist = false, continueIfNonExistent = true }: { throwOnExist?: boolean, continueIfNonExistent?: boolean } = {}): Function {
  return (req: Request, res: Response, next: NextFunction): void => {
    const param: UserAccountModel = { email: req.body.email || req.query.email };
    userAccountService.getUserWith(param)
      .then((userAccounts) => {
        if (throwOnExist && userAccounts.length)
          return next(API.conflict("EMAIL_EXIST"))

        if (!continueIfNonExistent && !userAccounts.length)
          return next(API.unprocessableEntity("EMAIL_NON_EXISTENT"));

        if (continueIfNonExistent && !userAccounts.length)
          return next();

        // attach to request body so that we don't have to query the db in the next middleware.
        req.body.user_account = userAccounts[0];
        next();
      })
      .catch((err) => {
        console.log('err > ', err);
        next(API.internalServerError("INTERNAL_SERVER_ERROR:FETCH_USER_FAILED:EMAIL"))
      });
  };
};

export function usernameExist(req: Request, res: Response, next: NextFunction): void {
  const param: UserAccountModel = {
    username: req.body.username
  };
  userAccountService.getUserWith(param)
  .then((userAccounts) => {
    if (userAccounts.length)
      return next(API.conflict("USERNAME_EXIST"));
    next();
  })
  .catch(() => next(API.internalServerError("INTERNAL_SERVER_ERROR:FETCH_USER_FAILED:USERNAME")));
};

export function create(req: Request, res: Response, next: NextFunction): void {
  const user: CreateUserAccount = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  };
  genPasswordHash(user.password)
    .then(hash => {
      user.password = hash;
      userAccountService.insertUser(user)
        .then(user_account => {
          // Create a user profile when a user account is created.
          userProfileService.createOne(user_account.id)
            .then(() => {
              const response = API.ok("Ok!");
              res.status(response.statusCode()).send(response.message);
            })
            .catch(() => next(API.badRequest("USER_ACCOUNT_CREATION_FAILED:USER_PROFILE_CREATION")));
        })
        .catch(() => next(API.badRequest("USER_ACCOUNT_CREATION_FAILED")));
    })
    .catch(() => next(API.badRequest("HASH_FAILED")));
};

export function idExist(req: Request, res: Response, next: NextFunction) : void {
  const user: UserAccountModel = {
    id: parseInt(req.params.id)
  };
  userAccountService.getUserWith(user)
    .then((userAccounts) => {
      if (!userAccounts.length)
        return next(API.notFound("USER_NON_EXISTENT"));
      next();
    })
    .catch(() => next(API.internalServerError("INTERNAL_SERVER_ERROR:FETCH_USER_FAILED:ID")));
};

export function remove(req: Request, res: Response, next: NextFunction): void {
  const id: number = parseInt(req.params.id);
  userAccountService.deleteUser(id)
    .then(result => {
      if (result) {
        const response = API.ok("DELETE_OK");
        res.status(response.statusCode()).send(response.message);
      }
    });
};

export function successfulLogin(req: Request, res: Response, next: NextFunction): void {
  const loggedIn = API.ok("Success!");
  res.status(loggedIn.statusCode()).send(loggedIn.message);
};

export function uploadProfileRelatedFiles(req: any, res: Response, next: NextFunction): void {
  const option: FileUploadOption = { dstPath: `${process.env.NODE_ENV}/user_account_id_${req._passport.user_profile.user_account.id}/${req.body.bucket}` };
  const uploads: FileUploadInfo[] = [];

  for (const file of req.files) {
    const uploadInfo: FileUploadInfo = { file: file, option: option };
    uploads.push(uploadInfo);
  };

  upload(uploads)
    .then(files => {
      const result = API.ok("Success!");
      result.attach(files.map(file => {
        return { filename: file.filename, url: file.url }
      }));
      res.status(result.statusCode()).json(result);
    })
    .catch(err => next(API.badRequest("BAD_REQUEST:FILE_UPLOAD_ERROR")));
};

// DEPRECATED!!!
// export function storeProfileImagesURL(req: any, res: Response, next: NextFunction): void {
//   if (!req.body.uploaded_files)
//     return next(API.badRequest("BAD_REQUEST:FILES_UPLOADED_BUT_URLS_NOT_STORED"));

//   let imagesToUpload: any = [];
//   for (const file of req.body.uploaded_files) {
//     imagesToUpload.push({
//       filename: file.filename,
//       url: file.url,
//       uploaded_by: req._passport.user_profile.user_account.id,
//       deleted_at: null
//     });
//   }

//   // imageService.storeImageURL(imagesToUpload)
//   //   .then(images => {
//   //     const result = API.ok("FILE_UPLOAD_OK");
//   //     result.attach(images);
//   //     res.status(result.statusCode()).json(result);
//   //   })
//   //   .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:FILE_UPLOAD_ERROR")));
// };
