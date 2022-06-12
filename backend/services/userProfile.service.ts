import { user_profile, user_accounts } from "@prisma/client";
import prisma from '../prisma/db';

export interface UserProfileModel {
  id?: number,
  user_account_id?: number,
  display_name?: string,
  location?: string
  profile_img_url?: string,
  profile_banner_url?: string,
  resume_url?: string
};

export interface UpdateUserProfileModel {
  display_name?: string,
  location?: string
  profile_img_url?: string,
  profile_banner_url?: string,
  resume_url?: string
};

export function createOne(userAccountID: number): Promise<user_profile> {
  return new Promise<user_profile>((resolve, reject) => {
    prisma.user_profile.create({
      data: {
        user_account_id: userAccountID
      }
    })
    .then(res => resolve(res))
    .catch(err => reject(err));
  });
};

export function update(properties: UpdateUserProfileModel, userProfileID: number): Promise<user_profile> {
  return new Promise<user_profile>((resolve, reject) => {
    prisma.user_profile.update({
      data: properties,
      where: {
        id: userProfileID
      }
    })
    .then(res => resolve(res))
    .catch(err => reject(err));
  });
};

export function get(properties: UserProfileModel): Promise<user_profile[]> {
  return new Promise<user_profile[]>((resolve, reject) => {
    prisma.user_profile.findMany({
      where: properties
    })
    .then(res => resolve(res))
    .catch(err => reject(err));
  });
};

export function getUserProfile(userAccountID: number): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    prisma.user_profile.findMany({
      where: {
        user_account_id: userAccountID
      },
      include: {
        user_account: {
          select: {
            username: true,
            email: true
          }
        }
      }
    })
    .then(userProfiles => resolve(userProfiles))
    .catch(err => reject(err));
  });
};

export function getUserProfilePublic(email: string): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    prisma.user_accounts.findMany({
      select: {
        username: true,
        email: true,
        user_profile: {
          select: {
            display_name: true,
            location: true,
            profile_img_url: true,
            profile_banner_url: true,
            resume_url: true
          }
        }
      },
      where: { email: email }
    })
    .then(userProfiles => resolve(userProfiles))
    .catch(err => reject(err));
  });
};

export default {
  createOne,
  update,
  get,
  getUserProfile,
  getUserProfilePublic
};
