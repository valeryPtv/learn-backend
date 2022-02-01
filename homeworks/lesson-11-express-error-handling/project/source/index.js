// Core
import debug from 'debug';
import 'dotenv/config';

// Instruments
import { app } from './server';
import { getPort } from './utils';
import {globalErrorHandler, NotFoundError} from "./utils/errors";

// DB
import './db';


const PORT = getPort();
const dg = debug('server:main');

app.listen(PORT, () => {
    dg(`Server API is up on port ${PORT}`);
});

process.on('uncaughtException', globalErrorHandler);

throw new NotFoundError('dick', {method: 'GET', originalUrl: '/123'});
throw new Error('oops');

