
import {success, failure} from './libs/response-lib';
var mp = require('mercadopago');

mp.configure({
    access_token: 'TEST-1187827521471485-080614-cd5ff36a09002eb14ad58b860e7c9fb3-341515166'
});

/**
 * Get last articles
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export function post (event, context, callback) {

    let request = {};
    request.query = event.queryStringParameters;

    mp.ipn.manage(request).then(function (response) {
        callback(null, success(response));
        return;
      },function(error){
        callback(null, failuer(error));
        return;    
      }).catch(function (error) {
        callback(null, failure(error));
        return; 
      });
}
