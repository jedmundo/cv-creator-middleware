import { Request, Response, Router } from 'express';
import express from 'express';

import { AUTHENTICATION_RULES, checkRequest } from '../rules/authentication.rules';
import AuthenticationService from '../services/authentication.service';
import { HTTP_STATUS_CODES } from '../util/http-status-codes';

class AuthenticationRouter {

  public router: express.Router;

  constructor() {
    console.debug('Initialized AuthenticationRouter');

    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.addGetTokenRoute();
    this.addCheckTokenRoute();
  }

  private addGetTokenRoute(): void {
    this.router.post('/token', AUTHENTICATION_RULES.forAuthenticate, async (req: Request, res: Response) => {
      checkRequest(req, res);

      const authenticationCode = req.body.code;
      const clientId = req.body.clientId;
      const returnUri = req.body.returnUri;
      console.debug(`Received a call to retrieve a Grip token for code ${authenticationCode}`);

      try {
        const gripResponse = await AuthenticationService.getGripAccessToken(authenticationCode, clientId, returnUri);
        console.debug(`Grip response was: ${JSON.stringify(gripResponse)}`);
        const access_token = gripResponse.access_token;

        res.status(HTTP_STATUS_CODES.OK).send({
          access_token
        });

      } catch (error) {
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: error.message });
        console.error('Error exchanging Grip token: ' + error);
      }
    });
  }

  private addCheckTokenRoute(): void {
    this.router.get('/check-token', async (req: Request, res: Response) => {

      const accessTokenWithBearer = req.headers.authorization;

      console.debug(`Received a call to check Grip token`);

      try {
        const gripResponse = await AuthenticationService.checkGripToken(accessTokenWithBearer);
        const gripUserEmail = gripResponse && gripResponse.email;

        console.debug(`Response was: ${JSON.stringify(gripResponse)}`);

        res.status(HTTP_STATUS_CODES.OK).send({
          status: (gripResponse && gripUserEmail) ? 'OK' : 'FAILED'
        });
      } catch (error) {
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: error.message });
        console.error('Error checking Grip token:' + error);
      }
    });
  }

}

export default new AuthenticationRouter().router;
