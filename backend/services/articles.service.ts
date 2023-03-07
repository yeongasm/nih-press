import { articles } from '@prisma/client';
import prisma from '../prisma/db';

export interface ArticlesModel {
  id?: number,
  tag?: string,
  title?: string,
  description?: string,
  url?: string,
  show?: boolean,
  publish?: boolean,
  hash?: number,
  created_at?: Date,
  created_by?: number,
  edited_at?: Date,
  edited_by?: number,
  deleted_at?: Date | null,
  deleted_by?: number | null
};

export interface CreateArticleModel {
  title: string,
  tag: string,
  description: string,
  show: boolean,
  publish: boolean
  tag_id: number
};

export interface UpdateArticleModel {
  title?: string,
  description?: string,
  url?: string
  show?: boolean,
  publish?: boolean,
  hash?: number
};

export function createOne(properties: CreateArticleModel, authorId: number): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    let articleValues: any = properties;
    const tagId: number = articleValues.tag_id;
    delete articleValues.tag_id;

    prisma.articles.create({
      include: {
        article_tags: {
          select: {
            tag: {
              select: {
                id: true,
                key: true,
                value: true,
                hidden: true,
                is_primary_tag: true
              }
            }
          }
        }
      },
      data: {
        ...articleValues,
        created_by: authorId,
        edited_by: authorId,
        article_tags: {
          create: [{
            tag: { connect: { id: tagId }},
          }]
        },
      }
    })
    .then(res => resolve(res))
    .catch(err => reject(err));
  });

};

export function removeArticleTags(articleId: number): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    prisma.articles_tag_entries.deleteMany({
      where: { article_id: articleId }
    })
    .then(() => resolve(true))
    .catch(() => resolve(false));
  });
};

export function edit(properties: UpdateArticleModel, articleID: number, editorId: number, tagIds: number[] = []): Promise<articles> {
  return new Promise<articles>((resolve, reject) => {
    prisma.articles.update({
      include: {
        article_tags: {
          select: {
            tag: {
              select: {
                id: true,
                key: true,
                value: true,
                hidden: true,
                is_primary_tag: true
              }
            }
          }
        }
      },
      data: {
        ...properties,
        edited_by: editorId,
        edited_at: new Date(),
        ...(tagIds.length && {
          article_tags: {
            create: tagIds.map((id: number) => ({
              tag: { connect: { id: id }}
            }))
          }
        })
      },
      where: { id: articleID }
    })
    .then(res => resolve(res))
    .catch(err => reject(err));
  });
};

export function get(
  whereClause: ArticlesModel,
  {
    cursorId = undefined,
    limit = 10,
    order = 'desc'
  }: {
    cursorId?: number,
    limit?: number,
    order?: 'asc' | 'desc'
  }): Promise<articles[]> {
    return new Promise<articles[]>((resolve, reject) => {
      prisma.articles.findMany({
      take: limit,
      ...(cursorId != undefined && {
        skip: 1,
        cursor: { id: cursorId }
      }),
      include: {
        article_tags: {
          select: {
            tag: {
              select: {
                id: true,
                key: true,
                value: true,
                hidden: true,
                is_primary_tag: true,
              }
            }
          }
        }
      },
      where: whereClause,
      orderBy: { id: order }
    })
    .then(articles => resolve(articles))
    .catch(error => reject(error));
  });
};

export function getOne(articleId: number): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    prisma.articles.findUnique({
      include: {
        article_tags: {
          select: {
            tag: {
              select: {
                id: true,
                key: true,
                value: true,
                hidden: true,
                is_primary_tag: true,
              }
            }
          }
        }
      },
      where: { id: articleId }
    })
    .then(articles => resolve(articles))
    .catch(error => reject(error));
  });
};

export function getPublic(
  whereClause: ArticlesModel,
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
    prisma.articles.findMany({
      take: limit,
      ...(cursorId != undefined && {
        skip: 1,
        cursor: { id: cursorId }
      }),
      select: {
        id: true,
        tag: true,
        title: true,
        description: true,
        url: true,
        article_tags: {
          select: {
            tag: {
              select: {
                id: true,
                key: true,
                value: true,
                hidden: true,
                is_primary_tag: true,
              }
            }
          }
        },
        created_at: true,
        author: {
          select: {
            id: true,
            display_name: true
          }
        },
        edited_at: true,
        editor: {
          select: {
            id: true,
            display_name: true
          }
        }
      },
      where: whereClause,
      orderBy: { id: order }
    })
    .then(articles => resolve(articles))
    .catch(error => reject(error));
  });
};

export function getOnePublic(tag: string): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    prisma.articles.findFirst({
      select: {
        id: true,
        tag: true,
        title: true,
        description: true,
        url: true,
        article_tags: {
          select: {
            tag: {
              select: {
                id: true,
                key: true,
                value: true,
                hidden: true,
                is_primary_tag: true,
              }
            }
          }
        },
        created_at: true,
        author: {
          select: {
            id: true,
            display_name: true
          }
        },
        edited_at: true,
        editor: {
          select: {
            id: true,
            display_name: true
          }
        }
      },
      where: { tag: tag, show: true, publish: true }
    })
    .then(articles => resolve(articles))
    .catch(error => reject(error));
  });
};

export function deleteOne(articleID: number, userAccountId: number): Promise<articles> {
  return new Promise<articles>((resolve, reject) => {
    prisma.articles.update({
      data: {
        deleted_at: new Date(),
        deleted_by: userAccountId
      },
      where: { id: articleID }
    })
    .then(res => resolve(res))
    .catch(err => reject(err));
  });
};

export function removeArticleNonPrimaryTags(articleId: number): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    prisma.articles_tag_entries.deleteMany({
      where: {
        article_id: articleId,
        tag: {
          is_primary_tag: false
        }
      }
    })
    .then(result => resolve(result))
    .catch(error => reject(error));
  });
};

export default {
  createOne,
  edit,
  get,
  getOne,
  getPublic,
  getOnePublic,
  deleteOne,
  removeArticleNonPrimaryTags
};
