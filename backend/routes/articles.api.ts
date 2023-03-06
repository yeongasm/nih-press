import http, { validateRequestSchema } from './api.impl';
import * as articlesController from '../controllers/articles.controller';
import * as userController from '../controllers/user.controller';
import articleSchema from '../schema/articles.schema';
import { isUserAuthenticated } from '../auth/auth.impl';
import { storeFile, onlyAllowFilesWithExtension } from '../util/files';


http.post(
  "article",
  isUserAuthenticated,
  validateRequestSchema(articleSchema.createArticle),
  articlesController.articleExist({ params: [ [ "title", "title" ] ], throwOnExist: true }),
  articlesController.create
);

http.patch(
  "article/:id",
  isUserAuthenticated,
  storeFile.array("file", 1),
  onlyAllowFilesWithExtension([ 'html' ]),
  validateRequestSchema(articleSchema.updateArticle),
  articlesController.articleExist({ checkId: true }),
  articlesController.abortIfNonExistent,
  articlesController.removeArticleHTML,
  articlesController.uploadArticleHTML,
  articlesController.removeArticleNonPrimaryTags,
  articlesController.update
);

http.get(
  "articles",
  isUserAuthenticated,
  articlesController.getInternal
);

http.get(
  "article/:id",
  isUserAuthenticated,
  articlesController.getOne
)

http.get(
  "public_articles",
  userController.emailExist({ continueIfNonExistent: false }),
  articlesController.getPublic
);

http.get(
  "public_article/:title",
  userController.emailExist({ continueIfNonExistent: false }),
  articlesController.getOnePublic
);

http.delete(
  "article/:id",
  isUserAuthenticated,
  articlesController.deleteArticle
);
