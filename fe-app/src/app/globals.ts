import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Injectable()
export class Globals {

  constructor(
    private localStorage: LocalStorage
  ) {
  }

  // User keys
  public user = {
    user: null,
    isLoggedIn: false,
  };

  // Misc keys
  public misc = {};

  /**
   * Set a specific value on global variables
   * @param group
   * @param key
   * @param value
   */
  public setValue(group: string = 'misc', key, value) {
    this[group][key] = value;
    this.localStorage.setItem(group, this[group]).toPromise()
      .then(() => {
        console.log('Globals: Setting ' + key + ': ');
        console.log(value);
      });
  }

  /**
   * Get a value from global variables
   * @param group
   * @param key
   */
  public async getValue(group: string = 'misc', key) {
    const groupValue = await this.localStorage.getItem(group).toPromise();

    console.log('Globals: Getting ' + key + ': ');
    console.log(groupValue[key]);
    return groupValue[key];
  }

}