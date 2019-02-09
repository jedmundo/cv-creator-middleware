import axios from 'axios';
import config from 'config';
import querystring from 'querystring';

export interface GetGripTokenResponse {
  access_token: string;
  id_token: string;
}

export interface GripUserInfoResponse {
  email: string;
}

class AuthenticationService {

  public async getGripAccessToken(authenticationCode: string, clientId: string, returnUri: string): Promise<GetGripTokenResponse | null> {

    const formData = {
      code: authenticationCode,
      grant_type: 'authorization_code',
      redirect_uri: returnUri
    };

    const getTokenUrl = config.get('authentication.gripGetAuthTokenUri');
    const encodedAuth = Buffer.from(`${clientId}:${config.get('authentication.clientSecret')}`).toString('base64');

    console.debug(`Made a call to exchange the grip token with url: ${getTokenUrl} and formData: ${JSON.stringify(formData)}`);

    try {
      const response = await axios.post(getTokenUrl, querystring.stringify(formData), {
        headers: {
          Authorization: 'Basic ' + encodedAuth,
          'Content-type': 'application/x-www-form-urlencoded; charset=utf-8'
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(JSON.stringify(error.response.data));
    }
  }

  public async checkGripToken(accessTokenWithBearer: string): Promise<GripUserInfoResponse | null> {

    const checkTokenUrl = config.get('authentication.gripValidateTokenUri');

    console.debug(`Made a call to check Grip token with url: ${checkTokenUrl}`);

    try {
      const response = await axios.get(checkTokenUrl, {
        headers: {
          Authorization: accessTokenWithBearer
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(JSON.stringify(error.response.data));
    }
  }

}

export default new AuthenticationService();
