import { projects } from '@prisma/client';
import prisma from '../prisma/db';

export type ProjectRepoType = 'none' | 'github' | 'gitlab' | 'bitbucket';

export interface ProjectModel {
  id?: number,
  title?: string,
  description?: string,
  banner_img_url?: string,
  content_url?: string,
  repo_url?: string,
  repo_type?: ProjectRepoType,
  show?: boolean,
  publish?: boolean,
  hash?: number,
  owned_by?: number,
  created_at?: Date,
  edited_at?: Date,
  deleted_at?: Date | null
};

export interface CreateProjectModel {
  title: string,
  description: string,
  tag_id: number,
  banner_img_url?: string,
  repo_url?: string,
  repo_type?: ProjectRepoType,
  show?: boolean,
  owned_by: number
};

export function createOne(properties: CreateProjectModel): Promise<projects> {
  return new Promise<projects>((resolve, reject) => {
    let projectValues: any = properties;
    const tagId: number = projectValues.tag_id;
    delete projectValues.tag_id;

    prisma.projects.create({
      include: {
        project_tags: {
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
        ...projectValues,
        project_tags: {
          create: [{
            tag: { connect: { id: tagId }},
          }]
        }
      }
    })
    .then(projects => resolve(projects))
    .catch(error => reject(error));
  });
};

export function updateProject(properties: ProjectModel, projectId: number, tagIds: number[] = []): Promise<projects> {
  return new Promise<projects>((resolve, reject) => {
    prisma.projects.update({
      include: {
        project_tags: {
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
        edited_at: new Date(),
        ...(tagIds.length && {
          project_tags: {
            create: tagIds.map((id: number) => ({
              tag: { connect: { id: id }}
            }))
          }
        })
      },
      where: { id: projectId }
    })
    .then(projects => resolve(projects))
    .catch(error => reject(error));
  });
};

export function get(
  where: ProjectModel,
  {
    cursorId,
    limit = 10,
    order = 'desc'
  }: {
    cursorId?: number,
    limit?: number,
    order?: 'asc' | 'desc'
  }): Promise<projects[]> {
  return new Promise<projects[]>((resolve, reject) => {
    prisma.projects.findMany({
      take: limit,
      ...(cursorId != undefined && {
        skip: 1,
        cursor: { id: cursorId }
      }),
      include: {
        project_tags: {
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
      where: where,
      orderBy: { id: order }
    })
    .then(projects => resolve(projects))
    .catch(error => reject(error));
  });
};

export function getOne(projectId: number): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    prisma.projects.findUnique({
      include: {
        project_tags: {
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
      where: { id: projectId }
    })
    .then(project => resolve(project))
    .catch(error => reject(error));
  });
};

export function getPublic(
  where: ProjectModel,
  {
    cursorId,
    limit = 10,
    order = 'desc'
  }: {
    cursorId?: number,
    limit?: number,
    order?: 'asc' | 'desc'
  }): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    prisma.projects.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        banner_img_url: true,
        content_url: true,
        repo_url: true,
        repo_type: true,
        project_tags: {
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
      take: limit,
      ...(cursorId != undefined && {
        skip: 1,
        cursor: { id: cursorId }
      }),
      where: where,
      orderBy: { id: order }
    })
    .then(projects => resolve(projects))
    .catch(error => reject(error));
  });
};

export function getOnePublic(articleId: number): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    prisma.projects.findUnique({
      select: {
        id: true,
        title: true,
        description: true,
        content_url: true,
        repo_url: true,
        repo_type: true,
        project_tags: {
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

export function deleteProject(projectId: number): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    prisma.projects.update({
      data: { deleted_at: new Date() },
      where: { id: projectId }
    })
    .then(result => resolve(result))
    .catch(error => reject(error));
  });
};

export function removeProjectNonPrimaryTags(projectId: number): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    prisma.project_tag_entries.deleteMany({
      where: {
        project_id: projectId,
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
  updateProject,
  get,
  getOne,
  getPublic,
  getOnePublic,
  deleteProject,
  removeProjectNonPrimaryTags
};
