const agent = require('superagent-promise')(require('superagent'), Promise);

const { expect } = require('chai');

describe('Given user loged in github', () => {
  const user = 'salorrego';
  const urlBase = 'https://api.github.com';

  describe(`When I look for the user ${user}`, () => {
    let userInfo;

    before(() => agent.get(`${urlBase}/user`)
      .auth('token', process.env.ACCESS_TOKEN)
      .then((response) => {
        userInfo = response.body;
      }));

    it.only('Then the user should have at least one repository', () => {
      expect(userInfo.public_repos).to.be.greaterThan(0);
    });
  });
});
