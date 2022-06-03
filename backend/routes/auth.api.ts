import http, { validateRequestSchema, } from './api.impl';
import * as authController from '../controllers/auth.controller';
import * as userControoler from '../controllers/user.controller';
import authSchema from '../schema/auth.schema';
import { isUserAuthenticated } from '../auth/auth.impl';

http.post(
  "auth/login",
  validateRequestSchema(authSchema.login),
  userControoler.emailExist(),
  authController.passwordValid,
  authController.login,
  authController.requestJwt
);

http.post(
  "auth/refresh_token",
  isUserAuthenticated, // Can only refresh the access token if user was previously authenticated.
  authController.requestJwt
);

http.post(
  "auth/logout",
  isUserAuthenticated,
  authController.logout
);

if (process.env.NODE_ENV == "development") {
  http.get(
    "auth/test",
    isUserAuthenticated,
    authController.testJwt
  );
};
