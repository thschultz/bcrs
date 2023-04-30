/**
 * Title: session-routes.js
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/17/23
 * Last Modified by: Carl Logan
 * Last Modification Date: 04/24/23
 * Description: session api routing for the bcrs project
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
const bcrypt = require("bcryptjs");
const { async } = require("rxjs");
// const SelectedSecurityQuestions = require('../schemas/selected-security-question');

// Logging and Validation
const myFile = "session-routes.js";
const ajv = new Ajv();

// Schema for validation
const loginSchema = {
  type: "object",
  properties: {
    userName: { type: "string" },
    password: { type: "string" },
  },
  required: ["userName", "password"],
  additionalProperties: false,
};

const registerSchema = {
  type: "object",
  properties: {
    userName: { type: "string" },
    password: { type: "string" },
    firstName: { type: "string" },
    lastName: { type: "string" },
    phoneNumber: { type: "string" },
    address: { type: "string" },
    email: { type: "string" },
    selectedSecurityQuestions: { type: "array" },
  },
  required: [
    "userName",
    "password",
    "firstName",
    "lastName",
    "phoneNumber",
    "address",
    "email",
    "selectedSecurityQuestions",
  ],
  additionalProperties: false,
};

const verifySecurityQuestionsSchema = {
  type: "object",
  properties: {
    questionText1: { type: "string" },
    answerText1: { type: "string" },
    questionText2: { type: "string" },
    answerText2: { type: "string" },
    questionText3: { type: "string" },
    answerText3: { type: "string" },
  },
  required: ["questionText1", "answerText1", "questionText2", "answerText2", "questionText3", "answerText3"],
  additionalProperties: false,
};

const resetPasswordSchema = {
  type: "object",
  properties: {
    password: { type: "string" },
  },
  required: ["password"],
  additionalProperties: false,
};

const saltRounds = 10;


/**
 * API: http://localhost:3000/api/session
 */


