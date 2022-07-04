import { Response, NextFunction } from 'express';
import tagService, { type TagModel, type CreateTagModel, type UpdateTagModel } from '../services/tags.service';
import { API } from '../routes/api.impl';

export function tagExists({ params, throwOnExist = false, passOnNonExistent = true }: { params: any, throwOnExist?: boolean, passOnNonExistent?: boolean }): Function {
  return (req: any, res: Response, next: NextFunction): void => {
    let append: any = {};

    for (const param of params) {
      append[param[0]] = req.body[param[1]];
      if (!isNaN(append[param[0]]))
        append[param[0]] = parseInt(append[param[0]]);
    }

    // If the key is not present in this middleware, we skip it.
    for (const key in append) {
      if (req.body[key] == undefined && passOnNonExistent)
        return next();
    }

    const whereClause: TagModel = {
      ...append,
      created_by: req._passport.user_profile.user_account.id,
      deleted_at: null
    };
    tagService.getTag(whereClause, { limit: 1 })
    .then(tags => {
      if (throwOnExist && tags.length)
        next(API.conflict("KEY_EXIST"));
      // attach to request body so that we don't have to query the db in the next middleware.
      if (tags.length)
        req.body.__tag__ = tags[0];
      next();
    })
    .catch((err) => next(API.internalServerError("INTERNAL_SERVER_ERROR:GET_FAILED:CATEGORY")));
  }
};

export function create(req: any, res: Response, next: NextFunction): void {
  const tag: CreateTagModel = {
    key: req.body.key,
    value: req.body.value,
    hidden: req.body.hidden,
    created_by: req._passport.user_profile.user_account.id,
    is_primary_tag: req.body.is_primary_tag
  };
  req.body.__groups__ && (tag.group_id = req.body.__groups__.id);
  tagService.createOne(tag)
  .then(tag => {
    const result = API.ok("CREATE_CATEGORY_OK");
    result.attach(tag);
    res.status(result.statusCode()).json(result);
  })
  .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:CREATE_CATEGORY_ERROR")));
};

export function update(req: any, res: Response, next: NextFunction): void {
  const tag: UpdateTagModel = {
    key: req.body?.key,
    value: req.body?.value,
    hidden: req.body?.hidden,
    group_id: req.body?.group_id
  };
  req.body.__groups__ && (tag.group_id = req.body.__groups__.id);
  tagService.updateOne(tag, parseInt(req.params.id))
  .then(tag => {
    const result = API.ok("UPDATE_CATEGORY_OK");
    result.attach(tag);
    res.status(result.statusCode()).json(result);
  })
  .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:UPDATE_CATEGORY_ERROR")));
};

export function getTagsForUser(req: any, res: Response, next: NextFunction): void {
  const { limit, cursor, order } = req.query;
  // NOTE:
  // req.body.user_account.id is set by the previous middleware
  const tagSearchParam : TagModel = {
    created_by: req._passport.user_profile.user_account.id || req.body.user_account.id,
    deleted_at: null,
    is_primary_tag: false
  };
  tagService.getTag(tagSearchParam, {
    ...(limit   != undefined && { limit: parseInt(limit) }),
    ...(cursor  != undefined && { cursor: parseInt(cursor) }),
    ...(order   != undefined && { order: order }),
  })
  .then(tags => {
    const result = API.ok("Success!");
    result.attach(tags);
    res.status(result.statusCode()).json(result);
  })
  .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:GET_FAILED:CATEGORIES")));
};

export function remove(req: any, res: Response, next: NextFunction): void {
  tagService.deleteOne(parseInt(req.params.id))
  .then(() => {
    const result = API.ok("DELETE_CATEGORY_OK");
    res.status(result.statusCode()).json(result);
  })
  .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:DELETE_CATEGORY_ERROR")));
};
