import http, { validateRequestSchema } from './api.impl';
import { isUserAuthenticated } from '../auth/auth.impl';
import { storeFile, onlyAllowFilesWithExtension } from '../util/files';
import * as documentController from '../controllers/documents.controller';
import * as tagsController from '../controllers/tags.controller';
import documentSchema from '../schema/documents.schema';

http.post(
  "compress_image",
  isUserAuthenticated,
  storeFile.array("file", 1),
  onlyAllowFilesWithExtension([ 'jpg', 'jpeg', 'png', 'gif' ]),
  validateRequestSchema(documentSchema.compressImage),
  documentController.compressImage
);

http.post(
  "image",
  isUserAuthenticated,
  storeFile.array("file", 1),
  onlyAllowFilesWithExtension([ 'jpg', 'jpeg', 'png', 'gif' ]),
  validateRequestSchema(documentSchema.uploadImage),
  tagsController.tagExists({ params: [[ 'id', 'tag_id' ]], passOnNonExistent: false }),
  documentController.uploadImage,
  documentController.storeImage
);

// http.post(
//   "document",
//   isUserAuthenticated,
//   storeFile.array("file", 1),
//   onlyAllowFilesWithExtension([ 'jpg', 'jpeg', 'png', 'gif' ]),
//   validateRequestSchema(documentSchema.newDocument),
//   documentController.newDocument
// );

// http.patch(
//   "document/:id",
//   isUserAuthenticated,
//   validateRequestSchema(documentSchema.updateTag),
//   documentController.updateDocumentTag
// );

http.get(
  "images",
  isUserAuthenticated,
  documentController.getImages
);

http.delete(
  "document/:id",
  isUserAuthenticated,
  documentController.deleteDocument
);
