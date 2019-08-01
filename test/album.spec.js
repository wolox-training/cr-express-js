const request = require('supertest');
const app = require('../app');
const userModel = require('../app/models').user;
const userAlbumModel = require('../app/models').user_album;
const authenticationService = require('../app/services/authentication');
const albumService = require('../app/services/album');
albumService.getAlbumById = jest.fn(id => Promise.resolve({ title: 'The title', id }));
albumService.getPhotosAlbums = jest.fn(id =>
  Promise.resolve([
    {
      albumId: id,
      id: 1,
      title: 'accusamus beatae ad facilis cum similique qui sunt',
      url: 'https://via.placeholder.com/600/92c952',
      thumbnailUrl: 'https://via.placeholder.com/150/92c952'
    },
    {
      albumId: id,
      id: 2,
      title: 'reprehenderit est deserunt velit ipsam',
      url: 'https://via.placeholder.com/600/771796',
      thumbnailUrl: 'https://via.placeholder.com/150/771796'
    }
  ])
);

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

describe('/POST /albums/:albumId - user purchases an album', () => {
  it('should success, an user buys a book', done => {
    createUserModel(regularUser).then(createdUser => {
      const tokenObject = authenticationService.generateToken(createdUser);
      request(app)
        .post('/albums/4')
        .set('Authorization', `Bearer ${tokenObject.token}`)
        .send()
        .then(res => {
          userAlbumModel.findOne({ where: { userId: 1, albumId: 4 } }).then(userPurchaseFound => {
            expect(userPurchaseFound.userId).toBe(1);
            expect(userPurchaseFound.albumId).toBe(4);
            expect(res.status).toBe(201);
            expect(res.body.albumId).toBe(4);
            expect(res.body.user).toBe(regularUser.email);
            done();
          });
        });
    });
  });

  it('should fail because user tries to buy the same book', done => {
    createUserModel(regularUser).then(createdUser => {
      const tokenObject = authenticationService.generateToken(createdUser);
      request(app)
        .post('/albums/4')
        .set('Authorization', `Bearer ${tokenObject.token}`)
        .send()
        .then(res => {
          expect(res.status).toBe(201);
          expect(res.body.albumId).toBe(4);
          request(app)
            .post('/albums/4')
            .set('Authorization', `Bearer ${tokenObject.token}`)
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

describe('GET /users/:userId/albums - list of bought albums', () => {
  it('should success with the albums bought by the logged regular user', done => {
    createUserModel(regularUser).then(createdUser => {
      const tokenObject = authenticationService.generateToken(createdUser);
      buyAlbum(createdUser.id, 2).then(purchasedAlbum => {
        request(app)
          .get('/users/1/albums')
          .set('Authorization', `Bearer ${tokenObject.token}`)
          .then(albumsUserList => {
            expect(albumsUserList.status).toBe(200);
            expect(albumsUserList.body.albumsData[0].id).toBe(purchasedAlbum.albumId);
            done();
          });
      });
    });
  });

  it('should success with the albums bought by an user consulted by an adminUser', done => {
    createUserModel(adminUser).then(adminUserCreated => {
      const tokenObject = authenticationService.generateToken(adminUserCreated);
      createUserModel(regularUser).then(regularUserCreated => {
        buyAlbum(regularUserCreated.id, 2).then(purchasedAlbum => {
          request(app)
            .get('/users/2/albums')
            .set('Authorization', `Bearer ${tokenObject.token}`)
            .then(albumsUserList => {
              expect(albumsUserList.status).toBe(200);
              expect(albumsUserList.body.albumsData[0].id).toBe(purchasedAlbum.albumId);
              done();
            });
        });
      });
    });
  });

  it('should fail for not allowed role to access to another user data', done => {
    const anotherRegularUser = {
      email: 'carlos@wolox.com.ar',
      name: 'carlos',
      lastName: 'perez',
      password: '$2a$10$4sUmMDqL/Ux1rqGIyxka5OljqC.pZHyIPxvVsMsV6wc7Ro1xBHwQC',
      role: 'regular'
    };
    createUserModel(regularUser).then(regularUserCreated => {
      const tokenObject = authenticationService.generateToken(regularUserCreated);
      createUserModel(anotherRegularUser).then(anotherRegularUserCreated => {
        buyAlbum(anotherRegularUserCreated.id, 2).then(() => {
          request(app)
            .get('/users/2/albums')
            .set('Authorization', `Bearer ${tokenObject.token}`)
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
  const checkPhotosLength = photos => photos.length >= 0;
  it('should success with list of photos of an album bought by an user', done => {
    createUserModel(regularUser).then(regularUserCreated => {
      const tokenObject = authenticationService.generateToken(regularUserCreated);
      buyAlbum(regularUserCreated.id, 1).then(() => {
        request(app)
          .get('/users/albums/1/photos')
          .set('Authorization', `Bearer ${tokenObject.token}`)
          .then(response => {
            expect(response.status).toBe(200);
            expect(checkPhotosLength(response.body.photosAlbum)).toBe(true);
            done();
          });
      });
    });
  });

  it('should fail for invalid album id', done => {
    createUserModel(regularUser).then(regularUserCreated => {
      const tokenObject = authenticationService.generateToken(regularUserCreated);
      request(app)
        .get('/users/albums/1/photos')
        .set('Authorization', `Bearer ${tokenObject.token}`)
        .then(response => {
          expect(response.status).toBe(404);
          expect(response.body.message).toBe('album id not found');
          expect(response.body.internal_code).toBe('not_found_error');
          done();
        });
    });
  });
});
