import * as _ from 'lodash';
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
  payment: {},
  paymentRefunded: {},
  customer: {},
  card: {},
  plan: {},
  subscription: {},
  subscriptionCancelled: {},

  paymentCreate: data => new Promise((resolve, reject) =>
    mercadopago.payment.create({
      token: data.token,
      payment_method_id: data.payment_method_id,
      payer: {
        email: data.payer_email || '',
        identification: {
          type: data.payer_identification_type || 'DNI',
          number: data.payer_identification_number
        }
      },
      description: data.description || '',
      transaction_amount: _.toNumber(data.amount),
      installments: 1,
      external_reference: `${data.paymentId}`,
      notification_url: `${data.notification_url}`
    })
      .then(response => {
        MP.payment = response.body;
        return resolve(MP.payment);
      })
      .catch(error => reject(handleError(error)))),

  paymentRefund: data => new Promise((resolve, reject) =>
    // mercadopago.payment.refund(data.id) // not working
    mercadopago.post(`/v1/payments/${data.id}/refunds`)
      .then(response => {
        MP.paymentRefunded = response.body;
        return resolve(MP.paymentRefunded);
      })
      .catch(error => resolve(data))),

  customerSearch: data => new Promise((resolve, reject) =>
    mercadopago.customers.search({ email: data.payer_email })
      .then(response => {
        if (!_.isEmpty(response.body.results)) {
          const customer = _.find(response.body.results, { email: data.payer_email });
          if (customer) {
            MP.customer = customer;
          }
        }
        return resolve(MP.customer);
      })
      .catch(error => reject(handleError(error)))),

  customerCreate: data => new Promise((resolve, reject) => {
    if (MP.customer.id) {
      return resolve(MP.customer)
    }

    return mercadopago.customers.create({ email: data.payer_email })
      .then(response => {
        MP.customer = response.body;
        return resolve(MP.customer);
      })
      .catch(error => reject(handleError(error)))
  }),

  cardCreate: data => new Promise((resolve, reject) => {
    if (MP.customer.default_card) {
      const card = _.find(MP.customer.cards, { id: MP.customer.default_card })
      if (!_.isEmpty(card)) {
        MP.card = card;
        return resolve(MP.card)
      }
    }

    return mercadopago.customers.cards.create({
      token: data.token,
      id: MP.customer.id
    })
      .then(response => {
        MP.card = response.body;
        MP.customer.default_card = MP.card.id;
        (MP.customer.cards || (MP.customer.cards = [])).push(MP.card);
        return resolve(MP.card);
      })
      .catch(error => reject(handleError(error)))
  }),

  planFindById: (planId) => new Promise((resolve, reject) =>
    mercadopago.get(`/v1/plans/${planId}`)
      .then(response => {
        MP.plan = response.body;
        return resolve(MP.plan);
      })
      .catch(error => reject(handleError(error)))),

  subscriptionsCreate: planId => new Promise((resolve, reject) =>
    mercadopago.post('/v1/subscriptions', {
      plan_id: planId,
      payer: {
        id: MP.customer.id
      }
    })
      .then(response => {
        MP.subscription = response.body;
        return resolve(MP.subscription);
      })
      .catch(error => reject(handleError(error)))),

  subscriptionsCancel: id => new Promise((resolve, reject) =>
    mercadopago.put(`/v1/subscriptions/${id}`, { status: 'cancelled' })
      .then(response => {
        MP.subscriptionCancelled = response.body;
        return resolve(MP.subscriptionCancelled);
      })
      .catch(error => reject(handleError(error)))),

  updateFromDB: () => {
    MP.payment = DB.payment.mp_payment || {};
    MP.paymentRefunded = DB.payment.mp_payment_refunded || {};
    MP.customer = DB.payment.mp_customer || {};
    MP.card = DB.payment.mp_card || {};
    MP.plan = DB.payment.mp_plan || {};
    MP.subscription = DB.payment.mp_subscription || {};
    MP.subscriptionCancelled = DB.payment.mp_subscription_cancelled || {};
  },
};

