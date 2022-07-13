import http, { validateRequestSchema, } from './api.impl';
import * as authController from '../controllers/auth.controller';
import * as userControoler from '../controllers/user.controller';
import authSchema from '../schema/auth.schema';
import { isUserAuthenticated } from '../auth/auth.impl';

http.post(
  "login",
  validateRequestSchema(authSchema.login),
  userControoler.emailExist({ continueIfNonExistent: false }),
  authController.passwordValid,
  authController.login
  // authController.requestJwt
);

http.post(
  "logout",
  // isUserAuthenticated, // Don't have to check if the user has access for logout.
  authController.logout
);

// NOTE:
// Ideally, we should do isUserAuthenticated here but because storing JWT in client localstorage is bad practice,
// We're just going to check if the session is valid and issue them with a new JWT.
http.post(
  "refresh_access",
  authController.isSessionStillValid,
  authController.requestJwt
);

http.get(
  "check_access",
  isUserAuthenticated,
  authController.validateJwt
);
