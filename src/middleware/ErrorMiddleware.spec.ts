import { NextFunction, Request, Response } from 'express';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import { expect } from 'chai';

import { HTTP_STATUS_CODES } from '../util/http-status-codes';

describe('src/middleware/ErrorMiddleware.ts', () => {

  let errorStub: any;
  let requestStub: Partial<Request>;
  let responseStub: Partial<Response>;
  let nextStub: NextFunction;
  let loggerStub: any;
  let ErrorMiddleware: any;

  beforeEach(() => {
    errorStub = {
      message: 'someMessage',
      code: 'someCode',
      status: 'someStatus'
    };
    requestStub = {};
    responseStub = {
      status: sinon.stub(),
      json: sinon.stub()
    };
    nextStub = sinon.stub();
    loggerStub = {
      error: sinon.stub(),
    };

    ErrorMiddleware = proxyquire('./ErrorMiddleware', {
      '../util/logger': {
        default: {
          child: () => {
            return loggerStub;
          }
        }
      },
    });
  });

  it('Should handle server errors', () => {
    ErrorMiddleware.default(errorStub, requestStub, responseStub, nextStub);

    expect(loggerStub.error).to.have.been.calledWith({
      err: errorStub
    });
    expect(responseStub.status).to.have.been.calledWith(errorStub.status);
    expect(responseStub.json).to.have.been.calledWith({
      code: errorStub.code,
      message: errorStub.message
    });
  });

  it('Should set default status if no status provided', () => {
    errorStub.status = undefined;
    ErrorMiddleware.default(errorStub, requestStub, responseStub, nextStub);

    expect(loggerStub.error).to.have.been.calledWith({
      err: errorStub
    });
    expect(responseStub.status).to.have.been.calledWith(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    expect(responseStub.json).to.have.been.calledWith({
      code: errorStub.code,
      message: errorStub.message
    });
  });
});