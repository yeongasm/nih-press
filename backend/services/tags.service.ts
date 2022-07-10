import { tags } from '@prisma/client';
import prisma from '../prisma/db';

export interface TagModel {
  id?: number,
  key?: string,
  value?: string,
  hidden?: boolean,
  group_id?: number,
  created_by?: number,
  created_at?: Date,
  edited_at?: Date,
  deleted_at?: Date | null,
  is_primary_tag?: boolean
};

export interface CreateTagModel {
  key: string,
  value: string,
  created_by: number,
  hidden: boolean,
  is_primary_tag: boolean,
  group_id?: number
};

export interface UpdateTagModel {
  key?: string,
  value?: string,
  hidden?: boolean,
  group_id?: number
};

export function getTag(
  whereClause: TagModel,
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
    prisma.tags.findMany({
      take: limit,
      ...(cursorId != undefined && {
        skip: 1,
        cursor: { id: cursorId }
      }),
      select: {
        id: true,
        key: true,
        value: true,
        hidden: true,
        is_primary_tag: true,
        created_by: true,
        created_at: true,
        edited_at: true,
        group: {
          select: {
            id: true,
            name: true
          }
        }
      },
      where: whereClause,
      orderBy: { id: order }
    })
    .then(res => resolve(res))
    .catch(err => reject(err));
  });
};

export function createOne(properties: CreateTagModel): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    prisma.tags.create({
      select: {
        id: true,
        key: true,
        value: true,
        hidden: true,
        is_primary_tag: true,
        created_by: true,
        created_at: true,
        edited_at: true,
        group: {
          select: {
            id: true,
            name: true
          }
        }
      },
      data: properties,
    })
    .then(res => resolve(res))
    .catch(err => reject(err));
  });
};

export function updateOne(properties: UpdateTagModel, categoryID: number): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    prisma.tags.update({
      select: {
        id: true,
        key: true,
        value: true,
        hidden: true,
        is_primary_tag: true,
        created_by: true,
        created_at: true,
        edited_at: true,
        group: {
          select: {
            id: true,
            name: true
          }
        }
      },
      data: { ...properties, edited_at: new Date() },
      where: { id: categoryID }
    })
    .then(res => resolve(res))
    .catch(err => reject(err));
  });
};

export function deleteOne(categoryID: number): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    prisma.tags.update({
      data: { deleted_at: new Date() },
      where: { id: categoryID }
    })
    .then(res => resolve(res))
    .catch(err => reject(err));
  });
};

export default {
  getTag,
  createOne,
  updateOne,
  deleteOne
};
