const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

let deleteTarget = 0;

chai.use(chaiHttp);

describe('Testing server', function() {

  before(function() {
   return runServer();
  });

  after(function() {
   return closeServer();
  });

  it('should return home page (GET)', function() {
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
      "category": "TravisXXX"
    }
    return chai.request(app)
      .post('/post')
      .send(record)
      .then(function(res) {
        res.should.have.status(201);
        // console.log("insert document, id: " + JSON.stringify(res.body));
      });
  })

  it('should return documents with cat=Travis (GET)', function() {
    return chai.request(app)
      .get('/questions/TravisXXX')
      .then(function(res) {
        res.should.have.status(200);
        res.should.not.equal(0);
        // console.log("Category TravisXXX: " + JSON.stringify(res.body[0]) + res.body[0]._id);
        deleteTarget = res.body[0]._id;
        // console.log("deleteTarget: " + deleteTarget);
      });
  });

  it('should delete document inserted during test (DEL)', function() {
    return chai.request(app)
      .delete('/' + deleteTarget)
      .then(function(res) {
        res.should.have.status(200);
        res.should.not.equal(0);
      });
  });

});
