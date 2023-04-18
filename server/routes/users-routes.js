/**
 * Title: users-routes.js
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/17/23
 * Last Modified by: Walter McCue
 * Last Modification Date: 04/17/23
 * Description: users api routing for the bcrs project
*/


// Require statements
const express = require('express');
const User = require('../models/user');
const router = express.Router();
const { debugLogger, errorLogger } = require('../logs/logger');
const createError = require('http-errors');
const Ajv = require('ajv');
// const bcrypt = require('bcryptjs');
const BaseResponse = require('../services/base-response');
const ErrorResponse = require('../services/error-response');

// Logging and Validation
const myFile = 'users-routes.js';
const ajv = new Ajv();
const saltRounds = 10; // hashes password

// Schema for validation


// findAllUsers

router.get('/', async (req, res, next) =>{
  try {
    User.find({}).where('isDisabled').equals(false).exec(function(err, users) {

      if (err) {
        const findAllError = new ErrorResponse(500, 'Internal server error', err.message);
        res.status(500).send(findAllError.toObject());
        errorLogger({filename: myFile, message: 'Internal server error'});
        next(err)
        return
      }

      console.log(users);
      const findAllResponse = new BaseResponse(200, 'Query Successful', users);
      debugLogger({filename: myFile, message: 'Query Successful'})
      res.json(findAllResponse.toObject());
    })

  } catch (e) {
    const findAllError = new ErrorResponse(500, 'Internal server error', e.message);
    res.status(500).send(findAllError.toObject());
    errorLogger({filename: myFile, message: 'Internal server error'});
    next(err)
  }
})




// findUserById

// createUser

// updateUser

// deleteUser


module.exports = router;
