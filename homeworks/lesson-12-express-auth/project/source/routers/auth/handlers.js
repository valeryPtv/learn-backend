import { users } from "../users/handlers";
import jwt from 'jsonwebtoken';
import passport from 'passport';

export const login = (req, res) => {
  const wrongCredentialsHandler = () => res.status(401).json({message: 'Wrong credentials'});
  try {
    if(!req.headers.authorization) {
      return wrongCredentialsHandler();
    }

    const credentials = req.headers.authorization.split(' ')[1];
    const [email, password] = Buffer.from(credentials, 'base64').toString('utf8').split(':');

    const foundUser = users.find((user) => user.email === email);

    if(!foundUser || process.env.PASSWORD !== password) {
      return wrongCredentialsHandler();
    }

    req.session.user = { email };

    res.status(200).json({email});
  } catch (error) {
    console.error(error);
  }
}

export const loginJwt = async (req, res, next) => {
    passport.authenticate(
      'login',
      async (err, user, info) => {
        try {
          if (err || !user) {
            return next(err);
          }

          req.login(user, { session: false }, async (error) => {
              if (error) return next(error);

              const body = { email: user.email };
              const token = jwt.sign({ user: body }, process.env.JWT_SECRET);

              res.setHeader('X-Token', token);

              return res.sendStatus(204);
            }
          );
        } catch (error) {
          return next(error);
        }
      }
    )(req, res, next);
  }

export const loginJWTOld = async (req, res) => {
  const foundUser = users.find((user) => user.email === payload.email);

  if(!email || !foundUser || payload.password !== process.env.PASSWORD) {
    return done(null, false, {message: 'Incorrect email or password.'});
  }

  return done(null, foundUser, {message: 'Logged In Successfully'});

  const token = await jwt.sign(process.env.JWT_SECRET, 'password1');

  res.setHeader('X-Token', token);
  return next();
}
