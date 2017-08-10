const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('Testing server', function() {

  before(function() {
   return runServer();
  });

  after(function() {
   return closeServer();
  });

  it('should return status = 200', function() {
    return chai.request(app)
      .get('/')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.html;
      });
  });

  it('should return count > 0', function() {
    return chai.request(app)
      .get('/count')
      .then(function(res) {
        res.should.have.status(200);
        res.should.not.equal(0);
      });
  });

});
