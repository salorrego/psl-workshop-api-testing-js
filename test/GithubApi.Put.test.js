const agent = require('superagent-promise')(require('superagent'), Promise);
const statusCode = require('http-status-codes');

const { expect } = require('chai');

describe('Given user login github', () => {
  const user = 'aperdomob';
  const urlBase = 'https://api.github.com';

  describe(`When I want to follow ${user}`, () => {
    let agentFollowing;

    before(() => {
      agentFollowing = agent.put(`${urlBase}/user/following/${user}`)
        .auth('token', process.env.ACCESS_TOKEN);
    });

    it('Then status should be 204 and empty body', () =>
      agentFollowing.then((response) => {
        expect(response.status).to.equal(statusCode.NO_CONTENT);
        expect(response.body).to.eql({});
      }));

    describe(`When I want to check following for ${user}`, () => {
      let followedUser;

      before(() => agent.get(`${urlBase}/user/following`)
        .auth('token', process.env.ACCESS_TOKEN)
        .then((response) => {
          followedUser = response.body.find(uFollowed => uFollowed.login === 'aperdomob');
        }));

      it(`Then I should get following ${user}`, () => {
        expect(followedUser).to.not.equal(undefined);
        expect(followedUser.url).to.equal(`${urlBase}/users/${user}`);
        expect(followedUser.type).to.equal('User');
      });
    });
  });
  describe(`When I want to follow ${user} again`, () => {
    let agentFollowingAgain;

    before(() => {
      agentFollowingAgain = agent.put(`${urlBase}/user/following/${user}`)
        .auth('token', process.env.ACCESS_TOKEN);
    });

    it('Then status should be 204 and empty body Again', () =>
      agentFollowingAgain.then((response) => {
        expect(response.status).to.equal(statusCode.NO_CONTENT);
        expect(response.body).to.eql({});
      }));

    describe(`When I want to check following for ${user} Again`, () => {
      let followedUserAgain;

      before(() => agent.get(`${urlBase}/user/following`)
        .auth('token', process.env.ACCESS_TOKEN)
        .then((response) => {
          followedUserAgain = response.body.find(uFollowed => uFollowed.login === 'aperdomob');
        }));

      it(`Then I should get following ${user} Again`, () => {
        expect(followedUserAgain).to.not.equal(undefined);
        expect(followedUserAgain.url).to.equal(`${urlBase}/users/${user}`);
        expect(followedUserAgain.type).to.equal('User');
      });
    });
  });
});
