import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable()
export default abstract class BaseService {

  /**
   * Defines which entity we are pointing
   */
  entity: string;

  protected api: object = environment.api;

  urls: Object;

  /**
   * Returns a given URL with the API base path
   * @param {string} specificUrl
   * @param {any} urlOptions
   * @returns {string}
   */
  protected url(specificUrl: string, urlParams = null) {

    let completeUrl = specificUrl;

    // If there is an options object, parse it as string to attach to the URL
    if (urlParams) {
      let optionsStringAsUrl = '?';
      for (let option in urlParams) {
        const optionName = option;
        const optionValue = urlParams[option];
        optionsStringAsUrl += optionName + '=' + optionValue;
      }
      completeUrl += optionsStringAsUrl;
    }

    return this.api[this.entity] + completeUrl;
  };

  /**
   * Generates placeholders for loading purposes
   * @param {number} quantity
   * @param {Object} placeholderData
   * @returns {any[]}
   */
  public generatePlaceholders(quantity: number, placeholderData: Object) {
    let placeholders = [];
    for (let i = 0; i < quantity; i++) {
      placeholders[i] = placeholderData;
    }
    return placeholders;
  }

}
