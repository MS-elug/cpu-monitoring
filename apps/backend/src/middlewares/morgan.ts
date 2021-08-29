import { rootLogger } from '@services/loggers/root-logger';
import morgan, { TokenIndexer } from 'morgan';
import { Request, Response, RequestHandler } from 'express';

// Build a custom formater including the request id
function formatRequest(tokens: TokenIndexer<Request, Response>, req: Request, res: Response) {
  const meta = {
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: tokens.status(req, res),
    id: tokens['id'](req, res),
    referrer: tokens['referrer'](req, res),
    remoteAddress: tokens['remote-addr'](req, res)
  };

  // Redirect stream to http logger
  const message = `REQ ${meta.method} ${meta.url}`;
  rootLogger.log('info', message, meta);

  return message;
}

export function connectMorgan(): RequestHandler {
  // Create new token for request id
  morgan.token('id', (req: Request, res: Response) => {
    return res.locals.id;
  });

  // Build a null write stream so morgan doesn't write the log to the default stream output Console
  const nullWriteStream = {
    write: () => {
      //do nothing
    }
  };

  // Register middleware
  return morgan(formatRequest, {
    immediate: true,
    stream: nullWriteStream
  });
}
