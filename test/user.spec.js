const request = require('supertest');
const app = require('.././app');
const userModel = require('../app/models').user;

describe('POST /signup - create users', () => {
  const userData = {
    email: 'jose@wolox.com.ar',
    name: 'jose',
    lastName: 'perez',
    password: 'asdasdasd654'
  };

  it('should succeed returning the created user', done => {
    request(app)
      .post('/users')
      .send(userData)
      .then(res => {
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
    request(app)
      .post('/users')
      .send(userDataWrongPassword)
      .then(res => {
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
    request(app)
      .post('/users')
      .send(userDataUncompletedFields)
      .then(res => {
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
  it('should succeed returning the generated token', () => {
    const signInData = {
      email: 'hector@wolox.com.ar',
      password: 'abc12345'
    };
    request(app)
      .post('/users')
      .send(user)
      .then(res => {
        expect(res.status).toBe(201);
        expect(res.body.email).toBe(user.email);
      });
    request(app)
      .post('/users/sessions')
      .send(signInData)
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body.token);
      });
  });

  it('should fail returning 400 code error because uncompleted fields', () => {
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
      });
  });

  it('should fail returning 400 code error because invalid password', () => {
    const signInData = {
      email: 'hector@wolox.com.ar',
      password: 'asdasdasd5'
    };
    request(app)
      .post('/users')
      .send(user);
    request(app)
      .post('/users/sessions')
      .send(signInData)
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.body.internal_code).toBe('bad_request_error');
      });
  });

  /* it('should fail returning 404 code error because the user with the requested email was not found', () => {
    const signInData = {
      email: 'hector@wolox.com.ar',
      password: 'asasdasdasds3'
    };
    request(app)
      .post('/users/sessions')
      .send(signInData)
      .send(userDataUncompletedFields)
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.body.internal_code).toBe('bad_request_error');
      });
  });*/
});
