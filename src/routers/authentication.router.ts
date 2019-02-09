import { Request, Response, Router } from 'express';
import express from 'express';

import { AUTHENTICATION_RULES, checkRequest } from '../rules/authentication.rules';
import AuthenticationService from '../services/authentication.service';
import { HTTP_STATUS_CODES } from '../util/http-status-codes';

class AuthenticationRouter {

  public router: express.Router;

  constructor() {
    console.debug('Initialized Authentication Router');

    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.addGetTokenRoute();
  }

  private addGetTokenRoute(): void {
    this.router.post('/token', AUTHENTICATION_RULES.forAuthenticate, async (req: Request, res: Response) => {
      checkRequest(req, res);

      const authenticationCode = req.body.code;
      const returnUri = req.body.redirect_uri;
      console.debug(`Received a call to retrieve a token for code ${authenticationCode}`);

      try {
        const response = await AuthenticationService.getLinkedInAccessToken(authenticationCode, returnUri);
        console.debug(`Response was: ${JSON.stringify(response)}`);
        const access_token = response.access_token;

        res.status(HTTP_STATUS_CODES.OK).send({
          access_token
        });

      } catch (error) {
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: error.message });
        console.error('Error exchanging token: ' + error);
      }
    });
  }

}

export default new AuthenticationRouter().router;