// openapi language used to describe the API via swagger
/**
 * @openapi
 * /api/session/login:
 *   post:
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
router.post("/login", async (req, res) => {
  try {

    let userLogin = req.body;

    // checks request body against the schema
    const validator = ajv.compile(loginSchema);
    const valid = validator(userLogin);

    // failed validation
    if (!valid) {
      console.log("Bad Request, unable to validate");
      const createServiceError = new ErrorResponse(
        400,
        "Bad Request, unable to validate",
        valid
      );
      errorLogger({
        filename: myFile,
        message: "Bad Request, unable to validate",
      });
      res.status(400).send(createServiceError.toObject());
      return;
    }

    User.findOne({ userName: req.body.userName }, (err, user) => {
      // return an error response
      if (err) {
        console.log(err);
        const signinMongodbErrorResponse = new ErrorResponse(
          404,
          "Bad request, invalid path",
          err
        );
        errorLogger({ filename: myFile, message: "Bad request, invalid path" });
        res.status(404).send(signinMongodbErrorResponse.toObject());
      } else {
        console.log(user);

        // compare the string password with the hashed password in the database
        if (user) {
          let passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
          );

          // valid password
          if (passwordIsValid) {
            console.log("Login successful");
            const signinResponse = new BaseResponse(
              200,
              "Login successful",
              user
            );
            debugLogger({ filename: myFile, message: user });
            res.json(signinResponse.toObject());
          }
          // invalid password
          else {
            console.log(`Invalid password or username: ${user.userName}`);
            const invalidPasswordResponse = new BaseResponse(
              401,
              "Invalid password or username, please try again.",
              null
            );
            errorLogger({
              filename: myFile,
              message: "Invalid password or username",
            });
            res.status(401).send(invalidPasswordResponse.toObject());
          }
        }
        //  invalid username
        else {
          console.log(`Username: ${req.body.userName} is invalid`);
          const invalidUserNameResponse = new BaseResponse(
            401,
            "Invalid password or username, please try again.",
            null
          );
          errorLogger({
            filename: myFile,
            message: "Invalid password or username",
          });
          res.status(401).send(invalidUserNameResponse.toObject());
        }
      }
    });
  } catch (err) {
    console.log(err);
    const signinCatchErrorResponse = new ErrorResponse(
      500,
      "Internal server error",
      e.message
    );
    errorLogger({ filename: myFile, message: "Internal server error" });
    res.status(500).send(signinCatchErrorResponse.toObject());
  }
});


// openapi language used to describe the API via swagger
/**
 * @openapi
 * /api/session/register:
 *   post:
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
 *               lastName:
 *                 text:
 *                   type: string
 *               phoneNumber:
 *                 text:
 *                   type: string
 *               address:
 *                 text:
 *                   type: string
 *               email:
 *                 text:
 *                   type: string
 *               selectedSecurityQuestions:
 *                 text:
 *                   type: array
 *                   items:
 *                     questionText:
 *                       type: string
 *                     answerText:
 *                       type: string
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
router.post("/register", async (req, res) => {
  try {

    let registerUser = req.body;

    // checks request body against the schema
    const validator = ajv.compile(registerSchema);
    const valid = validator(registerUser);

    // failed validation
    if (!valid) {
      console.log("Bad Request, unable to validate");
      const createServiceError = new ErrorResponse(
        400,
        "Bad Request, unable to validate",
        valid
      );
      errorLogger({
        filename: myFile,
        message: "Bad Request, unable to validate",
      });
      res.status(400).send(createServiceError.toObject());
      return;
    }

    User.findOne({ userName: req.body.userName }, (err, user) => {
      console.log("user --> " + user);
      if (err) {
        console.log(err);
        const registerUserMongodbErrorResponse = new ErrorResponse(
          401,
          "Bad request, username in use",
          err
        );
        errorLogger({ filename: myFile, message: "Bad request, username in use" });
        res.status(401).send(registerUserMongodbErrorResponse.toObject());
      } else {
        if (!user) {
          let hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);
          standardRole = {
            text: "standard",
          };

          let registeredUser = {
            userName: req.body.userName,
            password: hashedPassword,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address,
            email: req.body.email,
            role: standardRole,
            selectedSecurityQuestions: req.body.selectedSecurityQuestions,
          };

          User.create(registeredUser, (err, newUser) => {
            if (err) {
              console.log(err);
              const newUserMongodbErrorResponse = new ErrorResponse(
                500,
                "Internal server error",
                err
              );
              errorLogger({
                filename: myFile,
                message: "Internal server error",
              });
              res.status(500).send(newUserMongodbErrorResponse.toObject());
            } else {
              console.log(newUser);
              const registerUserResponse = new BaseResponse(
                200,
                "Query successful",
                newUser
              );
              debugLogger({ filename: myFile, message: newUser });
              res.json(registerUserResponse.toObject());
            }
          });
        } else {
          console.log(`Username ${req.body.userName} already exists.`);
          const userInUseError = new BaseResponse(
            400,
            `The username '${req.body.userName}' is already in use.`,
            null
          );
          errorLogger({
            filename: myFile,
            message: "Username already exists.",
          });
          res.status(400).send(userInUseError.toObject());
        }
      }
    });
  } catch (e) {
    console.log(err);
    const registerUserCatchErrorResponse = new ErrorResponse(
      500,
      "Internal server error",
      e.message
    );
    errorLogger({ filename: myFile, message: "Internal server error" });
    res.status(500).send(registerUserCatchErrorResponse.toObject());
  }
});


/**
 * verifyUser
 * @openapi
 * /api/session/verify/users/{userName}:
 *   get:
 *     tags:
 *       - Session
 *     description:  API that verify users by userName
 *     summary: Verify user by userName
 *     parameters:
 *       - name: userName
 *         in: path
 *         required: true
 *         description: userName
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User document
 *       '400':
 *         description: Invalid username
 *       '500':
 *         description: Server exception
 */

