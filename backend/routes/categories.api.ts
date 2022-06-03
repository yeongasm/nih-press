import http, { validateRequestSchema, } from './api.impl';
import categorySchema from '../schema/categories.schema';
import { isUserAuthenticated } from '../auth/auth.impl';
import * as categoryController from '../controllers/categories.controller';
import * as groupController from '../controllers/groups.controller';

http.post(
  "categories",
  isUserAuthenticated,
  validateRequestSchema(categorySchema.newCategory),
  groupController.groupExists({ param: "group" }),
  categoryController.keyExists(true),
  categoryController.create
);

http.patch(
  "categories/:id",
  isUserAuthenticated,
  validateRequestSchema(categorySchema.editCategory),
  groupController.groupExists({ param: "group" }),
  categoryController.keyExists(true),
  categoryController.update
);

http.delete(
  "categories/:id",
  isUserAuthenticated,
  categoryController.remove
);
