import http, { validateRequestSchema, } from './api.impl';
import { isUserAuthenticated } from '../auth/auth.impl';
import groupSchema from '../schema/group.schema';
import * as groupController from '../controllers/groups.controller';
import * as userController from '../controllers/user.controller';

http.post(
  "group",
  isUserAuthenticated,
  validateRequestSchema(groupSchema.newGroup),
  groupController.groupExists({ params: [ [ "name", "name" ] ], throwOnExist: true }),
  groupController.createGroup
);

http.get(
  "groups",
  isUserAuthenticated,
  groupController.getAllGroupsForUser
);

http.get(
  "public_groups",
  userController.emailExist(),
  groupController.getPublicGroups
)

// http.get(
//   "group/:id",
//   isUserAuthenticated,
//   groupController.getGroupWithId
// );

http.patch(
  "group/:id",
  isUserAuthenticated,
  validateRequestSchema(groupSchema.editGroup),
  groupController.groupExists({ params: [ [ "name", "name" ] ], throwOnExist: true }),
  groupController.editGroup
);

http.delete(
  "group/:id",
  isUserAuthenticated,
  groupController.isGroupReferenced(),
  groupController.removeGroupWithId
);
