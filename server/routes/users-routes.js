/**
 * Title: users-routes.js
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/17/23
 * Last Modified by: Walter McCue
 * Last Modification Date: 04/19/23
 * Description: users api routing for the bcrs project
 */

// Require statements
const express = require("express");
const User = require("../models/user");
const router = express.Router();
const { debugLogger, errorLogger } = require("../logs/logger");
const createError = require("http-errors");
const Ajv = require("ajv");
const bcrypt = require("bcryptjs");
const BaseResponse = require("../services/base-response");
const ErrorResponse = require("../services/error-response");

// Logging and Validation
const myFile = "users-routes.js";
const ajv = new Ajv();
const saltRounds = 10; // hashes password

// Schema for  create validation
const userSchema = {
  type: "object",
  properties: {
    userName: { type: "string" },
    password: { type: "string" },
    firstName: { type: "string" },
    lastName: { type: "string" },
    phoneNumber: { type: "string" },
    address: { type: "string" },
    email: { type: "string" },
  },
  required: [
    "userName",
    "password",
    "firstName",
    "lastName",
    "phoneNumber",
    "address",
    "email",
  ],
  additionalProperties: false,
};

const updateUserSchema = {
  type: "object",
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
    phoneNumber: { type: "string" },
    address: { type: "string" },
    email: { type: "string" },
    /*role: {
      type: 'object',
      properties: {
        text: {type: 'string'}
      },
      required: ['text'],
      additionalProperties: false
    }*/
  },
  required: [
    "firstName",
    "lastName",
    "phoneNumber",
    "address",
    "email" /*, 'role'*/,
  ],
  additionalProperties: false,
};

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
router.get("/", async (req, res) => {
  try {
    User.find({})
      .where("isDisabled")
      .equals(false)
      .exec(function (err, users) {
        // Server Error
        if (err) {
          const findAllError = new ErrorResponse(
            404,
            "Bad request, path not found.",
            err.message
          );
          res.status(404).send(findAllError.toObject());
          errorLogger({
            filename: myFile,
            message: "Bad request, path not found.",
          });
          return;
        }

        // Successful Query
        console.log(users);
        const findAllResponse = new BaseResponse(
          200,
          "Query Successful",
          users
        );
        debugLogger({ filename: myFile, message: users });
        res.json(findAllResponse.toObject());
      });

    //Server Error
  } catch (e) {
    const findAllError = new ErrorResponse(
      500,
      "Internal server error",
      e.message
    );
    res.status(500).send(findAllError.toObject());
    errorLogger({ filename: myFile, message: "Internal server error" });
  }
});

/**
 * findUserById
 * @openapi
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     description:  API that returns user by ID
 *     summary: returns user by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User document
 *       '401':
 *         description: Invalid invalid user ID
 *       '500':
 *         description: Server exception
 *       '501':
 *         description: MongoDB exception
 */

// findUserById
router.get("/:id", async (req, res) => {
  try {
    User.findOne({ _id: req.params.id }, function (err, user) {
      if (err) {
        console.log(err);
        const findByIdMongodbErrorResponse = new ErrorResponse(
          404,
          "Bad request, invalid UserId",
          err
        );
        res.status(404).send(findByIdMongodbErrorResponse.toObject());
        errorLogger({
          filename: myFile,
          message: "Bad request, invalid UserId",
        });
      } else {
        console.log(user);
        const findByIdResponse = new BaseResponse(
          200,
          "Query Successful",
          user
        );
        res.json(findByIdResponse.toObject());
        debugLogger({ filename: myFile, message: user });
      }
    });
  } catch (e) {
    console.log(e);
    const findByIdCatchErrorResponse = new ErrorResponse(
      500,
      "Internal server error",
      e
    );
    res.status(500).send(findByIdCatchErrorResponse.toObject());
    errorLogger({ filename: myFile, message: "Internal server error" });
  }
});

/**
 * createUser
 * @openapi
 * /api/users:
 *   post:
 *     tags:
 *       - Users
 *     description: API that creates a new user
 *     summary: Creates a new user
 *     requestBody:
 *       description: Creates a new user
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - text
 *             properties:
 *               userName:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               address:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       '200':
 *         description: New user added to MongoDB
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Null Record
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */

// createUser
router.post("/", async (req, res) => {
  try {
    let hashedPassword = bcrypt.hashSync(req.body.password, saltRounds); // salt/hash the password

    standardRole = {
      text: "standard",
    };

    // user object
    let newUser = req.body;

    // Checks current request body against the schema
    const validator = ajv.compile(userSchema);
    const valid = validator(newUser);

    // If invalid return 400 Error
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
    createUser = {
      userName: newUser.userName,
      password: hashedPassword,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      phoneNumber: newUser.phoneNumber,
      address: newUser.address,
      email: newUser.email,
      role: standardRole,
    };
    User.create(createUser, function (err, user) {
      if (err) {
        console.log(err);
        const createUserMongodbErrorResponse = new ErrorResponse(
          404,
          "Bad request, please ensure request meets requirements.",
          err
        );
        res.status(404).send(createUserMongodbErrorResponse.toObject());
        errorLogger({
          filename: myFile,
          message: "Bad request, please ensure request meets requirements.",
        });
      } else {
        console.log(user);
        const CreateUserResponse = new BaseResponse(
          200,
          "Query successful",
          user
        );
        res.json(CreateUserResponse.toObject());
        debugLogger({ filename: myFile, message: user });
      }
    });
  } catch (e) {
    console.log(e);
    const createUserCatchErrorResponse = ErrorResponse(
      500,
      "Internal server error",
      e.message
    );
    res.status(500).send(createUserCatchErrorResponse.toObject());
    errorLogger({ filename: myFile, message: "Internal server error" });
  }
});

