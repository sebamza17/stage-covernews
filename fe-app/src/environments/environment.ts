// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api: "https://1meiqciyd1.execute-api.us-east-1.amazonaws.com/prod",
  firebase:{
    apiKey: "AIzaSyD7nmlxbZyPyOoWFrIiKHfS1ryeBWtcu_U",
    authDomain: "dictioz-603d2.firebaseapp.com",
    databaseURL: "https://dictioz-603d2.firebaseio.com",
    projectId: "dictioz-603d2",
    storageBucket: "dictioz-603d2.appspot.com",
    messagingSenderId: "459980556882"
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
