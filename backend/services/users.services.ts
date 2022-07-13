import { user_accounts } from '@prisma/client';
import prisma from '../prisma/db';

export interface UserAccountModel {
  id?: number,
  username?: string,
  email?: string,
  password?: string,
  created_at?: Date
};

export interface CreateUserAccount {
  username: string,
  email: string,
  password: string
};

export function getUserWith(properties: UserAccountModel): Promise<user_accounts[]> {
  return new Promise<user_accounts[]>((resolve, reject) => {
    prisma.user_accounts.findMany({
      where: properties
    })
    .then(res => resolve(res))
    .catch(err => reject(err));
  });
};

export function insertUser(properties: CreateUserAccount): Promise<user_accounts> {
  return new Promise<user_accounts>((resolve, reject) => {
    prisma.user_accounts.create({
      data: properties
    })
    .then(res => resolve(res))
    .catch(err => reject(err));
  });
};

export function deleteUser(id: number): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    prisma.user_accounts.delete({
      where: { id: id }
    })
    .then(res => resolve(true))
    .catch(err => reject(err));
  });
}

export default {
  getUserWith,
  insertUser,
  deleteUser
}
