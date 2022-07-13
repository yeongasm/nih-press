import { Request, Response, NextFunction } from 'express';
import { API, parseCookies } from './../routes/api.impl';
import { comparePassword, issueJwt, issueSessionToken, type JwtObject } from '../auth/auth.impl';
import userAccountService from '../services/users.services';
// import { debugPrintf } from '../util/debug';
import * as redis from '../util/redis';
import calendar from '../util/dayjs';

export function passwordValid(req: Request, res: Response, next: NextFunction): void {
  const userAccount = req.body.user_account;
  if (!comparePassword(req.body.password, userAccount.password))
    return next(API.unauthorized("INVALID_PASSWORD"));
  next();
};

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {

  const token: string = issueSessionToken();
  const oneMonth: number = 1 * 1000 * 60 * 60 * 24 * 30; // number of milliseconds in a month.
  const expiresAt: Date = calendar.dateAfter(oneMonth, 'ms');

  // NOTE:
  // req.body.user_account is set by userController.emailExist().
  redis.set(token, { expires_at: expiresAt, user_account_id: req.body.user_account.id })
  .then(() => {
    // Attach session token so that we can use it in the next middleware.
    // req.body.__session_token__ = token;
    // Set session in cookie.
    res.cookie("__session_token", token, {
      httpOnly: true,
      maxAge: oneMonth, // session is valid for 1 month.
      expires: expiresAt
    });
    const result = API.ok("LOGGED_IN");
    res.status(result.statusCode()).json(result);
  })
  .catch(() => next(API.badRequest("INTERNAL_SERVER_ERROR:CREATE_SESSION_FAILED")));
};

export function isSessionStillValid(req: Request, res: Response, next: NextFunction): void {
  const token: string = parseCookies(req).__session_token;
  redis.get(token)
  .then(session => {
    if (calendar.isDateAfter(new Date(), session.expires_at)) {
      // NOTE:
      // Logout should be handled by the client.
      // res.cookie("__session_token", "", { httpOnly: true });
      // redis.del(sessionToken);
      return next(API.badRequest("SESSION_EXPIRED"));
    }
    // NOTE:
    // Remember, login() stores the user account id along with the expiration date time with the token.
    req.body.user_account_id = session.user_account_id;
    next();
  })
  .catch(() => next(API.internalServerError("INTERNAL_SERVER_ERROR:CHECK_SESSION_FAILED")));
};

export function requestJwt(req: any, res: Response, next: NextFunction): void {
  // NOTE:
  // req.body.user_account_id is attached by isSessionStillValid().
  userAccountService.getUserWith({ id: req.body.user_account_id })
  .then(users => {
    if (!users.length)
      return next(API.notFound("NOT_FOUND:COULD_NOT_REQUEST_ACCESS_FOR_NON_EXISTENT_ACCOUNT"));

    const token: string = parseCookies(req).__session_token;
    const jwt: JwtObject = issueJwt(users[0], token);
    const payload = API.ok("ACCESS_TOKEN_OK");
    payload.attach(jwt);
    res.status(payload.statusCode()).json(payload);
  })
  .catch(() => next(API.internalServerError("INTERNAL_SERVER_ERROR:REQUEST_ACCESS")));
};

export function validateJwt(req: Request, res: Response, next: NextFunction): void {
  const result = API.ok("OK");
  res.status(result.statusCode()).json(result);
};

export function logout(req: any, res: Response, next: NextFunction): void {
  const cookie = parseCookies(req);
  if (cookie.__session_token) {
    // Revoke session cookie.
    res.cookie("__session_token", "", { httpOnly: true });
    redis.del(cookie.__session_token);
  }
  const result = API.ok("SESSION_REVOKED");
  res.status(result.statusCode()).send(result);
};
