const agent = require('superagent-promise')(require('superagent'), Promise);
// const statusCode = require('http-status-codes');
const chai = require('chai');
// const md5 = require('md5');

// chai.use(require('chai-subset'));

const { expect } = chai;

const urlBase = 'https://api.github.com';

describe('Given a user is logged in GitHub', () => {
  const userName = 'aperdomob';

  describe(`When GET ${userName} information`, () => {
    let userInfo;

    before(() =>
      agent.get(`${urlBase}/users/${userName}`)
        .auth('token', process.env.ACCESS_TOKEN)
        .then((response) => {
          userInfo = response.body;
        }));

    it(`Then ${userName} info should be returned`, () => {
      expect(userInfo.name).to.equal('Alejandro Perdomo');
      expect(userInfo.company).to.equal('PSL');
      expect(userInfo.location).to.equal('Colombia');
    });
  });
});
