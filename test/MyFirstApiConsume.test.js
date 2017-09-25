
const agent = require('superagent-promise')(require('superagent'), Promise);
const statusCode = require('http-status-codes');
const chai = require('chai');

const expect = chai.expect;

describe('First Api Tests', () => {

    it('Consume GET Service', () => {
        return agent.get('https://httpbin.org/ip').then((response) => {
          expect(response.status).to.equal(statusCode.OK);
          expect(response.body).to.have.property('origin');
        });
      });
 
});
