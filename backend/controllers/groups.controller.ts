import { Request, Response, NextFunction } from 'express';
import groupsService, { type GroupModel, type CreateGroupModel } from '../services/groups.service';
import tagService, { type TagModel } from '../services/tags.service';
import { API } from './../routes/api.impl';

/**
 * Attaches a __groups__ object to the request's body if it exists.
 * @param param - object's key in the requests body that carries the name of the group.
 * @param throwOnExist - Returns a conflict on the request if the group exists when set to true.
 */
export function groupExists({ params, throwOnExist = false }: { params?: any, throwOnExist?: boolean }): Function {
  return (req: any, res: Response, next: NextFunction): void => {
    let append: any = {};

    if (params != undefined) {
      for (const param of params)
        append[param[0]] = req.body[param[1]];
    }

    const whereClause: GroupModel = {
      ...append,
      created_by: req._passport.user_profile.user_account.id,
      deleted_at: null
    };
    groupsService.getGroups(whereClause, { limit: 1 })
    .then(groups => {
      if (throwOnExist && groups.length)
        next(API.conflict("GROUP_EXIST"));
      // attach to request body so that we don't have to query the db in the next middleware.
      if (groups && groups.length)
        req.body.__groups__ = groups[0];
      next();
    })
    .catch(() => next(API.internalServerError("INTERNAL_SERVER_ERROR:GET_FAILED:GROUP")))
  };
};

export function createGroup(req: any, res: Response, next: NextFunction): void {
  const newGroup: CreateGroupModel = {
    name: req.body.name,
    created_by: req._passport.user_profile.user_account.id
  };
  groupsService.createOne(newGroup)
  .then(group => {
    const result = API.ok("Success!");
    result.attach(group);
    res.status(result.statusCode()).json(result);
  })
  .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:CREATE_FAILED:GROUP")));
};

export function getAllGroupsForUser(req: any, res: Response, next: NextFunction): void {
  const { limit, cursorId, order } = req.query;
  const whereClause: GroupModel = {
    created_by: req._passport.user_profile.user_account.id,
    deleted_at: null
  };
  groupsService.getGroups(whereClause, {
    ...(limit     != undefined && { limit: parseInt(limit) }),
    ...(cursorId  != undefined && { cursorId: parseInt(cursorId) }),
    ...(order     != undefined && { order: order }),
  })
  .then(groups => {
    const result = API.ok("Success!");
    result.attach(groups);
    res.status(result.statusCode()).json(result);
  })
  .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:GET_FAILED:GROUPS")));
};

export function getPublicGroups(req: any, res: Response, next: NextFunction): void {
  const { limit, cursorId, order } = req.query;
  // NOTE:
  // req.body.user_account.id is set by the previous middleware
  const whereClause: GroupModel = {
    created_by: req._passport.user_profile.user_account.id || req.body.user_account.id,
    deleted_at: null
  };
  groupsService.getPublic(whereClause, {
    ...(limit     != undefined && { limit: parseInt(limit) }),
    ...(cursorId  != undefined && { cursorId: parseInt(cursorId) }),
    ...(order     != undefined && { order: order }),
  })
  .then(groups => {
    const result = API.ok("Success!");
    result.attach(groups);
    res.status(result.statusCode()).json(result);
  })
  .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:GET_FAILED:GROUPS")));
};

export function isGroupReferenced(throwOnReferenced: boolean = true): Function {
  return (req: Request, res: Response, next: NextFunction): void => {
    const categorySearchParam: TagModel = {
      group_id: parseInt(req.params.id),
      deleted_at: null
    };

    tagService.getTag(categorySearchParam, { limit: 1 })
    .then(tags => {
      if (tags.length && throwOnReferenced)
        return next(API.badRequest("BAD_REQUEST:GROUP_STILL_REFERENCED"));
      next();
    })
    .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:UNABLE_TO_FETCH_CATEGORIES")));
  };
};

export function editGroup(req: any, res: Response, next: NextFunction): void {
  groupsService.updateGroupName(req.body.name, parseInt(req.params.id))
  .then(group => {
    const result = API.ok("Success!");
    result.attach(group);
    res.status(result.statusCode()).json(result);
  })
  .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:CREATE_FAILED:GROUP")));
};

export function removeGroupWithId(req: any, res: Response, next: NextFunction): void {
  groupsService.deleteGroup(parseInt(req.params.id))
  .then(() => {
    const result = API.ok("Success!");
    res.status(result.statusCode()).json(result);
  })
  .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:DELETE_FAILED:GROUP")));
};
