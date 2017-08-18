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

  it('should return home page', function() {
    return chai.request(app)
      .get('/')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.html;
      });
  });

  it('should return DB count (GET)', function() {
    return chai.request(app)
      .get('/count')
      .then(function(res) {
        res.should.have.status(200);
        res.should.not.equal(0);
      });
  });

  it('should insert DB record (POST)', function() {
    var record = {
      "question": "Question-Travis Test",
      "answer": "Of course it will work!",
      "category": "Travis"
    }
    return chai.request(app)
      .post('/post')
      .send(record)
      .then(function(res) {
        res.should.have.status(201);
      });
  })

});
