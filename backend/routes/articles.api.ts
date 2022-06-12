import http, { validateRequestSchema } from './api.impl';
import * as articlesController from '../controllers/articles.controller';
import articleSchema from '../schema/articles.schema';
import { isUserAuthenticated } from '../auth/auth.impl';
import { storeFile, onlyAllowFilesWithExtension } from '../util/files';


// http.post(
//   "article",
//   isUserAuthenticated,
//   validateRequestSchema(articleSchema.createArticle),
//   articlesController.articleTitleExist(true),
//   storeFile.array("file", 1),
//   onlyAllowFilesWithExtension([ 'article' ]),
//   articlesController.uploadArticle(true),
//   articlesController.create
// );

// http.patch(
//   "article/:id",
//   isUserAuthenticated,
//   validateRequestSchema(articleSchema.updateArticle),
//   articlesController.articleTitleExist(true),
//   articlesController.deleteArticleFromStorage,
//   storeFile.array("file", 1),
//   onlyAllowFilesWithExtension([ 'article' ]),
//   articlesController.uploadArticle,
//   articlesController.update
// );

// NOTE:
// This route is wrong and serves no purpose.
// http.get(
//   "article/:id",
//   articlesController.getArticleWithID
// );

// NOTE:
// This route is also wrong.
// Needs rework.
// http.get(
//   "articles/:user_id",
//   articlesController.getArticleWithUserID
// );

http.delete(
  "article/:id",
  isUserAuthenticated,
  articlesController.deleteArticle
);
