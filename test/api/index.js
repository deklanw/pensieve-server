const request = require('supertest');

describe('Server', () => {
  it('GET / redirects to /docs', (done) => {
    request(global.testingServer)
      .get('/')
      .expect(302, done);
  });

  it('response to 404 unsupported routes', (done) => {
    request(global.testingServer)
      .get('/invalid')
      .expect(404, done);
  });
});
