// Core
import 'module-alias/register';
import 'dotenv/config';
import debug from 'debug';

// Instruments
import { app } from './server';
import { getPort } from './utils';
import {genericErrorHandler} from "./utils/errors";

// DB
import './db';


const PORT = getPort();
const dg = debug('server:main');

app.listen(PORT, () => {
    dg(`Server API is up on port ${PORT}`);
});

// process.on('uncaughtException', genericErrorHandler);

// throw new NotFoundError('dick', {method: 'GET', originalUrl: '/123'});
// throw new Error('oops');

