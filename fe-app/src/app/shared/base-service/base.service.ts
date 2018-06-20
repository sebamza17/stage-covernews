import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable()
export default abstract class BaseService {

  protected apiUrl: string = environment.api;

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
