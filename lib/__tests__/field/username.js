'use strict';

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

describe('field/username', function() {
  var username = void 0;
  var dbConnection = void 0;
  beforeEach(function() {
    jest.resetModules();

    jest.mock('field/index', function() {
      return {
        setField: jest.fn()
      };
    });

    jest.mock('field/email', function() {
      return {
        validateEmail: function validateEmail(s) {
          return s;
        }
      };
    });

    jest.mock('connection/database', function() {
      return {
        databaseConnection: function databaseConnection(m) {
          return m;
        }
      };
    });

    username = require('field/username');
    dbConnection = _immutable2.default.fromJS({
      validation: null
    });
  });
  describe('usernameLooksLikeEmail()', function() {
    it('checks for @ and .', function() {
      expect(username.usernameLooksLikeEmail('t@t.com')).toBe(true);
      expect(username.usernameLooksLikeEmail('test.email@t.com')).toBe(true);
      expect(username.usernameLooksLikeEmail('tt.com')).toBe(false);
      expect(username.usernameLooksLikeEmail('t@tcom')).toBe(false);
    });
  });
  describe('getUsernameValidation()', function() {
    it("returns database connection's username validation", function() {
      expect(
        username.getUsernameValidation(
          _immutable2.default.fromJS({
            validation: {
              username: { min: 1, max: 2 }
            }
          })
        )
      ).toMatchSnapshot();
    });
    it("returns null there's no db connection username validation", function() {
      expect(username.getUsernameValidation(dbConnection)).toBe(null);
    });
  });
  describe('setUsername()', function() {
    it('calls setField', function() {
      username.setUsername(dbConnection, 'a-username', 'username', true);

      var mock = require('field/index').setField.mock;

      expect(mock.calls.length).toBe(1);
      expect(mock.calls[0]).toMatchSnapshot();
    });
    describe('field validation', function() {
      it('validates when usernameStyle is `email`', function() {
        var email = 'a@a.com';
        username.setUsername(dbConnection, email, 'email', true);

        var mock = require('field/index').setField.mock;

        expect(mock.calls[0][3](email)).toBe(email);
      });
      it('validates when usernameStyle is `username`', function() {
        var theUsername = 'the_user';
        username.setUsername(dbConnection, theUsername, 'username', true);

        var mock = require('field/index').setField.mock;

        expect(mock.calls[0][3](theUsername)).toBe(true);
      });
      it('validates when username looks like an email', function() {
        var email = 'a@a.com';
        username.setUsername(dbConnection, email, null, true);

        var mock = require('field/index').setField.mock;

        expect(mock.calls[0][3](email)).toBe(email);
      });
      it('validates when username does not look like an email', function() {
        var theUsername = 'the_user';
        username.setUsername(dbConnection, theUsername, null, true);

        var mock = require('field/index').setField.mock;

        expect(mock.calls[0][3](theUsername)).toBe(true);
      });
      it('defaults usernameStyle to `username`', function() {
        var theUsername = 'the_user';
        username.setUsername(dbConnection, theUsername, undefined, true);

        var mock = require('field/index').setField.mock;

        expect(mock.calls[0][3](theUsername)).toBe(true);
      });
      it('defaults validateUsernameFormat to `true`', function() {
        var theUsername = 'the_user';
        username.setUsername(dbConnection, theUsername, 'username', undefined);

        var mock = require('field/index').setField.mock;

        expect(mock.calls[0][3](theUsername)).toBe(true);
      });
      describe('when in username mode', function() {
        var expectToFailWith = function expectToFailWith(theUsername) {
          username.setUsername(dbConnection, theUsername, 'username', true);

          var mock = require('field/index').setField.mock;

          expect(mock.calls[0][3](theUsername)).toBe(false);
        };
        var expectToSuccedWith = function expectToSuccedWith(theUsername) {
          username.setUsername(dbConnection, theUsername, 'username', true);

          var mock = require('field/index').setField.mock;

          expect(mock.calls[0][3](theUsername)).toBe(true);
        };
        describe('validates if the username is not empty', function() {
          it('when `validateUsernameFormat` is true but there is no db connection validation', function() {
            var theUsername = '';
            username.setUsername(dbConnection, theUsername, 'username', true);

            var mock = require('field/index').setField.mock;

            expect(mock.calls[0][3](theUsername)).toBe(false);
          });
          it('when `validateUsernameFormat` is false and there is db connection validation', function() {
            var theUsername = '';
            var customDbConnection = _immutable2.default.fromJS({
              validation: {
                username: { min: 1, max: 2 }
              }
            });
            username.setUsername(customDbConnection, theUsername, 'username', false);

            var mock = require('field/index').setField.mock;

            expect(mock.calls[0][3](theUsername)).toBe(false);
          });
        });
        describe('with a db connection validation', function() {
          beforeEach(function() {
            dbConnection = _immutable2.default.fromJS({
              validation: {
                username: { min: 3, max: 5 }
              }
            });
          });
          it('validates min length', function() {
            expectToFailWith('aa');
          });
          it('validates max length', function() {
            expectToFailWith('aaaaaa');
          });
          it('validates invalid chars', function() {
            var invalidChars = '{}[],;?/\\%\xA8&*()\xB9\xB2\xB3\xAA\xBA\xA7\xA3\xA2\xAC<>|" '.split(
              ''
            );
            invalidChars.forEach(function(i) {
              return expectToFailWith('aa' + i);
            });
          });
          it('accepts letters, numbers, `_`, `-`, `+` and `.`', function() {
            var validChars = "_+-.!#$'^`~@".split('');
            validChars.forEach(function(i) {
              return expectToSuccedWith('aa' + i);
            });
          });
        });
      });
    });
  });
});
