const request = require('supertest');
const app = require('../app');
const userModel = require('../app/models').user;
const userAlbumModel = require('../app/models').user_album;
const authenticationService = require('../app/services/authentication');
const albumService = require('../app/services/album');
albumService.getAlbumById = jest.fn(id => Promise.resolve({ title: 'The title', id }));

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

describe('/POST /albums/:albumId - user purchases an album', () => {
  it('should success, an user buys a book', done => {
    createUserModel(userData).then(createdUser => {
      const token = authenticationService.generateToken(createdUser);
      request(app)
        .post('/albums/4')
        .set('Authorization', `Bearer ${token}`)
        .send()
        .then(res => {
          userAlbumModel.findOne({ where: { userId: 1, albumId: 4 } }).then(userPurchaseFound => {
            expect(userPurchaseFound.userId).toBe(1);
            expect(userPurchaseFound.albumId).toBe(4);
            expect(res.status).toBe(201);
            expect(res.body.albumId).toBe(4);
            expect(res.body.user).toBe(userData.email);
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
          expect(res.status).toBe(201);
          expect(res.body.albumId).toBe(4);
          request(app)
            .post('/albums/4')
            .set('Authorization', `Bearer ${token}`)
            .send()
            .then(response => {
              expect(response.status).toBe(409);
              expect(response.body.internal_code).toBe('conflict_error');
              done();
            });
        });
    });
  });
});
