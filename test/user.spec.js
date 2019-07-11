const request = require('supertest');
const app = require('.././app');
const userModel = require('../app/models').user;

describe('POST /signup - create users', () => {
  const userData = {
    email: 'jose@wolox.com.ar',
    name: 'jose',
    lastName: 'perez',
    password: 'asdasdasd654'
  };

  it('should succeed returning the created user', done => {
    request(app)
      .post('/users')
      .send(userData)
      .then(res => {
        expect(res.status).toBe(201);
        expect(res.body.email).toBe(userData.email);
        userModel.findOne({ where: { email: userData.email } }).then(user => {
          expect(user.email).toBe(userData.email);
          done();
        });
      });
  });

  it('should fail for the existence of the email', done => {
    userModel
      .create({
        email: userData.email,
        name: userData.name,
        lastName: userData.lastName,
        password: userData.password
      })
      .then(() => {
        request(app)
          .post('/users')
          .send(userData)
          .then(res => {
            expect(res.status).toBe(409);
            expect(res.body.internal_code).toBe('conflict_error');
            done();
          });
      });
  });

  it('should fail for invalid password', done => {
    const userDataWrongPassword = {
      email: 'asdadsa@wolox.com.ar',
      name: 'hector',
      lastName: 'asdasdasdas',
      password: '12'
    };
    request(app)
      .post('/users')
      .send(userDataWrongPassword)
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.body.internal_code).toBe('bad_request_error');
        done();
      });
  });
  it('should fail for uncompleted fields', done => {
    const userDataUncompletedFields = {
      email: '',
      name: 'hector',
      lastName: '',
      password: 'abc12345'
    };
    request(app)
      .post('/users')
      .send(userDataUncompletedFields)
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.body.internal_code).toBe('bad_request_error');
        done();
      });
  });
});
