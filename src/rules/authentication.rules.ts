import { Request, Response } from 'express';
import { check, validationResult } from 'express-validator/check';

export const AUTHENTICATION_RULES = {
  forAuthenticate: [
    check('code').exists()
  ]
};

const INVALID_PARAMETERS_HTTP_CODE = 422;

export function checkRequest(request: Request, response: Response): void | Response {
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    return response.status(INVALID_PARAMETERS_HTTP_CODE).json(errors.array());
  }
}
