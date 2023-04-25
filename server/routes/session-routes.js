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
const loginSchema = {
  type: 'object',
  properties: {
    userName: {type: 'string'},
    password: {type: 'string'}
  },
  required: ['userName', 'password'],
  additionalProperties: false
}


/**
 * API: http://localhost:3000/api/session
 */


// openapi language used to describe the API via swagger
/**
 * @openapi
 * /api/session/login:
 *   put:
 *     tags:
 *       - Session login
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
          const invalidUserNameResponse = new BaseResponse(200, 'Invalid password or username, please try again.', null);
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




// Verify Security Question
router.post('/verify/users/:userName/security-questions', async(req, res) => {
  try {

    // findOne function for user
    User.findOne({ 'userName': req.params.userName }, function (err, user) {

      // If userName not found
      if (err) {
        console.log(err);
        const verifySqError = new ErrorResponse(404, 'Bad request, invalid userName', err);
        res.status(404).send(verifySqError.toObject());
        errorLogger({ filename: myFile, message: "Bad request, invalid userName" });
        return
      }

      // If user is valid
      console.log(user);

      // variables for the selected questions
      const selectedSecurityQuestionOne = user.selectedSecurityQuestionOne.find(q => q.questionText === req.body.questionText1);
      const selectedSecurityQuestionTwo = user.selectedSecurityQuestionTwo.find(q2 => q2.questionText === req.body.questionText2);
      const selectedSecurityQuestionThree = user.selectedSecurityQuestionThree.find(q3 => q3.questionText === req.body.questionText3);

      //Variables for the selected answers
      const isValidAnswerOne = selectedSecurityQuestionOne.answerText === req.body.answerText1;
      const isValidAnswerTwo = selectedSecurityQuestionTwo.answerText === req.body.answerText2;
      const isValidAnswerThree = selectedSecurityQuestionThree.answerText === req.body.answerText3;

      // if all three security questions are valid
      if (isValidAnswerOne && isValidAnswerTwo && isValidAnswerThree) {
        console.log(`User ${user.userName} answered security questions correctly`);
        const validSqResponse = new BaseResponse(200, 'success', user)
        res.json(validSqResponse.toObject());
        debugLogger({ filename: myFile, message: user });
        return
      }

      // If any of the three security questions are invalid
      console.log(`User ${user.userName} failed to answer security questions correctly`);
      const invalidSqResponse = new BaseResponse(400, 'error', user)
      res.json(invalidSqResponse.toObject());
      errorLogger({ filename: myFile, message: `User ${user.userName} failed to answer security questions correctly` });
    })

    // Internal Server Error
  } catch (e) {
    console.log(e);
    const verifySqError = new ErrorResponse(500, 'Internal server error', e.message);
    res.status(500).send(verifySqError.toObject());
    errorLogger({ filename: myFile, message: "Internal server error" });
  }
})





module.exports = router;
