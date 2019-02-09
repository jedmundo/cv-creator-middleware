import { Request, Response, Router } from 'express';
import express from 'express';

import { checkRequest } from '../rules/authentication.rules';
import LinkedInService from '../services/linkedIn-info.service';
import { HTTP_STATUS_CODES } from '../util/http-status-codes';

class LinkedInRouter {

  public router: express.Router;

  constructor() {
    console.debug('Initialized LinkedIn Router');

    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.addGetProfileRoute();
  }

  private addGetProfileRoute(): void {
    this.router.get('/profile', async (req: Request, res: Response) => {
      checkRequest(req, res);

      const bearer = req.headers.authorization;
      console.debug(`Received a call get profile with ${bearer}`);

      try {
        const response = await LinkedInService.getProfile(bearer);
        console.debug(`Response was: ${JSON.stringify(response)}`);

        res.status(HTTP_STATUS_CODES.OK).send({
          data: response
        });

      } catch (error) {
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: error.message });
        console.error('Error exchanging token: ' + error);
      }
    });
  }

}

export default new LinkedInRouter().router;
