const list = '152b88c595';
const apikey = '666a1a677ea043f5b80bbc36a3babc1d-us18';
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