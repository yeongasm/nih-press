import http, { validateRequestSchema, } from './api.impl';
import tagSchema from '../schema/tags.schema';
import { isUserAuthenticated } from '../auth/auth.impl';
import * as tagsController from '../controllers/tags.controller';
import * as groupController from '../controllers/groups.controller';
import * as userController from '../controllers/user.controller';

http.post(
  "tag",
  isUserAuthenticated,
  validateRequestSchema(tagSchema.newTag),
  groupController.groupExists({ params: [ [ "id", "group_id" ] ] }),
  tagsController.tagExists({ params: [ [ "key", "key" ] ], throwOnExist: true }),
  tagsController.create
);

http.get(
  "tags",
  isUserAuthenticated,
  tagsController.getTagsForUser
);

http.get(
  "public_tags",
  userController.emailExist(),
  tagsController.getTagsForUser
);

http.patch(
  "tag/:id",
  isUserAuthenticated,
  validateRequestSchema(tagSchema.editTag),
  tagsController.tagExists({ params: [ [ "key", "key" ] ], throwOnExist: true }),
  tagsController.update
);

http.delete(
  "tag/:id",
  isUserAuthenticated,
  tagsController.remove
);
