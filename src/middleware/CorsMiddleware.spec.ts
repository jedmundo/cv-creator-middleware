import { NextFunction, Request, Response } from 'express';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import { expect } from 'chai';

import { HTTP_STATUS_CODES } from '../util/http-status-codes';

const projectConfig = require('../../config/default.json');

describe('src/middleware/CorsMiddleware.ts', () => {

  let requestStub: Partial<Request>;
  let responseStub: Partial<Response>;
  let nextStub: NextFunction;
  let loggerStub: any;
  let endStub: any;
  let CorsMiddleware: any;

  beforeEach(() => {
    endStub = sinon.stub();
    requestStub = {
      headers: {
        origin: projectConfig.cors.whitelist[0]
      }
    };
    responseStub = {
      header: sinon.stub(),
      status: sinon.stub().returns({ end: endStub })
    };
    nextStub = sinon.stub();
    loggerStub = {
      info: sinon.stub(),
    };

    CorsMiddleware = proxyquire('./CorsMiddleware', {
      '../util/logger': {
        default: {
          child: () => {
            return loggerStub;
          }
        }
      },
    });
  });

  it('Should not do anything if origin is not known', () => {
    requestStub.headers.origin = [];
    CorsMiddleware.default(requestStub, responseStub, nextStub);

    expect(loggerStub.info).to.have.callCount(1);
    expect(nextStub).to.have.been.calledWith();
    expect(endStub).to.have.callCount(0);
  });

  it('Should not set headers if origin is not in whitelist', () => {
    requestStub.headers.origin = 'someOrigin';
    CorsMiddleware.default(requestStub, responseStub, nextStub);

    expect(loggerStub.info).to.have.callCount(1);
    expect(responseStub.header).to.have.callCount(0);
    expect(responseStub.status).to.have.callCount(0);
    expect(nextStub).to.have.callCount(1);
    expect(endStub).to.have.callCount(0);
  });

  it('Should set the headers correctly if origin is known', () => {
    CorsMiddleware.default(requestStub, responseStub, nextStub);

    expect(loggerStub.info).to.have.callCount(1);
    expect(responseStub.header).to.have.callCount(4); // tslint:disable-line
    expect(nextStub).to.have.been.calledWith();
    expect(endStub).to.have.callCount(0);
  });

  it('Should send http status OK when request method is OPTIONS', () => {
    requestStub.method = 'OPTIONS';
    CorsMiddleware.default(requestStub, responseStub, nextStub);

    expect(loggerStub.info).to.have.callCount(1);
    expect(responseStub.header).to.have.callCount(4); // tslint:disable-line
    expect(responseStub.status).to.have.callCount(1);
    expect(responseStub.status).to.have.been.calledWith(HTTP_STATUS_CODES.OK);
    expect(nextStub).to.have.callCount(0);
    expect(endStub).to.have.callCount(1);
  });
});
