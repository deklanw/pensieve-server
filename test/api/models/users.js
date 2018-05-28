const User = require('../../../api/models/user');
const data = require('../../fixtures/users');

const { users } = data;
const user1 = users[0];
const user2 = users[1];

describe('User model', () => {
  describe('get', () => {
    it('should return user with matching id', (done) => {
      User.get(user1._id).then((user) => {
        expect(user._id.equals(user1._id)).to.be.true;
        expect(user.name).to.equal(user1.name);
        expect(user.email).to.equal(user1.email);

        done();
      });
    });
    it('should not return `password` field', (done) => {
      User.get(user1._id).then((user) => {
        expect(user._id.equals(user1._id)).to.be.true;
        expect(user).to.not.have.property('password');

        done();
      });
    });
  });
  describe('update', () => {
    it('should update user with matching id', (done) => {
      const newUser = { name: 'Jon Tester', email: 'jon@example.com' };
      User.update(newUser, user1._id).then((user) => {
        expect(user._id.equals(user1._id)).to.be.true;
        expect(user.name).to.equal(newUser.name);
        expect(user.email).to.equal(newUser.email);

        done();
      });
    });
    it('should not update fields that are not defined', (done) => {
      const newUser = { name: 'Joe Tester', email: undefined };
      User.update(newUser, user2._id).then((user) => {
        expect(user._id.equals(user2._id)).to.be.true;
        expect(user.name).to.equal(newUser.name);
        expect(user.email).to.equal(user2.email);

        done();
      });
    });
    it('should not return `password` field', (done) => {
      const newUser = { name: 'Jon Tester', email: 'jon@example.com' };
      User.update(newUser, user1._id).then((user) => {
        expect(user._id.equals(user1._id)).to.be.true;
        expect(user).to.not.have.property('password');

        done();
      });
    });
  });
  describe('delete', () => {
    it('should delete user with matching id', (done) => {
      User.delete(user2._id).then(() => {
        User.get(user2._id).then((user) => {
          expect(user).to.be.false;

          done();
        });
      });
    });
  });
  describe('create', () => {
    it('should create user with matching information', (done) => {
      const newUser = { name: 'Sue Tester', email: 'sue@example.com', password: '1234h' };
      User.create(newUser).then((user) => {
        expect(user.name).to.equal(newUser.name);
        expect(user.email).to.equal(newUser.email);

        done();
      });
    });
  });
  describe('authenticate', () => {
    it('should authenticate user with correct information', (done) => {
      const newUser = { name: 'Sid Tester', email: 'sid@example.com', password: '1234h' };
      User.create(newUser).then(() => {
        User.authenticate(newUser.email, newUser.password).then((user) => {
          expect(user.name).to.equal(newUser.name);
          expect(user.email).to.equal(newUser.email);

          done();
        });
      });
    });
  });
});
