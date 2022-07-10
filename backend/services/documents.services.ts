import { documents } from '@prisma/client';
import prisma from '../prisma/db';

export type DocumentType = 'image' | 'pdf';

export interface DocumentModel {
  id?: number,
  original_filename?: string,
  type?: DocumentType,
  extension?: string,
  url?: string,
  // tag_id?: number,
  uploaded_by?: number
  uploaded_at?: Date,
  edited_at?: Date,
  deleted_at?: Date | null
};

export interface UploadDocumentModel {
  original_filename: string,
  type: DocumentType,
  extension: string,
  url: string,
  // tag_id: number
};

export function uploadOne(properties: UploadDocumentModel, tagId: number, uploadedBy: number): Promise<documents> {
  return new Promise<documents>((resolve, reject) => {
    prisma.documents.create({
      data: {
        ...properties,
        uploaded_by: uploadedBy,
        document_tags: {
          create: [{
            tag: { connect: { id: tagId }},
          }]
        }
      }
    })
    .then(document => resolve(document))
    .catch(error => reject(error));
  });
};

export function get(
  properties: DocumentModel,
  tagId: number,
  {
    cursorId,
    limit = 10,
    order = 'desc'
  }: {
    cursorId?: number,
    limit?: number,
    order?: 'asc' | 'desc'
  }): Promise<documents[]> {
  return new Promise<documents[]>((resolve, reject) => {
    prisma.documents.findMany({
      take: limit,
      ...(cursorId != undefined && {
        skip: 1,
        cursor: { id: cursorId }
      }),
      where: {
        ...properties,
        document_tags: {
          some: {
            tag_id: tagId
          }
        }
      },
      orderBy: { id: order }
    })
    .then(documents => resolve(documents))
    .catch(error => reject(error));
  });
};

export function deleteOne(documentId: number): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    prisma.documents.update({
      data: {
        deleted_at: new Date()
      },
      where: {
        id: documentId
      }
    })
    .then(result => resolve(result))
    .catch(error => reject(error));
  });
};

export default {
  uploadOne,
  // updateTag,
  get,
  deleteOne
};
