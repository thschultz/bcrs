/**
 * Title: roles-routes.js
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/17/23
 * Last Modified by: Walter McCue
 * Last Modification Date: 04/17/23
 * Description: roles api routing for the bcrs project
 */

// Require statements
const express = require("express");

const router = express.Router();
const { debugLogger, errorLogger } = require("../logs/logger");
const createError = require("http-errors");
const Ajv = require("ajv");
const BaseResponse = require("../services/base-response");
const ErrorResponse = require("../services/error-response");
const User = require("../models/user");
const Role = require("../models/role");
const { async } = require("rxjs");

// Logging and Validation
const myFile = "roles-routes.js";
const ajv = new Ajv();
// Schema for  create and update validation
const roleSchema = {
  type: 'object',
  properties: {
    text: {type: 'string'}
  },
  required: ['text'],
  additionalProperties: false
}


/**
 * API: http://localhost:3000/api/roles
 */


// findRolesUsers

/**
 * findRolesUsers
 * @openapi
 * /api/roles/:
 *   get:
 *     tags:
 *       - Roles
 *     description:  API for viewing User roles
 *     summary: view user roles
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
    Role.find({})
      .where("isDisabled")
      .equals(false)
      .exec(function (err, roles) {
        if (err) {
          console.log(err);
          const findAllRolesMongodbErrorResponse = new ErrorResponse(
            "500",
            "Internal server error",
            err
          );
          res.status(500).send(findAllRolesMongodbErrorResponse.toObject());
        } else {
          console.log(roles);
          const findAllRolesResponse = new BaseResponse(
            "200",
            "Query successful",
            roles
          );
          res.json(findAllRolesResponse.toObject());
        }
      });
  } catch (e) {
    console.log(e);
    const findAllRolesCatchErrorResponse = new ErrorResponse(
      "500",
      "Internal server error",
      e.message
    );
    res.status(500).send(findAllRolesCatchErrorResponse.toObject());
  }
});

// findRolesById

/**
 * findRoleById
 * @openapi
 * /api/roles/{roleId}/:
 *   get:
 *     tags:
 *       - Roles
 *     description: API that finds role by ID
 *     summary: Finds role by ID
 *     parameters:
 *       - name: roleId
 *         in: path
 *         required: true
 *         description: Role ID
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: success
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Not found
 *       '500':
 *         description: Server Error
 */
router.get("/:roleId", async (req, res) => {
  try {
    Role.findOne({ _id: req.params.roleId }, function (err, role) {
      if (err) {
        //server error
        console.log(err);
        const findRoleByIdMongodbErrorResponse = new ErrorResponse(
          "500",
          "Internal server error",
          err
        );
        res.status(500).send(findRoleByIdMongodbErrorResponse.toObject());
      } else {
        //successful query
        console.log(role);
        const findRoleByIdResponse = new BaseResponse(
          "200",
          "Query successful",
          role
        );
        res.json(findRoleByIdResponse.toObject());
      }
    });
  } catch (e) {
    console.log(e);
    //server error
    const findRoleByIdCatchErrorResponse = new ErrorResponse(
      "500",
      "Internal server error",
      e.message
    );
    res.status(500).send(findRoleByIdCatchErrorResponse.toObject());
  }
});

// createRole

/**
 * createRole
 * @openapi
 * /api/roles:
 *   post:
 *     tags:
 *       - Roles
 *     description: API that creates a new user role
 *     summary: Creates a new user role.
 *     requestBody:
 *       description: Role data
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
 *         description: Role successfully created
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Null record
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.post("/", async (req, res) => {
  try {

    let newRole = req.body

    // Checks current request body against the schema
    const validator = ajv.compile(roleSchema);
    const valid = validator(newRole)

    // If invalid return 400 Error
    if (!valid) {
      console.log('Bad Request, unable to validate');
      const createServiceError = new ErrorResponse(400, 'Bad Request, unable to validate', valid);
      errorLogger({ filename: myFile, message: "Bad Request, unable to validate" });
      res.status(400).send(createServiceError.toObject());
      return
    }

    Role.findOne({ text: req.body.text }, (err, role) => {
      if (err) {
        //server error
        console.log(err);
        const findRoleMongodbError = new ErrorResponse(
          500,
          "Internal server error",
          err
        );
        res.status(500).send(findRoleMongodbError.toObject());
      } else {
        console.log(role);

        if (!role) {
          const newRole = {
            text: req.body.text,
          };

          Role.create(newRole, (err, role) => {
            if (err) {
              //server error
              console.log(err);
              const createRoleMongodbErrorResponse = new ErrorResponse(
                500,
                "Internal server error",
                err
              );
              res.status(500).send(createRoleMongodbErrorResponse.toObject());
            } else {
              //successful query
              console.log(role);
              const createRoleResponse = new BaseResponse(
                200,
                "Query successful",
                role
              );
              res.json(createRoleResponse.toObject());
            }
          });
        } else {
          //error response on existing role
          console.log(`Role: ${req.body.text} already exists`);
          const roleAlreadyExists = new ErrorResponse(
            200,
            `Role: ${req.body.text} already exists.
            If you do not see the role in the list then it means it was denied.`
          );
          res.status(200).send(roleAlreadyExists.toObject());
        }
      }
    });
  } catch (e) {
    console.log(e);
    //server error
    const createRoleCatchErrorResponse = new ErrorResponse(
      500,
      "Internal server error",
      e.message
    );
    res.status(500).send(createRoleCatchErrorResponse.toObject());
  }
});

// updateRole
/**
 * updateRole
 * @openapi
 * /api/roles/{roleId}/:
 *   put:
 *     tags:
 *       - Roles
 *     description: API that updates the user role
 *     summary: updates user role
 *     parameters:
 *       - name: roleId
 *         in: path
 *         required: true
 *         description: Role ID
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Role data
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
 *         description: Role updated
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Employee not found
 *       '500':
 *         description: Server Exception
 */
