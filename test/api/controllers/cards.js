/* eslint-disable func-names */
const request = require('supertest');
const data = require('../../fixtures/cards');
const User = require('../../../api/models/user');

const { user1, user2 } = data;

describe('Cards controller', () => {
  describe('GET /api/cards', () => {
    it('should return array of cards for user', (done) => {
      const token = User.generateToken(user1);
      request(global.testingServer)
        .get('/api/cards')
        .set({ Authorization: token })
        .expect(200)
        .then((response) => {
          expect(response.body).to.have.lengthOf(2);

          done();
        })
        .catch(error => done(error));
    });
  });
  describe('POST /api/cards', () => {
    it('should create single card for user', (done) => {
      const token = User.generateToken(user2);
      const newCard = { front: 'Test front', back: 'Test back' };
      request(global.testingServer)
        .post('/api/cards')
        .send(newCard)
        .set({ Authorization: token })
        .expect(200)
        .then((response) => {
          expect(response.body.front).to.include(newCard.front);
          expect(response.body.back).to.include(newCard.back);

          done();
        })
        .catch(error => done(error));
    });
  });
  describe('DELETE /api/cards/:id', () => {
    it('should delete single card for user', (done) => {
      const token = User.generateToken(user2);
      const card = data.cards[3];
      request(global.testingServer)
        .delete(`/api/cards/${card._id}`)
        .set({ Authorization: token })
        .expect(200, done);
    });
  });
});
