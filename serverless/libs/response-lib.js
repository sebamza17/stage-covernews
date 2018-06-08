/**
 * Success function
 * @param {*} body 
 */
export function success(body) {
  return buildResponse(200, body);
}

/**
 * Fail response status 500
 * @param {*} body 
 */
export function failure(body) {
  return buildResponse(500, body);
}

/**
 * Build Responses for success and fail actions
 * @param {*} statusCode 
 * @param {*} body 
 */
function buildResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify(body)
  };
}