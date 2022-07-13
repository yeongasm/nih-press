import http, { validateRequestSchema, } from './api.impl';
import projectSchema from '../schema/projects.schema';
import { isUserAuthenticated } from '../auth/auth.impl';
import * as projectController from '../controllers/projects.controller';
import * as userController from '../controllers/user.controller';
import { storeFile, onlyAllowFilesWithExtension } from '../util/files';

http.post(
  "project",
  isUserAuthenticated,
  storeFile.array("file", 1),
  onlyAllowFilesWithExtension([ 'jpg', 'jpeg', 'png', 'gif' ]),
  validateRequestSchema(projectSchema.newProject),
  projectController.projectExist({ params: [ [ "title", "title" ] ], throwOnExist: true }),
  projectController.tryUploadProjectBanner,
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

http.patch(
  "project/banner/:id",
  isUserAuthenticated,
  storeFile.array("file", 1),
  onlyAllowFilesWithExtension([ 'jpg', 'jpeg', 'png', 'gif' ]),
  projectController.projectExist({ checkId: true }),
  projectController.tryDeleteExistingProjectBanner,
  projectController.tryUploadProjectBanner,
  projectController.updateProjectBannerUrl
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
  userController.emailExist({ continueIfNonExistent: false }),
  projectController.getPublic
);

http.get(
  "public_project/:id",
  userController.emailExist({ continueIfNonExistent: false }),
  projectController.getOnePublic
);

http.delete(
  "project/:id",
  isUserAuthenticated,
  projectController.deleteProject
);
