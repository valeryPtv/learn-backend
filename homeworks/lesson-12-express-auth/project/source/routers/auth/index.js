import express from 'express';
import { login } from "./handlers";

const authRouter = express.Router();

authRouter.post('/login', login);

export { authRouter as auth };
