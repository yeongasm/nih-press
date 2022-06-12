import { defineStore } from 'pinia';
import axios from '@/util/axios';
import { queryStringFromObj, apiUrl } from '@/util/util';
import { $assert } from './assert.store';

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [] as any[]
  }),
  getters: {
    userCategories: (state) => state.categories
  },
  actions: {

    getCategories(): Promise<void> {
      return new Promise<void>(resolve => {
        axios.get(apiUrl("categories"), { withCredentials: true })
        .then((response: any) => {
          if (response?.data?.payload.length)
            this.categories = response.data.payload;
          $assert("Categories fetched!");
          resolve();
        })
        .catch((error: any) => {
          $assert(
            `
            Failed to fetch categories.
            ${error?.response?.data && "Server responded with - " + JSON.stringify(error?.response?.data) }
            `,
            "error"
          );
          resolve();
        });
      });
    },

    getCategoriesWithEmail(): Promise<boolean> {
      return new Promise<boolean>((resolve) => {
        axios.get(apiUrl("public_categories") + queryStringFromObj({ email: import.meta.env.VITE_USER_EMAIL }))
        .then((response: any) => {
          if (response?.data?.payload.length)
            this.categories = response.data.payload
          resolve(true);
        })
        .catch(() => resolve(false));
      });
    },

    newCategory(key: string, value: string, type: 'bool' | 'int' | 'float' | 'string', groupName: string): Promise<boolean> {
      return new Promise<boolean>((resolve) => {
        axios.post(apiUrl("categories"), {
          key: key,
          value: value,
          type: type,
          ...((groupName != undefined) && { group: groupName })
        }, { withCredentials: true })
        .then((response: any) => {
          if (response?.data?.payload)
            this.categories.push(response.data.payload);
          $assert(`Category [ ${key} ] created!`);
          resolve(true);
        })
        .catch((error: any) => {
          $assert(
            `
            Failed to create new category [ ${key} ].
            ${error?.response?.data && "Server responded with - " + JSON.stringify(error?.response?.data) }
            `,
            "error"
          );
          resolve(false);
        });
      });
    },

    editCategory(key: string, value: string, type: 'bool' | 'int' | 'float' | 'string', groupName: string, categoryId: number): Promise<boolean> {
      return new Promise<boolean>((resolve) => {
        axios.patch(apiUrl(`categories/${categoryId}`), {
          key: key,
          value: value,
          type: type,
          ...((groupName != undefined) && { group: groupName })
        }, { withCredentials: true })
        .then((response: any) => {

          if (response?.data?.payload)
            this.categories[this.categories.findIndex(category => category.id == categoryId)] = response.data.payload;

          $assert(`Category with id [ ${categoryId} ] edited!`);
          resolve(true);
        })
        .catch((error: any) => {
          $assert(
            `
            Failed to edit new category [ ${key} ].
            ${error?.response?.data && "Server responded with - " + JSON.stringify(error?.response?.data) }
            `,
            "error"
          );
          resolve(false);
        });
      });
    },

    deleteCategory(id: number): Promise<boolean> {
      return new Promise<boolean>((resolve) => {
        axios.delete(apiUrl(`categories/${id}`))
        .then(() => {
          this.categories.splice(this.categories.findIndex(category => category.id == id), 1);
          $assert("Category deleted!");
          resolve(true);
        })
        .catch((error: any) => {
          $assert(
            `
            Failed to delete category with id [ ${id} ].
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
