import { Response, NextFunction } from 'express';
import articlesService, { type ArticlesModel, type CreateArticleModel, type UpdateArticleModel } from '../services/articles.service';
import userProfileService from '../services/userProfile.service';
import { API } from './../routes/api.impl';
import { upload, remove, type FileUploadOption, type FileUploadInfo } from '../util/files';

export function articleTitleExist(throwOnExist: boolean = false): Function {
  return (req: any, res: Response, next: NextFunction): void => {
  const whereClause: ArticlesModel = {
    created_by: req._passport.user.id,
    title: req.body.title
  };
  articlesService.get(whereClause)
    .then(articles => {
      if (throwOnExist && articles.length)
        next(API.conflict("KEY_EXIST"));
      // attach to request body so that we don't have to query the db in the next middleware.
      if (articles.length)
        req.body.__article__ = articles[0];
      next();
    })
    .catch(() => next(API.internalServerError("INTERNAL_SERVER_ERROR:GET_FAILED:CATEGORY")));
  }
};

export function deleteArticleFromStorage(req: any, res: Response, next: NextFunction): void {
  articlesService.get({ id: req.params.id })
  .then(articles => {
    const article = articles[0];
    remove(article.url);
    next();
  })
  .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:ARTICLE_WITH_ID_NON_EXISTENT")));
};

export function uploadArticle(throwIfNoFile: boolean = false): Function {
  return (req: any, res: Response, next: NextFunction): void => {
    const option: FileUploadOption = { dstPath: `${req._passport.user.id}\\articles` };
    const uploads: FileUploadInfo[] = [];

    for (const file of req.files) {
      const uploadInfo: FileUploadInfo = { file: file, option: option };
      uploads.push(uploadInfo);
    };

    // Extra checking to enforce the users to upload a file.
    if (throwIfNoFile && !uploads.length)
      return next(API.badRequest("BAD_REQUEST:NO_ARTICLE_TO_BE_CREATED"));

    if (!uploads.length)
      return next();

    // We upload an array of files but we know that it's only ever going to be 1 file uploaded at a time.
    upload(uploads)
    .then(files => {
      const article = files.shift();
      req.body.__article__ = article;
      next();
    })
    .catch(err => next(API.badRequest("BAD_REQUEST:ARTICLE_UPLOAD_ERROR")));
  };
};

export function create(req: any, res: Response, next: NextFunction): void {
  userProfileService.get({ user_account_id: req._passport.user.id })
  .then(userProfiles => {
    const userProfile = userProfiles[0];
    const create: CreateArticleModel = {
      title: req.body.title,
      description: req.body.description,
      category_id: req.body.category_id,
      url: req.body.__article__?.url || "",
      created_by: userProfile.id
    };
    articlesService.createOne(create)
    .then(article => {
      const result = API.ok("Success!");
      result.attach(article);
      res.status(result.statusCode()).json(result);
    })
    .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:CREATE_ARTICLE_FAILED")));
  })
  .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:GET_USER_PROFILE_FAILED")));
};

export function update(req: any, res: Response, next: NextFunction): void {
  userProfileService.get({ user_account_id: req._passport.user.id })
  .then(userProfiles => {
    const userProfile = userProfiles[0];
    const update: UpdateArticleModel = {
      title: req.body?.title,
      description: req.body?.description,
      url: req.body?.__article__?.url,
      category_id: req.body?.category_id,
      edited_by: userProfile.id,
      edited_at: new Date()
    };
    articlesService.edit(update, req.params.id)
    .then(article => {
      const result = API.ok("Success!");
      result.attach(article);
      res.status(result.statusCode()).json(result);
    })
    .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:CREATE_ARTICLE_FAILED")));
  })
  .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:GET_USER_PROFILE_FAILED")));
};

export function getArticleWithID(req: any, res: Response, next: NextFunction): void {
  const { id } = req.params;
  const article: ArticlesModel = { id: id };
  articlesService.get(article)
  .then(articles => {
    const result = API.ok("Success!");
    result.attach(articles[0]);
    res.status(result.statusCode()).json(result);
  })
  .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:GET_ARTICLE_FAIELD")));
};

export function getArticleWithUserID(req: any, res: Response, next: NextFunction): void {
  userProfileService.get({ id: req.params.id })
  .then(userProfiles => {
    const userProfile = userProfiles[0];
    articlesService.get({ created_by: userProfile.id })
    .then(articles => {
      const result = API.ok("Success!");
      result.attach(articles);
      res.status(result.statusCode()).json(result);
    })
    .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:GET_ARTICLES_FAILED")));
  })
  .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:GET_USER_PROFILE_FAILED")));
};

export function deleteArticle(req: any, res: Response, next: NextFunction): void {
  userProfileService.get({ user_account_id: req._passport.user.id })
  .then(userProfiles => {
    const userProfile = userProfiles[0];
    articlesService.deleteOne(userProfile.id, req.params.id)
    .then(() => {
      const result = API.ok("Success!");
      res.status(result.statusCode()).json(result);
    })
    .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:DELETE_ARTICLE_FAILED")));
  })
  .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:GET_USER_PROFILE_FAILED")));
};
