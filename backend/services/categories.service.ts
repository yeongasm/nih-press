import { categories } from '@prisma/client';
import prisma from '../prisma/db';

export interface CategoryModel {
  id?: number,
  key?: string,
  value?: string,
  type?: 'bool' | 'int' | 'float' | 'string',
  group_id?: number,
  created_by?: number,
  created_at?: number,
  edited_at?: Date,
  deleted_at?: Date | null
};

export interface CreateCategoryModel {
  key: string,
  value: string,
  type: 'bool' | 'int' | 'float' | 'string',
  created_by: number,
  group_id?: number
};

export interface UpdateCategoryModel {
  key?: string,
  value?: string,
  type?: 'bool' | 'int' | 'float' | 'string',
  group_id?: number
};

export function getCategory(properties: CategoryModel): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    const whereClause: any = properties;
    prisma.categories.findMany({
      select: {
        id: true,
        key: true,
        value: true,
        type: true,
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
      where: whereClause
    })
    .then(res => resolve(res))
    .catch(err => reject(err));
  });
};

export function createOne(properties: CreateCategoryModel): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    prisma.categories.create({
      select: {
        id: true,
        key: true,
        value: true,
        type: true,
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

export function updateOne(properties: UpdateCategoryModel, categoryID: number): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    prisma.categories.update({
      select: {
        id: true,
        key: true,
        value: true,
        type: true,
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
    prisma.categories.update({
      data: { deleted_at: new Date() },
      where: { id: categoryID }
    })
    .then(res => resolve(res))
    .catch(err => reject(err));
  });
};

export default {
  getCategory,
  createOne,
  updateOne,
  deleteOne
};
