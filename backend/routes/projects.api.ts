import http, { validateRequestSchema, } from './api.impl';
import projectSchema from '../schema/projects.schema';
import { isUserAuthenticated } from '../auth/auth.impl';
import * as projectController from '../controllers/projects.controller';
import * as userController from '../controllers/user.controller';
import { storeFile, onlyAllowFilesWithExtension } from '../util/files';

http.post(
  "project",
  isUserAuthenticated,
  validateRequestSchema(projectSchema.newProject),
  projectController.projectExist({ params: [ [ "title", "title" ] ], throwOnExist: true }),
  projectController.createNewProject
);

http.patch(
  "project/:id",
  isUserAuthenticated,
  storeFile.array("file", 1),
  onlyAllowFilesWithExtension([ 'html' ]),
  validateRequestSchema(projectSchema.updateProject),
  projectController.projectExist({ checkId: true }),
  projectController.abortIfNonExistent,
  projectController.removeProjectHTML,
  projectController.uploadProjectHTML,
  projectController.removeProjectNonPrimaryTags,
  projectController.updateProject
);

http.get(
  "projects",
  isUserAuthenticated,
  projectController.getInternal
);

http.get(
  "project/:id",
  isUserAuthenticated,
  projectController.getOne
);

http.get(
  "public_projects",
  userController.emailExist(),
  projectController.getPublic
);

http.delete(
  "project/:id",
  isUserAuthenticated,
  projectController.deleteProject
);
