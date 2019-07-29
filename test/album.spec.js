const request = require('supertest');
const app = require('../app');
const userModel = require('../app/models').user;
const userAlbumModel = require('../app/models').user_album;
const authenticationService = require('../app/services/authentication');
jest.mock('../app/services/album');

const createUserModel = user =>
  userModel.create({
    email: user.email,
    name: user.name,
    lastName: user.lastName,
    password: user.password,
    role: user.role
  });

const buyAlbum = (userId, albumId) => userAlbumModel.create({ userId, albumId });

const regularUser = {
  email: 'jose@wolox.com.ar',
  name: 'jose',
  lastName: 'perez',
  password: '$2a$10$4sUmMDqL/Ux1rqGIyxka5OljqC.pZHyIPxvVsMsV6wc7Ro1xBHwQC',
  role: 'regular'
};

const adminUser = {
  email: 'jorge@wolox.com.ar',
  name: 'jorge',
  lastName: 'perez',
  password: '$2a$10$4sUmMDqL/Ux1rqGIyxka5OljqC.pZHyIPxvVsMsV6wc7Ro1xBHwQC',
  role: 'admin'
};

describe('/POST /albums/:id - user purchases an album', () => {
  it('should success, an user buys a book', done => {
    createUserModel(regularUser).then(createdUser => {
      const token = authenticationService.generateToken(createdUser);
      request(app)
        .post('/albums/4')
        .set('Authorization', `Bearer ${token}`)
        .send()
        .then(res => {
          userAlbumModel.findOne({ where: { userId: 1, albumId: 4 } }).then(userPurchaseFound => {
            expect(userPurchaseFound.userId).toBe(1);
            expect(userPurchaseFound.albumId).toBe(4);
            expect(res.status).toBe(200);
            expect(res.body.albumId).toBe(4);
            expect(res.body.user).toBe(regularUser.email);
            done();
          });
        });
    });
  });

  it('should fail because user tries to buy the same book', done => {
    createUserModel(regularUser).then(createdUser => {
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
      });
  });
});

describe('GET /users/:user_id/albums - list of bought albums', () => {
  it('should success with the list of albums bought by an user', done => {
    createUserModel(regularUser).then(createdUser => {
      const token = authenticationService.generateToken(createdUser);
      buyAlbum(createdUser.id, 2).then(purchasedAlbum => {
        request(app)
          .get('/users/1/albums')
          .set('Authorization', `Bearer ${token}`)
          .then(albumsUserList => {
            expect(albumsUserList.status).toBe(200);
            expect(albumsUserList.body.albumsData[0].id).toBe(purchasedAlbum.albumId);
            done();
          });
      });
    });
  });

  it('should success with the list of albums bought by all the users', done => {
    createUserModel(adminUser).then(adminUserCreated => {
      const token = authenticationService.generateToken(adminUserCreated);
      createUserModel(regularUser).then(regularUserCreated => {
        buyAlbum(regularUserCreated.id, 2).then(purchasedAlbum => {
          request(app)
            .get('/users/2/albums')
            .set('Authorization', `Bearer ${token}`)
            .then(albumsUserList => {
              expect(albumsUserList.status).toBe(200);
              expect(albumsUserList.body.albumsData[0].id).toBe(purchasedAlbum.albumId);
              done();
            });
        });
      });
    });
  });

  it('should fail for invalid permissions', done => {
    const anotherRegularUser = {
      email: 'carlos@wolox.com.ar',
      name: 'carlos',
      lastName: 'perez',
      password: '$2a$10$4sUmMDqL/Ux1rqGIyxka5OljqC.pZHyIPxvVsMsV6wc7Ro1xBHwQC',
      role: 'regular'
    };
    createUserModel(regularUser).then(regularUserCreated => {
      const token = authenticationService.generateToken(regularUserCreated);
      createUserModel(anotherRegularUser).then(anotherRegularUserCreated => {
        buyAlbum(anotherRegularUserCreated.id, 2).then(() => {
          request(app)
            .get('/users/2/albums')
            .set('Authorization', `Bearer ${token}`)
            .then(response => {
              expect(response.status).toBe(400);
              expect(response.body.message).toBe('invalid userId');
              expect(response.body.internal_code).toBe('bad_request_error');
              done();
            });
        });
      });
    });
  });
});

describe('GET /users/albums/:id/photos - list of photos of bought album', () => {
  it('should success with list of photos of an album bought by an user', done => {
    createUserModel(regularUser).then(regularUserCreated => {
      const token = authenticationService.generateToken(regularUserCreated);
      buyAlbum(regularUserCreated.id, 1).then(() => {
        request(app)
          .get('/users/albums/1/photos')
          .set('Authorization', `Bearer ${token}`)
          .then(response => {
            expect(response.status).toBe(200);
            expect(response.body.photosAlbum[0].albumId).toBe('1');
            expect(response.body.photosAlbum[0].url).toBe('https://via.placeholder.com/600/92c952');
            done();
          });
      });
    });
  });

  it('should fail for invalid album id', done => {
    createUserModel(regularUser).then(regularUserCreated => {
      const token = authenticationService.generateToken(regularUserCreated);
      request(app)
        .get('/users/albums/1/photos')
        .set('Authorization', `Bearer ${token}`)
        .then(response => {
          expect(response.status).toBe(400);
          expect(response.body.message).toBe('invalid albumId');
          expect(response.body.internal_code).toBe('bad_request_error');
          done();
        });
    });
  });
});
