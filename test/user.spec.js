const request = require('supertest');
const app = require('.././app');
const userModel = require('../app/models').user;

const createUser = user =>
  request(app)
    .post('/users')
    .send(user)
    .then(userCreated => userCreated);

describe('POST /signup - create users', () => {
  const userData = {
    email: 'jose@wolox.com.ar',
    name: 'jose',
    lastName: 'perez',
    password: 'asdasdasd654'
  };

  it('should succeed returning the created user', done => {
    createUser(userData).then(res => {
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
    createUser(userDataWrongPassword).then(res => {
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
    createUser(userDataUncompletedFields).then(res => {
      expect(res.status).toBe(400);
      expect(res.body.internal_code).toBe('bad_request_error');
      done();
    });
  });
});

describe('POST /users/sessions  - signIn user', () => {
  const user = {
    name: 'hector',
    lastName: 'gonzalez',
    email: 'hector@wolox.com.ar',
    password: 'abc12345'
  };
  it('should succeed returning the generated token', done => {
    const signInData = {
      email: 'hector@wolox.com.ar',
      password: 'abc12345'
    };
    createUser(user).then(res => {
      expect(res.status).toBe(201);
      request(app)
        .post('/users/sessions')
        .send(signInData)
        .then(response => {
          expect(response.status).toBe(200);
          expect(response.body.token).toBeDefined();
          done();
        });
    });
  });

  it('should fail returning 400 code error because uncompleted fields', done => {
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

  it('should fail returning 400 code error because invalid password', done => {
    const signInData = {
      email: 'hector@wolox.com.ar',
      password: 'asdasdasd5'
    };
    createUser(user).then(res => {
      expect(res.status).toBe(201);
      request(app)
        .post('/users/sessions')
        .send(signInData)
        .then(response => {
          expect(response.status).toBe(400);
          expect(response.body.internal_code).toBe('bad_request_error');
          done();
        });
    });
  });

  it('should fail returning 404 code error because the user with the requested email was not found', done => {
    const signInData = {
      email: 'hector@wolox.com.ar',
      password: 'asasdasdasds3'
    };
    createUser(user).then(res => {
      expect(res.status).toBe(201);
      request(app)
        .post('/users/sessions')
        .send(signInData)
        .then(response => {
          expect(response.status).toBe(400);
          expect(response.body.internal_code).toBe('bad_request_error');
          done();
        });
    });
  });
});

describe('GET /users - list of users', () => {
  it('should response with 200 code', done => {
    request(app)
      .get('/users')
      .expect(200, done());
  });
  it('should response with 200 code', done => {
    request(app)
      .get('/users?limit=10&page=1')
      .expect(200, done());
  });
  it('should response with 200 code when the response should not show anything', done => {
    request(app)
      .get('/users?limit=10&page=4')
      .expect(200, done());
  });
});

describe('POST /admin/users signup admin users or update the user role to admin', () => {
  it('should succeed return 201 creating an user wich role is admin', () => {
    console.log('go');
  });
});
