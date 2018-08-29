const list = process.env.MC_LIST;
const apikey = process.env.MC_APIKEY;
var Mailchimp = require('mailchimp-api-v3');
var mailchimp = new Mailchimp(apikey);
/**
 * Suscribe un user dentro de la lista de mailchimp
 * @param {*} userData 
 */
export function suscribeUserMailchimp(userEmail){
    console.log(mailchimp);
    mailchimp.post('/lists/'+ list +'/members', {
        email_address : userEmail,
        status : 'subscribed',
      })
      .then(function(results){
        console.log(results);
      })
      .catch(function (err) {
        console.log(err);
      });
}