router.put("/:roleId", async (req, res) => {
  try {

    let updateRole = req.body

    // Checks current request body against the schema
    const validator = ajv.compile(roleSchema);
    const valid = validator(updateRole)

    // If invalid return 400 Error
    if (!valid) {
      console.log('Bad Request, unable to validate');
      const createServiceError = new ErrorResponse(400, 'Bad Request, unable to validate', valid);
      errorLogger({ filename: myFile, message: "Bad Request, unable to validate" });
      res.status(400).send(createServiceError.toObject());
      return
    }

    Role.findOne({ _id: req.params.roleId }, (err, role) => {
      if (err) {
        console.log(err);
        const updateRoleMongodbErrorResponse = new ErrorResponse(
          500,
          "Internal server error",
          err
        );
        res.status(500).send(updateRoleMongodbErrorResponse.toObject());
      } else {
        console.log(role);

        role.set({
          text: req.body.text,
        });

        role.save((err, updateRole) => {
          if (err) {
            console.log(err);
            const updatedRoleMongodbErrorResponse = new ErrorResponse(
              500,
              "Internal server error",
              err
            );
            res.status(500).send(updatedRoleMongodbErrorResponse.toObject());
          } else {
            console.log(updateRole);
            const updatedRoleResponse = new BaseResponse(
              200,
              "Query successful",
              updateRole
            );
            res.json(updatedRoleResponse.toObject());
          }
        });
      }
    });
  } catch (e) {
    console.log(e);
    const updateRoleCatchErrorResponse = new ErrorResponse(
      500,
      "Internal server error",
      e.message
    );
    res.status(500).send(updateRoleCatchErrorResponse.toObject());
  }
});

// deleteRole
/**
 * deleteRole
 * @openapi
 * /api/roles/{roleId}/:
 *   delete:
 *     tags:
 *       - Roles
 *     description: API that delete the user role
 *     summary: Deletes user role
 *     parameters:
 *       - name: roleId
 *         in: path
 *         required: true
 *         description: Role ID
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Role Deleted
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Not found
 *       '500':
 *         description: Server Error
 */
router.delete("/:roleId", async (req, res) => {
  try {
    // findOne function to find a role by Id
    Role.findOne({ _id: req.params.roleId }, function (err, role) {

      // If role is not found
      if (err) {
        console.log(err);
        const deleteRoleError = new ErrorResponse(
          404,
          "Bad request, role not found",
          err
        );
        res.status(404).send(deleteRoleError.toObject());
        errorLogger({
          filename: myFile,
          message: "Bad request, role not found",
        });
        return;
      }

      // if Role is found
      console.log(role);

      // searches users for roles that match the currently requested role
      User.aggregate(
        [
          {
            $lookup: {
              from: "roles",
              localField: "role.text",
              foreignField: "text",
              as: "userRoles",
            },
          },
          {
            $match: {
              "userRoles.text": role.text,
            },
          },
        ],
        function (err, users) {
          console.log(users);

          // if there is a server error
          if (err) {
            console.log(err);
            const deleteRoleError = new ErrorResponse(
              500,
              "Internal server error",
              err
            );
            res.status(500).send(deleteRoleError.toObject());
            errorLogger({ filename: myFile, message: "Internal server error" });
            return;
          }

          // if users have the role, returns an error
          if (users.length > 0) {
            console.log(
              `Role ${role.text} is already in use and cannot be deleted.`
            );
            const deleteRoleError = new ErrorResponse(
              501,
              `Role ${role.text} is already in use and cannot be deleted.`,
              role
            );
            res.status(501).send(deleteRoleError.toObject());
            errorLogger({
              filename: myFile,
              message: `Role <${role.text}> is already in use and cannot be deleted.`,
            });
            return;
          }

          // if no users have the role, confirms that the role can be deleted
          console.log(
            `Role <${role.text}> is not in use and can be safely removed.`
          );
          role.set({ isDisabled: true });

          role.save(function (err, updatedRole) {
            // Internal server error
            if (err) {
              const deleteRoleError = new ErrorResponse(
                500,
                "Internal server error",
                err
              );
              res.status(500).send(deleteRoleError.toObject());
              errorLogger({
                filename: myFile,
                message: "Internal server error",
              });
              return;
            }

            // updates the role to disabled
            console.log(updatedRole);
            const updatedRoleResponse = new BaseResponse(
              200,
              `Role ${role.text} has been removed successfully.`,
              updatedRole
            );
            res.json(updatedRoleResponse.toObject());
            debugLogger({ filename: myFile, message: updatedRole });
          });
        }
      );
    });
  // Internal server errror
  } catch (e) {
    const deleteRoleError = new ErrorResponse(
      500,
      "Internal server error",
      e.message
    );
    res.status(500).send(deleteRoleError.toObject());
    errorLogger({ filename: myFile, message: "Internal server error" });
  }
});

module.exports = router;
