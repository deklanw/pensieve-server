const request = require('supertest');
const startServer = require('../../api/index');

let server;

describe('Server', () => {
  before(async () => {
    server = await startServer();
  });
  after(() => {
    server.close();
  });
  it('GET / redirects to /docs', (done) => {
    request(server)
      .get('/')
      .expect(302, done);
  });

  it('response to 404 unsupported routes', (done) => {
    request(server)
      .get('/invalid')
      .expect(404, done);
  });
});
