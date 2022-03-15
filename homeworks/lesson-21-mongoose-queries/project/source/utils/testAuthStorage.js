import {getPassword} from "./env";

export class TestAuthStorage {
  /**
   * @param server
   * @param email
   * @param password
   * @returns {Promise<void>}
   */
  constructor(server, email = 'jdoe@email.com', password = getPassword()) {
    this._server = server;
    this._email = email;
    this.password = password;
    this._fetchCredentials();
  }

  async _fetchCredentials() {
    try {
      if(!this._fetchPromise) {
        this._fetchPromise = this._server.post('/login')
          .set('Authorization', `Basic ${email}:${password}`)
          // .send({ email });
      }
      const response = await this._fetchPromise;

      // const {
      //   body: { data },
      // } = response;

      //  [ 'user=s%3AUPAzPmsDbKxTVzKbUI9F1DAoDPloM_aH.sbJY08bPYzFcCxllSuSL4KceHlPLypFo0cRDXKqZEM8; Path=/; HttpOnly' ]
      // const [source] = response.headers['set-cookie'][0].split(';');
      // const [source] = response.headers['Cookie'].split('=')[1];
      // const authCookies = response.headers['Cookie'];
      const authCookies = response.headers['set-cookie'][0];
      server.jar.setCookie(authCookies);

      // this._credentials = response.headers['Cookie'].split('=')[1];
    } catch (error) {
      console.error(error);
    }
  }

  async getCredentials() {
  //   await this._fetchPromise;
  //   return this._credentials;
  }
}
