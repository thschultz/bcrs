/**
 * Title: session-routes.js
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/17/23
 * Last Modified by: Carl Logan
 * Last Modification Date: 04/17/23
 * Description: session api routing for the bcrs project
*/


// Require statements
const express = require('express');
const User = require('../models/user');
const router = express.Router();
const { debugLogger, errorLogger } = require('../logs/logger');
const createError = require('http-errors');
const Ajv = require('ajv');
const BaseResponse = require('../services/base-response');
const ErrorResponse = require('../services/error-response');
const bcrypt = require('bcryptjs');

// Logging and Validation
const myFile = 'session-routes.js';
const ajv = new Ajv();

// Schema for validation


// User Sign-in
router.post('/login', async(req, res) => {
  try {
    User.findOne({'userName': req.body.userName}, (err, user) => {
      if(err) {
        console.log(err);
        const signinMongodbErrorResponse = new ErrorResponse(500, 'Internal server error', err);
        res.status(500).send(signinMongodbErrorResponse.toObject());
      }
      else {
        console.log(user);

        if(user) {
          let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
          // let passwordIsValid = true;

          // valid password
          if(passwordIsValid) {
            console.log('Login successful');
            const signinResponse = new BaseResponse(200, 'Login successful', user);
            res.json(signinResponse.toObject());
          }
          // invalid password
          else {
            console.log(`Invalid password or username: ${user.userName}`);
            const invalidPasswordResponse = new BaseResponse(401, 'Invalid password or username, please try again.', null);
            res.status(401).send(invalidPasswordResponse.toObject());
          }
        }
        //  invalid username
        else {
          console.log(`Username: ${req.body.userName} is invalid`);
          const invalidUserNameResponse = new BaseResponse(200, 'Invalid password or username, please try again.', null);
          res.status(401).send(invalidUserNameResponse.toObject());
        }
      }
    });
  }
  catch (err) {
    console.log(err);
    const signinCatchErrorResponse = new ErrorResponse(500, 'Internal server error', e.message);
    res.status(500).send(signinCatchErrorResponse.toObject());
  }
});



module.exports = router;
