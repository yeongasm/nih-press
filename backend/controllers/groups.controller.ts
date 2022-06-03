import { Request, Response, NextFunction } from 'express';
import groupsService, { type GroupModel, type CreateGroupModel } from '../services/groups.service';
import { API } from './../routes/api.impl';

/**
 * Attaches a __groups__ object to the request's body if it exists.
 * @param param - object's key in the requests body that carries the name of the group.
 * @param throwOnExist - Returns a conflict on the request if the group exists when set to true.
 */
export function groupExists({ param, throwOnExist = false }: { param: string, throwOnExist?: boolean }): Function {
  return (req: any, res: Response, next: NextFunction): void => {
    const searchClause: GroupModel = {
      name: req.body[param],
      created_by: req._passport.user.id
    };
    groupsService.getGroups(searchClause)
    .then(groups => {
      if (throwOnExist && groups)
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
    created_by: req._passport.user.id
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
  const groupSearchParams: GroupModel = {
    created_by: req._passport.user.id,
    deleted_at: null
  };
  groupsService.getGroups(groupSearchParams, [ 'id', 'name', 'created_by', 'created_at', 'edited_at' ])
  .then(groups => {
    const result = API.ok("Success!");
    result.attach(groups);
    res.status(result.statusCode()).json(result);
  })
  .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:GET_FAILED:GROUPS")));
};

// export function getGroupWithId(req: any, res: Response, next: NextFunction): void {
//   const groupSearchParams: GroupModel = {
//     id: req.query.id,
//     deleted_at: null
//   };
//   groupsService.getGroups(groupSearchParams)
//   .then(groups => {
//     const result = API.ok("Success!");
//     result.attach(groups);
//     res.status(result.statusCode()).json(result);
//   })
//   .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:GET_FAILED:GROUPS")));
// };

export function editGroup(req: any, res: Response, next: NextFunction): void {
  groupsService.updateGroupName(req.body.name, req.params.id)
  .then(group => {
    const result = API.ok("Success!");
    result.attach(group);
    res.status(result.statusCode()).json(result);
  })
  .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:CREATE_FAILED:GROUP")));
};

export function removeGroupWithId(req: any, res: Response, next: NextFunction): void {
  groupsService.deleteGroup(req.params.id)
  .then(() => {
    const result = API.ok("Success!");
    res.status(result.statusCode()).json(result);
  })
  .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:CREATE_FAILED:GROUP")));
};
