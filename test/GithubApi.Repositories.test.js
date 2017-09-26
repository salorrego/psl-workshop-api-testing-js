const agent = require('superagent-promise')(require('superagent'), Promise);
const chai = require('chai');
const md5 = require('md5');

// chai.use(require('chai-subset'));

const { expect, assert } = chai;

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

    xit(`Then ${userName} info should be returned`, () => {
      expect(userInfo.name).to.equal('Alejandro Perdomo');
      expect(userInfo.company).to.equal('PSL');
      expect(userInfo.location).to.equal('Colombia');
    });

    describe(`When GET ${userName} repository`, () => {
      let repository;
      const expectedRepository = 'jasmine-awesome-report';

      before(() =>
        agent.get(userInfo.repos_url)
          .auth('token', process.env.ACCESS_TOKEN)
          .then((response) => {
            repository = response.body.find(repos => repos.name === expectedRepository);
          }));

      xit(`Then ${expectedRepository} should exist`, () => {
        assert.exists(repository);
        expect(repository.full_name).to.equal('aperdomob/jasmine-awesome-report');
        expect(repository.private).to.equal(false);
        expect(repository.language).to.equal('JavaScript');
        expect(repository.default_branch).to.equal('development');
        expect(repository.description).to.equal('An awesome html report for Jasmine');
      });

      describe(`When ${expectedRepository} main branch is downloaded`, () => {
        const numExpectedMd5 = '81b4fd5281eff113c603bcc8f6f6cc4f';
        let zip;

        before(() =>
          agent.get(`${repository.svn_url}/archive/${repository.default_branch}.zip`)
            .auth('token', process.env.ACCESS_TOKEN)
            .buffer(true)
            .then((response) => {
              zip = response.text;
            }));

        it('Then the zip archive should be downloaded correctly', () => {
          expect(md5(zip)).to.equal(numExpectedMd5);
        });
      });
    });
  });
});
