import config from 'config';
import http from 'http';

import app from './app';
import errorEventHandler from './event-handlers/ErrorEventHandler';
import listeningEventHandler from './event-handlers/ListeningEventHandler';

const port = config.get('port');

const server = http.createServer(app);

server.listen(port);

server.on('error', errorEventHandler(port));
server.on('listening', listeningEventHandler(server.address()));
