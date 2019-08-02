const request = require('supertest');
const app = require('.././app');
const userModel = require('../app/models').user;
const authenticationService = require('../app/services/authentication');
const moment = require('moment');

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
  const compareDates = (newDate, oldDate) => moment(newDate).isAfter(oldDate);

  it('should success invalidating all the user logged sessions', done => {
    createUserModel(userData).then(createdUser => {
      const tokenRegularUser = authenticationService.generateToken(createdUser);
      request(app)
        .post('/users/sessions/invalidate_all')
        .set('Authorization', `Bearer ${tokenRegularUser}`)
        .send()
        .then(res => {
          expect(res.status).toBe(200);
          expect(compareDates(res.body.baseAllowedDateToken, createdUser.baseAllowedDateToken)).toBe(true);
          expect(res.body.message).toBe('Old user logged sessions invalidated');
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
        .then(() => {
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
