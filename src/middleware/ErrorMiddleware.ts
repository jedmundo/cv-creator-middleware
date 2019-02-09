import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../util/http-status-codes';

class ErrorMiddleware {

  public handleRequest(err: any, _req: Request, res: Response, _next: NextFunction): void {
    console.error({ err });

    res.status(err.status || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    res.json({
      code: err.code,
      message: err.message,
    });
  }

}

export default new ErrorMiddleware().handleRequest;
