const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../server');
const environment = process.env.NODE_ENV = 'test';
const configuration = require('../knexfile')[environment];
const knex = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return a 404 status code for and endpoint that doesn\'t exist', done => {
    chai.request(server)
      .get('/exordium')
      .end((err, resp) => {
        resp.should.have.status(404);
        done();
      });
  });
});

describe('API Routes', () => {
  
  beforeEach( done => {
    knex.migrate.rollback()
      .then(() => {
        knex.migrate.latest()
          .then(() => {
            return knex.seed.run()
              .then(() => {
                done();
              });
          });
      });
  });

  describe('GET /api/v1/games', () => {
    it('should return an array of game objects', done => {
      chai.request(server)
        .get('/api/v1/games')
        .end((err, resp) => {
          resp.should.have.status(200);
          resp.should.be.json;
          resp.body.should.be.a('array');
          resp.body[0].should.have.property('id');
          resp.body[0].id.should.equal(1);
          resp.body[0].should.have.property('level_name');
          resp.body[0].level_name.should.equal('CSS-01');
          done();
        });
    });
  });

  describe('GET /api/v1/games/:id', () => {
    it('should return an individual game object', done => {
      chai.request(server)
        .get('/api/v1/games/1')
        .end((err, resp) => {
          resp.should.have.status(200);
          resp.should.be.json;
          resp.body.should.be.a('object');
          resp.body.should.have.property('id');
          resp.body.id.should.equal(1);
          resp.body.should.have.property('level_name');
          resp.body.level_name.should.equal('CSS-01');
          done();
        });
    });

    it('should return an error if the id does not exist', done => {
      chai.request(server)
        .get('/api/v1/games/123')
        .end((err, resp) => {
          resp.should.have.status(500);
          resp.body.should.be.a('object');
          resp.body.should.have.property('error');
          resp.body.error.should.equal('Could not find a game with the id of 123');
          done();
        });
    });
  });

  describe('POST /api/v1/users', () => {
    it('should return the id of the user that was added', done => {
      chai.request(server)
        .post('/api/v1/users')
        .send({
          user: { gamer_tag: 'Youngpasta', level_id: 1 }
        })
        .end((err, resp) => {
          resp.should.have.status(201);
          resp.should.be.json;
          resp.body.should.be.a('object');
          resp.body.should.have.property('id');
          resp.body.id.should.equal(3);
          done();
        });
    });
  });
});