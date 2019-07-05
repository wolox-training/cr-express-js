const request = require('supertest');
const app = require('.././app');

describe('POST / users', () => {
  const data = {
    name: 'hectooooooor',
    lastName: 'gonzalez',
    email: 'hector@wolox.com.ar',
    password: 'abc12345'
  };
  it('should response with the created user', done => {
    request(app)
      .post('/users')
      .send(data)
      .expect(200, done());
  });

  it('should reject the request for the existence of the email', done => {
    request(app)
      .post('/users')
      .send(data)
      .then(
        request(app)
          .post('/users')
          .send(data)
          .expect(409, done())
      )
      .catch(done());
  });

  it('should reject the request for invalid password', done => {
    const data2 = {
      email: 'asdadsa@wolox.com.ar',
      name: 'hectooooooor',
      lastName: 'asdasdasdas',
      password: '12'
    };
    request(app)
      .post('/users')
      .send(data2)
      .expect(400, done());
  });

  it('should reject the request for uncompleted fields', done => {
    const data3 = {
      email: '',
      name: 'hectooooooor',
      lastName: '',
      password: 'abc12345'
    };
    request(app)
      .post('/users')
      .send(data3)
      .expect(400, done());
  });
});

describe('POST /users/sessions', () => {
  const data = {
    name: 'hectooooooor',
    lastName: 'gonzalez',
    email: 'hector@wolox.com.ar',
    password: 'abc12345'
  };
  it('should response with the generated token', done => {
    const signInData = {
      email: 'hector@wolox.com.ar',
      password: 'abc12345'
    };
    request(app)
      .post('/users')
      .send(data)
      .then(
        request(app)
          .post('/users/sessions')
          .send(signInData)
          .expect(200, done())
      )
      .catch(done());
  });

  it('should response with 400 code error because uncompleted fields', done => {
    const signInData = {
      email: 'hectorwolox.com.ar',
      password: ''
    };
    request(app)
      .post('/users/sessions')
      .send(signInData)
      .expect(400, done());
  });

  it('should response with 400 code error becasuse invalid password', done => {
    const signInData = {
      email: 'hector@wolox.com.ar',
      password: 'asasdasdasds3'
    };
    request(app)
      .post('/users/sessions')
      .send(signInData)
      .expect(400, done());
  });

  it('should reponse with 404 code error because the user with the requested email was not found', done => {
    const signInData = {
      email: 'hector@wolox.com.ar',
      password: 'asasdasdasds3'
    };
    request(app)
      .post('/users/sessions')
      .send(signInData)
      .expect(404, done());
  });
});

describe('GET /users', () => {
  it('should response with 200 code', done => {
    request(app)
      .get('/users')
      .expect(200, done());
  });
  it('should response with 200 code', done => {
    request(app)
      .get('/users?limit=10?page=1')
      .expect(200, done());
  });
  it('should response with 200 code when the response should not show anything', done => {
    request(app)
      .get('/users?limit=10?page=4')
      .expect(200, done());
  });
});
