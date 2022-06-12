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

export function getGroups(where: GroupModel, select: string[] = []): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    const whereClause: any = where;
    let selectClause: any = {};
    select.length && select.forEach(param => selectClause[param] = true);
    prisma.groups.findMany({
      ...(select.length && { select: selectClause }),
      where: whereClause
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
  createOne,
  updateGroupName,
  deleteGroup
};
