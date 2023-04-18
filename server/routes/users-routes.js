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


/**
 * API: http://localhost:3000/api/users
 */


/**
 * findAllUsers
 * @openapi
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     description: Returns all users
 *     summary: Returns all users
 *     responses:
 *       '200':
 *         description: Returned all users
 *       '500':
 *         description: Server Error
*/

// findAllUsers
router.get('/', async (req, res) =>{
  try {
    User.find({}).where('isDisabled').equals(false).exec(function (err, users) {

      // Server Error
      if (err) {
        const findAllError = new ErrorResponse(500, 'Internal server error', err.message);
        res.status(500).send(findAllError.toObject());
        errorLogger({filename: myFile, message: 'Internal server error'});
        return
      }

      // Successful Query
      console.log(users);
      const findAllResponse = new BaseResponse(200, 'Query Successful', users);
      debugLogger({filename: myFile, message: users})
      res.json(findAllResponse.toObject());
    })

  //Server Error
  } catch (e) {
    const findAllError = new ErrorResponse(500, 'Internal server error', e.message);
    res.status(500).send(findAllError.toObject());
    errorLogger({filename: myFile, message: 'Internal server error'});
  }
})




// findUserById

// createUser

// updateUser

// deleteUser


module.exports = router;
