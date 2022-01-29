// Core
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';

// Instruments
import {
    sessionOptions,
} from './utils';

// Routers
import * as routers from "./routers";
import {requestLoggerMiddleware} from "./middlewares";

const app = express();

app.use(bodyParser.json());
app.use(requestLoggerMiddleware);

app.use('/users', routers.users);
app.use('/classes', routers.classes);
app.use('/lessons', routers.lessons);
app.use('/test', (req, res, next) => next());

app.use(session(sessionOptions));
app.use(express.json({ limit: '10kb' }));

export { app };
