import { Response, NextFunction } from 'express';
import projectService, { type CreateProjectModel, type ProjectModel } from '../services/projects.service';
import { API } from '../routes/api.impl';
import { upload, remove, type FileUploadInfo, type FileUploadOption } from '../util/files';

export function projectExist({ params, throwOnExist = false, checkId = false }: { params?: any, throwOnExist?: boolean, checkId?:boolean }): Function {
  return (req: any, res: Response, next: NextFunction): void => {
    let append: any = {};

    if (params != undefined) {
      for (const param of params)
        append[param[0]] = req.body[param[1]];
    }

    const whereClause: ProjectModel = {
      ...append,
      ...(checkId && { id: parseInt(req.params.id) }),
      owned_by: req._passport.user_profile.user_account.id,
      deleted_at: null
    };
    projectService.get(whereClause, { limit: 1 })
    .then(projects => {
      if (throwOnExist && projects.length)
        next(API.conflict("PROJECT_EXIST"));

      // attach to request body so that we don't have to query the db in the next middleware.
      if (projects && projects.length)
        req.body.__projects__ = projects[0];
      next();
    })
    .catch((error) => {
      console.log('error > ', error);
      next(API.internalServerError("INTERNAL_SERVER_ERROR:GET_FAILED:PROJECT"))
    });
  };
};

export function abortIfNonExistent(req: any, res: Response, next: NextFunction): void {
  if (req.body.__projects__ == undefined)
    return next(API.notFound("NOT_FOUND:PROJECTS:NON_EXISTENT"));
  next();
};

export function tryDeleteExistingProjectBanner(req: any, res: Response, next: NextFunction): void {
  if (req.files == undefined || !req.files.length)
    return next();

  const project: any = req.body.__projects__;

  if (!project.banner_img_url?.length)
    return next();

  const filename: string = (project.banner_img_url.split("/")).pop();
  const path: string = `${process.env.NODE_ENV}/user_account_id_${req._passport.user_profile.user_account.id}/projects/banners/${filename}`;
  remove(path)
  .then(() => next())
  .catch((error: any) => next(API.badRequest("BAD_REQUEST:REMOVE_BANNER_IMAGE_FAILED")));
};

export function updateProjectBannerUrl(req: any, res: Response, next: NextFunction): void {
  const properties: ProjectModel = { banner_img_url: req.body?.__file__?.url };

  projectService.updateProject(properties, parseInt(req.params.id))
  .then(project => {
    const result = API.ok("Success!");
    result.attach(project);
    res.status(result.statusCode()).json(result);
  })
  .catch(err => (API.internalServerError("INTERNAL_SERVER_ERROR:FAILED_TO_STORE_PROJECT_UPDATE")));
};

export function tryUploadProjectBanner(req: any, res: Response, next: NextFunction): void {
  // Skip if there are no files present.
  if (req.files == undefined || !req.files.length)
    return next();

  const option: FileUploadOption = { dstPath: `${process.env.NODE_ENV}/user_account_id_${req._passport.user_profile.user_account.id}/projects/banners` };
  const uploads: FileUploadInfo[] = [];

  for (const file of req.files) {
    const uploadInfo: FileUploadInfo = { file: file, option: option };
    uploads.push(uploadInfo);
  };

  upload(uploads)
  .then(files => {
    if (!files.length)
      return next(API.badRequest("BAD_REQUEST:NO_BANNER_IMAGE_HAVE_BEEN_UPLOADED"));

    const file: any = files.shift();
    req.body.__file__ = file;
    next();
  })
  .catch(err => next(API.badRequest("BAD_REQUEST:IMAGE_UPLOAD_ERROR")));
};

export function createNewProject(req: any, res: Response, next: NextFunction): void {

  const properties: CreateProjectModel = {
    title: req.body.title,
    tag: req.body.tag,
    description: req.body.description,
    tag_id: parseInt(req.body.tag_id),
    ...(req.body.__file__ != undefined && { banner_img_url: req.body.__file__.url }),
    ...(req.body.repo_url != undefined && { repo_url: req.body.repo_url }),
    ...(req.body.repo_type != undefined && { repo_type: req.body.repo_type }),
    show: true,
    owned_by: req._passport.user_profile.user_account.id
  };

  projectService.createOne(properties)
  .then(project => {
    const result = API.ok("Success!");
    result.attach(project);
    res.status(result.statusCode()).json(result);
  })
  .catch(err => next(API.badRequest("INTERNAL_SERVER_ERROR:FAILED_TO_STORE_PROJECT")));
};

