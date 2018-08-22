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
  paymentCreate: (data) => {
    const payload = {
      token: data.token,
      payment_method_id: data.payment_method_id,
      payer: {
        email: data.payer_email || '',
      },
      description: data.description || '',
      transaction_amount: _.toNumber(data.amount),
      installments: 1,
      external_reference: `${data.paymentId}`,
      notification_url: 'https://api.dictioz.com/v1/notify',
    };
    console.log({ payload });
    return mercadopago.payment.create(payload);
  },
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
    token: data.token,
    uid: data.uid,
    amount: _.toNumber(data.amount),
    currency_id: data.currency_id,
    status: 'pending',
  };

  getConnection()
    .then((db) => {
      const payment = db.collection('payment');

      payment.insertOne(doc, (err, res) => {
        if (err) {
          return callback(null, failure(err));
        }

        const paymentId = doc._id;

        mp.paymentCreate({ ...data, paymentId })
          .then((response) => {
            const mpPayment = response.body;

            payment.update(
              { _id: paymentId },
              {$set: { status: mpPayment.status } },
              { upsert: true, new: true },
              (err2, res2) => {
                if (err2) {
                  return callback(null, failure(err2));
                }

                // In progress...
                // mp.paymentRefund(mpPayment.id)
                //   .then((response2) => {
                //     const mpPaymentRefund = response2.body;

                //     // create customer
                //     // create card
                //     // add customer to plan

                //     callback(null, success(mpPayment));
                //   })
                //   .catch(error => callback(null, failure(error)));

                callback(null, success(mpPayment));
              }
            );
          })
          .catch(error => callback(null, failure(error)));
      });
    }).catch(error => callback(null, failure(error)));

};

export function get (event, context, callback) {
  return callback(null, success({ success: true }));
};
