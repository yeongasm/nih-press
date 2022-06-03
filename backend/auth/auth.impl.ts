import { Response, NextFunction } from 'express';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import bcrypt from 'bcrypt';
import fs from 'fs';
import jsonwebtoken from 'jsonwebtoken';
import { PUBLIC_KEY_PATH, PRIVATE_KEY_PATH } from '../util/paths';
import { type user_accounts } from '@prisma/client';
import { API } from '../routes/api.impl';
import userAccountService, { type UserAccountModel } from '../services/users.services';
// import userSessionService, { type UserSessionModel } from '../services/sessions.services';
import * as redis from '../util/redis';
import calendar from '../util/dayjs';
import { debugPrintf } from '../util/debug';

const PUB_KEY: string = fs.readFileSync(PUBLIC_KEY_PATH, 'utf8');
const PRIV_KEY: string = fs.readFileSync(PRIVATE_KEY_PATH, 'utf8');

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ['RS256']
};

/**
 * JWT Strategy is skipped if jwt token is not provided or is invalid.
 */
passport.use(new JwtStrategy(options, (jwtPayload, done) => {
  const param: UserAccountModel = { id: jwtPayload.sub };
  const sessionToken = jwtPayload.session_token;
  const redisKey: string = `user_${param.id}_${sessionToken}`;
  redis.get(redisKey)
    .then(session => {
      debugPrintf('session in JwtStrategy > ', session);
      // Revoke the session ...
      if (calendar.isDateAfter(new Date(), session.expires_at)) {
        redis.del(redisKey);
        return done(API.forbidden("SESSION_EXPIRED"), false);
      }
      userAccountService.getUserWith(param)
        .then(userAccount => {
          if (userAccount)
            return done(null, userAccount);

          done(null, false);
        })
        .catch(() => done(API.internalServerError("INTERNAL_SERVER_ERROR:AUTHENTICATE_JWT"), false));
    })
    .catch(() => done(API.badRequest("SESSION_EXPIRED"), false));
}));

export function genPasswordHash(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10).then(salt => {
      bcrypt.hash(password, salt)
        .then(hash => resolve(hash))
        .catch(err => reject(err));
    });
  });
};

export function comparePassword(pwd: string, hash: string): boolean {
  return bcrypt.compareSync(pwd, hash);
}

export interface JwtObject {
  token: string,
  expiration: number
};

export function issueJwt(userAccount: user_accounts, session_token: string): JwtObject {
  const id: number = userAccount.id;
  const expiresIn: number = 1000 * 60 * 10; // 10 minutes expiration for access token.

  const payload = {
    sub: id,
    session_token: session_token,
    iat: Date.now()
  };
  const signedToken: string = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });

  return {
    token: "Bearer " + signedToken,
    expiration: expiresIn
  }
};

export function issueSessionToken(): string {
  const timestamp = Date.now().toString();
  return bcrypt.hashSync(timestamp, bcrypt.genSaltSync());
}

/**
 * NOTE:
 * This middleware gets called after passport goes through JwtStrategy.
 */
export function isUserAuthenticated(req: any, res: Response, next: NextFunction): any {
  return passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err && !user) {
      (err?.message == "SESSION_EXPIRED") && (res.cookie("__session_token", "", { httpOnly: true }));
      return next(err || API.forbidden("ACCESS_TOKEN_ABSENT"));
    }

    req._passport.user = user;
    next();
  })(req, res, next);
};

export default passport;