export function removeProjectHTML(req: any, res: Response, next: NextFunction): void {
  // Don't have to delete anything if there's nothing to upload.
  if (req.files == undefined || !req.files.length || req.body.__projects__.content_url == null)
    return next();

  const project: any = req.body.__projects__;
  const filename: string = (project.content_url.split("/")).pop();
  const path: string = `${process.env.NODE_ENV}/user_account_id_${req._passport.user_profile.user_account.id}/projects/${project.id}/${filename}`;
  remove(path)
  .then(() => next())
  .catch((error: any) => next(API.badRequest("BAD_REQUEST:REMOVE_PROJECT_HTML_FAILED")));
};

export function uploadProjectHTML(req: any, res: Response, next: NextFunction): void {

  if (req.files == undefined || !req.files.length)
    return next();

  const project: any = req.body.__projects__;
  const option: FileUploadOption = { dstPath: `${process.env.NODE_ENV}/user_account_id_${req._passport.user_profile.user_account.id}/projects/${project.id}` };
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
  .catch(err => next(API.badRequest("BAD_REQUEST:PROJECT_UPLOAD_ERROR")));
};

export function removeProjectNonPrimaryTags(req: any, res: Response, next: NextFunction): void {
  if (req.body.tag_ids == undefined)
    return next();

  projectService.removeProjectNonPrimaryTags(parseInt(req.params.id))
  .then(() => {
    next();
  })
  .catch(error => next(API.internalServerError("INTERNAL_SERVER_ERROR:COULD_NOT_REMOVE_NON_PRIMARY_TAGS")));
};

export function updateProject(req: any, res: Response, next: NextFunction): void {
  const properties: ProjectModel = {
    title: req.body.title,
    description: req.body.description,
    content_url: req.body?.__file__?.url,
    repo_type: req.body.repo_type,
    repo_url: req.body.repo_url,
    show: req.body.show,
    publish: req.body.publish,
    hash: req.body.hash
  };

  const tagIds: number[] = req.body.tag_ids || [];

  projectService.updateProject(properties, parseInt(req.params.id), tagIds)
  .then(project => {
    const result = API.ok("Success!");
    result.attach(project);
    res.status(result.statusCode()).json(result);
  })
  .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:FAILED_TO_STORE_PROJECT_UPDATE")));
};

export function getInternal(req: any, res: Response, next: NextFunction): void {
  const { limit, cursorId, order } = req.query;
  const properties: ProjectModel = {
    owned_by: req._passport.user_profile.user_account.id,
    deleted_at: null
  };
  projectService.get(properties, {
    ...(limit != undefined && { limit: parseInt(limit) }),
    ...(cursorId != undefined && { cursorId: cursorId }),
    ...(order != undefined && { order: order })
  })
  .then(projects => {
    const result = API.ok("Success!");
    result.attach(projects);
    res.status(result.statusCode()).json(result);
  })
  .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:FAILED_TO_GET_PROJECT_LIST")));
};

export function getOne(req: any, res: Response, next: NextFunction): void {
 projectService.getOne(parseInt(req.params.id))
 .then(project => {
  const result = API.ok("Success!");
  result.attach(project);
  res.status(result.statusCode()).json(result);
 })
 .catch(error => next(API.internalServerError("INTERNAL_SERVER_ERROR:FAILED_TO_GET_PROJECT_WITH_ID")));
};

export function getOnePublic(req: any, res: Response, next: NextFunction): void {
  projectService.getOnePublic(decodeURI(req.params.tag))
  .then(article => {
    const result = API.ok("Success!");
    result.attach(article);
    res.status(result.statusCode()).json(result);
  })
  .catch(error => next(API.internalServerError("INTERNAL_SERVER_ERROR:FAILED_TO_GET_ARTICLE_WITH_ID")));
};

export function getPublic(req: any, res: Response, next: NextFunction): void {
  const { limit, cursorId, order } = req.query;
  const properties: ProjectModel = {
    // ...(tag_id != undefined && { tag_id: parseInt(tag_id) }),
    owned_by: req.body.user_account.id,
    publish: true,
    deleted_at: null,
    show: true
  };
  projectService.getPublic(properties, {
    ...(limit != undefined && { limit: parseInt(limit) }),
    ...(cursorId != undefined && { cursorId: parseInt(cursorId) }),
    ...(order != undefined && { order: order })
  })
  .then(projects => {
    const result = API.ok("Success!");
    result.attach(projects);
    res.status(result.statusCode()).json(result);
  })
  .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:FAILED_TO_GET_PROJECT_LIST")));
};

export function deleteProject(req: any, res: Response, next: NextFunction): void {
  projectService.deleteProject(parseInt(req.params.id))
  .then(() => {
    const result = API.ok("Success!");
    res.status(result.statusCode()).json(result);
  })
  .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:FAILED_TO_DELETE_PROJECT")));
}
