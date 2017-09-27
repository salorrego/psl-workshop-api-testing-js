const agent = require('superagent-promise')(require('superagent'), Promise);
const responseTime = require('superagent-response-time');

const { expect } = require('chai');

describe('Given a user loged in giGithub', () => {
  const urlBase = 'https://api.github.com';

  describe('When I try to get all users', () => {
    let timeResponse;
    let usersResponse;

    before(() => {
      usersResponse = agent.get(`${urlBase}/users`)
        .auth('token', process.env.ACCESS_TOKEN);

      return agent.get(`${urlBase}/users`)
        .auth('token', process.env.ACCESS_TOKEN)
        .use(responseTime((err, time) => {
          timeResponse = time;
        })).then(() => 0);
    });

    it('Then response should be less than 5 seconds', () => {
      expect(timeResponse).to.be.lessThan(5000);
    });

    it('Then I should get 30 users by default', () =>
      usersResponse.then((response) => {
        expect(response.body.length).to.equals(30);
      }));
  });

  describe('When I try to get 10 Users only', () => {
    let usersResponse;
    const queryToSend = {
      per_page: 10
    };

    before(() =>
      agent.get(`${urlBase}/users`)
        .auth('token', process.env.ACCESS_TOKEN)
        .query(queryToSend)
        .then((response) => {
          usersResponse = response.body;
        }));

    it('Then I should get only 10 users', () => {
      expect(usersResponse.length).to.equal(10);
    });
  });

  describe('When I try to get 100 Users', () => {
    let usersResponse;
    const queryToSend = {
      per_page: 100
    };

    before(() =>
      agent.get(`${urlBase}/users`)
        .auth('token', process.env.ACCESS_TOKEN)
        .query(queryToSend)
        .then((response) => {
          usersResponse = response.body;
        }));

    it('Then I should get 100 users', () => {
      expect(usersResponse.length).to.equal(100);
    });
  });
});
