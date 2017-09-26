const agent = require('superagent-promise')(require('superagent'), Promise);
const chai = require('chai');
const md5 = require('md5');

chai.use(require('chai-subset'));

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

    it(`Then ${userName} info should be returned`, () => {
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

      it(`Then ${expectedRepository} should exist`, () => {
        assert.exists(repository);
        expect(repository.full_name).to.equal('aperdomob/jasmine-awesome-report');
        expect(repository.private).to.equal(false);
        expect(repository.language).to.equal('JavaScript');
        expect(repository.default_branch).to.equal('development');
        expect(repository.description).to.equal('An awesome html report for Jasmine');
      });

      describe(`When ${expectedRepository} main branch is downloaded`, () => {
        let zip;
        const numExpectedMd5 = '81b4fd5281eff143c603bcc8f6f6c84f';

        before(() =>
          agent.get(`${repository.svn_url}/zipball/${repository.default_branch}`)
            .auth('token', process.env.ACCESS_TOKEN)
            .buffer(true)
            .then((response) => {
              zip = response.text;
            }));

        it('Then the zip archive should be downloaded correctly', () => {
          expect(md5(zip)).to.not.equal(numExpectedMd5);
        });
      });

      describe('When GET repository list', () => {
        let readmeInfo;
        const readmeContent = {
          name: 'README.md',
          path: 'README.md',
          sha: '9bcf2527fd5cd12ce18e457581319a349f9a56f3'
        };

        before(() =>
          agent.get(`${repository.url}/contents`)
            .auth('token', process.env.ACCESS_TOKEN)
            .then((response) => {
              readmeInfo = response.body.find(files => files.name === 'README.md');
            }));

        it('Then README.md should exist', () => {
          assert.exists(readmeInfo);
          expect(readmeInfo).containSubset(readmeContent);
        });

        describe('When README.md is downloaded', () => {
          let readmeFile;
          const numReadmeMd5 = '8a406064ca4738447ec522e639f828bf';

          before(() =>
            agent.get(readmeInfo.download_url)
              .buffer(true)
              .then((response) => {
                readmeFile = response.text;
              }));

          it('Then README file should exist', () => {
            assert.exists(readmeFile);
            expect(md5(readmeFile)).to.equal(numReadmeMd5);
          });
        });
      });
    });
  });
});
