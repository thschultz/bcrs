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


// Logging and Validation
const myFile = "security-routes.js";
const ajv = new Ajv();

// Schema for  create and update validation
const securitySchema = {
  type: 'object',
  properties: {
    text: {type: 'string'}
  },
  required: ['text'],
  additionalProperties: false
}


/**
 * API: http://localhost:3000/api/security
 */


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

// findAllSecurityQuestions
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
            404,
            "Bad request, path not found.",
            err
          );
          res.status(404).send(findAllMongoDBErrorResponse.toObject());
          errorLogger({ filename: myFile, message: "Bad request, path not found." });
        } else {
          //successful query response
          console.log(securityQuestions);
          const findAllResponse = new BaseResponse(
            200,
            "Query Successful",
            securityQuestions
          );
          res.json(findAllResponse.toObject());
          debugLogger({ filename: myFile, message: securityQuestions });
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
    errorLogger({ filename: myFile, message: "Internal server error" });
  }
});


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

// findById
router.get("/:id", async (req, res) => {
  try {
    // Find question by id from request parameter
    SecurityQuestion.findOne(
      { _id: req.params.id },
      (err, securityQuestion) => {
        // Internal server error
        if (err) {
          console.log(err);
          const findByIdMongodbErrorResponse = new ErrorResponse(
            404,
            "Bad request, invalid securityQuestionId",
            err
          );
          res.status(404).send(findByIdMongodbErrorResponse.toObject());
          errorLogger({ filename: myFile, message: "Bad request, invalid securityQuestionId" });
        } else {
          // Successful query response
          console.log(securityQuestion);
          const findByIdResponse = new BaseResponse(
            200,
            "Query successful",
            securityQuestion
          );
          res.json(findByIdResponse.toObject());
          debugLogger({ filename: myFile, message: securityQuestion });
        }
      }
    );
  } catch (e) {
    // Internal server error
    console.log(e);
    const findByIdCatchErrorResponse = new ErrorResponse(
      500,
      "Internal server error",
      e.message
    );
    res.status(500).send(findByIdCatchErrorResponse.toObject());
    errorLogger({ filename: myFile, message: "Internal server error" });
  }
});


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

// createSecurityQuestion
router.post("/", async (req, res) => {
  try {
    let newSecurityQuestion = req.body

    // Checks current request body against the schema
    const validator = ajv.compile(securitySchema);
    const valid = validator(newSecurityQuestion)

    // If invalid return 400 Error
    if (!valid) {
      console.log('Bad Request, unable to validate');
      const createServiceError = new ErrorResponse(400, 'Bad Request, unable to validate', valid);
      errorLogger({ filename: myFile, message: "Bad Request, unable to validate" });
      res.status(400).send(createServiceError.toObject());
      return
    }

    SecurityQuestion.create(
      newSecurityQuestion,
      function (err, securityQuestion) {

        if (err) {
          console.log(err);
          const createSecurityQuestionMongodbErrorResponse = new ErrorResponse(
            404,
            "Bad request, path not found.",
            err
          );
          res
            .status(404)
            .send(createSecurityQuestionMongodbErrorResponse.toObject());
            errorLogger({ filename: myFile, message: "Bad request, path not found." });
        } else {
          console.log(securityQuestion);
          const createSecurityQuestionResponse = new BaseResponse(
            200,
            "Query Successful",
            securityQuestion
          );
          res.json(createSecurityQuestionResponse.toObject());
          debugLogger({ filename: myFile, message: securityQuestion });
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
    errorLogger({ filename: myFile, message: "Internal server error" });
  }
});


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

// updateSecurityQuestion
router.put("/:id", async (req, res) => {
  try {

    let updateSecurityQuestion = req.body

    // Checks current request body against the schema
    const validator = ajv.compile(securitySchema);
    const valid = validator(updateSecurityQuestion)

    // If invalid return 400 Error
    if (!valid) {
      console.log('Bad Request, unable to validate');
      const createServiceError = new ErrorResponse(400, 'Bad Request, unable to validate', valid);
      errorLogger({ filename: myFile, message: "Bad Request, unable to validate" });
      res.status(400).send(createServiceError.toObject());
      return
    }

    SecurityQuestion.findOne(
      { _id: req.params.id },
      function (err, securityQuestion) {

        if (err) {
          //server error
          console.log(err);
          const updateSecurityQuestionMongodbErrorResponse = new ErrorResponse(404,
            "Bad request, securityQuestionId not valid",
            err
          );
          res
            .status(404)
            .send(updateSecurityQuestionMongodbErrorResponse.toObject());
            errorLogger({ filename: myFile, message: "Bad request, securityQuestionId not valid" });
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
                new ErrorResponse(404, "Bad request: id not found.", err);
              res
                .status(404)
                .send(savedSecurityQuestionMongodbErrorResponse.toObject());
                errorLogger({ filename: myFile, message: "Bad request: id not found." });
            } else {
              //saving new security question
              console.log(savedSecurityQuestion);
              const savedSecurityQuestionResponse = new BaseResponse(
                204,
                "Query successful",
                savedSecurityQuestion
              );
              res.json(savedSecurityQuestionResponse.toObject());
              debugLogger({ filename: myFile, message: savedSecurityQuestion });
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
    errorLogger({ filename: myFile, message: "Internal server error" });
  }
});

/**
 * deleteSecurityQuestionById
 * @openapi
 * /api/security/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     name: deleteSecurityQuestion
 *     description: API for deleting a document.
 *     summary: Sets the isDisabled status to true.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Id of the document to remove.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Service disabled
 *       '400':
 *         description: Bad Request
 *       '500':
 *         description: Server Exception
 */

// deleteSecurity
router.delete('/:id', async (req, res) => {
  // find a security question by _id and delete it, or return an error message
  try {
    SecurityQuestion.findOne({'_id': req.params.id },function (err, securityQuestion) {
        if (err) {
          console.log(err);
          const deleteByIdMongoDBErrorResponse = new new ErrorResponse(404, "Bad Request, securityQuestionId not valid", err);
          res.status(404).send(deleteByIdMongoDBErrorResponse.toObject());
          errorLogger({ filename: myFile, message: "Bad Request, securityQuestionId not valid" });
        } else {

          console.log(securityQuestion)
          securityQuestion.set({
            isDisabled: true,
          });

          securityQuestion.save(function (err, savedSecurityQuestion) {
            if (err) {
              console.log(err);
              const savedSecurityQuestionMongoDBErrorResponse = ErrorResponse(501, "Internal server error", err);
              res.status(501).send(savedSecurityQuestionMongoDBErrorResponse.toObject());
              errorLogger({ filename: myFile, message: "Internal server error" });

            } else {
              console.log(savedSecurityQuestion);
              const deleteByIdResponse = new BaseResponse(200, "Query successful", savedSecurityQuestion);
              res.json(deleteByIdResponse.toObject());
              debugLogger({ filename: myFile, message: savedSecurityQuestion });
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
    errorLogger({ filename: myFile, message: "Internal server error" });
  }
});

module.exports = router;
