import { Response, NextFunction } from 'express';
import articlesService, { type ArticlesModel, type CreateArticleModel, type UpdateArticleModel } from '../services/articles.service';
import { API } from './../routes/api.impl';
import { upload, remove, type FileUploadOption, type FileUploadInfo } from '../util/files';
import userProfileService from '../services/userProfile.service';

export function articleExist({ params, throwOnExist = false, checkId = false }: { params?: any, throwOnExist?: boolean, checkId?:boolean }): Function {
  return (req: any, res: Response, next: NextFunction): void => {
    let append: any = {};

    if (params != undefined) {
      for (const param of params)
        append[param[0]] = req.body[param[1]];
    }

    const whereClause: ArticlesModel = {
      ...append,
      ...(checkId && { id: parseInt(req.params.id) }),
      created_by: req._passport.user_profile.user_account.id,
      deleted_at: null
    };
    articlesService.get(whereClause, { limit: 1 })
    .then(articles => {
      if (throwOnExist && articles.length)
        next(API.conflict("CONFLICT:ARTICLE_TITLE_EXIST"));
      // attach to request body so that we don't have to query the db in the next middleware.
      if (articles && articles.length)
        req.body.__article__ = articles[0];
      next();
    })
    .catch((error) => next(API.internalServerError("INTERNAL_SERVER_ERROR:GET_FAILED:ARTICLE")));
  }
};

export function abortIfNonExistent(req: any, res: Response, next: NextFunction): void {
  if (req.body.__article__ == undefined)
    return next(API.notFound("NOT_FOUND:ARTICLES:NON_EXISTENT"));
  next();
};

export function removeArticleHTML(req: any, res: Response, next: NextFunction): void {
  // Don't have to delete anything if there's nothing to upload.
  if (req.files == undefined || !req.files.length || req.body.__article__.url == null)
    return next();

  const article: any = req.body.__article__;
  const filename: string = (article.url != null && article.url.length) ? (article.url.split("/")).pop() : req.files[0].filename;
  const path: string = `${process.env.NODE_ENV}/user_account_id_${req._passport.user_profile.user_account.id}/articles/${article.id}/${filename}`;
  remove(path)
  .then(() => next())
  .catch((error: any) => next(API.badRequest("BAD_REQUEST:REMOVE_PROJECT_HTML_FAILED")));
};

export function uploadArticleHTML(req: any, res: Response, next: NextFunction): void {

  if (req.files == undefined || !req.files.length)
    return next();

  const article: any = req.body.__article__;
  const option: FileUploadOption = { dstPath: `${process.env.NODE_ENV}/user_account_id_${req._passport.user_profile.user_account.id}/articles/${article.id}` };
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
  .catch(err => next(API.badRequest("BAD_REQUEST:ARTICLE_UPLOAD_ERROR")));
};

export function removeArticleNonPrimaryTags(req: any, res: Response, next: NextFunction): void {
  if (req.body.tag_ids == undefined)
    return next();

  articlesService.removeArticleNonPrimaryTags(parseInt(req.params.id))
  .then(() => {
    next();
  })
  .catch(error => next(API.internalServerError("INTERNAL_SERVER_ERROR:COULD_NOT_REMOVE_NON_PRIMARY_TAGS")));
};

export function create(req: any, res: Response, next: NextFunction): void {

  const params: CreateArticleModel = {
    title: req.body.title,
    tag: req.body.tag,
    description: req.body.description,
    publish: false,
    show: true,
    tag_id: parseInt(req.body.tag_id)
  };

  articlesService.createOne(params, req._passport.user_profile.id)
  .then(article => {
    const result = API.ok("Success!");
    result.attach(article);
    res.status(result.statusCode()).json(result);
  })
  .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:CREATE_ARTICLE_FAILED")));
};

export function update(req: any, res: Response, next: NextFunction): void {
  const update: UpdateArticleModel = {
    title: req.body?.title,
    description: req.body?.description,
    url: req.body?.__file__?.url,
    show: req.body.show,
    publish: req.body.publish,
    hash: req.body.hash
  };

  const tagIds: number[] = req.body.tag_ids || [];

  articlesService.edit(update, parseInt(req.params.id), req._passport.user_profile.id, tagIds)
  .then(article => {
    const result = API.ok("Success!");
    result.attach(article);
    res.status(result.statusCode()).json(result);
  })
  .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:CREATE_ARTICLE_FAILED")));
};

export function getInternal(req: any, res: Response, next: NextFunction): void {
  const { limit, cursorId, order } = req.query;
  const whereClause: ArticlesModel = {
    created_by: req._passport.user_profile.id,
    deleted_at: null,
    deleted_by: null
  };
  articlesService.get(whereClause, {
    ...(limit     != undefined && { limit: parseInt(limit) }),
    ...(cursorId  != undefined && { cursorId: parseInt(cursorId) }),
    ...(order     != undefined && { order: order }),
  })
  .then(articles => {
    const result = API.ok("Success!");
    result.attach(articles);
    res.status(result.statusCode()).json(result);
  })
  .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:FAILED_TO_GET_ARTICLES")));
};

export function getOne(req: any, res: Response, next: NextFunction): void {
  articlesService.getOne(parseInt(req.params.id))
  .then(articles => {
   const result = API.ok("Success!");
   result.attach(articles);
   res.status(result.statusCode()).json(result);
  })
  .catch(error => next(API.internalServerError("INTERNAL_SERVER_ERROR:FAILED_TO_GET_ARTICLE_WITH_ID")));
 };

export function getOnePublic(req: any, res: Response, next: NextFunction): void {
  articlesService.getOnePublic(decodeURI(req.params.tag))
  .then(article => {
    const result = API.ok("Success!");
    result.attach(article);
    res.status(result.statusCode()).json(result);
  })
  .catch(error => next(API.internalServerError("INTERNAL_SERVER_ERROR:FAILED_TO_GET_ARTICLE_WITH_ID")));
};

export async function getPublic(req: any, res: Response, next: NextFunction) {
  const { limit, cursorId, order } = req.query;

  userProfileService.getUserProfile(parseInt(req.body.user_account.id))
  .then(userProfiles => {
    const userProfile: any = userProfiles[0];
    const whereClause: ArticlesModel = {
      created_by: userProfile.id,
      deleted_at: null,
      deleted_by: null,
      show: true,
      publish: true
    };

    articlesService.getPublic(whereClause, {
      ...(limit     != undefined && { limit: parseInt(limit) }),
      ...(cursorId  != undefined && { cursorId: parseInt(cursorId) }),
      ...(order     != undefined && { order: order }),
    })
    .then(articles => {
      const result = API.ok("Success!");
      result.attach(articles);
      res.status(result.statusCode()).json(result);
    })
    .catch(err => {
      console.log('err > ', err);
      next(API.internalServerError("INTERNAL_SERVER_ERROR:FAILED_TO_GET_ARTICLES"))
    });
  });
};

export function deleteArticle(req: any, res: Response, next: NextFunction): void {
  articlesService.deleteOne(parseInt(req.params.id), req._passport.user_profile.user_account.id)
  .then(() => {
    const result = API.ok("Success!");
    res.status(result.statusCode()).json(result);
  })
  .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:DELETE_ARTICLE_FAILED")));
};
