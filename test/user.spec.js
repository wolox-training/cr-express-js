const request = require('supertest');
const app = require('.././app');

describe('POST / users', () => {
  const data = {
    email: 'hector@wolox.com',
    name: 'hectooooooor',
    lastname: 'gonzalez',
    password: 'abc12345'
  };
  it('should response with the created user', done => {
    request(app)
      .post('/users')
      .send(data)
      .expect(200, done);
  });

  it('should reject the request for the existence of the email', done => {
    request(app)
      .post('/users')
      .send(data)
      .then(
        request(app)
          .post('/users')
          .send(data)
          .expect(500, done)
      )
      .catch(done());
  });

  it('should reject the request for invalid password', done => {
    const data2 = {
      email: 'hector@wolox.com',
      name: 'hectooooooor',
      lastname: 'gonzalez',
      password: '12'
    };
    request(app)
      .post('/users')
      .send(data2)
      .expect(422, done);
  });

  it('should reject the request for uncompleted fields', done => {
    const data3 = {
      email: '',
      name: 'hectooooooor',
      lastname: '',
      password: 'abc12345'
    };
    request(app)
      .post('/users')
      .send(data3)
      .expect(422, done);
  });
});
