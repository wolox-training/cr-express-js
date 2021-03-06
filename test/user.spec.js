const request = require('supertest');
const app = require('.././app');
const userModel = require('../app/models').user;
const authenticationService = require('./../app/services/authentication');
const { default_role } = require('../app/constants');
const { admin_role } = require('../app/constants');

const createUser = user =>
  request(app)
    .post('/users')
    .send(user);

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
  password: '$2a$10$4sUmMDqL/Ux1rqGIyxka5OljqC.pZHyIPxvVsMsV6wc7Ro1xBHwQC'
};

const userDataToEndpoint = {
  email: 'jose@wolox.com.ar',
  name: 'jose',
  lastName: 'perez',
  password: 'asdasdasd4566'
};

describe('POST /signup - create users', () => {
  it('should success returning the created user', done => {
    createUser(userDataToEndpoint).then(res => {
      expect(res.status).toBe(201);
      expect(res.body.email).toBe(userDataToEndpoint.email);
      userModel.findOne({ where: { email: userDataToEndpoint.email } }).then(user => {
        expect(user.email).toBe(userDataToEndpoint.email);
        done();
      });
    });
  });

  it('should fail for the existence of the email', done => {
    createUserModel(userData).then(() => {
      request(app)
        .post('/users')
        .send(userDataToEndpoint)
        .then(res => {
          expect(res.status).toBe(409);
          expect(res.body.internal_code).toBe('conflict_error');
          done();
        });
    });
  });

  it('should fail for invalid password', done => {
    const userDataWrongPassword = {
      email: 'jose@wolox.com.ar',
      name: 'jose',
      lastName: 'perez',
      password: '12'
    };
    createUser(userDataWrongPassword).then(res => {
      expect(res.status).toBe(400);
      expect(res.body.internal_code).toBe('bad_request_error');
      done();
    });
  });

  it('should fail for uncompleted fields', done => {
    const userDataUncompletedFields = {
      email: '',
      name: 'jose',
      lastName: '',
      password: 'abc12345'
    };
    createUser(userDataUncompletedFields).then(res => {
      expect(res.status).toBe(400);
      expect(res.body.internal_code).toBe('bad_request_error');
      done();
    });
  });
});
describe('POST /users/sessions  - signIn user', () => {
  it('should success with the generated token', done => {
    const signInDataToEndpoint = {
      email: 'jose@wolox.com.ar',
      password: 'asdasdasd4566'
    };
    createUserModel(userData).then(() => {
      request(app)
        .post('/users/sessions')
        .send(signInDataToEndpoint)
        .then(response => {
          expect(response.status).toBe(200);
          expect(response.header.authorization).toBeDefined();
          done();
        });
    });
  });

  it('should fail for uncompleted fields', done => {
    const signInData = {
      email: 'hectorwolox.com.ar',
      password: ''
    };
    request(app)
      .post('/users/sessions')
      .send(signInData)
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.body.internal_code).toBe('bad_request_error');
        done();
      });
  });

  it('should fail for invalid password', done => {
    const signInData = {
      email: 'jose@wolox.com.ar',
      password: 'asdasdasd5'
    };
    createUserModel(userData).then(() => {
      request(app)
        .post('/users/sessions')
        .send(signInData)
        .then(response => {
          expect(response.status).toBe(400);
          expect(response.body.internal_code).toBe('bad_request_error');
          expect(response.body.message).toBe('sign in error');
          done();
        });
    });
  });

  it('should fail because the email does not exists', done => {
    const signInData = {
      email: 'hector@wolox.com.ar',
      password: 'asasdasdasds3'
    };
    createUserModel(userData).then(() => {
      request(app)
        .post('/users/sessions')
        .send(signInData)
        .then(response => {
          expect(response.status).toBe(400);
          expect(response.body.internal_code).toBe('bad_request_error');
          expect(response.body.message).toBe('sign in error');
          done();
        });
    });
  });
});

describe('GET /users - list of users', () => {
  const token = authenticationService.generateToken(userData);
  const anotherUser = {
    email: 'kevin@wolox.com.ar',
    name: 'kevin',
    lastName: 'perez',
    password: 'asdasdasd'
  };
  const compare = (order, firstValue, secondValue) => {
    if (order === 'ASC') {
      return firstValue > secondValue;
    }
    return firstValue < secondValue;
  };
  const checkOrder = (order, orderBy, arr) =>
    arr.every((value, index) => !index || compare(order, value[orderBy], arr[index - 1][orderBy]));

  it('should success with default params', done => {
    createUserModel(userData).then(() => {
      createUserModel(anotherUser).then(() => {
        request(app)
          .get('/users')
          .set('Authorization', `Bearer ${token}`)
          .then(res => {
            expect(res.status).toBe(200);
            expect(res.body.totalPages).toBe(1);
            expect(res.body.users.count).toBe(2);
            expect(checkOrder('ASC', 'email', res.body.users.rows)).toBe(true);
            done();
          });
      });
    });
  });

  it('should success with specified params', done => {
    createUserModel(userData).then(() => {
      createUserModel(anotherUser).then(() => {
        request(app)
          .get('/users?limit=20&page=1&orderBy=name&order=desc')
          .set('Authorization', `Bearer ${token}`)
          .then(res => {
            expect(res.status).toBe(200);
            expect(res.body.totalPages).toBe(1);
            expect(res.body.users.count).toBe(2);
            expect(checkOrder('DESC', 'name', res.body.users.rows)).toBe(true);
            done();
          });
      });
    });
  });

  it('should fail for invalid token', done => {
    request(app)
      .get('/users?limit=10&page=4')
      .set('Authorization', 'Bearer 12')
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('invalid token');
        expect(res.body.internal_code).toBe('bad_request_error');
        done();
      });
  });
});

describe('POST /admin/users - signup admin users or update the user role to admin', () => {
  const adminUser = {
    email: 'jorge@wolox.com.ar',
    name: 'jorge',
    lastName: 'perez',
    password: 'hola123456',
    role: 'admin'
  };
  const token = authenticationService.generateToken(adminUser);
  const createUserAdmin = user =>
    request(app)
      .post('/admin/users')
      .set('Authorization', `Bearer ${token}`)
      .send(user);

  it('should success creating an user wich role is admin', done => {
    createUserAdmin(userDataToEndpoint).then(res => {
      expect(res.status).toBe(200);
      expect(res.body.role).toBe(admin_role);
      userModel.findOne({ where: { email: userData.email } }).then(userFound => {
        expect(userFound.role).toBe(admin_role);
        done();
      });
    });
  });

  it('should success updating an user wich role is regular', done => {
    createUserModel(userData).then(createdUser => {
      expect(createdUser.role).toBe(default_role);
      createUserAdmin(userDataToEndpoint).then(createdAdmin => {
        expect(createdAdmin.status).toBe(200);
        expect(createdAdmin.body.role).toBe(admin_role);
        userModel.findOne({ where: { email: userData.email } }).then(userFound => {
          expect(userFound.role).toBe(admin_role);
          done();
        });
      });
    });
  });

  it('should fail for not allowed role', done => {
    createUserModel(userData).then(createdUser => {
      expect(createdUser.role).toBe(default_role);
      const tokenRegularUser = authenticationService.generateToken(createdUser);
      request(app)
        .post('/admin/users')
        .set('Authorization', `Bearer ${tokenRegularUser}`)
        .send(userDataToEndpoint)
        .then(res => {
          expect(res.body.message).toBe('not allowed');
          expect(res.body.internal_code).toBe('unauthorized_error');
          expect(res.status).toBe(401);
          done();
        });
    });
  });
});
