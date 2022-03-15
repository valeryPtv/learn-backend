// Instruments
import { getPassword } from '../env';

export const sessionOptions = {
    key:               'user',
    secret:            getPassword(),
    resave:            false,  // Forces the session to be saved back to the session store, even if the session was never modified during the request.
    // resave: true may lead to race conditions
    rolling:           true, // reset max age on every use
    saveUninitialized: false,  // Forces a session that is "uninitialized" to be saved to the store. A session is uninitialized when it is new but not modified.
    cookie:            {
        httpOnly: true,
        maxAge:   process.env.NODE_ENV === 'production' ?  15 * 60 * 1000 : 24 * 60 * 60 * 1000, // 15 min
    },
};
