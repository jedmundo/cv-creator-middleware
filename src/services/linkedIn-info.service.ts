import axios from 'axios';
import config from 'config';

class LinkedInService {

  public async getProfile(
    bearer: string
  ): Promise<any | null> {
    const getProfileUrl = config.get('linkedIn.profile');
    try {
      const response = await axios.get(getProfileUrl, {
        headers: {
          Authorization: bearer
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(JSON.stringify(error.response.data));
    }
  }
}

export default new LinkedInService();
