const request = require('supertest');
const app = require('.././app');
const userModel = require('../app/models').user;
const { expiry, expiry_type } = require('../config').common.session;
const authenticationService = require('../app/services/authentication');

const createUserModel = user =>
  userModel.create({
    email: user.email,
    name: user.name,
    lastName: user.lastName,
    password: user.password,
    role: user.role || 'regular'
  });

const userData = {
  email: 'jose@wolox.com.ar',
  name: 'jose',
  lastName: 'perez',
  password: '$2a$10$4sUmMDqL/Ux1rqGIyxka5OljqC.pZHyIPxvVsMsV6wc7Ro1xBHwQC'
};

describe('POST /users/sessions/invalidate_all - invalidate all the user sessions', () => {
  const compareDates = (newDate, oldDate) => new Date(newDate) - new Date(oldDate) >= 0;

  it('should succes with updated user base token date', done => {
    createUserModel(userData).then(createdUser => {
      const tokenRegularUser = authenticationService.generateToken(createdUser);
      request(app)
        .post('/users/sessions/invalidate_all')
        .set('Authorization', `Bearer ${tokenRegularUser}`)
        .send()
        .then(updatedUser => {
          expect(updatedUser.status).toBe(201);
          expect(compareDates(updatedUser.body.baseAllowedDateToken, createdUser.baseAllowedDateToken)).toBe(
            true
          );
          done();
        });
    });
  });

  it('should fail for invalid token', done => {
    createUserModel(userData).then(createdUser => {
      const tokenRegularUser = authenticationService.generateToken(createdUser);
      request(app)
        .post('/users/sessions/invalidate_all')
        .set('Authorization', `Bearer ${tokenRegularUser}`)
        .send()
        .then(updatedUser => {
          expect(updatedUser.status).toBe(201);
          expect(compareDates(updatedUser.body.baseAllowedDateToken, createdUser.baseAllowedDateToken)).toBe(
            true
          );
          request(app)
            .post('/users/sessions/invalidate_all')
            .set('Authorization', `Bearer ${tokenRegularUser}`)
            .send()
            .then(res => {
              expect(res.status).toBe(400);
              expect(res.body.message).toBe('invalid token');
              expect(res.body.internal_code).toBe('bad_request_error');
              done();
            });
        });
    });
  });
});

describe('POST sign', () => {
  const signInDataToEndpoint = {
    email: 'jose@wolox.com.ar',
    password: 'asdasdasd4566'
  };

  it('should success with the generated token', done => {
    createUserModel(userData).then(() => {
      request(app)
        .post('/users/sessions')
        .send(signInDataToEndpoint)
        .then(response => {
          expect(response.status).toBe(200);
          expect(response.header.authorization).toBeDefined();
          expect(response.body.expiration_token).toBe(`${expiry} ${expiry_type}`);
          setTimeout(() => {
            request(app)
              .post('/users/sessions/invalidate_all')
              .set('Authorization', `Bearer ${response.header.authorization.split(' ')[1]}`)
              .send()
              .then(res => {
                expect(res.status).toBe(201);
                done();
              });
          }, 500);
        });
    });
  });

  it('should fail for expired token', done => {
    const token =
      'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9\
    .eyJlbWFpbCI6InBlZHJvQHdvbG94LmNvbS5hciIsIm5hbWUiOiJwZWRybyIsImxhc3ROYW1lIj\
    oicm9kcmlndWV6IiwiaWQiOjEsInJvbGUiOiJyZWd1bGFyIiwiZ2VuZXJhdGVkRGF0ZSI6MTU2ND\
    UwMjE4MTM3OSwiZXhwIjoxNTY0NTAyMTkxMzc5fQ\
    .GDG02Hc0baqTcrWKpaxaLBgas0zaKau50I4Q23UUBoc';
    request(app)
      .post('/users/sessions/invalidate_all')
      .set('Authorization', token)
      .send()
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('invalid token');
        expect(res.body.internal_code).toBe('bad_request_error');
        done();
      });
  });
});
