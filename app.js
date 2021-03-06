/*
 * app.js
 * Copyright (c) 2019, Texx
 * License: MIT
 *     See https://github.com/texxme/Texx/blob/master/LICENSE
 */

import { ExpressPeerServer } from 'peer';
import express, { Router } from 'express';
import path from 'path';
import logger from 'morgan';
import bodyParser from 'body-parser';

const app = express();
app.disable('x-powered-by');

const routes = Router();
const server = app.listen(8080, '0.0.0.0');
const peerServer = ExpressPeerServer(server, { debug: true });

peerServer.on('connection', id => console.log(`New connection: ${id}`));

routes.get('/', (req, res) => {
  res.render('index');
});
app.use('/api', peerServer);

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev', {
  skip: () => app.get('env') === 'test',
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'dist')));

// Routes
app.use('/', routes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  res
    .status(err.status || 500)
    .render('error', {
      message: err.message,
    });
});
