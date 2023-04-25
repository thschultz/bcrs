/**
 * Title: session-routes.js
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/17/23
 * Last Modified by: Carl Logan
 * Last Modification Date: 04/17/23
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
router.post("/login", async (req, res) => {
  try {
    // checks request body against the schema
    const validator = ajv.compile(loginSchema);
    const valid = validator({
      userName: req.body.userName,
      password: req.body.password,
    });

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
          500,
          "Internal server error",
          err
        );
        errorLogger({ filename: myFile, message: "Internal server error" });
        res.status(500).send(signinMongodbErrorResponse.toObject());
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
            200,
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

// VerifyUser

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

module.exports = router;
