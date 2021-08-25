import express from 'express';
import { cpuRouter } from './cpu.router';

export const apiV1Router = express.Router();
apiV1Router.use('/cpu', cpuRouter);
