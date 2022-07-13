import 'dotenv/config';
import express, { Express } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import history from 'connect-history-api-fallback';
import morgan from 'morgan';
import passport from './auth/auth.impl';
import { __WORKING_DIR__ } from './util/paths';
import './util/firebase';

const app: Express = express();
// Make a temp dir if directory does not exist. Special use case for Heroku.
if (!fs.existsSync("temp")) {
  fs.mkdirSync("temp");
}

// Theoratically, we should not have crashes due to accessing undefined variables from an object since we're using TypeScript.

// This needs to be set up correctly, cannot be as simple as just creating a writeStream as it overrides the existing one.
// For development it's fine, for production, we need access logs by dates.
app.use(morgan('combined', {
  immediate: true,
  stream: fs.createWriteStream(path.join(__WORKING_DIR__, "access.log"))
}));
app.use(express.json());

let allowedOrigins: string[] = [];
if (process.env.NODE_ENV == "development") {
  allowedOrigins = [
    "http://127.0.0.1:3000",
    "http://localhost:3000"
  ];
}

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin
    // (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (process.env.NODE_ENV == "developmment" && allowedOrigins.indexOf(origin) === -1) {
      let msg = `The CORS policy for this site does not allow access from ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(history({
  verbose: true,
  rewrites: [
    {
      from: /^\/api\/.*$/,
      to: (context: any): string => context.parsedUrl.path,
    },
  ],
})); // history module needs a "rewrites" option to make GET requests work.
if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__WORKING_DIR__, "/dist/")))
}
app.use(passport.initialize());

import api, { errorHandler } from './routes/api';

app.use(api);
app.use(errorHandler);

const port: number = parseInt(process.env.PORT ?? "5000");
app.listen(port, () => console.log(`Server running on ${port}`));
