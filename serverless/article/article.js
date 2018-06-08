import {success, failure} from '../libs/response-lib';

export const get = async (event, context, callback) => {

  callback(null, success({}));
};

