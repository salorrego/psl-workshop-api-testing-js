const isomorphicFetch = require('isomorphic-fetch');
const statusCode = require('http-status-codes');
const chai = require('chai');

const { expect } = chai;

chai.use(require('chai-subset'));

const testFile = `
function wait(method, time) {
    return new Promise((resolve) => {
      setTimeout(resolve(method()), time);
    });
}
`;

const data = {
  description: 'gist de prueba github API',
  public: true,
  files: {
    'promise-js': {
      content: testFile
    }
  }
};

describe('Given a user is loged in Github', () => {
  const urlBase = 'https://api.github.com';

  describe('When I try to create a new gist', () => {
    let gist;
    let respStatus;
    const authHeaders = { Authorization: `token ${process.env.ACCESS_TOKEN}` };

    before(() => {
      const options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: authHeaders
      };

      return isomorphicFetch(`${urlBase}/gists`, options)
        .then((response) => {
          respStatus = response.status;
          return response.json();
        })
        .then((body) => {
          gist = body;
          return body;
        });
    });

    it('Then I should get status 201, the description and files returned', () => {
      expect(respStatus).to.equal(statusCode.CREATED);
      expect(gist).to.containSubset(data);
    });

    describe('When I try to GET the gist', () => {
      let getStatus;
      before(() => {
        const options = {
          method: 'GET',
          headers: authHeaders
        };

        return isomorphicFetch(gist.url, options)
          .then((response) => {
            getStatus = response.status;
            return response.json();
          });
      });

      it('Then the gist should exist', () => {
        expect(getStatus).to.equal(statusCode.OK);
      });

      describe('When I try to DELETE the gist', () => {
        let deleteStatus;

        before(() => {
          const options = {
            method: 'DELETE',
            headers: authHeaders
          };

          return isomorphicFetch(gist.url, options)
            .then((response) => {
              deleteStatus = response.status;
            });
        });

        it('Then the gist should be deleted', () => {
          expect(deleteStatus).to.equal(statusCode.NO_CONTENT);
        });

        describe('When I try to GET the deleted gist', () => {
          let getDeleteStatus;

          before(() => {
            const options = {
              method: 'GET',
              headers: authHeaders
            };

            return isomorphicFetch(gist.url, options)
              .then((response) => {
                getDeleteStatus = response.status;
              });
          });

          it('Then I should get NOT FOUND', () => {
            expect(getDeleteStatus).to.equal(statusCode.NOT_FOUND);
          });
        });
      });
    });
  });
});
