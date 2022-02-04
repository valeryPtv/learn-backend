// Core
import express from 'express';
import session from 'express-session';
import passport from 'passport';

// Instruments
import {
    sessionOptions,
} from './utils';

import './utils/passport';
import {useJwtPassportJwtVerify, useLocalLoginStrategy} from "./utils/passport";

// Routers
import * as routers from "./routers";

// Middlewares
import {
    requestLoggerMiddleware,
    errorLoggerMiddleware,
    checkIfEndpointExistsMiddleware
} from "./middlewares";

const app = express();
app.use(express.json({ limit: '10kb' }));
app.use(session(sessionOptions));

// Initialize strategy
app.use(passport.initialize());

// Initialize session
app.use(passport.session());

app.use(requestLoggerMiddleware);

useLocalLoginStrategy();
useJwtPassportJwtVerify();

app.use('/users', routers.users);
app.use('/classes', routers.classes);
app.use('/lessons', routers.lessons);
app.use('/api/auth', routers.auth);

// Test jwt auth
app.get('/jwt-protected', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.status(200).json('Some protected stuff');
})

app.use(checkIfEndpointExistsMiddleware);
app.use(errorLoggerMiddleware);

export { app };
