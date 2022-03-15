import {users} from "../routers/users/handlers";

/**
 * @param req - Express req
 * @return object | false - if authenticated return user, otherwise false
 */
export const basicAuthHandler = (req) => {
  const credentials = req.headers.authorization.split(' ')[1];
  const [email, password] = Buffer.from(credentials, 'base64').toString('utf8').split(':');

  const foundUser = users.find((user) => user.email === email);

  if(!foundUser || process.env.PASSWORD !== password) {
    return false;
  }

  return foundUser;
}
