const express = require("express");
const msal = require('@azure/msal-node');
const fs = require('fs');
require('dotenv').config();

const SERVER_PORT = process.env.PORT || 3000;

const cfg = JSON.parse(fs.readFileSync('./cfg.json', 'utf8'));

const app = express();

app.listen(SERVER_PORT, () => console.log(`App listening on port ${SERVER_PORT}!`))

const aadConfig = {
    auth: {
        clientId: cfg.aadClientId,
        authority: cfg.aadTenant,
        clientSecret: cfg.aadClientSecret
    },
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


const cca = new msal.ConfidentialClientApplication(aadConfig);

app.get('/auth/azuread', (req, res) => {
    const authCodeUrlParameters = {
        scopes: ["user.read"],
        redirectUri: cfg.aadRedirectURI,
    };

    // get url to sign user in and consent to scopes needed for application
    cca.getAuthCodeUrl(authCodeUrlParameters).then((resp) => {
        res.redirect(resp);
    }).catch((error) => console.log(JSON.stringify(error)));
});

app.get('/auth/azuread/redirect', (req, res) => {
    const tokenRequest = {
        code: req.query.code,
        scopes: ["user.read"],
        redirectUri: cfg.aadRedirectURI,
    };

    cca.acquireTokenByCode(tokenRequest).then((resp) => {
        res.json(resp);
    }).catch((error) => {
        console.log(error);
        res.status(500).send(error);
    });
});