// verifyUser
router.get("/verify/users/:userName", async (req, res) => {
  try {
    User.findOne({ userName: req.params.userName }, function (err, user) {
      if (err) {
        console.log(err);
        res.status(500).send(verifyUserMongodbErrorResponse.toObject());
      } else {
        if (user) {
          console.log(user);
          const verifyUserResponse = new BaseResponse(
            "200",
            "Query successful",
            user
          );
          res.json(verifyUserResponse.toObject());
        } else {
          const invalidUserNameResponse = new BaseResponse(
            "400",
            "Invalid username",
            req.params.userName
          );
          res.status(400).send(invalidUserNameResponse.toObject());
        }
      }
    });
  } catch (e) {
    console.log(e);
    const verifyUserCatchErrorResponse = new ErrorResponse(
      "500",
      "Internal server error",
      e.message
    );
    res.status(500).send(verifyUserCatchErrorResponse.toObject());
  }
});


/**
 * @openapi
 * /api/session/verify/users/{username}/security-questions:
 *   post:
 *     tags:
 *       - Session
 *     name: verifySecurityQuestions
 *     description: Verifies that a user's input to confirm security questions matches what is stored in the database.
 *     summary: Verify a user's security questions against MongoDB
 *     operationId: verifySecurityQuestions
 *     parameters:
 *       - name: userName
 *         in: path
 *         required: true
 *         description: findOne function to find the selected security questions of the selected userName
 *         scheme:
 *           type: string
 *     requestBody:
 *       required: true
 *       description: The security questions and answers
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - questionText1
 *               - questionText2
 *               - questionText3
 *               - answerText1
 *               - answerText2
 *               - answerText3
 *             properties:
 *               questionText1:
 *                 type: string
 *               questionText2:
 *                 type: string
 *               questionText3:
 *                 type: string
 *               answerText1:
 *                 type: string
 *               answerText2:
 *                 type: string
 *               answerText3:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Verified security question
 *       '400':
 *         description: Bad request, unable to validate
 *       '401':
 *         description: User failed to answer security questions correctly
 *       '404':
 *         description: Bad request, invalid userName
 *       '500':
 *         description: Server Exception
 */

// Verify Security Question
router.post("/verify/users/:userName/security-questions", async (req, res) => {
  try {

    let verifySecurityQuestions = req.body;

    // checks request body against the schema
    const validator = ajv.compile(verifySecurityQuestionsSchema);
    const valid = validator(verifySecurityQuestions);

    // failed validation
    if (!valid) {
      console.log("Bad Request, unable to validate");
      const createServiceError = new ErrorResponse(
        400,
        "Bad Request, unable to validate",
        valid
      );
      errorLogger({
        filename: myFile,
        message: "Bad Request, unable to validate",
      });
      res.status(400).send(createServiceError.toObject());
      return;
    }

    // findOne function for user
    User.findOne({ userName: req.params.userName }, function (err, user) {
      // If userName not found
      if (err) {
        console.log(err);
        const verifySqError = new ErrorResponse(
          404,
          "Bad request, invalid userName",
          err
        );
        res.status(404).send(verifySqError.toObject());
        errorLogger({
          filename: myFile,
          message: "Bad request, invalid userName",
        });
        return;
      }

      // If user is valid
      console.log(user);

      // Variables to gather the selected questions
      const selectedSecurityQuestionOne = user.selectedSecurityQuestions.find(
        (q) => q.questionText === req.body.questionText1
      );
      const selectedSecurityQuestionTwo = user.selectedSecurityQuestions.find(
        (q2) => q2.questionText === req.body.questionText2
      );
      const selectedSecurityQuestionThree = user.selectedSecurityQuestions.find(
        (q3) => q3.questionText === req.body.questionText3
      );

      // Variables to compare the selected answers against the answers stored in the database
      const isValidAnswerOne =
        selectedSecurityQuestionOne.answerText === req.body.answerText1;
      const isValidAnswerTwo =
        selectedSecurityQuestionTwo.answerText === req.body.answerText2;
      const isValidAnswerThree =
        selectedSecurityQuestionThree.answerText === req.body.answerText3;

      // if all three security questions are valid
      if (isValidAnswerOne && isValidAnswerTwo && isValidAnswerThree) {
        console.log(
          `User ${user.userName} answered security questions correctly`
        );
        const validSqResponse = new BaseResponse(200, "success", user);
        res.json(validSqResponse.toObject());
        debugLogger({ filename: myFile, message: user });
        return;
      }

      // If any of the three security questions are invalid
      console.log(
        `User ${user.userName} failed to answer security questions correctly`
      );
      const invalidSqResponse = new BaseResponse(401, "error", user);
      res.json(invalidSqResponse.toObject());
      errorLogger({
        filename: myFile,
        message: `User ${user.userName} failed to answer security questions correctly`,
      });
    });

    // Internal Server Error
  } catch (e) {
    console.log(e);
    const verifySqError = new ErrorResponse(
      500,
      "Internal server error",
      e.message
    );
    res.status(500).send(verifySqError.toObject());
    errorLogger({ filename: myFile, message: "Internal server error" });
  }
});


