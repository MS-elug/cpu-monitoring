import express, { NextFunction } from 'express';
import cors from 'cors';
import compression from 'compression';
import { apiV1Router } from './api/v1/index';
import { Request, Response } from 'express';
import { rootLogger } from '@services/loggers/root-logger';
import { nanoid } from 'nanoid';
import { connectMorgan } from '@middlewares/morgan';

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3001;
const host = process.env.HOST ? process.env.HOST : '127.0.0.1';
app.set('port', port);
app.set('host', host);
app.set('x-powered-by', false); // Security: better to do not give information about the backend technologies

// Attach unique ID to request and dedicated logger
app.use((req, res, next) => {
  res.locals.id = nanoid();
  return next();
});

// Register http request logging system
app.use(connectMorgan());

// Compression of response
app.use(compression({ level: 9 }));

// Enable CORS
app.use(cors());

// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// Parse body to json if HTTP header application/json is sent and store the result in req.body
app.use(express.json());

// Declare api v1 routes
app.use('/api/v1', apiV1Router);

// Middleware to non-processed requests
app.use((req: Request, res: Response) => {
  res.status(404).send('service not found');
});

// Middleware to handle errors from routers
// Disable eslint rule because Express JS always expect 4 parameters to work
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // Log the error
  rootLogger.error('Unexpected error', err.stack, { reqId: res.locals.id });
  // Return a generic error to end user (for security reason the error cause mustn't be disclosed)
  res.status(500).send({ error: 'Unexpected error' });
});

// Start the server
app.listen(app.get('port'), app.get('host'), () => {
  rootLogger.info(`HTTP Server listening on port ${app.get('host')}:${app.get('port')}`);
});
