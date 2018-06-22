/**
 * Success function
 * @param {*} body 
 */
export function success(body,token = '') {
  console.log("Success",200);
  return buildResponse(200, body,token);
}

/**
 * Fail response status 500
 * @param {*} body 
 */
export function failure(err, token = '') {
  console.log("FAIL",err);
  return buildResponse(500, err, token);
}

/**
 * Build Responses for success and fail actions
 * @param {*} statusCode 
 * @param {*} body 
 */
function buildResponse(statusCode, body, token = '') {
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Methods" : "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Access-Control-Allow-Origin, X-Requested-With, token"
    },
    body: JSON.stringify(body)
  };
}