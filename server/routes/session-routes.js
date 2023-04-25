/**
 * Title: session-routes.js
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/17/23
 * Last Modified by: Carl Logan
 * Last Modification Date: 04/24/23
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
const loginSchema = {
  type: 'object',
  properties: {
    userName: {type: 'string'},
    password: {type: 'string'}
  },
  required: ['userName', 'password'],
  additionalProperties: false
}

const registerSchema = {
  type: 'object',
  properties: {
    userName: {type: 'string'},
    password: {type: 'string'},
    firstName: {type: 'string'},
    lastName: {type: 'string'},
    phoneNumber: {type: 'string'},
    address: {type: 'string'},
    email: {type: 'string'},
    selectedSecurityQuestions: {type: 'array'},
  },
  required: [
              'userName', 'password', 'firstName', 'lastName', 'phoneNumber',
              'address', 'email', 'selectedSecurityQuestions'
            ],
  additionalProperties: false
}

const saltRounds = 10;

// openapi language used to describe the API via swagger
/**
 * @openapi
 * /api/session/login:
 *   put:
 *     tags:
 *       - Session
 *     operationId: login
 *     description: Login with username and password.
 *     summary: Login with username and password.
 *     requestBody:
 *       description: Login with username and password.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 text:
 *                   type: string
 *               password:
 *                 text:
 *                   type: string
 *       required: true
 *     responses:
 *       '200':
 *         description: Login successful.
 *       '400':
 *         description: Bad request.
 *       '404':
 *         description: Not found.
 *       '500':
 *         description: Server expectations.
 */
// User Sign-in
router.post('/login', async(req, res) => {
  try {
    // checks request body against the schema
    const validator = ajv.compile(loginSchema);
    const valid = validator({'userName': req.body.userName, 'password': req.body.password})

    // failed validation
    if (!valid) {
      console.log('Bad Request, unable to validate');
      const createServiceError = new ErrorResponse(400, 'Bad Request, unable to validate', valid);
      errorLogger({ filename: myFile, message: "Bad Request, unable to validate" });
      res.status(400).send(createServiceError.toObject());
      return
    }

    User.findOne({'userName': req.body.userName}, (err, user) => {

      // return an error response
      if(err) {
        console.log(err);
        const signinMongodbErrorResponse = new ErrorResponse(500, 'Internal server error', err);
        errorLogger({ filename: myFile, message: "Internal server error" });
        res.status(500).send(signinMongodbErrorResponse.toObject());
      }
      else {
        console.log(user);

        // compare the string password with the hashed password in the database
        if(user) {
          let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

          // valid password
          if(passwordIsValid) {
            console.log('Login successful');
            const signinResponse = new BaseResponse(200, 'Login successful', user);
            debugLogger({ filename: myFile, message: user });
            res.json(signinResponse.toObject());
          }
          // invalid password
          else {
            console.log(`Invalid password or username: ${user.userName}`);
            const invalidPasswordResponse = new BaseResponse(401, 'Invalid password or username, please try again.', null);
            errorLogger({ filename: myFile, message: "Invalid password or username" });
            res.status(401).send(invalidPasswordResponse.toObject());
          }
        }
        //  invalid username
        else {
          console.log(`Username: ${req.body.userName} is invalid`);
          const invalidUserNameResponse = new BaseResponse(401, 'Invalid password or username, please try again.', null);
          errorLogger({ filename: myFile, message: "Invalid password or username" });
          res.status(401).send(invalidUserNameResponse.toObject());
        }
      }
    });
  }
  catch (err) {
    console.log(err);
    const signinCatchErrorResponse = new ErrorResponse(500, 'Internal server error', e.message);
    errorLogger({ filename: myFile, message: "Internal server error" });
    res.status(500).send(signinCatchErrorResponse.toObject());
  }
});

// openapi language used to describe the API via swagger
/**
 * @openapi
 * /api/session/register:
 *   put:
 *     tags:
 *       - Session
 *     operationId: register
 *     description: Register a new user.
 *     summary: Register a new user.
 *     requestBody:
 *       description: Register a new user.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 text:
 *                   type: string
 *               password:
 *                 text:
 *                   type: string
 *               firstName:
 *                 text:
 *                   type: string
 *                lastName:
 *                 text:
 *                   type: string
 *                phoneNumber:
 *                 text:
 *                   type: string
 *                address:
 *                 text:
 *                   type: string
 *                email:
 *                 text:
 *                   type: string
 *                selectedSecurityQuestions:
 *                 text:
 *                   type: string
 *       required: true
 *     responses:
 *       '200':
 *         description: Successful registration.
 *       '400':
 *         description: Bad request.
 *       '404':
 *         description: Not found.
 *       '500':
 *         description: Server expectations.
 */
// register
//
router.post('/register', async(req, res) => {
  try {

    // checks request body against the schema
    const validator = ajv.compile(registerSchema);
    const valid = validator({
      'userName': req.body.userName,
      'password': req.body.password,
      'firstName': req.body.firstName,
      'lastName': req.body.lastName,
      'phoneNumber': req.body.phoneNumber,
      'address': req.body.address,
      'email': req.body.email,
      'selectedSecurityQuestions': req.body.selectedSecurityQuestions
    });

    // failed validation
    if (!valid) {
      console.log('Bad Request, unable to validate');
      const createServiceError = new ErrorResponse(400, 'Bad Request, unable to validate', valid);
      errorLogger({ filename: myFile, message: "Bad Request, unable to validate" });
      res.status(400).send(createServiceError.toObject());
      return
    }

    User.findOne({'userName': req.body.userName}, (err, user) => {
      console.log("user --> " + user);
      if(err) {
        console.log(err);
        const registerUserMongodbErrorResponse = new ErrorResponse(500, 'Internal server error', err);
        errorLogger({ filename: myFile, message: "Internal server error" });
        res.status(500).send(registerUserMongodbErrorResponse.toObject());
      }
      else {
        if(!user) {
          let hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);
          standardRole = {
            text: 'standard'
          }

          let registeredUser = {
            userName: req.body.userName,
            password: hashedPassword,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address,
            email: req.body.email,
            role: standardRole,
            selectedSecurityQuestions: req.body.selectedSecurityQuestions
          };

          User.create(registeredUser, (err, newUser) => {
            if(err) {
              console.lof(err);
              const newUserMongodbErrorResponse = new ErrorResponse(500, 'Internal server error', err);
              errorLogger({ filename: myFile, message: "Internal server error" });
              res.status(500).send(newUserMongodbErrorResponse.toObject());
            }
            else {
              console.log(newUser);
              const registerUserResponse = new BaseResponse(200, 'Query successful', newUser);
              debugLogger({ filename: myFile, message: newUser });
              res.json(registerUserResponse.toObject());
            }
          });
        }
        else {
          console.log(`Username ${req.body.userName} already exists.`);
          const userInUseError = new BaseResponse(400, `The username '${req.body.userName}' is already in use.`, null);
          errorLogger({ filename: myFile, message: "Username already exists." });
          res.status(400).send(userInUseError.toObject());
        }
      }
    });
  }
  catch(e) {
    console.log(err);
    const registerUserCatchErrorResponse = new ErrorResponse(500, 'Internal server error', e.message);
    errorLogger({ filename: myFile, message: "Internal server error" });
    res.status(500).send(registerUserCatchErrorResponse.toObject());
  }
});

module.exports = router;
