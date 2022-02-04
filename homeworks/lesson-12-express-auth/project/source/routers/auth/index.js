import express from 'express';
import {login, loginJwt} from "./handlers";
import passport from "passport";

const authRouter = express.Router();

authRouter.post('/login', login);
authRouter.post('/login-jwt', loginJwt);
authRouter.get(
  '/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }),
  (req, res) => {
    res.status(200).json('Authenticated in gh');
});

authRouter.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.type('text/html');
    res.status(200).send(`
        <h1>Hello</h1>
        <p style="color: blue;">You are successfully logged in!</p>
        <p>User data:</p>
        <pre>${JSON.stringify(req.user, null, 4)}</pre>
    `);
  });

export { authRouter as auth };
