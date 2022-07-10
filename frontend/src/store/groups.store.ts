import { defineStore } from 'pinia';
import axios from '@/util/axios';
import { queryStringFromObj, apiUrl } from '@/util/util';
import { $assert } from './assert.store';

export const useGroupsStore = defineStore('groups', {
  state: () => ({
    groups: [] as any[]
  }),
  getters: {
    userGroups: (state) => state.groups,
  },
  actions: {

    getGroups(): Promise<void> {
      return new Promise<void>((resolve) => {
        axios.get(apiUrl("groups"), { withCredentials: true })
        .then((response: any) => {
          if (response.data?.payload.length)
            this.groups = response.data.payload;
          $assert("Group(s) fetched!");
          resolve();
        })
        .catch((error: any) => {
          $assert(
            `
            Failed to fetch groups.
            ${error?.response?.data && "Server responded with - " + JSON.stringify(error?.response?.data) }
            `,
            "error"
          );
          resolve();
        });
      });
    },

    getGroupsWithEmail(): Promise<boolean> {
      return new Promise<boolean>((resolve) => {
        axios.get(apiUrl("public_groups") + queryStringFromObj({ email: import.meta.env.VITE_USER_EMAIL }))
        .then((response: any) => {
          if (response?.data?.payload.length)
            this.groups = response.data.payload
          resolve(true);
        })
        .catch(() => resolve(false));
      });
    },

    newGroup(name: string): Promise<boolean> {
      return new Promise<boolean>((resolve) => {
        axios.post(apiUrl("group"), { name: name }, { withCredentials: true })
        .then((response: any) => {
          if (response?.data?.payload)
            this.groups.push(response.data.payload);

          $assert(`Group [ ${name} ] created!`);
          resolve(true);
        })
        .catch((error: any) => {
          $assert(
            `
            Failed to create new group [ ${name} ].
            ${error?.response?.data && "Server responded with - " + JSON.stringify(error?.response?.data) }
            `,
            "error"
          );
          resolve(false);
        });
      });
    },

    editGroup(name: string, id: number): Promise<boolean> {
      return new Promise<boolean>((resolve) => {
        axios.patch(apiUrl(`group/${id}`), { name: name }, { withCredentials: true })
        .then(() => {
          this.groups[this.groups.findIndex(group => group.id == id)].name = name;
          $assert(`Group with id [ ${id} ] edited!`);
          resolve(true);
        })
        .catch((error: any) => {
          $assert(
            `
            Failed to edit group [ ${name} ].
            ${error?.response?.data && "Server responded with - " + JSON.stringify(error?.response?.data) }
            `,
            "error"
          );
          resolve(false);
        });
      });
    },

    deleteGroup(id: number): Promise<boolean> {
      return new Promise<boolean>((resolve) => {
        axios.delete(apiUrl(`group/${id}`))
        .then(() => {
          this.groups.splice(this.groups.findIndex(group => group.id == id), 1);
          $assert("Group deleted!");
          resolve(true);
        })
        .catch((error: any) => {
          $assert(
            `
            Failed to delete group with id [ ${id} ].
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
