import Auth0 from 'auth0-js';
import * as StringUtils from '../utils/string_utils';

class Auth0WebAPI {
  constructor() {
    this.clients = {};
  }

  setupClient(lockID, clientID, domain) {
    // TODO: reuse clients
    this.clients[lockID] = new Auth0({clientID: clientID, domain: domain});
  }

  signIn(lockID, options, cb) {
    this.clients[lockID].login(options, function (error, profile, idToken, accessToken, state, refreshToken) {
      cb(normalizeError(error), profile, idToken, accessToken, state, refreshToken);
    });
  }

  signOut(lockID, query) {
    this.clients[lockID].logout(query);
  }

  startPasswordless(lockID, options, cb) {
    this.clients[lockID].startPasswordless(options, cb);
  }
}

export default new Auth0WebAPI();

function normalizeError(error) {
  return error && {
    error: error.details ? error.details.error : error.error,
    description: error.details ? error.details.error_description : error.error_description
  }
}
