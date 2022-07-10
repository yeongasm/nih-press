import { groups } from '@prisma/client';
import prisma from '../prisma/db';

export interface GroupModel {
  id?: number,
  name?: string,
  created_by?: number,
  created_at?: Date,
  edited_at?: Date,
  deleted_at?: Date | null
};

export interface CreateGroupModel {
  name: string,
  created_by: number
};

export function getGroups(
  whereClause: GroupModel,
  {
    cursorId = undefined,
    limit = 10,
    order = 'desc'
  }: {
    cursorId?: number,
    limit?: number,
    order?: 'asc' | 'desc'
  }): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    prisma.groups.findMany({
      take: limit,
      ...(cursorId != undefined && {
        skip: 1,
        cursor: { id: cursorId }
      }),
      select: {
        id: true,
        name: true,
        created_at: true,
        edited_at: true
      },
      where: whereClause,
      orderBy: { id: order }
    })
    .then(res => resolve(res))
    .catch(err => reject(err));
  });
};

export function getPublic(
  whereClause: GroupModel,
  {
    cursorId = undefined,
    limit = 10,
    order = 'desc'
  }: {
    cursorId?: number,
    limit?: number,
    order?: 'asc' | 'desc'
  }): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    prisma.groups.findMany({
      take: limit,
      ...(cursorId != undefined && {
        skip: 1,
        cursor: { id: cursorId }
      }),
      select: {
        id: true,
        name: true
      },
      where: whereClause,
      orderBy: { id: order }
    })
    .then(res => resolve(res))
    .catch(err => reject(err));
  });
};

export function createOne(properties: CreateGroupModel): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    prisma.groups.create({
      data: properties,
    })
    .then(res => resolve(res))
    .catch(err => reject(err));
  });
};

export function updateGroupName(name: string, groupID: number): Promise<groups> {
  return new Promise<groups>((resolve, reject) => {
    prisma.groups.update({
      data: {
        name: name,
        edited_at: new Date()
      },
      where: { id: groupID }
    })
    .then(res => resolve(res))
    .catch(err => reject(err));
  });
};

export function deleteGroup(groupID: number): Promise<groups> {
  return new Promise<groups>((resolve, reject) => {
    prisma.groups.update({
      data: { deleted_at: new Date() },
      where: { id: groupID }
    })
    .then(res => resolve(res))
    .catch(err => reject(err));
  });
};

export default {
  getGroups,
  getPublic,
  createOne,
  updateGroupName,
  deleteGroup
};
