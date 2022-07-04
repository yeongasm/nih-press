import { defineStore } from 'pinia';
import axios from '@/util/axios';
import { queryStringFromObj, apiUrl, hashString } from '@/util/util';
import { $assert } from './assert.store';

export const useArticleStore = defineStore('articles', {
  state: () => ({
    articles: [] as any,
    article: null as any
  }),
  getters: {
    userArticles: (state) => state.articles,
    selectedArticle: (state) => state.article
  },
  actions: {

    getArticles({
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
        axios.get(apiUrl("articles") + queryStringFromObj(queries), {
          withCredentials: true
        })
        .then((response: any) => {
          if (response?.data?.payload)
            this.articles = response.data.payload;
          $assert("Articles fetched!");
          resolve();
        })
        .catch((error: any) => {
          $assert(
            `
            Failed to get article list.
            ${error?.response?.data && "Server responded with - " + JSON.stringify(error?.response?.data) }
            `,
            "error"
          );
          resolve();
        })
      });
    },

    getArticleWithId(articleId: number): Promise<any> {
      return new Promise<any>((resolve) => {
        axios.get(apiUrl("article") + `/${articleId}`, {
          withCredentials: true
        })
        .then((response: any) => {
          if (response?.data?.payload)
            this.article = response.data.payload;
          $assert(`Article with id [ ${articleId} ] fetched!`);
          resolve(true);
        })
        .catch((error: any) => {
          $assert(
            `
            Failed to get article with id [ ${articleId} ].
            ${error?.response?.data && "Server responded with - " + JSON.stringify(error?.response?.data) }
            `,
            "error"
          );
          resolve(false);
        });
      });
    },

    newArticle({
      title,
      description,
      tag_id
    }: {
      title: string,
      description: string,
      tag_id: number
    }): Promise<boolean> {
      return new Promise<boolean>((resolve) => {
        axios.post(apiUrl("article"), {
          title: title,
          description: description,
          tag_id: tag_id
        }, { withCredentials: true })
        .then((response: any) => {
          if (response?.data?.payload)
            this.articles.push(response.data.payload);
          $assert(`Article [ ${title} ] created!`);
          resolve(true);
        })
        .catch((error: any) => {
          $assert(
            `
            Failed to create new article [ ${title} ].
            ${error?.response?.data && "Server responded with - " + JSON.stringify(error?.response?.data) }
            `,
            "error"
          );
          resolve(false);
        });
      });
    },

    updateArticle(properties: any): Promise<boolean> {
      return new Promise<boolean>((resolve) => {

        const formCopy: any = { ...properties };
        const form = new FormData();

        if (formCopy.content != undefined && formCopy?.content.length) {
          const hash: number = hashString(formCopy.content);
          if (hash != this.selectedArticle.hash) {
            const projectHtml = new File([formCopy.content], `${this.selectedArticle.title.toLowerCase().replace(/ /g, "_")}.html`, { type: "text/html" });
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

        axios.patch(apiUrl("article") + `/${this.selectedArticle.id}`, form, { withCredentials: true })
        .then((response: any) => {
          if (response?.data?.payload) {
            this.articles.splice(this.articles.findIndex((project: any) => project.id == this.selectedArticle.id), 1, response.data.payload);
            this.article = response.data.payload;
          }

          $assert(`Article with id [ ${this.selectedArticle.id} ] updated!`);
          resolve(true);
        })
        .catch((error: any) => {
          $assert(
            `
            Failed to create update article with id [ ${this.selectedArticle.id} ].
            ${error?.response?.data && "Server responded with - " + JSON.stringify(error?.response?.data) }
            `,
            "error"
          );
          resolve(false);
        });
      });
    },

    getArticleContent(): Promise<string> {
      return new Promise<string>((resolve) => {
        axios.get(this.selectedArticle.url, {
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

    mutateArticlePublishState(publish: boolean, articleId: number): Promise<boolean> {
      return new Promise<boolean>((resolve) => {
        axios.patch(apiUrl("article") + `/${articleId}`, {
          publish: publish
         }, {
          withCredentials: true
        })
        .then((response: any) => {
          if (response?.data?.payload)
            this.articles.splice(this.articles.findIndex((article: any) => article.id == articleId), 1, response.data.payload);

          $assert(`Article with id [ ${articleId} ] published!`);
          resolve(true);
        })
        .catch((error: any) => {
          $assert(
            `
            Failed to publish article with id [ ${articleId} ].
            ${error?.response?.data && "Server responded with - " + JSON.stringify(error?.response?.data) }
            `,
            "error"
          );
          resolve(false);
        });
      });
    },

    deleteArticle(id: number): Promise<boolean> {
      return new Promise<boolean>((resolve) => {
        axios.delete(apiUrl(`article/${id}`), { withCredentials: true })
        .then(() => {
          this.articles.splice(this.articles.findIndex((article: any) => article.id == id), 1);
          $assert(`Article with id [ ${id} ] deleted!`);
          resolve(true);
        })
        .catch((error: any) => {
          $assert(
            `
            Failed to delete article with id [ ${id} ].
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
