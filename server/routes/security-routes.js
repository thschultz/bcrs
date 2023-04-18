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

const { debugLogger, errorLogger } = require("../logs/logger");
const createError = require("http-errors");
const Ajv = require("ajv");
const BaseResponse = require("../models/base-response");
const ErrorResponse = require("../models/error-response");

const router = express.Router();
const { debugLogger, errorLogger } = require('../logs/logger');
const createError = require('http-errors');
const Ajv = require('ajv');
const BaseResponse = require('../models/base-response');
const ErrorResponse = require('../models/error-response');

// Logging and Validation
const myFile = "security-routes.js";
const ajv = new Ajv();

// findAllSecurity

// findSecurityById

// createSecurity

router.post("/", async (req, res) => {
  try {
    let newSecurityQuestion = {
      text: req.body.text,
    };

    securityQuestion.create(
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

// deleteSecurity

module.exports = router;
