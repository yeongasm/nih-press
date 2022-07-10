import { defineStore } from 'pinia';
import axios from '@/util/axios';
import { queryStringFromObj, apiUrl } from '@/util/util';
import { $assert } from './assert.store';

export interface IUpdateUserProfile {
  display_name?: string,
  location?: string,
  profile_img_url?: string,
  profile_banner_url?: string,
  resume_url?: string
};

// Can't destructure state & getters.
// Can destructure actions.
export const useUserStore = defineStore("user", {
  state: () => ({
    user: null
  }),
  getters: {
    userProfile: (state) => state.user
  },
  actions: {

    getUserProfile() {
      return new Promise((resolve, reject) => {
        axios.get(apiUrl("public_user_profile") + queryStringFromObj({ email: import.meta.env.VITE_USER_EMAIL }))
        .then((res: any) => {
          res.data?.payload && (this.user = {
            email: res.data.payload.email,
            username: res.data.payload.username,
            ...res.data.payload.user_profile
          });
          resolve(this.user);
        })
        .catch((err: any) => reject(err));
      });
    },

    uploadDocument(file: File, destination: "profile" | "banner" | "resume"): Promise<string | boolean> {
      return new Promise<string | boolean>(resolve => {

        const form = new FormData();
        form.append("file", file, file.name);
        form.append("bucket", destination);

        axios.post(apiUrl("upload"), form, { withCredentials: true })
        .then((response: any) => {
          if (response.data?.payload.length)
            resolve(response.data?.payload[0].url);

          $assert(`Document [${file.name}] upload is successful`);
        })
        .catch((error: any) => {
          $assert(
            `
            Failed to upload document.
            ${error?.response?.data && "Server responded with: " + error?.response?.data}
            `,
            "error"
          );
          resolve(false)
        });
      });
    },

    updateUserProfile(payload: IUpdateUserProfile): Promise<boolean> {
      return new Promise<boolean>(resolve => {
        axios.patch(apiUrl("user_profile"), payload, { withCredentials: true })
        .then((response: any) => {
          if (response.data?.payload.length) {
            const updatedProfile = response.data.payload[0];
            this.user = {
              email: updatedProfile.email,
              username: updatedProfile.username,
              ...updatedProfile.user_profile
            };
          }
          resolve(true);
          $assert(`User profile update was successful`);
        })
        .catch((error: any) => {
          $assert(
            `
            Failed to update user profile.
            ${error?.response?.data && "Server responded with: " + JSON.stringify(error?.response?.data) }
            `,
            "error"
          );
          resolve(false);
        })
      });
    },

    /**
     * This function should not throw assertions.
     */
    login(email: string, password: string): Promise<boolean> {
      return new Promise<boolean>((resolve, reject) => {
        axios.post(apiUrl("login"), {
          email: email,
          password: password
        }, {
          withCredentials: true
        })
        .then((res: any) => {
          resolve(true);
        })
        .catch((err: any) => reject(err?.response?.data));
      });
    },

    /**
     * This function should not throw assertions.
     */
    logout() {
      return new Promise((resolve) => {
        axios.post(apiUrl("logout"), {}, {
          withCredentials: true
        })
        .then(() => resolve(true))
        .catch(() => resolve(false));
      });
    },

    /**
     * This function should not throw assertions.
     */
    refreshAccessToken(): Promise<boolean> {
      return new Promise<boolean>((resolve) => {
        axios.post(apiUrl("refresh_access"), {}, {
          withCredentials: true
        })
        .then((res: any) => {
          const payload = res.data.payload;
          axios.defaults.headers.common['Authorization'] = payload.token;
          // refresh access token 2 minutes before the token expires.
          setTimeout(this.refreshAccessToken, payload.expiration - (1 * 1000 * 60 * 2));
          resolve(true);
        })
        .catch((err: any) => {
          resolve(false);
        });
      });
    },

    /**
     * This function should not throw assertions.
     */
    validateAccess(): Promise<boolean> {
      return new Promise<boolean>((resolve) => {
        axios.get(apiUrl("check_access"))
        .then(() => resolve(true))
        .catch(() => resolve(false));
      });
    }

  }
});

export const hasAccess = () => useUserStore().validateAccess();
export const logOut = () => useUserStore().logout();
export const refreshAccess = () => useUserStore().refreshAccessToken();
