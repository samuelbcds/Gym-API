import express from 'express';
import configDotenv from './src/config/dotenv';
import passport = require("passport");

configDotenv();

const app = express();

const name = process.env.APP_NAME || 'GymWebSystem';
const host = process.env.APP_HOST || 'localhost';
const port = parseInt(process.env.APP_PORT || '3333', 10);


/* ---------------------------- middleware ---------------------------------- */
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ------------------------------ router ------------------------------------ */
const router = express.Router();


/* ----------------------------- routes ------------------------------------- */

app.use('/api/', router);

/* ------------------------------ server ------------------------------------ */
app.listen(port, host, () => { console.log(`${name} listening at http:${host}:${port}`) });