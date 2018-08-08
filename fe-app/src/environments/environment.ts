// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api: {
    article: 'https://5cufvngwok.execute-api.us-east-1.amazonaws.com/stage',
    author: 'https://breb1wv546.execute-api.us-east-1.amazonaws.com/stage',
    category: 'https://cdr12lpah1.execute-api.us-east-1.amazonaws.com/stage',
    user: 'https://mjxdq979n3.execute-api.us-east-1.amazonaws.com/stage'
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
    basic: {
      clientId: '1739500474548132',
      clientSecret: 'Aip9ODxx34dql2Vx3mt3OUuOGz2jzglR',
    },
    test: {
      publicKey: 'TEST-033f92fb-f736-4d57-8b29-f626896344af',
      accessToken: 'TEST-1739500474548132-062914-1fa4eb39460345a789af695826f80419__LC_LD__-57621646',
    },
    prod: {
      publicKey: 'APP_USR-a41a05e4-be71-4665-9849-3659d99a140a',
      accessToken: 'APP_USR-1739500474548132-062914-c0409ae9942fafd2be202aba600079f8__LD_LC__-57621646'
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
