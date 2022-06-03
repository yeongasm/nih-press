/**
 * Simple wrapper around express.Router.
 * router is initialized and SUBDIR is included into path to avoid typing for every request.
 */

import express, { Request, Response, NextFunction, type Router } from 'express';
const router : Router = express.Router();

const unwrap = (...callbacks: Function[]) => Array.from([ ...callbacks ], cb => (req: Request, res: Response, next: NextFunction) => Promise.resolve(cb(req, res, next)).catch(next));

const http_post   = (path: string, ...handlers: any[]): Router => router.post(  process.env.SUBDIR + '/' + path, unwrap(...handlers));
const http_put    = (path: string, ...handlers: any[]): Router => router.put(   process.env.SUBDIR + '/' + path, unwrap(...handlers));
const http_patch  = (path: string, ...handlers: any[]): Router => router.patch( process.env.SUBDIR + '/' + path, unwrap(...handlers));
const http_get    = (path: string, ...handlers: any[]): Router => router.get(   process.env.SUBDIR + '/' + path, unwrap(...handlers));
const http_delete = (path: string, ...handlers: any[]): Router => router.delete(process.env.SUBDIR + '/' + path, unwrap(...handlers));

class ISuccess {};
class IError {};

interface IResponse {
  code: number,
  message: string
};

class HttpResponse<T extends ISuccess | IError> implements IResponse {
  code: number;
  message: string;
  payload?: any;

  constructor(code: number, message: string) {
    this.code = code;
    this.message = message;
  };

  statusCode(): number { return this.code; };
  attach<T>(payload: T) { this.payload = payload; };
};

class ApiError extends HttpResponse<IError> {
  // response: HttpResponse<IError>;
  // constructor(code: number, message: string) {
  //   super(message);
  //   this.response = new HttpResponse<IError>(code, message);
  // };

  // statusCode(): number { return this.response.statusCode(); };
  // msg(): string { return this.response.message; };
}

/**
 * Reason for doing this is we do not want to have the payload attached to the error response.
 */
function constructError(code: number, msg: string) {
  const error = new ApiError(code, msg);
  delete error.payload;
  return error;
}

class API {

  /** 200 */
  static ok                   (msg: string): HttpResponse<ISuccess> { return new HttpResponse<ISuccess>(200, msg); }
  static created              (msg: string): HttpResponse<ISuccess> { return new HttpResponse<ISuccess>(201, msg); }
  static accepted             (msg: string): HttpResponse<ISuccess> { return new HttpResponse<ISuccess>(202, msg); }

  /** 400 */
  static badRequest           (msg: string): ApiError { return constructError(400, msg); }
  static unauthorized         (msg: string): ApiError { return constructError(401, msg); }
  static forbidden            (msg: string): ApiError { return constructError(403, msg); }
  static notFound             (msg: string): ApiError { return constructError(404, msg); }
  static methodNotAllowed     (msg: string): ApiError { return constructError(405, msg); }
  static notAcceptable        (msg: string): ApiError { return constructError(406, msg); }
  static requestTimeout       (msg: string): ApiError { return constructError(408, msg); }
  static conflict             (msg: string): ApiError { return constructError(409, msg); }
  static unprocessableEntity  (msg: string): ApiError { return constructError(422, msg); }

  /** 500 */
  static internalServerError  (msg: string): ApiError { return constructError(500, msg); }
  static notImplemented       (msg: string): ApiError { return constructError(501, msg); }
  static badGateway           (msg: string): ApiError { return constructError(502, msg); }

}

function errorHandler(err: ApiError, req: Request, res: Response, next: NextFunction): void {
  res.status(500);
  if (typeof err.statusCode === "function") {
    res.status(err.statusCode());
  }
  if (Object.keys(err).length) {
    res.send(err);
  } else {
    // TODO(Afiq):
    // Should dump the contents of the stack into a log file...
    res.send('Sorry, something went wrong :(');
  }
}

import { ObjectSchema, ValidationOptions } from 'joi';

function validateRequestSchema(schema: ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const options: ValidationOptions = {
      abortEarly: true,
      allowUnknown: false,
      stripUnknown: true
    };
    const validation = schema.validate(req.body, options);
    if (validation.error) {
      return next(API.unprocessableEntity(validation.error.details[0].message));
    }
    next();
  }
};

function parseCookies (req: Request): any {
  const list: any = {};
  const cookieHeader = req.headers?.cookie;
  if (!cookieHeader) return list;

  cookieHeader.split(`;`).forEach((cookie) => {
      let [ name, ...rest] = cookie.split(`=`);
      name = name?.trim();
      if (!name) return;
      const value = rest.join(`=`).trim();
      if (!value) return;
      list[name] = decodeURIComponent(value);
  });

  return list;
}

interface ModuleExport
{
  router: Router,
  validateRequestSchema: Function,
  parseCookies: Function,
  post: Function,
  put: Function,
  patch: Function,
  get: Function,
  delete: Function
}

const e : ModuleExport = {
  router: router,
  validateRequestSchema: validateRequestSchema,
  parseCookies: parseCookies,
  post: http_post,
  put: http_put,
  patch: http_patch,
  get: http_get,
  delete: http_delete
};

export {
  router,
  API,
  errorHandler,
  parseCookies,
  validateRequestSchema,
  http_post as post,
  http_put as put,
  http_patch as patch,
  http_get as get,
  http_delete as delete
};

export default e;
