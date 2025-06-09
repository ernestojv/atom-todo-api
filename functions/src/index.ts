import * as functions from "firebase-functions";
import express, { Request, Response } from 'express';

import { corsMiddleware } from './middleware/cors.middleware';
import { errorHandler } from './middleware/error.middleware';
import { generalRateLimit } from './middleware/rateLimit.middleware';
import { basicSecurity } from './middleware/helmet.middleware';

import { routerApi } from './routes/index.routes';

const app = express();

app.use(corsMiddleware);
app.use(basicSecurity);
app.use(generalRateLimit);
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Hello Atom TODO Api!',
    timestamp: new Date().toISOString(),
    environment: 'Cloud Functions'
  });
});

routerApi(app);

app.use(errorHandler);
export { app };
export const api = functions.https.onRequest(app);