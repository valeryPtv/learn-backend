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
import {requestLoggerMiddleware, errorLoggerMiddleware, checkIfEndpointExistsMiddleware} from "./middlewares";

const app = express();

// Order of middlewares is important !!!
app.use(bodyParser.json());
app.use(requestLoggerMiddleware);

app.use('/users', routers.users);
app.use('/classes', routers.classes);
app.use('/lessons', routers.lessons);

app.post('/error', (req, res) => {
    const error = new Error('Hey its me error');
    error.statusCode = 400;

    throw error;
});

app.use(session(sessionOptions));
app.use(express.json({ limit: '10kb' }));

app.use(checkIfEndpointExistsMiddleware);
app.use(errorLoggerMiddleware);

export { app };
