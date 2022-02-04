import express from 'express';
import {login, loginJwt} from "./handlers";
import {app} from "../../server";

const authRouter = express.Router();

authRouter.post('/login', login);
authRouter.post('/login-jwt', loginJwt);

export { authRouter as auth };
