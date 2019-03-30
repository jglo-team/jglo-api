const express = require('express');
const path = require('path');
const request = require('request');
const config = require('../config');
const http = require('http');

const greenlock = require('greenlock-express');

class WebServerHelper {

    constructor() {
        this.app = express();
        // this.server = http.createServer(this.app);

        if (config.https){
            this.lex = greenlock.create({
                server: 'https://acme-v02.api.letsencrypt.org/directory',
                email: 'ricardomaltez@gmail.com',
                agreeTos: true,
                configDir: __dirname + '/keys',
                approveDomains: ['jglo.ricardomaltez.com'],
                app: this.app
            });

            this.server = this.lex.listen(80, 443, function () {
                console.log("Listening on port 80 for ACME challenges and 443 for express app.");
            });
        }else {
            this.server = http.createServer(this.app);
            this.server.listen(80);
        }
    }

    setSocketHelper(socketHelper){
        this.socketHelper = socketHelper;
    }


    setRoutes() {
        this.app.get('/api/auth', (req, res) => {

            let code = req.query.code;
            let token = req.query.state;

            if (!code || !token){
                res.sendStatus(400);
                return;
            }

            request.post('https://api.gitkraken.com/oauth/access_token', {
                form: {
                    grant_type: 'authorization_code',
                    client_id: config.clientId,
                    client_secret: config.clientSecret,
                    code: code
                }
            }, (err,httpResponse,body) => {

                if (err){
                    console.error('/api/auth', err);
                    res.sendFile('public/error.html', { root: __dirname + '../' });
                }

                let json = JSON.parse(body);

                if (!json.access_token){
                    this.socketHelper.sendToRoom(token, 'An error occurred getting the access token');
                    return;
                }

                this.socketHelper.sendToRoom(token, json.access_token);
                res.sendFile('public/index.html',{ root: __dirname + '../' });
            });

        });

    }
}

module.exports = WebServerHelper;