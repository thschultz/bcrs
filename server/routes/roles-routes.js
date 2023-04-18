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

// Logging and Validation
const myFile = 'roles-routes.js';
const ajv = new Ajv();


// findRolesUsers

// findRolesById

// createRole

// updateRole

// deleteRole


module.exports = router;
