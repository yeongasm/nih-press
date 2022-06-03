import { Request, Response, NextFunction } from 'express';
import { API, parseCookies } from './../routes/api.impl';
import { comparePassword, issueJwt, issueSessionToken, type JwtObject } from '../auth/auth.impl';
// import userSessionService from '../services/sessions.services.ts';
import userAccountService from '../services/users.services';
import { debugPrintf } from '../util/debug';
import * as redis from '../util/redis';
import calendar from '../util/dayjs';

export function passwordValid(req: Request, res: Response, next: NextFunction): void {
  const userAccount = req.body.user_account;
  if (!comparePassword(req.body.password, userAccount.password))
    return next(API.unauthorized("INVALID_PASSWORD"));
  next();
};

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  const userAccount = req.body.user_account;
  //
  // If session already exist and user tries to log in again ...
  // Extract session information from session token.
  // From the session information that was extracted, update the session that's in the DB.
  // Invalidate the previous session (i.e log out) and reset the cookie.
  //
  // NOTE: Would be nice to wrap this into a tryLogout function that will be used by the logout middleware as well.
  //
  // if (cookie.__session_token) {
  //   userSessionService.logOutFromSession(cookie.__session_token)
  //     .then(() => {
  //       // Revoke session cookie.
  //       res.cookie("__session_token", "", { httpOnly: true });
  //       // Throw a bad request.
  //       next(API.badRequest("EXPIRING_SESSION:LOGGING_IN_WITH_PRE_EXISTING_SESSION"));
  //     });
  //   return;
  // }

  // Set session token.
  const token: string = issueSessionToken();
  const oneMonth: number = 1000 * 60 * 60 * 24 * 30; // number of milliseconds in a month.
  const expiresAt: Date = calendar.dateAfter(oneMonth, 'ms');
  const redisSessionKey: string = `user_${userAccount.id}_${token}`;

  redis.set(redisSessionKey, { expires_at: expiresAt })
    .then((result) => {
      debugPrintf("result from redis.set in login > ", result);
      // Attach session token so that we can use it in the next middleware.
      req.body.__session_token__ = token;
      // Set session in cookie.
      res.cookie("__session_token", token, {
        httpOnly: true,
        maxAge: oneMonth, // session is valid for 1 month.
        expires: expiresAt
      });
      next();
    })
    .catch((err) => {
      debugPrintf(err);
      next(API.badRequest("INTERNAL_SERVER_ERROR:CREATE_SESSION_FAILED"))
    });
};


export async function requestJwt(req: Request, res: Response, next: NextFunction): Promise<void> {
  let userAccount = req.body.user_account || req.body.passport.user;
  if (!userAccount)
    userAccount = await userAccountService.getUserWith({ email: req.body.email });

  const sessionToken: string = req.body.__session_token__ || parseCookies(req);
  const redisSessionKey: string = `user_${userAccount.id}_${sessionToken}`;
  //
  // We need to check if the session is still valid when request for a new jwt token.
  // Can only request for a new access token if session is valid.
  // Valid meaning user has not logged out from the session && session token is the same as the on in the db.
  //
  redis.get(redisSessionKey)
    .then(session => {
      debugPrintf("session in requestJwt > ", session);
      if (calendar.isDateAfter(new Date(), session.expires_at)) {
        // If the user has not logged out, we log them out.
        redis.del(redisSessionKey);
        return next(API.badRequest("SESSION_EXPIRED"));
      }
      const jwt: JwtObject = issueJwt(userAccount, sessionToken);
      const payload = API.ok("TOKEN_OK");
      payload.attach(jwt);
      res.status(payload.statusCode()).json(payload);
    })
    .catch(err => {
      debugPrintf("error in requestJwt > ", err);
      next(API.badRequest("INTERNAL_SERVER_ERROR:FETCH_SESSION_FAILED"));
    });
};

export function testJwt(req: Request, res: Response, next: NextFunction): void {
  const result = API.ok("Auth is ok!");
  res.status(result.statusCode()).send(result);
};

export function logout(req: any, res: Response, next: NextFunction): void {
  const cookie = parseCookies(req);
  const userId: number = req._passport.user.id;
  if (cookie.__session_token) {
    // Revoke session cookie.
    redis.del(`user_${userId}_${cookie.__session_token}`)
      .then(() => {
        res.cookie("__session_token", "", { httpOnly: true });
        const result = API.ok("TOKEN_REVOKED");
        res.status(result.statusCode()).send(result);
      })
      .catch(debugPrintf);
  }
};
