// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api: {
    article: 'https://5cufvngwok.execute-api.us-east-1.amazonaws.com/stage',
    author: 'https://breb1wv546.execute-api.us-east-1.amazonaws.com/stage',
    category: 'https://cdr12lpah1.execute-api.us-east-1.amazonaws.com/stage',
    user: 'http://localhost:3001',
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
    sandbox: true,
    appId: '341515166',
    client: {
      clientId: '1187827521471485',
      clientSecret: '99vCgsrco2cUoSpQ7yEZxlUlnvrJcU7Y'
    },
    test: {
      publicKey: 'TEST-23fb62d3-a998-4697-9415-2a8bbc60e908',
      accessToken: 'TEST-1187827521471485-080614-cd5ff36a09002eb14ad58b860e7c9fb3-341515166'
    },
    prod: {
      publicKey: 'APP_USR-5563c161-17da-44f8-8a98-c7381adf5e10',
      accessToken: 'APP_USR-1187827521471485-080614-3557ae141d2084640f8a0fe91d7fccd6-341515166'
    },
  },
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
