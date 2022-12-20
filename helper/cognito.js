const { config } = require("../config/index.js");
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const CognitoUserAttribute = AmazonCognitoIdentity.CognitoUserAttribute;
const CognitoUser = AmazonCognitoIdentity.CognitoUser;
const randomstring = require('randomstring');
const AWS = require('aws-sdk');
const cognitoAdmin = new AWS.CognitoIdentityServiceProvider({
  region: 'eu-west-1',
  accessKeyId: config.awsCognitoKeyId,
  secretAccessKey: config.awsCognitoAccessKey
});

const poolData = {
  UserPoolId: config.awsPoolId, // Your user pool id here
  ClientId: config.awsPoolClientId // Your client id here
};

const userPool = new CognitoUserPool(poolData);

function resetEmailConfirmationCode(email) {
  const emailVerificationAttribute = getEmailVerificationAttribute();
  return new Promise((resolve, reject) => {
    cognitoAdmin.adminUpdateUserAttributes({
      Username: email,
      UserPoolId: poolData.UserPoolId,
      UserAttributes: [emailVerificationAttribute]
    }, (err, data) => {
      if (err) {
        return reject({success: false, error: err, data: null});
      }
      data.user = {};
      data.user.verificationCode = emailVerificationAttribute.Value;
      return resolve({success: true, error: null, data})
    })
  })
}

function confirmUser(email, code) {
  var params = {
    UserPoolId: poolData.UserPoolId, /* required */
    Username: email /* required */
  };
  return new Promise((resolve, reject) => {
    cognitoAdmin.adminGetUser(params, function(err, data) {
      if (err) {
        return reject({success: false, error: err, data: null});
      }
        const emailVerificationAttribute = data.UserAttributes.find(x => x.Name === 'custom:email_verification');
        if (emailVerificationAttribute !== undefined && emailVerificationAttribute.Value === code) {
          cognitoAdmin.adminConfirmSignUp({
            UserPoolId: poolData.UserPoolId,
            Username: email
          }, (err, result) => {
            if (err) {
              return reject({success: false, error: err, data: null});
            }
              cognitoAdmin.adminUpdateUserAttributes({
                UserAttributes: [
                  {
                    Name: 'email_verified',
                    Value: 'true'
                  }
                ],
                UserPoolId: poolData.UserPoolId,
                Username: email
              }, (err, result) => {
                if (err) {
                  return reject({success: false, error: err, data: null});
                }
                return resolve({success: true, error: null, data: data});
              })

          })
        } else {
          const err = new Error('Verification code does not match.');
          return reject({success: false, error: err})
        }

    });
  })

}

function signup(email, password, attributeList = []) {
  const emailVerificationAttribute = getEmailVerificationAttribute();
  attributeList.push(emailVerificationAttribute);

  return new Promise((resolve, reject) => {
    userPool.signUp(email, password, attributeList, null, function(
      err,
      result
    ) {
      if (err) {
        return reject({success: false, error: err, user: null})
      }
      result.user.verificationCode = emailVerificationAttribute.Value;
      return resolve({success: true, error: null, user: result.user})
    });
  })
}

function login(email, password) {
  const authenticationData = {
    Username: email,
    Password: password
  }

  const userData = {
    Username: email,
    Pool: userPool
  }

  const user = new CognitoUser(userData);

  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

  return new Promise((resolve, reject) => {
    user.authenticateUser(authenticationDetails, {
      onSuccess: function(result) {
        user.getUserData(function(err, userData) {
          if (err) {
            return reject({success: false, error: err, user: null})
          }
          const User = {
            Username: userData.Username,
            Email: userData.UserAttributes.find(x => x.Name === 'email').Value,
            Verified: userData.UserAttributes.find(x => x.Name === 'email_verified').Value === 'true'
          }
          return resolve({success: true, error: null, user: User})
        });
      },
      onFailure: function(err) {
        return reject({success: false, error: err, user: null})
      }
    })

  })
}


function getEmailVerificationAttribute() {
  const code = randomstring.generate({
    length: 7,
    readable: true,
    charset: 'alphanumeric',
    capitalization: 'lowercase'
  });
  return new CognitoUserAttribute({
    Name: 'custom:email_verification',
    Value: code
  })
}

module.exports =  {
  login,
  signup,
  confirmUser,
  resetEmailConfirmationCode
}
