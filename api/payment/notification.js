import { success, failure } from './libs/response-lib';
import { getConnection } from './libs/mongodb-connect';
import * as mercadopago from 'mercadopago';

mercadopago.configure({
  access_token: process.env.mp_access_token
});

const currentDateTime = () =>
  new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });

const handleError = error =>
  new Error(_.isObject(error) ? JSON.stringify(error) : error);

const MP = {
  notification: {},
  payment: {},
  plan: {},
  subscription: {},
  invoice: {},

  ipnManage: ({ request, data }) => new Promise((resolve, reject) =>
    mercadopago.ipn.manage(request)
      .then(response => {
        MP.notification = response.body;

        return MP[`${data.type}FindById`](data.id).then(resource => resolve({
          mp_notification: MP.notification,
          [`mp_${data.type}`]: MP[data.type],
        }));
      })
      .catch(error => reject(handleError(error)))),

  paymentFindById: id => new Promise((resolve, reject) =>
    mercadopago.payment.findById(id)
      .then(response => {
        MP.payment = response.body;
        return resolve(MP.payment);
      })
      .catch(error => reject(handleError(error)))),

  planFindById: (id) => new Promise((resolve, reject) =>
    mercadopago.get(`/v1/plans/${id}`)
      .then(response => {
        MP.plan = response.body;
        return resolve(MP.plan);
      })
      .catch(error => reject(handleError(error)))),

  subscriptionFindById: (id) => new Promise((resolve, reject) =>
    mercadopago.get(`/v1/subscriptions/${id}`)
      .then(response => {
        MP.subscription = response.body;
        return resolve(MP.subscription);
      })
      .catch(error => reject(handleError(error)))),

  invoiceFindById: (id) => new Promise((resolve, reject) =>
    mercadopago.get(`/v1/invoices/${id}`)
      .then(response => {
        MP.invoice = response.body;
        return resolve(MP.subscription);
      })
      .catch(error => reject(handleError(error)))),
};

const DB = {
  notification: {},

  insert: (col, data) => new Promise((resolve, reject) => {
    const doc = {
      ...data,
      created: currentDateTime()
    };

    return col.insertOne(doc, (error, res) => {
      if (error) {
        return reject(handleError(error));
      }
      DB.notification = doc;
      return resolve(DB.payment);
    });
  }),
}

/**
 * Get last notifications
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export function post (event, context, callback) {
  const request = { query: event.queryStringParameters };
  const data = _.isString(event.body) ? JSON.parse(event.body) : event.body;

  const chain = ({ notification }) => MP.ipnManage({ request, data })
    .then((data) => DB.insert(notification, data))
    .then(() => callback(null, success(MP.notification)))
    .catch(error => callback(null, failure(error)));

  getConnection()
    .then(db => chain({
      notification: db.collection('notification'),
    }))
    .catch(error => callback(null, failure(error)));
}
