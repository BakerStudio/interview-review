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

  it('should return DB count', function() {
    return chai.request(app)
      .get('/count')
      .then(function(res) {
        res.should.have.status(200);
        res.should.not.equal(0);
      });
  });

  it('should insert DB record', function() {
    var record = {
      "question": "Question 5",
      "answer": "Answer 5",
      "category": "Test"
    }
    return chai.request(app)
      .post('/question')
      .send(record)
      .then(function(res) {
        res.should.have.status(201);
      });
  })

  // chai.request(server)
  //             .post('/book')
  //             .send(book)
  //             .end((err, res) => {
  //                 res.should.have.status(200);
  //                 res.body.should.be.a('object');
  //                 res.body.should.have.property('errors');
  //                 res.body.errors.should.have.property('pages');
  //                 res.body.errors.pages.should.have.property('kind').eql('required');
  //               done();
  //             });
  //       });


});
