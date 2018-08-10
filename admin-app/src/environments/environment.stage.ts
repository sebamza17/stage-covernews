// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api: {
    article: "https://5cufvngwok.execute-api.us-east-1.amazonaws.com/stage",
    author: "https://breb1wv546.execute-api.us-east-1.amazonaws.com/stage",
    category: "https://cdr12lpah1.execute-api.us-east-1.amazonaws.com/stage",
    user: "https://mjxdq979n3.execute-api.us-east-1.amazonaws.com/stage"
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
