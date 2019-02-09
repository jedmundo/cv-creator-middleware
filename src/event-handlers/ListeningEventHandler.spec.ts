import { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

describe('src/event-handlers/ListeningEventHandler.ts', () => {

  let loggerStub: any;
  let listeningEventHandler: (address: string | object) => () => void;

  beforeEach(() => {
    loggerStub = {
      info: sinon.stub(),
    };

    ({ default: listeningEventHandler } = proxyquire('./ListeningEventHandler', {
      '../util/logger': {
        default: {
          child: () => {
            return loggerStub;
          }
        }
      }
    }));
  });

  it('Should listen to port', () => {
    listeningEventHandler({ port: 1234 })();

    expect(loggerStub.info).to.have.been.calledWith('Listening on port 1234');
  });

  it('Should listen to address', () => {
    listeningEventHandler('1234')();

    expect(loggerStub.info).to.have.been.calledWith('Listening on pipe 1234');
  });
});
