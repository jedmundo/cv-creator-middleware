import axios from 'axios';
import config from 'config';
import querystring from 'querystring';

export interface GetLinkedInTokenResponse {
  access_token: string;
  id_token: string;
}

export interface LinkedInUserInfoResponse {
  email: string;
}

class AuthenticationService {

  public async getLinkedInAccessToken(
    authenticationCode: string,
    returnUri: string
  ): Promise<GetLinkedInTokenResponse | null> {

    const formData = {
      client_id: config.get('authentication.clientId'),
      client_secret: config.get('authentication.clientSecret'),
      code: authenticationCode,
      grant_type: 'authorization_code',
      redirect_uri: returnUri
    };

    const getTokenUrl = config.get('authentication.linkedInGetAuthTokenUri');

    console.debug(`Made a call to exchange the token with url: ${getTokenUrl} and formData: ${JSON.stringify(formData)}`);

    try {
      const response = await axios.post(getTokenUrl, querystring.stringify(formData), {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded; charset=utf-8'
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(JSON.stringify(error.response.data));
    }
  }
}

export default new AuthenticationService();
