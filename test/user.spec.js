const request = require('supertest');
const app = require('.././app');

describe('POST / signup users', () => {
  const user = {
    email: 'jose@wolox.com.ar',
    name: 'jose',
    lastName: 'perez',
    password: 'asdasdasd654'
  };

  it('should succeed returning the created user', () => {
    request(app)
      .post('/users')
      .send(user)
      .then(res => {
        expect(res.status).toBe(201);
        expect(res.body.email).toBe(user.email);
      });
  });

  test('should fail for the existence of the email', () => {
    request(app)
      .post('/users')
      .send(user)
      .then(res => {
        expect(res.status).toBe(201);
        expect(res.body.email).toBe(user.email);
      });
    request(app)
      .post('/users')
      .send(user)
      .then(res => {
        expect(res.status).toBe(409);
        expect(res.body.internal_code).toBe('conflict_error');
      });
  });

  it('should fail for invalid password', () => {
    const user2 = {
      email: 'asdadsa@wolox.com.ar',
      name: 'hector',
      lastName: 'asdasdasdas',
      password: '12'
    };
    request(app)
      .post('/users')
      .send(user2)
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.body.internal_code).toBe('bad_request_error');
      });
  });
  it('should fail for uncompleted fields', () => {
    const user3 = {
      email: '',
      name: 'hector',
      lastName: '',
      password: 'abc12345'
    };
    request(app)
      .post('/users')
      .send(user3)
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.body.internal_code).toBe('bad_request_error');
      });
  });
});
