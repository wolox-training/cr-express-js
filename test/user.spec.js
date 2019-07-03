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
