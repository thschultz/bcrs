/**
 * Title: roles-routes.js
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/17/23
 * Last Modified by: Walter McCue
 * Last Modification Date: 04/17/23
 * Description: roles api routing for the bcrs project
*/


// Require statements
const express = require('express');

const router = express.Router();
const { debugLogger, errorLogger } = require('../logs/logger');
const createError = require('http-errors');
const Ajv = require('ajv');
const BaseResponse = require('../services/base-response');
const ErrorResponse = require('../services/error-response');
const User = require('../models/user');
const Role = require('../models/role');
const { async } = require('rxjs');

// Logging and Validation
const myFile = 'roles-routes.js';
const ajv = new Ajv();


// findRolesUsers

router.get('/', async (req, res) => {
  try {
    Role.find({})
      .where('isDisabled')
      .equals(false)
      .exec(function(err, roles)
  {
    if (err)
    {
      console.log(err);
      const findAllRolesMongodbErrorResponse = new ErrorResponse('500', 'Internal server error', err);
      res.status(500).send(findAllRolesMongodbErrorResponse.toObject());
    }
    else {
      console.log(roles);
      const findAllRolesResponse = new BaseResponse('200', 'Query successful', roles);
      res.json(findAllRolesResponse.toObject());
    }
  })
  }
  catch (e) {
    console.log(e);
    const findAllRolesCatchErrorResponse = new ErrorResponse('500', 'Internal server error', e.message);
    res.status(500).send(findAllRolesCatchErrorResponse.toObject());
  }
});


// findRolesById
router.get('/:roleId', async(req, res) => {
  try {
    Role.findOne({'_id': req.params.roleId}, function(err, role)
    {
      if (err)
      {
        console.log(err);
        const findRoleByIdMongodbErrorResponse = new ErrorResponse('500', 'Internal server error', err);
        res.status(500).send(findRoleByIdMongodbErrorResponse.toObject());
      }
      else
      {
        console.log(role);
        const findRoleByIdResponse = new BaseResponse('200', 'Query successful', role);
        res.json(findRoleByIdResponse.toObject());
      }
    })
  }
  catch (e)
  {
    console.log(e);
    const findRoleByIdCatchErrorResponse = new ErrorResponse('500', 'Internal server error', e.message);
    res.status(500).send(findRoleByIdCatchErrorResponse.toObject());
  }
})


// createRole
router.post('/', async(req, res) => {
  try {
    Role.findOne({'text': req.body.text}, (err, role) => {
      if(err) {
        console.log(err);
        const findRoleMongodbError = new ErrorResponse(500, 'Internal server error', err);
        res.status(500).send(findRoleMongodbError.toObject());
      }
      else {
        console.log(role);

        if(!role) {
          const newRole = {
            text: req.body.text
          }

          Role.create(newRole, (err, role) => {
            if(err) {
              console.log(err);
              const createRoleMongodbErrorResponse = new ErrorResponse(500, 'Internal server error', err);
              res.status(500).send(createRoleMongodbErrorResponse.toObject());
            }
            else {
              console.log(role);
              const createRoleResponse = new BaseResponse(200, 'Query successful', role);
              res.json(createRoleResponse.toObject());
            }
          })
        }
        else {
          console.log(`Role: ${req.body.text} already exists`);
          const roleAlreadyExists = new ErrorResponse(
            200, `Role: ${req.body.text} already exists.
            If you do not see the role in the list then it means it was denied.`
          );
          res.status(200).send(roleAlreadyExists.toObject());
        }
      }
    })
  }
  catch (e) {
    console.log(e);
    const createRoleCatchErrorResponse = new ErrorResponse(500, 'Internal server error', e.message);
    res.status(500).send(createRoleCatchErrorResponse.toObject());
  }
})


// updateRole
router.put('/:roleId', async(req, res) => {
  try {
    Role.findOne({'_id': req.params.roleId}, (err, role) => {
      if(err) {
        console.log(err);
        const updateRoleMongodbErrorResponse = new ErrorResponse(500, 'Internal server error', err);
        res.status(500).send(updateRoleMongodbErrorResponse.toObject());
      }
      else {
        console.log(role);

        role.set({
          text: req.body.text
        });

        role.save((err, updateRole) => {
          if(err) {
            console.log(err);
            const updatedRoleMongodbErrorResponse = new ErrorResponse(500, 'Internal server error', err);
            res.status(500).send(updatedRoleMongodbErrorResponse.toObject());
          }
          else {
            console.log(updateRole);
            const updatedRoleResponse = new BaseResponse(200, 'Query successful', updateRole);
            res.json(updatedRoleResponse.toObject());
          }
        });
      }
    });
  }
  catch(e) {
    console.log(e);
    const updateRoleCatchErrorResponse = new ErrorResponse(500, 'Internal server error', e.message);
    res.status(500).send(updateRoleCatchErrorResponse.toObject());
  }
})


// deleteRole
router.delete('/:roleId', async (req, res) => {
  try {

    // findOne function to find a role by Id
    Role.findOne({'_id': req.params.roleId}, function(err, role) {

      // If role is not found
      if (err) {
        console.log(err);
          const deleteRoleError = new ErrorResponse(404, 'Bad request, role not found', err);
          res.status(404).send(deleteRoleError.toObject());
          errorLogger({ filename: myFile, message: "Bad request, role not found" });
          return
      }

      // if Role is found
      console.log(role);

      // searches users for roles that match the currently requested role
      User.aggregate(
        [
          {
            $lookup: {
              from: 'roles',
              localField: 'role.text',
              foreignField: 'text',
              as: 'userRoles'
            }
          },
          {
            $match: {
              'userRoles.text': role.text
            }
          }
        ], function(err, users) {
          console.log(users);

          // if there is a server error
          if (err) {
            console.log(err);
            const deleteRoleError = new ErrorResponse(500, 'Internal server error', err);
            res.status(500).send(deleteRoleError.toObject());
            errorLogger({ filename: myFile, message: "Internal server error" });
            return
          }

          // if users have the role, returns an error
          if (users.length > 0) {
            console.log(`Role ${role.text} is already in use and cannot be deleted.`);
            const deleteRoleError = new ErrorResponse(501, `Role ${role.text} is already in use and cannot be deleted.`, role);
            res.status(501).send(deleteRoleError.toObject());
            errorLogger({ filename: myFile, message: `Role <${role.text}> is already in use and cannot be deleted.` });
            return
          }

          // if no users have the role, confirms that the role can be deleted
          console.log(`Role <${role.text}> is not in use and can be safely removed.`);
          role.set({isDisabled: true});

          role.save(function(err, updatedRole) {

            // Internal server error
            if (err) {
              const deleteRoleError = new ErrorResponse(500, 'Internal server error', err);
              res.status(500).send(deleteRoleError.toObject());
              errorLogger({ filename: myFile, message: "Internal server error" });
              return
            }

            // updates the role to disabled
            console.log(updatedRole);
            const updatedRoleResponse = new BaseResponse(200, `Role ${role.text} has been removed successfully.`, updatedRole);
            res.json(updatedRoleResponse.toObject());
            debugLogger({ filename: myFile, message: updatedRole });
          })
        }
      )
    })

  // Internal server errror
  } catch (e) {
    const deleteRoleError = new ErrorResponse(500, 'Internal server error', e.message);
    res.status(500).send(deleteRoleError.toObject());
    errorLogger({ filename: myFile, message: "Internal server error" });
  }
})

module.exports = router;
