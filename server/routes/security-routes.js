/**
 * Title: security-routes.js
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/17/23
 * Last Modified by: Jamal Damir
 * Last Modification Date: 04/19/23
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
const securityQuestion = require("../models/security-question");

// Logging and Validation
const myFile = "security-routes.js";
const ajv = new Ajv();

// findAllSecurityQuestions

/**
 * findAllSecurityQuestions
 * @openapi
 * /api/security:
 *   get:
 *     tags:
 *       - SecurityQuestions
 *     description:  API for viewing all security questions
 *     summary: view all security questions
 *     responses:
 *       '200':
 *         description: Success
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Not Found
 *       '500':
 *         description: server error for all other use cases
 */

router.get("/", async (req, res) => {
  try {
    SecurityQuestion.find({})
      .where("isDisabled")
      .equals(false)
      .exec(function (err, securityQuestions) {
        //internal server error
        if (err) {
          console.log(err);
          const findAllMongoDBErrorResponse = new ErrorResponse(
            500,
            "Internal server error",
            err
          );
          res.status(500).send(findAllMongoDBErrorResponse.toObject());
        } else {
          //successful query response
          console.log(securityQuestions);
          const findAllResponse = new BaseResponse(
            200,
            "Query Successful",
            securityQuestions
          );
          res.json(findAllResponse.toObject());
        }
      });
  } catch (e) {
    //error response with server
    console.log(e);
    const findAllCatchErrorResponse = new ErrorResponse(
      500,
      "Internal server error",
      e.message
    );
    res.status(500).send(findAllCatchErrorResponse.toObject());
  }
});

// findById
/**
 * @openapi
 * /api/security/{id}:
 *   get:
 *     tags:
 *       - SecurityQuestions
 *     operationId: findById
 *     description: API to find the security questions.
 *     summary: Returns an object matching the object ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: Return a security question document.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 text:
 *                   type: string
 *                 isDisabled:
 *                   type: Boolean
 *       '400':
 *         description: Bad request.
 *       '404':
 *         description: Not found.
 *       '500':
 *         description: Server expectations.
 */
router.get("/:id", async (req, res) => {
  try {
    SecurityQuestion.findOne(
      { _id: req.params.id },
      (err, securityQuestion) => {
        if (err) {
          console.log(err);
          const findByIdMongodbErrorResponse = new ErrorResponse(
            500,
            "Internal server error",
            err
          );
          res.status(500).send(findByIdMongodbErrorResponse.toObject());
        } else {
          console.log(securityQuestion);
          const findByIdResponse = new BaseResponse(
            200,
            "Query successful",
            securityQuestion
          );
          res.json(findByIdResponse.toObject());
        }
      }
    );
  } catch (e) {
    console.log(e);
    const findByIdCatchErrorResponse = new ErrorResponse(
      500,
      "Internal server error",
      e.message
    );
    res.status(500).send(findByIdCatchErrorResponse.toObject());
  }
});

// createSecurityQuestion

/**
 * createSecurityQuestion
 * @openapi
 * /api/security:
 *   post:
 *     tags:
 *       - SecurityQuestions
 *     description: API that creates a new security question.
 *     summary: Creates a new new security question
 *     requestBody:
 *       description: Creates a new new security question
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       '200':
 *         description: New security question added to MongoDB
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Null Record
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */

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

// updateSecurityQuestions
/**
 * updateSecurityQuestions
 * @openapi
 * /api/security/{id}:
 *   put:
 *     tags:
 *       - SecurityQuestions
 *     description: API that updates security questions by id
 *     summary: Updates security questions
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: question id
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Creates a new new security question
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       '204':
 *         description: Question updated
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Not found
 */
router.put("/:id", async (req, res) => {
  try {
    SecurityQuestion.findOne(
      { _id: req.params.id },
      function (err, securityQuestion) {
        if (err) {
          //server error
          console.log(err);
          const updateSecurityQuestionMongodbErrorResponse = new ErrorResponse(500,
            "Internal server error",
            err
          );
          res
            .status(500)
            .send(updateSecurityQuestionMongodbErrorResponse.toObject());
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
              const savedSecurityQuestionMongodbErrorResponse =
                new ErrorResponse(500, "Internal server error", err);
              res
                .status(500)
                .send(savedSecurityQuestionMongodbErrorResponse.toObject());
            } else {
              //saving new security question
              console.log(savedSecurityQuestion);
              const savedSecurityQuestionResponse = new BaseResponse(
                200,
                "Query successful",
                savedSecurityQuestion
              );
              res.json(savedSecurityQuestionResponse.toObject());
            }
          });
        }
      }
    );
  } catch (e) {
    //server error
    console.log(e);
    const updateSecurityQuestionCatchErrorResponse = new ErrorResponse(
      500,
      "Internal server error",
      e.message
    );
    res.status(500).send(updateSecurityQuestionCatchErrorResponse.toObject());
  }
});

// deleteSecurity
router.delete("/:id", async (req, res) => {
  // find a security question by _id and delete it, or return an error message
  try {
    SecurityQuestion.findOne({'_id': req.params.id },function (err, securityQuestion) {
        if (err) {
          console.log(err);
          const deleteByIdMongoDBErrorResponse = new new ErrorResponse(500, "Internal server error", err);
          res.status(500).send(deleteByIdMongoDBErrorResponse.toObject());
        } else {
          console.log(securityQuestion)
          securityQuestion.set({
            isDisabled: true,
          });

          securityQuestion.save(function (err, savedSecurityQuestion) {
            if (err) {
              console.log(err);
              const savedSecurityQuestionMongoDBErrorResponse = ErrorResponse(500, "Internal server error", err);
              res.status(501).send(savedSecurityQuestionMongoDBErrorResponse.toObject());
            } else {
              console.log(savedSecurityQuestion);
              const deleteByIdResponse = new BaseResponse(200, "Query successful", savedSecurityQuestion);
              res.json(deleteByIdResponse.toObject());
            }
          });
        }
      }
    );
  } catch (e) {
    // internal Server Error
    console.log(e);
    const deleteSecurityQuestionCatchErrorResponse = new ErrorResponse(500, "Internal server error", err);
    res.status(500).send(deleteSecurityQuestionCatchErrorResponse.toObject());
  }
});
module.exports = router;
