import { articles } from '@prisma/client';
import prisma from '../prisma/db';

export interface ArticlesModel {
  id?: number,
  title?: string,
  description?: string,
  url?: string,
  category_id?: number,
  created_at?: Date,
  created_by?: number,
  edited_at?: Date,
  edited_by?: number,
  deleted_at?: Date,
  deleted_by?: number
};

export interface CreateArticleModel {
  title: string,
  description: string,
  url: string,
  category_id?: number
  created_by: number
};

export interface UpdateArticleModel {
  title?: string,
  description?: string,
  url?: string,
  category_id?: number,
  edited_by: number,
  edited_at: Date
};

// export function createOne(properties: CreateArticleModel): Promise<articles> {
//   return new Promise<articles>((resolve, reject) => {
//     prisma.articles.create({
//       data: {
//         ...properties,
//         edited_by: properties.created_by
//       }
//     })
//     .then(res => resolve(res))
//     .catch(err => reject(err));
//   });
// };

// export function createMany(properties: CreateArticleModel[]): Promise<any> {
//   return new Promise<any>((resolve, reject) => {
//     prisma.articles.createMany({
//       data: properties.map(property => {
//         return {
//           ...property,
//           edited_by: property.created_by
//         }
//       })
//     })
//     .then(res => resolve(res))
//     .catch(err => reject(err));
//   });
// };

export function edit(properties: UpdateArticleModel, articleID: number): Promise<articles> {
  return new Promise<articles>((resolve, reject) => {
    prisma.articles.update({
      data: properties,
      where: { id: articleID }
    })
    .then(res => resolve(res))
    .catch(err => reject(err));
  });
};

// export function get(properties: ArticlesModel): Promise<any> {
//   return new Promise<any>((resolve, reject) => {
//     const whereClause: any = properties;
//     prisma.articles.findMany({
//       select: {
//         id: true,
//         title: true,
//         description: true,
//         url: true,
//         category_id: true,
//         created_at: true,
//         edited_at: true,
//         author: {
//           select: {
//             display_name: true,
//             profile_img_url: true
//           }
//         },
//         editor: {
//           select: {
//             display_name: true,
//             profile_img_url: true
//           }
//         }
//       },
//       where: whereClause
//     })
//     .then(res => resolve(res))
//     .catch(err => reject(err));
//   });
// };

export function deleteOne(userProfileID: number, articleID: number): Promise<articles> {
  return new Promise<articles>((resolve, reject) => {
    prisma.articles.update({
      data: {
        deleted_at: new Date(),
        deleted_by: userProfileID
      },
      where: { id: articleID }
    })
    .then(res => resolve(res))
    .catch(err => reject(err));
  });
};

export default {
  // createOne,
  edit,
  // get,
  deleteOne
  // createMany
};
