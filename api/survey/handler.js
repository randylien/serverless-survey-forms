'use strict';

let aws = require('../config/aws');
let survey = require('./survey')(aws);
let user = require('../user/user.js')(aws);
let feedback = require('../feedback/feedback.js')(aws);

module.exports.handler = (event, context, callback) => {
  // request from API Gateway
  console.log("Dispatch request from API Gateway: ", JSON.stringify(event));

  // validate requester role Check if authAccountid is authorized
  const authorizedJudge = new Promise((resolve, reject) => {
    if (!event.authAccountid) {
      reject(new Error("400 Bad Request: " + JSON.stringify(event)));
    } else {
      user.getOneUser({
        accountid: event.authAccountid
      }, function(err, data) {
        if (err) {
          reject(err, null);
        } else {
          // Authorized: Designer or Admin
          if (data.role === "Admin" || data.role === "Designer" && event.accountid === event.authAccountid) {
            resolve();
          } else {
            reject(new Error(`403 Unauthorized request: The role of the requester ${event.authAccountid} is ${data.role} or ${event.accountid} != ${event.authAccountid}`));
          }
        }
      });
    }
  });

  switch (event.op) {
    case "getOneSurvey":
      // GET /api/v1/surveys/<accountid>/<surveyid>/
      // Authenticated: Not necessary
      return survey.getOneSurvey({
        accountid: event.accountid,
        surveyid: event.surveyid
      }, (err, response) => {
        // A callback handler to decide return is 304 or 200.
        if (err) {
          callback(err, response);
        } else if (event.ifModifiedSince && response.datetime && new Date(response.datetime).toUTCString() === event.ifModifiedSince) {
          return callback("304 Not Modified", null);
        } else {
          response['datetime'] = new Date(response.datetime).toUTCString();
          callback(null, response);
        }
      });
      break;

    case "listSurveys":
      // GET /api/v1/mgnt/surveys/[?startKey=<startKey>]
      // Authenticated: Yes
      return authorizedJudge.then(() => {
        survey.listSurveys({
          accountid: event.accountid,
          startKey: event.startKey,
        }, callback);
      }).catch((err) => {
        callback(err, null);
      });
      break;

    case "addOneSurvey":
      // POST /api/v1/mgnt/surveys/
      // Authenticated: Yes
      return authorizedJudge.then(() => {
        survey.addOneSurvey({
          accountid: event.accountid,
          subject: event.subject,
          survey: event.survey
        }, callback);
      }).catch((err) => {
        callback(err, null);
      });
      break;

    case "updateOneSurvey":
      // PUT /api/v1/mgnt/surveys/
      // Authenticated: Yes
      return authorizedJudge.then(() => {
        survey.updateOneSurvey({
          accountid: event.accountid,
          subject: event.subject,
          survey: event.survey,
          surveyid: event.surveyid
        }, callback);
      }).catch((err) => {
        callback(err, null);
      });
      break;

    case "deleteOneSurvey":
      // DELETE /api/v1/mgnt/surveys/<accountid>/<surveyid>
      // Authenticated: Yes
      authorizedJudge.then(() => {
        return survey.deleteOneSurvey({
          accountid: event.accountid,
          surveyid: event.surveyid,
        });
      }).then(response => {
        return callback(null, response);
      }).catch(err => {
        return callback(err, null);
      });
      break;

    default:
      let error = new Error("400 Bad Request: " + JSON.stringify(event));
      return callback(error, null);
  }
};