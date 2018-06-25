// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api: {
    article: "https://jskopm2r2l.execute-api.us-east-1.amazonaws.com/prod",
    author: "https://29w05vcxd1.execute-api.us-east-1.amazonaws.com/prod",
    category: "https://docwjx3a3k.execute-api.us-east-1.amazonaws.com/prod",
    user: "https://cidp4k5462.execute-api.us-east-1.amazonaws.com/prod"
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
