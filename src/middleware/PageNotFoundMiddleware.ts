import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../util/http-status-codes';

class PageNotFoundMiddleware {

  // tslint:disable-next-line
  public handleRequest(_req: Request, res: Response, _next: NextFunction): void {
    console.debug('Page not found');

    res.status(HTTP_STATUS_CODES.NOT_FOUND);
  }

}

export default new PageNotFoundMiddleware().handleRequest;
