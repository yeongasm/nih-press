import { Request, Response, NextFunction } from 'express';
import categoryService, { type CategoryModel, type CreateCategoryModel, type UpdateCategoryModel } from '../services/categories.service';
import { API } from './../routes/api.impl';

export function keyExists(throwOnExist: boolean = false): Function {
  return (req: any, res: Response, next: NextFunction): void => {
  const whereClause: CategoryModel = {
    created_by: req._passport.user.id,
    key: req.body.key,
    deleted_at: null
  };
  categoryService.getCategory(whereClause)
  .then(categories => {
    if (throwOnExist && categories.length)
      next(API.conflict("KEY_EXIST"));
    // attach to request body so that we don't have to query the db in the next middleware.
    if (categories.length)
      req.body.__categories__ = categories;
    next();
  })
  .catch(() => next(API.internalServerError("INTERNAL_SERVER_ERROR:GET_FAILED:CATEGORY")));
  }
};

export function create(req: any, res: Response, next: NextFunction): void {
  const category: CreateCategoryModel = {
    key: req.body.key,
    value: req.body.value,
    type: req.body.type,
    created_by: req._passport.user.id
  };
  req.body.__groups__ && (category.group_id = req.body.__groups__.id);
  categoryService.createOne(category)
  .then(category => {
    const result = API.ok("CREATE_CATEGORY_OK");
    result.attach(category);
    res.status(result.statusCode()).json(result);
  })
  .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:CREATE_CATEGORY_ERROR")));
};

export function update(req: any, res: Response, next: NextFunction): void {
  const category: UpdateCategoryModel = {
    key: req.body?.key,
    value: req.body?.value,
    type: req.body?.type,
  };
  req.body.__groups__ && (category.group_id = req.body.__groups__.id);
  categoryService.updateOne(category, req._passport.user.id)
  .then(category => {
    const result = API.ok("UPDATE_CATEGORY_OK");
    result.attach(category);
    res.status(result.statusCode()).json(result);
  })
  .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:UPDATE_CATEGORY_ERROR")));
};

export function remove(req: any, res: Response, next: NextFunction): void {
  categoryService.deleteOne(req._passport.user.id)
  .then(() => {
    const result = API.ok("DELETE_CATEGORY_OK");
    res.status(result.statusCode()).json(result);
  })
  .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:DELETE_CATEGORY_ERROR")));
};
