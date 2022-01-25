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

const app = express();

app.use(bodyParser.json());

app.use('/products', routers.products);
app.use('/customers', routers.customers);
app.use('/orders', routers.orders);
app.use('/staff', routers.staff);

app.use(session(sessionOptions));
app.use(express.json({ limit: '10kb' }));

export { app };
