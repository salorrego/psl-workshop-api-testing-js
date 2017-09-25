const agent = require('superagent-promise')(require('superagent'), Promise);
const statusCode = require('http-status-codes');
const { expect } = require('chai');

function busquedaPorNombre(element) {
  return element.name === 'jasmine-awesome-report';
}

describe('Consultar información aperdomob', () => {
  it('Comprobar Nombre, Compañía y ubicación', () =>
    agent.get('https://api.github.com/users/aperdomob').then((response) => {
      expect(response.status).to.equal(statusCode.OK);
      expect(response.body.name).to.eql('Alejandro Perdomo');
      expect(response.body.company).to.eql('PSL');
      expect(response.body.location).to.eql('Colombia');
    }));

  it('Comprobar repositorio por hypermedia', () => {
    agent.get('https://api.github.com/users/aperdomob').then((response) => {
      agent.get(response.body.repos_url).then((reposResponse) => {
        expect(reposResponse.find(busquedaPorNombre).name).to.eql('jasmine-awesome-report');
      });
    });
  });
});
