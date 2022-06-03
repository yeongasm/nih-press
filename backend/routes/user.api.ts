import http, { validateRequestSchema } from './api.impl';
import * as userController from '../controllers/user.controller';
import * as userProfileController from '../controllers/userProfile.controller';
import userSchema from '../schema/user.schema';
import { isUserAuthenticated } from '../auth/auth.impl';
import { storeFile, onlyAllowFilesWithExtension } from '../util/files';

// NOTE:
// Unless we expand this into a framework, we don't need to add new user(s) to the backend in production.
//
if (process.env.NODE_ENV == "development") {

  http.post(
    "user",
    validateRequestSchema(userSchema.createUser),
    userController.emailExist(true),
    userController.usernameExist,
    userController.create
  );

  http.delete(
    "user/:id",
    userController.idExist,
    userController.remove
  );

}

http.post(
  "user/profile",
  isUserAuthenticated,
  validateRequestSchema(userSchema.updateProfile),
  userProfileController.updateUserProfile,
  userProfileController.getUserProfile
);

http.get(
  "user/profile",
  isUserAuthenticated,
  userProfileController.getUserProfile
)

// Perhaps we can combine all three APIs into one.

http.post(
  "upload",
  isUserAuthenticated,
  validateRequestSchema(userSchema.uploadDocument),
  storeFile.array("file", 1),
  onlyAllowFilesWithExtension([ 'jpg', 'jpeg', 'png', 'html' ]),
  userController.uploadProfileRelatedFiles
);

// http.post(
//   "user/upload_background_img",
//   isUserAuthenticated,
//   storeFile.array("file", 1),
//   onlyAllowFilesWithExtension([ 'jpg', 'jpeg', 'png' ]),
//   userController.uploadProfileRelatedFiles("background_img")
// );

// http.post(
//   "user/upload_profile_img",
//   isUserAuthenticated,
//   storeFile.array("file", 1),
//   onlyAllowFilesWithExtension([ 'jpg', 'jpeg', 'png' ]),
//   userController.uploadProfileRelatedFiles("profile_img")
// );

// http.post(
//   "user/upload_resume",
//   isUserAuthenticated,
//   storeFile.array("file", 1),
//   onlyAllowFilesWithExtension([ 'html' ]),
//   userController.uploadProfileRelatedFiles("profile_resume")
// );
