import bodyParser from 'body-parser';
import config from 'config';
import cookieParser from 'cookie-parser';
import express from 'express';

import CorsMiddleware from './middleware/CorsMiddleware';
import ErrorMiddleware from './middleware/ErrorMiddleware';
import AuthenticationRouter from './routers/authentication.router';
import linkedInRouter from './routers/linkedIn.router';

class App {

  public app: express.Application;

  constructor() {
    this.app = express();
    this.configBeforeRoutes();
    this.routes();
    this.configAfterRoutes();
  }

  private configBeforeRoutes(): void {
    this.app.use(cookieParser());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    this.app.use(CorsMiddleware);
  }

  private configAfterRoutes(): void {
    this.app.use(ErrorMiddleware);
  }

  private routes(): void {
    const version = config.get('version');
    const versionRoute = `/v${version}`;

    this.app.use(`${versionRoute}/auth`, AuthenticationRouter);
    this.app.use(`${versionRoute}/info`, linkedInRouter);
  }
}

export default new App().app;
