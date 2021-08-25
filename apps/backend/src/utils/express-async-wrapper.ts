import { Request, Response, NextFunction } from 'express';

/**
 * Wrap an asynchronous expressjs router function to catch all possible expections and properly route it to the 'next' express callback.
 * It helps to avoid code duplication and make the code cleaner/simpler, no need to wrap the code with try/catch.
 * StrongLoop recommendation
 * @param fn
 * @returns
 */
export const wrapAsync =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction): Promise<unknown> =>
    fn(req, res, next).catch(next);
