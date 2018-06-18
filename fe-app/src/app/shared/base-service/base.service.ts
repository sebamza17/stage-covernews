import { Injectable } from '@angular/core';

@Injectable()
export default abstract class BaseService {

  protected apiUrl: string = 'https://1meiqciyd1.execute-api.us-east-1.amazonaws.com/prod';

  urls: Object;

  /**
   * Returns a given URL with the API base path
   * @param {string} specificUrl
   * @returns {string}
   */
  url(specificUrl: string) {
    return this.apiUrl + specificUrl;
  };

}
