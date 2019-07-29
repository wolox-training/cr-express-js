const request = require('supertest');
const app = require('.././app');
const userModel = require('../app/models').user;
const authenticationService = require('./../app/services/authentication');

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

const userDataToEndpoint = {
  email: 'jose@wolox.com.ar',
  name: 'jose',
  lastName: 'perez',
  password: 'asdasdasd4566'
};
// TERMINAR
describe('POST /users/sessions/invalidate_all - invalidate all the user sessions', () => {
  const compareDates = (newDate, oldDate) => new Date(newDate) - new Date(oldDate) >= 0;
  it('should succes with updated user base token date', done => {
    createUserModel(userData).then(createdUser => {
      const tokenRegularUser = authenticationService.generateToken(createdUser);
      request(app)
        .post('/users/sessions/invalidate_all')
        .set('Authorization', `Bearer ${tokenRegularUser}`)
        .send(userDataToEndpoint)
        .then(updatedUser => {
          expect(updatedUser.status).toBe(201);
          expect(compareDates(updatedUser.body.baseAllowedDateToken, createdUser.baseAllowedDateToken)).toBe(
            true
          );
          done();
        });
    });
  });
});