/**
 * @openapi
 * /api/session/users/{userName}/reset-password:
 *   post:
 *     tags:
 *       - Session
 *     operationId: Reset Password
 *     description: Resets user password.
 *     summary: Resets Password.
 *     parameters:
 *       - name: userName
 *         in: path
 *         required: true
 *         description: userName
 *         schema:
 *           type: string
 *     requestBody:
 *       description: New password.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 text:
 *                   type: string
 *       required: true
 *     responses:
 *       '200':
 *         description: Password reset successful.
 *       '400':
 *         description: Bad request.
 *       '404':
 *         description: Not found.
 *       '500':
 *         description: Server expectations.
 */

// ResetPassword
router.post("/users/:userName/reset-password", async (req, res) => {
  try {
    let newPassword = req.body;

    // checks request body against the schema
    const validator = ajv.compile(resetPasswordSchema);
    const valid = validator(newPassword);

    // failed validation
    if (!valid) {
      console.log("Bad Request, unable to validate");
      const createServiceError = new ErrorResponse(
        400,
        "Bad Request, unable to validate",
        valid
      );
      errorLogger({
        filename: myFile,
        message: "Bad Request, unable to validate",
      });
      res.status(400).send(createServiceError.toObject());
      return;
    }

    User.findOne({ userName: req.params.userName }, function (err, user) {
      if (err) {
        console.log(err);
        const resetPasswordMongodbErrorResponse = new ErrorResponse(
          "500",
          "Internal Server Error",
          err
        );
        res.status(500).send(resetPasswordMongodbErrorResponse.toObject());
      } else {
        console.log(user);
        password = req.body.password
        let hashedPassword = bcrypt.hashSync(password, saltRounds);

        user.set({
          password: hashedPassword,
        });

        user.save(function (err, updatedUser) {
          if (err) {
            console.log(err);
            const updateUserMongodbErrorResponse = new ErrorResponse(
              "500",
              "Internal server error",
              err
            );
            res.status(500).send(updateUserMongodbErrorResponse.toObject());
          } else {
            console.log(updatedUser);
            const updatedPasswordResponse = new BaseResponse(
              "200",
              "Query Successful",
              updatedUser
            );
            res.json(updatedPasswordResponse.toObject());
          }
        });
      }
    });
  } catch (e) {
    console.log(e);
    const resetPasswordCatchError = new ErrorResponse(
      "500",
      "Internal server error",
      e
    );
    res.status(500).send(resetPasswordCatchError.toObject());
  }
});

module.exports = router;
