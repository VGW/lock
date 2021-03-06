'use strict';

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _database = require('../../../connection/database');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

describe('database/index.js', function() {
  describe('databaseUsernameValue', function() {
    var getModel = function getModel(email, username, usernameRequired) {
      return _immutable2.default.fromJS({
        field: {
          email: {
            value: email
          },
          username: {
            value: username
          }
        },
        core: {
          transient: {
            connections: {
              database: [
                {
                  requireUsername: usernameRequired
                }
              ]
            }
          }
        }
      });
    };

    beforeEach(function() {
      jest.resetAllMocks();
    });

    describe('for database connection without username required', function() {
      var model = getModel('user@auth0.com', null, false);

      it('should get the email', function() {
        expect((0, _database.databaseUsernameValue)(model)).toEqual('user@auth0.com');
      });
    });

    describe('for database connection with username required', function() {
      var model = getModel('user@auth0.com', 'user', true);

      it('should get the username when `emailFirst` is not set', function() {
        expect((0, _database.databaseUsernameValue)(model)).toEqual('user');
      });
      it('should get the username when `emailFirst` is false', function() {
        expect((0, _database.databaseUsernameValue)(model, { emailFirst: false })).toEqual('user');
      });
      it('should get the email when `emailFirst` is true', function() {
        expect((0, _database.databaseUsernameValue)(model, { emailFirst: true })).toEqual(
          'user@auth0.com'
        );
      });

      describe('and only email address is filled in', function() {
        var model = getModel('user@auth0.com', null, true);

        it('should get the email address', function() {
          expect((0, _database.databaseUsernameValue)(model)).toEqual('user@auth0.com');
        });
      });
    });
  });
  describe('initDatabase', function() {
    describe('calls initNS with the correct additionalSignUpFields', function() {
      describe('uses the `storage` attribute', function() {
        var model = _immutable2.default.fromJS({});
        var modelOut = (0, _database.initDatabase)(model, {
          additionalSignUpFields: [
            {
              type: 'hidden',
              name: 'hidden_field',
              value: 'hidden_value',
              storage: 'root'
            }
          ]
        });
        var modelOutJS = modelOut.toJS();
        expect(modelOutJS.database.additionalSignUpFields).toEqual([
          {
            type: 'hidden',
            name: 'hidden_field',
            value: 'hidden_value',
            storage: 'root'
          }
        ]);
      });
      describe('with a valid hidden field', function() {
        var model = _immutable2.default.fromJS({});
        var modelOut = (0, _database.initDatabase)(model, {
          additionalSignUpFields: [
            {
              type: 'hidden',
              name: 'hidden_field',
              value: 'hidden_value'
            }
          ]
        });
        var modelOutJS = modelOut.toJS();
        expect(modelOutJS.field).toEqual({
          hidden_field: { showInvalid: false, valid: true, value: 'hidden_value' }
        });
        expect(modelOutJS.database.additionalSignUpFields).toEqual([
          {
            type: 'hidden',
            name: 'hidden_field',
            value: 'hidden_value'
          }
        ]);
      });
      describe('with a hidden field without a value', function() {
        var model = _immutable2.default.fromJS({});
        var modelOut = (0, _database.initDatabase)(model, {
          additionalSignUpFields: [
            {
              type: 'hidden',
              name: 'hidden_field'
            }
          ]
        });
        expect(modelOut.toJS().database.additionalSignUpFields.length).toBe(0);
      });
    });
  });
});
