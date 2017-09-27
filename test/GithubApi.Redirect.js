const agent = require('superagent-promise')(require('superagent'), Promise);
const statusCode = require('http-status-codes');

const { expect } = require('chai');

describe('Given old and new URL', () => {
  const oldUrl = 'https://github.com/aperdomob/redirect-test';
  const newUrl = 'https://github.com/aperdomob/new-redirect-test';

  describe('When I try to get the old URL with HEAD', () => {
    let headResponse;

    before(() => agent.head(oldUrl)
      .catch((err) => {
        headResponse = err;
      }));

    it('Then the response should be 301, Redirected', () => {
      expect(headResponse.status).to.equal(statusCode.MOVED_PERMANENTLY);
      expect(headResponse.response.headers.location).to.equal(newUrl);
    });

    describe('When I try to GET the new URL with the old URL', () => {
      let newUrlResponse;

      before(() => agent.get(oldUrl)
        .then((response) => {
          newUrlResponse = response;
        }));

      it.only('Then the response should be 200, OK', () => {
        expect(newUrlResponse.status).to.equal(statusCode.OK);
      });
    });
  });
});
