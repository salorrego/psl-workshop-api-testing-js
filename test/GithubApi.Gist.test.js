const agent = require('superagent-promise')(require('superagent'), Promise);
const statusCode = require('http-status-codes');
const chai = require('chai');

const { expect, assert } = require('chai');

chai.use(require('chai-subset'));

const testFile = `
    function wait(method, time) {
        return new Promise((resolve) => {
        setTimeout(resolve(method()), time);
        });
  }
`;

describe.only('Given a user is loged in Github', () => {
  const urlBase = 'https://api.github.com';

  describe('When I try to create a new gist', () => {
    let gist;
    const gistQuery = {
      description: 'gist de prueba github API',
      public: true,
      files: {
        'promise.js': {
          content: testFile
        }
      }
    };

    before(() => agent.post(`${urlBase}/gists`)
      .auth('token', process.env.ACCESS_TOKEN)
      .send(gistQuery)
      .then((response) => {
        gist = response;
      }));

    it('Then I should get status 201, the description and files returned', () => {
      expect(gist.status).to.equal(statusCode.CREATED);
      expect(gist.body.description).to.equal(gistQuery.description);
      expect(gist.body.files).containSubset(gistQuery.files);
    });

    describe('When I try to GET the gist', () => {
      let gistRequest;

      before(() => {
        gistRequest = agent.get(gist.body.url)
          .auth('token', process.env.ACCESS_TOKEN);
      });

      it('Then the gist should exist', () =>
        gistRequest.then((response) => {
          assert.exists(response.body);
          expect(response.status).to.equal(statusCode.OK);
        }));

      describe('When I try to DELETE the gist', () => {
        let gistDeleted;

        before(() => {
          gistDeleted = agent.del(gist.body.url)
            .auth('token', process.env.ACCESS_TOKEN);
        });

        it('Then the gist should be deleted', () =>
          gistDeleted.then((response) => {
            expect(response.status).to.equal(statusCode.NO_CONTENT);
            expect(response.body).to.eql({});
          }));

        describe('When I try to GET the deleted gist', () => {
          let gistAfterDelete;

          before((done) => {
            agent.get(gist.body.url)
              .auth('token', process.env.ACCESS_TOKEN).then((response) => {
                gistAfterDelete = response;
                done();
              }).catch((error) => {
                gistAfterDelete = error;
                done();
              });
          });

          it('Then I should get NOT FOUND', () => {
            expect(gistAfterDelete.status).to.equal(statusCode.NOT_FOUND);
          });
        });
      });
    });
  });
});