const DB = {
  collections: {},
  payment: {},

  findByMPId: (collection, id) => new Promise((resolve, reject) => {
    return collection.findOne({ mp_payment_id: id }, (error, doc) => {
      if (error) {
        return reject(handleError(error));
      }
      DB.payment = doc;
      MP.updateFromDB();
      return resolve(DB.payment);
    });
  }),

  findByEmail: (collection, email) => new Promise((resolve, reject) => {
    return collection.findOne({ email }, { sort: { mp_payment_id: -1 } }, (error, doc) => {
      if (error) {
        return reject(handleError(error));
      }
      DB.payment = doc;
      MP.updateFromDB();
      return resolve(DB.payment);
    });
  }),

  insert: (collection, data) => new Promise((resolve, reject) => {
    const doc = {
      token: data.token,
      uid: data.uid,
      name: data.payer_name,
      email: data.payer_email,
      identification: {
        type: data.payer_identification_type,
        number: data.payer_identification_number,
      },
      amount: _.toNumber(data.amount),
      currency_id: data.currency_id,
      mp_payment: { status: 'pending' },
      mp_payment_refunded: {},
      mp_customer: {},
      mp_card: {},
      mp_plan: {},
      mp_subscription: {},
      mp_subscription_cancelled: {},
      mp_payment_id: 0,
      created: currentDateTime()
    };

    return collection.insertOne(doc, (error, res) => {
      if (error) {
        return reject(handleError(error));
      }
      DB.payment = doc;
      return resolve(DB.payment);
    });
  }),

  update: (collection) => new Promise((resolve, reject) => {
    const doc = {
      mp_payment: MP.payment,
      mp_payment_refunded: MP.paymentRefunded,
      mp_customer: MP.customer, 
      mp_card: MP.card,
      mp_plan: MP.plan,
      mp_subscription: MP.subscription,
      mp_subscription_cancelled: MP.subscriptionCancelled,
      mp_payment_id: MP.payment.id,
      updated: currentDateTime()
    };

    return collection.updateOne({ _id: DB.payment._id }, { $set: doc }, { upsert: false }, (error, res) => {
      if (error) {
        return reject(handleError(error));
      }
      DB.payment = { ...DB.payment, doc };
      return resolve(DB.payment);
    });
  }),

  connect: () => new Promise((resolve, reject) => getConnection()
    .then(db => {
      DB.collections = {
        payment: db.collection('payment'),
      };
      resolve(db);
    })
    .catch(error => reject(handleError(error)))),
}

/**
 * Add a payment
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export function add (event, context, callback) {
  const data = {
    ...(_.isString(event.body) ? JSON.parse(event.body) : event.body),
    notification_url: process.env.mp_notification_url,
    plan_id: process.env.mp_plan_id,
  }

  const onApproved = () => MP.paymentRefund(MP.payment)
    .then(() => MP.customerSearch(data))
    .then(() => MP.customerCreate(data))
    .then(() => MP.cardCreate({ token: data.token }))
    .then(() => MP.planFindById(data.plan_id))
    .then(() => MP.subscriptionsCreate(data.plan_id))
    .then(() => DB.update(DB.collections.payment))
    .then(() => callback(null, success({ status: 'approved' })));

  const onPending = () => DB.update(DB.collections.payment)
    .then(() => callback(null, success({ status: 'pending' })));

  const onRejected = () => DB.update(DB.collections.payment)
    .then(() => callback(null, success({ status: 'rejected' })));

  const checkStatus = () => {
    switch (MP.payment.status) {
      case 'approved':
        return onApproved();
      case 'pending':
      case 'in_process':
        return onPending();
      case 'rejected':
      case 'cancelled':
        return onRejected();
    }
  };

  DB.connect()
    .then(() => data.mp_payment_id
      ? DB.findByMPId(data.mp_payment_id)
      : DB.insert(DB.collections.payment, data)
        .then(() => MP.paymentCreate({ ...data, paymentId: DB.payment._id })))
    .then(() => checkStatus())
    .catch(error => callback(null, failure(error)));
};

export function get_subscription (event, context, callback) {
  const data = _.isString(event.body) ? JSON.parse(event.body) : event.body;

  DB.connect()
    .then(() => DB.findByEmail(DB.collections.payment, data.email))
    .then(() => callback(null, success(DB.payment.mp_subscription)))
    .catch(error => callback(null, failure(error)));
};

export function cancel_subscription (event, context, callback) {
  const data = _.isString(event.body) ? JSON.parse(event.body) : event.body;

  DB.connect()
    .then(() => DB.findByEmail(DB.collections.payment, data.email))
    .then(payment => MP.subscriptionsCancel(MP.subscription.id))
    .then(() => DB.update(payment))
    .then(() => callback(null, success(MP.subscriptionCancelled)))
    .catch(error => callback(null, failure(error)));

  return DB.connect(() => onConnected(), callback);
};
