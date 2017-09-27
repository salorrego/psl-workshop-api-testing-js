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
});
