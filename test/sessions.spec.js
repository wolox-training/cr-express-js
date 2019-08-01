const request = require('supertest');
const app = require('.././app');
const userModel = require('../app/models').user;
const authenticationService = require('../app/services/authentication');
const moment = require('moment');
const jwt = require('jwt-simple');
const { secret } = require('../config').common.session;

const createUserModel = user =>
  userModel.create({
    email: user.email,
    name: user.name,
    lastName: user.lastName,
    password: user.password,
    role: user.role || 'regular'
  });

const compareDates = (newDate, oldDate) => moment(newDate).isAfter(oldDate);

const userData = {
  email: 'jose@wolox.com.ar',
  name: 'jose',
  lastName: 'perez',
  password: '$2a$10$4sUmMDqL/Ux1rqGIyxka5OljqC.pZHyIPxvVsMsV6wc7Ro1xBHwQC'
};

describe('POST /users/sessions/invalidate_all - invalidate all the user sessions', () => {
  it('should success invalidating all the user logged sessions', done => {
    createUserModel(userData).then(createdUser => {
      const tokenRegularUserObject = authenticationService.generateToken(createdUser);
      request(app)
        .post('/users/sessions/invalidate_all')
        .set('Authorization', `Bearer ${tokenRegularUserObject.token}`)
        .send()
        .then(res => {
          expect(res.status).toBe(200);
          expect(compareDates(res.body.baseAllowedTimeToken, createdUser.baseAllowedTimeToken)).toBe(true);
          expect(res.body.message).toBe('Old user logged sessions invalidated');
          done();
        });
    });
  });

  it('should fail for invalid token', done => {
    createUserModel(userData).then(createdUser => {
      const tokenRegularUserObject = authenticationService.generateToken(createdUser);
      request(app)
        .post('/users/sessions/invalidate_all')
        .set('Authorization', `Bearer ${tokenRegularUserObject.token}`)
        .send()
        .then(() => {
          request(app)
            .post('/users/sessions/invalidate_all')
            .set('Authorization', `Bearer ${tokenRegularUserObject.token}`)
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

describe('POST /users/sessions - testing expiration for user token session', () => {
  const signInDataToEndpoint = {
    email: 'jose@wolox.com.ar',
    password: 'asdasdasd4566'
  };
  it('should success with the expiration token date', done => {
    const oldDate = moment().unix();
    createUserModel(userData).then(() => {
      request(app)
        .post('/users/sessions')
        .send(signInDataToEndpoint)
        .then(response => {
          expect(response.status).toBe(200);
          expect(response.header.authorization).toBeDefined();
          expect(compareDates(response.body.expirationTokenDate, oldDate)).toBe(true);
          done();
        });
    });
  });

  it('should fail for expired token', done => {
    const payload = {
      iat: moment().unix(),
      exp: moment().unix()
    };
    const token = jwt.encode(payload, secret);
    request(app)
      .post('/users/sessions/invalidate_all')
      .set('Authorization', `Bearer ${token}`)
      .send()
      .then(res => {
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Token expired');
        expect(res.body.internal_code).toBe('unauthorized_error');
        done();
      });
  });
});
