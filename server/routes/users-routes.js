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
// const bcrypt = require('bcryptjs');
const BaseResponse = require("../services/base-response");
const ErrorResponse = require("../services/error-response");

// Logging and Validation
const myFile = "users-routes.js";
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
router.get("/", async (req, res) => {
  try {
    User.find({})
      .where("isDisabled")
      .equals(false)
      .exec(function (err, users) {
        // Server Error
        if (err) {
          const findAllError = new ErrorResponse(
            500,
            "Internal server error",
            err.message
          );
          res.status(500).send(findAllError.toObject());
          errorLogger({ filename: myFile, message: "Internal server error" });
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


// findUserById

router.get("/:id", async (req, res) => {
  try {
    User.findOne({ _id: req.params.id }, function (err, user) {
      if (err) {
        console.log(err);
        const findByIdMongodbErrorResponse = new ErrorResponse(
          500,
          "Internal server error",
          err
        );
        res.status(500).send(findByIdMongodbErrorResponse.toObject());
      } else {
        console.log(user);
        const findByIdResponse = new BaseResponse(
          200,
          "Query Successful",
          user
        );
        res.json(findByIdResponse.toObject());
      }
    });
  } catch (e) {
    console.log(e);
    const findByIdCatchErrorResponse = new ErrorResponse(
      500,
      "Internal server error",
      e
    );
    res.status(200).send(findByIdCatchErrorResponse.toObject());
  }
});


// createUser




// updateUser
router.put("/:id", async (req, res) => {
  try {
    User.findOne({ _id: req.params.id }, function (err, user) {
      if (err) {
        //server error
        console.log(err);
        const updateUserByIdMongodbErrorResponse = new ErrorResponse(
          500,
          "Internal server error",
          err
        );
        res.status(500).send(updateUserByIdMongodbErrorResponse.toObject());
      } else {
        //updating fields
        console.log(user);

        user.set({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phoneNumber: req.body.phoneNumber,
          address: req.body.address,
          email: req.body.email,
          "role.text": req.body.role,
          dateModified: new Date(),
        });
        //saving updating user function
        user.save(function (err, savedUser) {
          if (err) {
            //Server error
            console.log(err);
            const saveUserMongodbErrorResponse = new ErrorResponse(
              500,
              "Internal server error",
              err
            );
            res.status(500).send(saveUserMongodbErrorResponse.toObject());
          } else {
            //saving updated User
            console.log(savedUser);
            const saveUserResponse = new BaseResponse(
              200,
              "Query successful",
              savedUser
            );
            res.json(saveUserResponse.toObject());
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
  }
});


// deleteUser
router.delete('/:id', async (req, res) => {
  try {

    // finds User by Id
    User.findOne({'_id': req.params.id}, function(err, user) {

      // Server error
      if (err) {
        console.log(err);
        const deleteUserErrorResponse = new ErrorResponse(500, 'Internal server error', err.message);
        res.status(500).send(deleteUserErrorResponse.toObject());
        return
      }

      // sets disabled status instead of deleting the record
      console.log(user);
      user.set({
        isDisabled: true,
        dateModified: new Date()
      });
      user.save(function(err, savedUser) {

        // Server error if unable to save the disabled status
        if (err) {
          console.log(err);
          const savedUserErrorResponse = new ErrorResponse(500, 'Internal server Error', err);
          res.json(500).send(savedUserErrorResponse.toObject());
          return
        }

        // Successfully saves the disabled status
        console.log(savedUser);
        const savedUserResponse = new BaseResponse(200, 'Successful Query', savedUser);
        res.json(savedUserResponse.toObject());
      })
    })

    // Server error
  } catch (e) {
    console.log(e);
    const deleteUserErrorResponse = new ErrorResponse(500, 'Internal server error',  e.message);
    res.status(500).send(deleteUserErrorResponse.toObject());
  }
})




module.exports = router;
