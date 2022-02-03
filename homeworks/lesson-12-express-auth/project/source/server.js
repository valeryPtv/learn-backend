// Core
import express from 'express';
import session from 'express-session';

// Instruments
import {
    sessionOptions,
} from './utils';

// Routers
import * as routers from "./routers";
import {requestLoggerMiddleware, errorLoggerMiddleware, checkIfEndpointExistsMiddleware} from "./middlewares";

const app = express();
app.use(express.json({ limit: '10kb' }));
app.use(session(sessionOptions));
app.use(requestLoggerMiddleware);

app.use('/users', routers.users);
app.use('/classes', routers.classes);
app.use('/lessons', routers.lessons);
app.use('/api/auth', routers.auth);

app.use(checkIfEndpointExistsMiddleware);
app.use(errorLoggerMiddleware);

export { app };
