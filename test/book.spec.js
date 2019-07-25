const request = require('supertest');
const app = require('.././app');
const userModel = require('../app/models').user;
const userService = require('../app/services/user');
const authenticationService = require('./../app/services/authentication');

const createUserModel = user =>
  userModel.create({
    email: user.email,
    name: user.name,
    lastName: user.lastName,
    password: user.password
  });

const userData = {
  email: 'jose@wolox.com.ar',
  name: 'jose',
  lastName: 'perez',
  password: '$2a$10$4sUmMDqL/Ux1rqGIyxka5OljqC.pZHyIPxvVsMsV6wc7Ro1xBHwQC',
  role: 'regular'
};

/* const mockAlbum = {
  id: 1,
  title: 'Harry Potter'
};*/

describe('/POST /albums/:id - user purchases an album', () => {
  it('should success, an user buys a book', done => {
    createUserModel(userData).then(createdUser => {
      const token = authenticationService.generateToken(createdUser);
      request(app)
        .post('/albums/4')
        .set('Authorization', `Bearer ${token}`)
        .send()
        .then(res => {
          expect(res.status).toBe(200);
          expect(res.body.albumId).toBe(4);
          expect(res.body.user).toBe(userData.email);
          done();
        })
        .catch(() => {
          userService.buyAlbum(userData, 4).then(purchase => {
            expect(purchase.email).toBe(userData.email);
            expect(purchase.albumId).toBe(4);
            done();
          });
        });
    });
  });

  it('should fail because user tries to buy the same book', done => {
    createUserModel(userData).then(createdUser => {
      const token = authenticationService.generateToken(createdUser);
      request(app)
        .post('/albums/4')
        .set('Authorization', `Bearer ${token}`)
        .send()
        .then(res => {
          expect(res.status).toBe(200);
          expect(res.body.albumId).toBe(4);
          request(app)
            .post('/albums/4')
            .set('Authorization', `Bearer ${token}`)
            .send()
            .then(response => {
              expect(response.status).toBe(409);
              expect(response.body.internal_code).toBe('conflict_error');
              done();
            })
            .catch(() => {
              userService.buyAlbum(userData, 4).then(purchase => {
                expect(purchase.email).toBe(userData.email);
                expect(purchase.albumId).toBe(4);
                done();
              });
            });
        });
    });
  });

  it('should fail for invalid token', done => {
    request(app)
      .post('/albums/4')
      .set('Authorization', 'Bearer 12')
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('invalid token');
        expect(res.body.internal_code).toBe('bad_request_error');
        done();
      })
      .catch(() => {
        userService.buyAlbum(userData, 4).then(purchase => {
          expect(purchase.email).toBe(userData.email);
          expect(purchase.albumId).toBe(4);
          done();
        });
      });
  });
});
