export const environment = {
  production: true,
  api: {
    article: 'https://5cufvngwok.execute-api.us-east-1.amazonaws.com/stage',
    author: 'https://breb1wv546.execute-api.us-east-1.amazonaws.com/stage',
    category: 'https://cdr12lpah1.execute-api.us-east-1.amazonaws.com/stage',
    user: 'https://mjxdq979n3.execute-api.us-east-1.amazonaws.com/stage',
    payment: 'http://localhost:3000'
  },
  firebase: {
    apiKey: 'AIzaSyD7nmlxbZyPyOoWFrIiKHfS1ryeBWtcu_U',
    authDomain: 'dictioz-603d2.firebaseapp.com',
    databaseURL: 'https://dictioz-603d2.firebaseio.com',
    projectId: 'dictioz-603d2',
    storageBucket: 'dictioz-603d2.appspot.com',
    messagingSenderId: '459980556882'
  },
  mercadopago: {
    sandbox: false,
    basic: {
      clientId: '1187827521471485',
      clientSecret: '99vCgsrco2cUoSpQ7yEZxlUlnvrJcU7Y',
    },
    test: {
      publicKey: 'TEST-23fb62d3-a998-4697-9415-2a8bbc60e908',
      accessToken: 'TEST-1187827521471485-080614-cd5ff36a09002eb14ad58b860e7c9fb3-341515166',
    },
    prod: {
      publicKey: 'APP_USR-5563c161-17da-44f8-8a98-c7381adf5e10',
      accessToken: 'APP_USR-1187827521471485-080614-3557ae141d2084640f8a0fe91d7fccd6-341515166'
    },
  },
};
