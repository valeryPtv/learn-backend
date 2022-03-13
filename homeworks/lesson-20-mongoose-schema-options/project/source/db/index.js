// Core
import mongoose from 'mongoose';
import dg from 'debug';

// Instruments
import { getDBUrl } from '../utils';

const debug = dg('db');
const { DB_URL } = getDBUrl();

const mongooseOptions = {
    // promiseLibrary: global.Promise, now deprecated
    // max amount of active connections to DB
    // poolSize: 50, - in mongoose 6 its minPoolSize and maxPoolSize
    minPoolSize: 20,
    maxPoolSize: 120,
    // lifetime of connection if its not being used
    // interval by which connection is being checked if its alive
    keepAlive: true,
    keepAliveInitialDelay: 30000,
    connectTimeoutMS: 5000,
    // reconnectTries: Number.MAX_SAFE_INTEGER,
    // reconnectInterval: 5000,
    useNewUrlParser: true,
    // used for backward compatability with older versions of Mongo and Mongoose
    // useFindAndModify: false, dy default false
    // useCreateIndex: true, by default its true
    // useUnifiedTopology: true, by default its true
    // autoIndex: false,
};

export const connection = mongoose.connect(
    DB_URL,
    mongooseOptions,
);

connection
    .then(() => {
        debug('DB connected');
    })
    .catch(({ message }) => {
        debug(`DB connected error ${message}`);
    });
