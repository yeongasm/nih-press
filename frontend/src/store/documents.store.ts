import { defineStore } from 'pinia';
import axios from '@/util/axios';
import { queryStringFromObj, apiUrl } from '@/util/util';
import { $assert } from './assert.store';

export interface ImageResizeConfig {
  width?: number,
  height?: number,
  quality: number
};

export const useDocumentStore = defineStore('documents', {
  state: () => ({
    images: [] as any
  }),
  getters: {
    imagesWithTag: (state) => state.images
  },
  actions: {

    getImagesTaggedWith(tagId: number, {
      limit = 20,
      order = 'desc',
      cursorId
    }: {
      limit?: number,
      cursorId?: number,
      order?: 'asc' | 'desc'
    } = {}): Promise<boolean> {
      return new Promise<boolean>((resolve) => {
        const queries: any = {
          tagId: tagId,
          limit: limit,
          order: order,
          ...(cursorId != undefined && { cursorId: cursorId })
        };
        axios.get(apiUrl("images") + queryStringFromObj(queries), {
          withCredentials: true
        })
        .then((response: any) => {
          if (response?.data?.payload)
            this.images = response.data.payload;
          $assert(`Images tagged with id [ ${tagId} ] fetched!`);
          resolve(true);
        })
        .catch((error: any) => {
          $assert(
            `
            Failed to get imaged tagged with id [ ${tagId} ].
            ${error?.response?.data && "Server responded with - " + JSON.stringify(error?.response?.data) }
            `,
            "error"
          );
          resolve(false);
        });
      });
    },

    uploadImageTaggedWith(image: File, tagId: number): Promise<boolean> {
      return new Promise<boolean>((resolve) => {
        const form = new FormData();
        form.append("file", image, image.name);
        form.append("tag_id", `${tagId}`);

        axios.post(apiUrl("image"), form, { withCredentials: true })
        .then((response: any) => {
          if (response?.data?.payload)
            this.images.push(response.data.payload);

          $assert(`Image with filename [ ${image.name} ] uploaded!`);
          resolve(true);
        })
        .catch((error: any) => {
          $assert(
            `
            Failed to upload image with filename [ ${image.name} ].
            ${error?.response?.data && "Server responded with - " + JSON.stringify(error?.response?.data) }
            `,
            "error"
          );
          resolve(false);
        });
      });
    },

    compressImageToBase64(file: File, config: ImageResizeConfig): Promise<string> {
      return new Promise<string>(resolve => {
        const form = new FormData();
        form.append("file", file, file.name);

        (config.width)    && form.set("width",    `${config?.width}`);
        (config.height)   && form.set("height",   `${config.height}`);
        (config.quality)  && form.set("quality",  `${config.quality}`);

        axios.post(apiUrl("compress_image"), form, { withCredentials: true })
        .then((response: any) => {
          if (response?.data) {
            resolve(response.data);
            $assert(`Image [ ${file.name} ] successfully compressed!`);
          }
        })
        .catch((error: any) => {
          $assert(
            `
            Could not compress image with name [ ${file.name} ].
            ${error?.response?.data && "Server responded with: " + JSON.stringify(error?.response?.data) }
            `,
            "error"
          );
          resolve("");
        });
      });
    }

  }
});
