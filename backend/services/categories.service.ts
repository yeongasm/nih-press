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

export function getCategory(properties: CategoryModel): Promise<categories[]> {
  return new Promise<categories[]>((resolve, reject) => {
    const whereClause: any = properties;
    prisma.categories.findMany({
      where: whereClause
    })
    .then(res => resolve(res))
    .catch(err => reject(err));
  });
};

export function createOne(properties: CreateCategoryModel): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    prisma.categories.create({
      data: properties,
    })
    .then(res => resolve(res))
    .catch(err => reject(err));
  });
};

export function updateOne(properties: UpdateCategoryModel, categoryID: number): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    prisma.categories.update({
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
