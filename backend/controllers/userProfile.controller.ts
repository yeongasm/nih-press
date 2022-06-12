import { Request, Response, NextFunction } from 'express';
import { API } from './../routes/api.impl';
import userProfileService, { type UserProfileModel } from '../services/userProfile.service';
import userAccountService from '../services/users.services';

export function updateUserProfile(req: any, res: Response, next: NextFunction): void {
  let params: UserProfileModel = {
    display_name: req.body.display_name,
    location: req.body.location,
    profile_img_url: req.body.profile_img_url,
    profile_banner_url: req.body.profile_banner_url,
    resume_url: req.body.resume_url
  };
  userProfileService.get({ user_account_id: req._passport.user.id })
    .then(userProfiles => {
      const profile = userProfiles.shift();
      // Technically, this shouldn't happen since user profiles are created when user accounts are created.
      if (!profile)
        return next(API.badRequest("EXCEPTIONAL_CASE:USER_PROFILE_NON_EXISTENT_FOR_ACCOUNT"));

      userProfileService.update(params, profile.id)
        .then(() => next())
        .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:UPDATE_USER_PROFILE")));
    })
    .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:UPDATE_USER_PROFILE:GET")));
};

export function getUserProfile(req: any, res: Response, next: NextFunction): void {
  userProfileService.getUserProfile(req._passport.user.id)
    .then(userProfile => {
      if (!userProfile)
        return next(API.badRequest("USER_PROFILE_NON_EXISTENT"));

      // NOTE:
      // We will probably want to have a flattenObject() method in the future.
      const result = API.ok("GET_USER_PROFILE_OK");
      result.attach(userProfile);
      res.status(result.statusCode()).json(result);
    })
    .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:GET_USER_PROFILE")));
};

export function getPublicAccessUserProfile(req: Request, res: Response, next: NextFunction): void {
  userProfileService.getUserProfilePublic(req.query.email as string)
  .then(userProfile => {
    if (!userProfile || !userProfile.length)
      return next(API.badRequest("USER_PROFILE_NON_EXISTENT"));

    const result = API.ok("GET_PUBLIC_USER_PROFILE_OK");
    result.attach(userProfile.shift());
    res.status(result.statusCode()).json(result);
  })
  .catch(err => next(API.internalServerError("INTERNAL_SERVER_ERROR:GET_USER_PROFILE_PUB")));
};
