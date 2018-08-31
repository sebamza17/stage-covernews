import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

var userPool = new CognitoUserPool({ 
    UserPoolId : process.env.USER_POOL_ID,
    ClientId : process.env.CLIENT_ID
});

/**
 * Registro del user en el userpool de cognito
 * @param {*} body 
 * @param {*} callback 
 */
export function signUp(body, callback) {

    var attributeList = [];
    var dataEmail = {
        Name : 'email',
        Value : body.email
    };

    //genero el pasw de cognito
    var password = body.email + "2018"; //ToDo: Agregar un seed en el env y usarlo para hashear esto
    var username = body.email;
    var attributeEmail = new CognitoUserAttribute(dataEmail);
   
    attributeList.push(attributeEmail);
   
    //La funcion lambda "preSignupAutoconfirm" confirma el user automagicamente (trigger de cognito)
    userPool.signUp(username, password, attributeList, null, function(err, result){
        if (err) {
          console.log(`Problem creating user ${JSON.stringify(err)}`);
          callback(err,null);
        }
        else{
          console.log(`User successfully created ${JSON.stringify(result)}`);
          var cognitoUser = result;
          callback(null,cognitoUser);
        }
    });
}

/**
 * Signin del user en cognito, devuelve los datos de auth para llamar a los endpoints privados
 * @param {*} user 
 * @param {*} callback 
 */
export function signIn(user, idmongo,callback){

    var authenticationData = {
        Username : user,
        Password : user + "2018",
    };
    var authenticationDetails = new AuthenticationDetails(authenticationData);
   
    var userData = {
        Username : user,
        Pool : userPool
    };
    var cognitoUser = new CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            //guardo el id de mongo en cognito
            if(idmongo){
                var disclaimerAttribute = [
                    new CognitoUserAttribute({
                        Name: 'custom:mongoID',
                        Value: idmongo
                    })
                ];
                cognitoUser.updateAttributes(disclaimerAttribute, function (err, result) {
                    if (err) {
                        console.log(`Problem updating user attr: `, err);
                    }
                });
            }
            console.log(`Success authenticating user ${JSON.stringify(result)}`);
            //el token para la api es result.idToken.jwtToken
            callback(null, result);

        },
        onFailure: function(err) {
            console.log(`Problem authenticating user ${JSON.stringify(err)}`);
            callback(err, null);
        },
    });
}