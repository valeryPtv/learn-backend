// Core
import debug from 'debug';
import 'dotenv/config';

// Instruments
import { app } from './server';
import { getPort } from './utils';

// DB
import './db';

const PORT = getPort();
const dg = debug('server:main');

app.listen(PORT, () => {
    dg(`Server API is up on port ${PORT}`);
});
