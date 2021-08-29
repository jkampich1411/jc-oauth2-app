const express = require("express");
const msal = require('@azure/msal-node');
const fs = require('fs');
require('dotenv').config();

const SERVER_PORT = process.env.PORT || 3000;

const cfg = JSON.parse(fs.readFileSync('./cfg.json', 'utf8'));

const app = express();

app.listen(SERVER_PORT, () => console.log(`Msal Node Auth Code Sample app listening on port ${SERVER_PORT}!`))

const moreConfig = {
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: msal.LogLevel.Verbose,
        }
    }
};