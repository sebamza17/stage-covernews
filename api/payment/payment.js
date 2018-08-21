import * as _ from 'lodash';
import mongodb from 'mongodb';
import {success, failure} from './libs/response-lib';
import {getConnection} from './libs/mongodb-connect';
import AWS from 'aws-sdk';
import request from 'request';
import * as mercadopago from 'mercadopago';

const s3 = new AWS.S3();

mercadopago.configure({
  access_token: process.env.mp_access_token
});

const mp = {
  paymentCreate: data => mercadopago.payment.create({
    token: data.token,
    payment_method_id: data.payment_method_id,
    payer: {
      email: data.payer_email,
    },
    description: data.description || '',
    transaction_amount: data.amount,
    currency_id: 'ARS',
    external_reference: data.paymentId,
    notification_url: 'https://api.dictioz.com/v1/notify',
  }),
  paymentRefund: id => mercadopago.payment.refund(id),
};

/**
 * Add a payment
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export function add (event, context, callback) {
  const data = _.isString(event.body) ? JSON.parse(event.body) : event.body;
  const doc = {
    user_id: data.user_id,
    token: data.token,
    amount: data.amount,
  };

  getConnection()
    .then((db) => {
      const payment = db.collection('payment');
      payment.insertOne(doc, (err, res) => {
        if (err) {
          throw err;
        }

        mp.paymentCreate({ ...data, paymentId: doc._id })
          .then(response => {
            // TO DO
            // console.log({ response });
            callback(null, success(response))
          })
          .catch(error => callback(null, failure(error)));
      });
    }).catch((error) => {
      callback(null, failure(error));
    });

};

export function get (event, context, callback) {
  return callback(null, success({ success: true }));
};

export function ipn (event, context, callback) {
  return callback(null, success({ success: true }));
};
