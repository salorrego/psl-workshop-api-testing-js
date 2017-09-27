const agent = require('superagent-promise')(require('superagent'), Promise);
const statusCode = require('http-status-codes');

const { expect, assert } = require('chai');

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

    it('Then the user should have at least one repository', () => {
      expect(userInfo.public_repos).to.be.greaterThan(0);
    });

    describe(`When I look at the repositories of ${user}`, () => {
      let repositories;
      let repository;

      before(() => agent.get(userInfo.repos_url)
        .auth('token', process.env.ACCESS_TOKEN)
        .then((response) => {
          repositories = response.body;
          [repository] = repositories;
        }));

      it('Then there must be at least one repository', () => {
        assert.exists(repository);
        expect(repository).to.has.property('id');
      });

      describe('When I try to create an issue', () => {
        let issueRequest;
        const issueQuery = {
          title: 'testing issue for API testing'
        };

        before(() => {
          issueRequest = agent.post(`${urlBase}/repos/${user}/${repository.name}/issues`)
            .auth('token', process.env.ACCESS_TOKEN)
            .send(issueQuery);
        });

        it('Then I should get the title sent and no body', () => issueRequest.then((response) => {
          expect(response.status).to.equal(statusCode.CREATED);
          expect(response.body.body).to.equal(null);
        }));
      });
    });
  });
});
