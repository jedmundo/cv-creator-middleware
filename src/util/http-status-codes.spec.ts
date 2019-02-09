import { expect } from 'chai';

import { HTTP_STATUS_CODES } from './http-status-codes';

describe('src/util/http-status-codes.ts', () => {

  it('Should have status OK (200)', () => {
    expect(HTTP_STATUS_CODES).to.have.property('OK');
    expect(HTTP_STATUS_CODES.OK).to.be.a('number');
    expect(HTTP_STATUS_CODES.OK).to.equal(200);
  });

  it('Should have status Not Found (404)', () => {
    expect(HTTP_STATUS_CODES).to.have.property('NOT_FOUND');
    expect(HTTP_STATUS_CODES.NOT_FOUND).to.be.a('number');
    expect(HTTP_STATUS_CODES.NOT_FOUND).to.equal(404);
  });

  it('Should have status Server Error (500)', () => {
    expect(HTTP_STATUS_CODES).to.have.property('INTERNAL_SERVER_ERROR');
    expect(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).to.be.a('number');
    expect(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).to.equal(500);
  });

});
