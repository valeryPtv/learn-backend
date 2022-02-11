import passport from 'passport';
import LocalStrategy from 'passport-local';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as GitHubStrategy } from 'passport-github2';

import { users } from "../routers/users/handlers";
import {NotFoundError} from "./errors";

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

export const usePassportGitHub = () => {
  passport.use(new GitHubStrategy({
      clientID: process.env.GH_CLIENT_ID,
      clientSecret: process.env.GH_CLIENT_SECRET,
      callbackURL: "http://127.0.0.1:3000/api/auth/github/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      if(!profile) {
        return done(new NotFoundError(`User with login ${profile.login}`), null);
      }

      return done(null, profile)
    }
  ));
}
