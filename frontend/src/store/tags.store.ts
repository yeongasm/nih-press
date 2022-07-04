import { defineStore } from 'pinia';
import axios from '@/util/axios';
import { queryStringFromObj, apiUrl } from '@/util/util';
import { $assert } from './assert.store';

export const useTagStore = defineStore('tags', {
  state: () => ({
    tags: [] as any[]
  }),
  getters: {
    userTags: (state) => state.tags
  },
  actions: {

    getTags(): Promise<void> {
      return new Promise<void>(resolve => {
        axios.get(apiUrl("tags"), { withCredentials: true })
        .then((response: any) => {
          if (response?.data?.payload.length)
            this.tags = response.data.payload;
          $assert("Tags fetched!");
          resolve();
        })
        .catch((error: any) => {
          $assert(
            `
            Failed to fetch tags.
            ${error?.response?.data && "Server responded with - " + JSON.stringify(error?.response?.data) }
            `,
            "error"
          );
          resolve();
        });
      });
    },

    getTagsWithEmail(): Promise<boolean> {
      return new Promise<boolean>((resolve) => {
        axios.get(apiUrl("public_tags") + queryStringFromObj({ email: import.meta.env.VITE_USER_EMAIL }))
        .then((response: any) => {
          if (response?.data?.payload.length)
            this.tags = response.data.payload
          resolve(true);
        })
        .catch(() => resolve(false));
      });
    },

    newTag({
      key,
      value,
      visible,
      isPrimaryTag,
      groupId
    }: {
      key: string,
      value: string,
      visible: boolean,
      groupId: number
      isPrimaryTag?: boolean
    }): Promise<boolean> {
      return new Promise<any>((resolve) => {
        axios.post(apiUrl("tag"), {
          key: key,
          value: value,
          hidden: !visible,
          group_id: groupId,
          ...(isPrimaryTag != undefined && { is_primary_tag: isPrimaryTag }),
        }, {
          withCredentials: true
        })
        .then((response: any) => {
          if (response?.data?.payload)
            this.tags.push(response.data.payload);
          $assert(`Tag [ ${key} ] created!`);
          resolve(response.data.payload);
        })
        .catch((error: any) => {
          $assert(
            `
            Failed to create new tag [ ${key} ].
            ${error?.response?.data && "Server responded with - " + JSON.stringify(error?.response?.data) }
            `,
            "error"
          );
          resolve(null);
        });
      });
    },

    editTag(params: any, tagId: number): Promise<boolean> {
      return new Promise<boolean>((resolve) => {
        axios.patch(apiUrl(`tag/${tagId}`), params, { withCredentials: true })
        .then((response: any) => {

          if (response?.data?.payload)
            this.tags[this.tags.findIndex(tag => tag.id == tagId)] = response.data.payload;

          $assert(`Tag with id [ ${tagId} ] edited!`);
          resolve(true);
        })
        .catch((error: any) => {
          $assert(
            `
            Failed to edit tag with id [ ${tagId} ].
            ${error?.response?.data && "Server responded with - " + JSON.stringify(error?.response?.data) }
            `,
            "error"
          );
          resolve(false);
        });
      });
    },

    deleteTag(id: number): Promise<boolean> {
      return new Promise<boolean>((resolve) => {
        axios.delete(apiUrl(`tag/${id}`))
        .then(() => {
          this.tags.splice(this.tags.findIndex(tag => tag.id == id), 1);
          $assert("Tag deleted!");
          resolve(true);
        })
        .catch((error: any) => {
          $assert(
            `
            Failed to delete tag with id [ ${id} ].
            ${error?.response?.data && "Server responded with - " + JSON.stringify(error?.response?.data) }
            `,
            "error"
          );
          resolve(false);
        });
      });
    }

  }
});
