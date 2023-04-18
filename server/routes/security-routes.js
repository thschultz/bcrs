/**
 * Title: security-routes.js
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/17/23
 * Last Modified by: Walter McCue
 * Last Modification Date: 04/17/23
 * Description: security question api routing for the bcrs project
 */

// Require statements
const express = require("express");
const User = require("../models/user");
const router = express.Router();
const { debugLogger, errorLogger } = require("../logs/logger");
const createError = require("http-errors");
const Ajv = require("ajv");
const BaseResponse = require("../services/base-response");
const ErrorResponse = require("../services/error-response");
const SecurityQuestion = require("../models/security-question");

// Logging and Validation
const myFile = "security-routes.js";
const ajv = new Ajv();

// findAllSecurity
router.get("/", async (req, res) => {
  try {
    SecurityQuestion.find({})
      .where("isDisabled")
      .equals(false)
      .exec(function(err, securityQuestions) {
        //internal server error
        if (err) {
          console.log(err);
          const findAllMongoDBErrorResponse = new ErrorResponse(500, 'Internal server error', err);
          res.status(500).send(findAllMongoDBErrorResponse.toObject());
        } else {
          //successful query response
          console.log(securityQuestions);
          const findAllResponse = new BaseResponse(200, 'Query Successful', securityQuestions);
          res.json(findAllResponse.toObject());
        }
      });
  } catch (e) {
    //error response with server
    console.log(e);
    const findAllCatchErrorResponse = new ErrorResponse(500, 'Internal server error', e.message);
    res.status(500).send(findAllCatchErrorResponse.toObject());
  }
});
// findSecurityById

// createSecurity

router.post("/", async (req, res) => {
  try {
    let newSecurityQuestion = {
      text: req.body.text,
    };

    SecurityQuestion.create(
      newSecurityQuestion,
      function (err, securityQuestion) {
        if (err) {
          console.log(err);
          const createSecurityQuestionMongodbErrorResponse = new ErrorResponse(
            500,
            "Internal server error",
            err
          );
          res
            .status(500)
            .send(createSecurityQuestionMongodbErrorResponse.toObject());
        } else {
          console.log(securityQuestion);
          const createSecurityQuestionResponse = new BaseResponse(
            200,
            "Query Successful",
            securityQuestion
          );
          res.json(createSecurityQuestionResponse.toObject());
        }
      }
    );
  } catch (e) {
    console.log(e);
    const createSecurityQuestionCatchResponse = new ErrorResponse(
      500,
      "Internal server error",
      e.message
    );
    res.status(500).send(createSecurityQuestionCatchResponse.toObject());
  }
});

// updateSecurity

router.put("/:id", async (req, res) => {
  try {
    SecurityQuestion.findOne({'_id': req.params.id }, function (err, securityQuestion) {
        if (err) {
          //server error
          console.log(err);
          const updateSecurityQuestionMongodbErrorResponse = new ErrorResponse(500, "Internal server error", err);
          res.status(500).send(updateSecurityQuestionMongodbErrorResponse.toObject());
        } else {
          //setting security question
          console.log(securityQuestion);

          securityQuestion.set({
            text: req.body.text,
          });

          securityQuestion.save(function (err, savedSecurityQuestion) {
            if (err) {
              //server error
              console.log(err);
              const savedSecurityQuestionMongodbErrorResponse = new ErrorResponse(500, "Internal server error", err);
              res.status(500).send(savedSecurityQuestionMongodbErrorResponse.toObject());
            } else {
              //saving new security question
              console.log(savedSecurityQuestion);
              const savedSecurityQuestionResponse = new BaseResponse(200, "Query successful", savedSecurityQuestion );
              res.json(savedSecurityQuestionResponse.toObject());
            }
          });
        }
      }
    );
  } catch (e) {
    //server error
    console.log(e);
    const updateSecurityQuestionCatchErrorResponse = new ErrorResponse(500, "Internal server error", e.message);
    res.status(500).send(updateSecurityQuestionCatchErrorResponse.toObject());
  }
});

// deleteSecurity

module.exports = router;
