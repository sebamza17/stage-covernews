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
   * Init for globals vars
   * Retrieve all data from LS and sets it on static keys
   */
  public async init() {
    this.user = await this.getGroup('user') || {
      user: null,
      isLoggedIn: false,
    };
    this.misc = await this.getGroup('misc');
  }

  /**
   * Set a specific value on global variables
   * @param group
   * @param key
   * @param value
   */
  public async setValue(group: string = 'misc', key, value) {
    let groupObject = this[group] || {};
    groupObject[key] = value;

    // Check if item exists on LS, if exists remove it
    const currentGroup = await this.localStorage.getItem(group).toPromise();
    if (currentGroup) {
      await this.localStorage.removeItem(group).toPromise();
    }

    // Set item
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
    if (!groupValue) {
      this[group] = null;
      return false;
    }
    if (!groupValue[key]) {
      this[group][key] = null;
      return false;
    }
    this[group][key] = groupValue[key];
    return groupValue[key];
  }

  /**
   * Removes a value from global variables
   * @param group
   * @param key
   */
  public async removeValue(group: string, key = null) {
    if (key) {
      // Copy current group to store it on LS
      let groupObject = Object.assign(this[group], {});
      delete groupObject[key];

      // Set to null local group
      if (this[group] && this[group][key]) {
        this[group][key] = null;
      }

      // Store on LS
      this.localStorage.setItem(group, this[group]).toPromise()
        .then(() => {
          console.log('Globals: Removed key: ' + key + ' from: ' + group);
          console.log(groupObject);
        });
    } else {
      this[group] = null;
      this.localStorage.removeItemSubscribe(group);
      console.log('Globals: Removed group: ' + group);
    }
  }

  /**
   *
   * @param group
   */
  public async getGroup(group) {
    const groupValue = await this.localStorage.getItem(group).toPromise();
    return groupValue;
  }

}