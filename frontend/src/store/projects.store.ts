import { defineStore } from 'pinia';
import axios from '@/util/axios';
import { queryStringFromObj, apiUrl, hashString } from '@/util/util';
import { $assert } from './assert.store';

export const useProjectStore = defineStore('projects', {
  state: () => ({
    projects: [] as any,
    project: null as any,
    public_projects: [] as any,
    home_screen_project_list: [] as any
  }),
  getters: {
    userProjects: (state) => state.projects,
    selectedProject: (state) => state.project,
    publicProjects: (state) => state.public_projects,
    homseScreenProjects: (state) => state.home_screen_project_list
  },
  actions: {

    getProjects({
      limit = 20,
      order = 'desc',
      cursorId
    }: {
      limit?: number,
      cursorId?: number,
      order?: 'asc' | 'desc'
    } = {}): Promise<void> {
      return new Promise<void>((resolve) => {
        const queries: any = {
          limit: limit,
          order: order,
          ...(cursorId != undefined && { cursorId: cursorId })
        };
        axios.get(apiUrl("projects") + queryStringFromObj(queries), {
          withCredentials: true
        })
        .then((response: any) => {
          if (response?.data?.payload)
            this.projects = response.data.payload;
          $assert("Projects fetched!");
          resolve();
        })
        .catch((error: any) => {
          $assert(
            `
            Failed to get project list.
            ${error?.response?.data && "Server responded with - " + JSON.stringify(error?.response?.data) }
            `,
            "error"
          );
          resolve();
        })
      });
    },

    getProjectWithIdPublic(id: number): Promise<any> {
      return new Promise<any>((resolve) => {
        axios.get(apiUrl("public_project") + `/${id}` + queryStringFromObj({ email: import.meta.env.VITE_USER_EMAIL }))
        .then((response: any) => {
          resolve(response.data.payload);
        })
        .catch((error: any) => resolve(null));
      });
    },

    getProjectsPublic({
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
          limit: limit,
          order: order,
          ...(cursorId != undefined && { cursorId: cursorId }),
          email: import.meta.env.VITE_USER_EMAIL
        };
        axios.get(apiUrl("public_projects") + queryStringFromObj(queries))
        .then((response: any) => {
          if (response?.data?.payload) {
            this.public_projects = response.data.payload;

            // Optimization:
            // When the website first loads, we fill this array with projects that will be used for previewing.
            (!this.home_screen_project_list.length && (this.home_screen_project_list = this.public_projects));
          }

          resolve(true);
        })
        .catch((error: any) => {
          resolve(false);
        });
      });
    },

    getProjectWithId(projectId: number): Promise<any> {
      return new Promise<any>((resolve) => {
        axios.get(apiUrl("project") + `/${projectId}`, {
          withCredentials: true
        })
        .then((response: any) => {
          if (response?.data?.payload)
            this.project = response.data.payload;
          $assert(`Project with id [ ${projectId} ] fetched!`);
          resolve(true);
        })
        .catch((error: any) => {
          $assert(
            `
            Failed to get project with id [ ${projectId} ].
            ${error?.response?.data && "Server responded with - " + JSON.stringify(error?.response?.data) }
            `,
            "error"
          );
          resolve(false);
        });
      });
    },

    newProject({
      title,
      description,
      tag_id,
      repo_url,
      repo_type,
      bannerImg
    }: {
      title: string,
      description: string,
      tag_id: number,
      repo_url?: string,
      repo_type?: 'none' | 'github' | 'gitlab' | 'bitbucket',
      bannerImg?: File
    }): Promise<boolean> {
      return new Promise<boolean>((resolve) => {
        const form = new FormData();

        form.append("title", title);
        form.append("description", description);
        form.append("tag_id", `${tag_id}`);

        ((bannerImg != undefined && bannerImg != null) && form.append("file", bannerImg, bannerImg.name));
        ((repo_url  != undefined && repo_url  != null) && form.append("repo_url", repo_url));
        ((repo_type != undefined && repo_type != null) && form.append("repo_type", repo_type));

        axios.post(apiUrl("project"), form, { withCredentials: true })
        .then((response: any) => {
          if (response?.data?.payload)
            this.projects.push(response.data.payload);
          $assert(`Project [ ${title} ] created!`);
          resolve(true);
        })
        .catch((error: any) => {
          $assert(
            `
            Failed to create new project [ ${title} ].
            ${error?.response?.data && "Server responded with - " + JSON.stringify(error?.response?.data) }
            `,
            "error"
          );
          resolve(false);
        });
      });
    },

    updateProject(properties: any): Promise<boolean> {
      return new Promise<boolean>((resolve) => {

        const formCopy: any = { ...properties };
        const form = new FormData();

        if (formCopy.content != undefined && formCopy?.content.length) {
          const hash: number = hashString(formCopy.content);
          if (hash != this.selectedProject.hash) {
            const projectHtml = new File([formCopy.content], `${this.selectedProject.title.toLowerCase().replace(/ /g, "_")}.html`, { type: "text/html" });
            form.append("file", projectHtml, projectHtml.name);
            form.append("hash", JSON.stringify(hash));
          }
        }
        delete formCopy.content;

        for (const key in formCopy) {
          if (typeof formCopy[key] === 'string') {
            form.append(key, formCopy[key]);
            continue;
          }
          form.append(key, JSON.stringify(formCopy[key]));
        }

        axios.patch(apiUrl("project") + `/${this.selectedProject.id}`, form, { withCredentials: true })
        .then((response: any) => {
          if (response?.data?.payload) {
            this.projects.splice(this.projects.findIndex((project: any) => project.id == this.selectedProject.id), 1, response.data.payload);
            this.project = response.data.payload;
          }

          $assert(`Project with id [ ${this.selectedProject.id} ] updated!`);
          resolve(true);
        })
        .catch((error: any) => {
          $assert(
            `
            Failed to create update project with id [ ${this.selectedProject.id} ].
            ${error?.response?.data && "Server responded with - " + JSON.stringify(error?.response?.data) }
            `,
            "error"
          );
          resolve(false);
        });
      });
    },

    updateProjectBanner(bannerImg: File): Promise<boolean> {
      return new Promise<boolean>((resolve) => {
        const form = new FormData();
        form.append("file", bannerImg, bannerImg.name);
        axios.patch(apiUrl("project/banner") + `/${this.selectedProject.id}`, form, { withCredentials: true })
        .then((response: any) => {
          if (response?.data?.payload) {
            this.projects.splice(this.projects.findIndex((project: any) => project.id == this.selectedProject.id), 1, response.data.payload);
            this.project = response.data.payload;
          }
          $assert(`Project with id [ ${this.selectedProject.id} ] banner updated!`);
          resolve(true);
        })
        .catch((error: any) => {
          $assert(
            `
            Failed to create update project's banner with project id [ ${this.selectedProject.id} ].
            ${error?.response?.data && "Server responded with - " + JSON.stringify(error?.response?.data) }
            `,
            "error"
          );
          resolve(false);
        });
      });
    },

    getProjectContent(project?: any): Promise<string> {
      return new Promise<string>((resolve) => {
        const projectUrl: string = (project != null) ? project.content_url : this.selectedProject.content_url;
        axios.get(projectUrl, {
          transformRequest: [(data: any, headers: any) => { delete headers.common.Authorization; return data }],
          headers: {
            "Accept": "text/html"
          }
        })
        .then((response: any) => {
          resolve(response.data);
        })
        .catch((error: any) => {
          resolve("");
        });
      });
    },

    mutateProjectPublishState(publish: boolean, projectId: number): Promise<boolean> {
      return new Promise<boolean>((resolve) => {
        axios.patch(apiUrl("project") + `/${projectId}`, {
          publish: publish
         }, {
          withCredentials: true
        })
        .then((response: any) => {
          if (response?.data?.payload)
            this.projects.splice(this.projects.findIndex((project: any) => project.id == projectId), 1, response.data.payload);

          $assert(`Project with id [ ${projectId} ] published!`);
          resolve(true);
        })
        .catch((error: any) => {
          $assert(
            `
            Failed to publish project with id [ ${projectId} ].
            ${error?.response?.data && "Server responded with - " + JSON.stringify(error?.response?.data) }
            `,
            "error"
          );
          resolve(false);
        });
      });
    },

    deleteProject(id: number): Promise<boolean> {
      return new Promise<boolean>((resolve) => {
        axios.delete(apiUrl(`project/${id}`), { withCredentials: true })
        .then(() => {
          this.projects.splice(this.projects.findIndex((project: any) => project.id == id), 1);
          $assert("Project deleted!");
          resolve(true);
        })
        .catch((error: any) => {
          $assert(
            `
            Failed to delete project with id [ ${id} ].
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
