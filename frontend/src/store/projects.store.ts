import { defineStore } from 'pinia';
import axios from '@/util/axios';
import { queryStringFromObj, apiUrl, hashString } from '@/util/util';
import { $assert } from './assert.store';

export const useProjectStore = defineStore('projects', {
  state: () => ({
    projects: [] as any,
    project: null as any
  }),
  getters: {
    userProjects: (state) => state.projects,
    selectedProject: (state) => state.project
  },
  actions: {

    getProjects({
      limit = 20,
      order = 'desc',
      cursorId
    }: {
      limit: number,
      cursorId: number,
      order: 'asc' | 'desc'
    }): Promise<void> {
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
      repo_type
    }: {
      title: string,
      description: string,
      tag_id: number,
      repo_url?: string,
      repo_type?: 'none' | 'github' | 'gitlab' | 'bitbucket'
    }): Promise<boolean> {
      return new Promise<boolean>((resolve) => {
        axios.post(apiUrl("project"), {
          title: title,
          description: description,
          tag_id: tag_id,
          ...(repo_url != undefined && { repo_url: repo_url }),
          ...(repo_type != undefined && { repo_type: repo_type })
        }, { withCredentials: true })
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

    getProjectContent(): Promise<string> {
      return new Promise<string>((resolve) => {
        axios.get(this.selectedProject.content_url, {
          transformRequest: [(data: any, headers: any) => { delete headers.common.Authorization; return data }],
          headers: {
            "Accept": "text/html",
            // "Access-Control-Request-Headers": "Content-Type",
            // "Access-Control-Request-Method": "GET"
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
