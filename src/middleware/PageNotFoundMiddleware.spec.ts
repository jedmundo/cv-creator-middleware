import { NextFunction, Request, Response } from 'express';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import { expect } from 'chai';

import { HTTP_STATUS_CODES } from '../util/http-status-codes';

describe('src/middleware/PageNotFoundMiddleware.ts', () => {

  it('Should respond with status not found', () => {
    const requestStub: Partial<Request> = {};
    const responseStub: Partial<Response> = {
      status: sinon.stub()
    };
    const nextStub: NextFunction = sinon.stub();
    const loggerStub: any = {
      debug: sinon.stub(),
    };

    const PageNotFoundMiddleware: any = proxyquire('./PageNotFoundMiddleware', {
      '../util/logger': {
        default: {
          child: () => {
            return loggerStub;
          }
        }
      },
    });

    PageNotFoundMiddleware.default(requestStub, responseStub, nextStub);

    expect(loggerStub.debug).to.have.been.called;
    expect(responseStub.status).to.have.been.calledWith(HTTP_STATUS_CODES.NOT_FOUND);
  });
});