import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

//Creo el pool obj (ToDo: Sacar esto a un env y traerlo como una variable del env)
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
    var password = body.email + "2018";
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
          var cognitoUser = result.user.username;
          callback(null,cognitoUser);
        }
    });
}

/**
 * Signin del user en cognito, devuelve los datos de auth para llamar a los endpoints privados
 * @param {*} user 
 * @param {*} callback 
 */
export function signIn(user, callback){

    var authenticationData = {
        Username : user,
        Password : user + "2018",
    };
    var authenticationDetails = new AuthenticationDetails(authenticationData);
   
    var userData = {
        Username : user,
        Pool : userPool
    };
    console.log('userData',userData);
    console.log('user',user);
    
    var cognitoUser = new CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            //el id token es result.idToken.jwtToken
            callback(null, result);
        },

        onFailure: function(err) {
            console.log(`Problem authenticating user ${JSON.stringify(err)}`);
            callback(err, null);
        },
    });
    
}