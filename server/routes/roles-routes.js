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


module.exports = router;
