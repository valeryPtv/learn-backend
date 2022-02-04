import passport from 'passport';
import LocalStrategy from 'passport-local';
import { Strategy as JwtStrategy } from 'passport-jwt';

import { users } from "../routers/users/handlers";

export const useLocalLoginStrategy = () => passport.use('login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const foundUser = users.find((user) => user.email === email);

        if(!email || !foundUser || password !== process.env.PASSWORD) {
          return done(null, false, {message: 'Incorrect email or password.'});
        }

        return done(null, foundUser, {message: 'Logged In Successfully'});
      } catch (error) {
        return done(error);
      }
    }
  )
);


export const useJwtPassportJwtVerify = () => {
  const options = {
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: (req) => {
      return req.headers['x-token'];
    }
  };

  passport.use(new JwtStrategy(options, async (token, done) => {
    try {
      return done(null, token.user);
    } catch (error) {
      done(error);
    }
  }));
}

// passport.use(new JwtStrategy(options, (payload, done) => {
//     const foundUser = users.find((user) => user.email === payload.email);
//
//     if(!email || !foundUser || payload.password !== process.env.PASSWORD) {
//       return done(null, false, {message: 'Incorrect email or password.'});
//     }
//
//     return done(null, foundUser, {message: 'Logged In Successfully'});
//     //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
//   }
// ));
