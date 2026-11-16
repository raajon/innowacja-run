import express from 'express';
import { ParseServer } from 'parse-server';
import ParseDashboard from 'parse-dashboard';
import path from 'path';
import http from 'http';
import fs from 'fs';

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import config from "./config.js";

export const app = express();
app.set('trust proxy', 1);

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use('/', express.static(path.join(__dirname, '/react')));

// Serve the Parse API on the /parse URL prefix
if (!process.env.TESTING) {
  const mountPath = process.env.PARSE_MOUNT || '/parse';
  const server = new ParseServer({
    ...config,
    cloud: __dirname + '/cloud/main.js',
  });
  await server.start();
  app.use(mountPath, server.app);

  const dashboard = new ParseDashboard({
    "apps": [
      {
        serverURL: config.publicServerURL,
        appId: config.appId,
        masterKey: config.masterKey,
        appName: config.appName
      }
    ],
    "users": [
      {
        "user": process.env.DASHBOARD_USER,
        "pass": process.env.DASHBOARD_PASS
      }
    ]
  },{ allowInsecureHTTP: true});
  app.use("/dashboard", dashboard);
}

// Parse Server plays nicely with the rest of your web routes
app.get('/dupa', function (req, res) {
  res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function (req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

app.get('/health-check', (req, res) => {
  res.status(200).send('OK');
});

const options = {
    // key: fs.readFileSync('./key.pem', 'utf8'),
    // cert: fs.readFileSync('./server.crt', 'utf8'),
};

if (!process.env.TESTING) {
  const port = process.env.PORT || 1337;
  // const httpServer = https.createServer(options, app);
  const httpServer = http.createServer(app);
  httpServer.listen(port, '0.0.0.0', async () => {
    console.log(`Parse Server running on port ${port}.`);
    
    try {
      // Tworzymy LiveQueryServer po tym, jak serwer HTTP faktycznie wystartuje
      await ParseServer.createLiveQueryServer(httpServer);
      console.log('Parse LiveQuery Server initialized successfully.');
    } catch (err) {
      console.error('Error starting LiveQuery Server:', err);
    }
  });
}

// Zamiast console.log(app.routes), wyślij informację o gotowości
console.log('Index.js execution completed, server listening...');