/**
 * updateUser
 * @openapi
 * /api/users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     description: API that updates users
 *     summary: Updates Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type:
 *     requestBody:
 *       description: Update user
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - text
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               address:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       '204':
 *         description: User updated
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: User not found
 */

// updateUser
router.put("/:id", async (req, res) => {
  try {
    let updatedUser = req.body;

    // Checks current request body against the schema
    const validator = ajv.compile(updateUserSchema);
    const valid = validator(updatedUser);

    // If invalid return 400 Error
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

    User.findOne({ _id: req.params.id }, function (err, user) {
      if (err) {
        //server error
        console.log(err);
        const updateUserByIdMongodbErrorResponse = new ErrorResponse(
          404,
          "Bad request, id not found",
          err
        );
        errorLogger({ filename: myFile, message: "Bad request, id not found" });
        res.status(404).send(updateUserByIdMongodbErrorResponse.toObject());
      } else {
        //updating fields
        console.log(user);

        user.set({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phoneNumber: req.body.phoneNumber,
          address: req.body.address,
          email: req.body.email,
          role: req.body.role,
          dateModified: new Date(),
        });
        //saving updating user function
        user.save(function (err, savedUser) {
          if (err) {
            //Server error
            console.log(err);
            const saveUserMongodbErrorResponse = new ErrorResponse(
              501,
              "Bad request, please ensure request meets requirements",
              err
            );
            res.status(501).send(saveUserMongodbErrorResponse.toObject());
            errorLogger({
              filename: myFile,
              message: "Bad request, please ensure request meets requirements",
            });
          } else {
            //saving updated User
            console.log(savedUser);
            const saveUserResponse = new BaseResponse(
              204,
              "Query successful",
              savedUser
            );
            res.json(saveUserResponse.toObject());
            debugLogger({ filename: myFile, message: user });
          }
        });
      }
    });
    //Server error
  } catch (e) {
    console.log(e);
    const updateUserByIdCatchErrorResponse = new ErrorResponse(
      500,
      "Internal server error",
      e.message
    );
    res.status(500).send(updateUserByIdCatchErrorResponse.toObject());
    errorLogger({ filename: myFile, message: "Internal server error" });
  }
});

/**
 * deleteUserById
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     name: deleteUser
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

// deleteUser
router.delete("/:id", async (req, res) => {
  try {
    // finds User by id
    User.findOne({ _id: req.params.id }, function (err, user) {
      // Server error
      if (err) {
        console.log(err);
        const deleteUserErrorResponse = new ErrorResponse(
          404,
          "Bad request, invalid UserId",
          err.message
        );
        res.status(404).send(deleteUserErrorResponse.toObject());
        errorLogger({
          filename: myFile,
          message: "Bad request, invalid UserId",
        });
        return;
      }

      // sets disabled status instead of deleting the record
      console.log(user);
      user.set({
        isDisabled: true,
        dateModified: new Date(),
      });
      user.save(function (err, savedUser) {
        // Server error if unable to save the disabled status
        if (err) {
          console.log(err);
          const savedUserErrorResponse = new ErrorResponse(
            501,
            "Bad request, unable to update record",
            err
          );
          res.json(501).send(savedUserErrorResponse.toObject());
          errorLogger({
            filename: myFile,
            message: "Bad request, unable to update record",
          });
          return;
        }

        // Successfully saves the disabled status
        console.log(savedUser);
        const savedUserResponse = new BaseResponse(
          204,
          "Successful Query",
          savedUser
        );
        res.json(savedUserResponse.toObject());
        debugLogger({ filename: myFile, message: savedUser });
      });
    });

    // Server error
  } catch (e) {
    console.log(e);
    const deleteUserErrorResponse = new ErrorResponse(
      500,
      "Internal server error",
      e.message
    );
    res.status(500).send(deleteUserErrorResponse.toObject());
    errorLogger({ filename: myFile, message: "Internal server error" });
  }
});

// FindSelectedSecurityQuestions

/**
 * FindSelectedSecurityQuestions
 * @openapi
 * /api/users/{userName}/security-questions:
 *   get:
 *     tags:
 *       - Users
 *     description: API that finds security questions by userName
 *     summary:  Finds Selected Security Questions by username
 *     parameters:
 *        - name: userName
 *          in: path
 *          required: true
 *          description: Username
 *          schema:
 *            type: string
 *     responses:
 *       '200':
 *         description: Query successful
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Null Record
 *       '500':
 *         description: Server Exception
 */

router.get("/:userName/security-questions", async (req, res) => {
  try {
    User.findOne({ userName: req.params.userName }, function (err, user) {
      //error handling if server can't save.
      if (err) {
        console.log(err);
        const findSelectedSecurityQuestionsMongodbErrorResponse =
          new ErrorResponse(404, "Bad request, invalid path.", err);
        res
          .status(404)
          .send(findSelectedSecurityQuestionsMongodbErrorResponse.toObject());
      } else {
        //successful save
        console.log(user);
        const findSelectedSecurityQuestionResponse = new BaseResponse(
          "200",
          "Query Successful",
          user.selectedSecurityQuestions
        );
        res.json(findSelectedSecurityQuestionResponse.toObject());
      }
    });
  } catch (e) {
    //server error
    console.log(e);
    const findSelectedSecurityQuestionsCatchErrorResponse = new ErrorResponse(
      "500",
      "Internal server error",
      e
    );
    res
      .status(500)
      .send(findSelectedSecurityQuestionsCatchErrorResponse.toObject());
  }
});

module.exports = router;
