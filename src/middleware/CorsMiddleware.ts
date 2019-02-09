import config from 'config';
import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../util/http-status-codes';

class CorsMiddleware {

  public handleRequest(req: Request, res: Response, next: NextFunction): void {
    console.info(`CORS request - req.headers.origin: ${req.headers.origin},
      result: ${config.cors.whitelist.indexOf(req.headers.origin)}`);

    if (typeof req.headers.origin !== 'string') {
      return next();
    }

    if (config.cors.whitelist.includes(req.headers.origin)) {
      res.header('Access-Control-Allow-Origin', req.headers.origin); // Inject origin from request header
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
      res.header('Access-Control-Allow-Headers',
        'Content-Type, Authorization, Content-Length, X-Requested-With, x-http-method-override');

      // Allow authentication cookies
      res.header('Access-Control-Allow-Credentials', 'true');

      // Return an OK for the OPTIONS request
      if (req.method === 'OPTIONS') {
        return res.status(HTTP_STATUS_CODES.OK).end();
      }
    }

    return next();
  }
}

export default new CorsMiddleware().handleRequest;
