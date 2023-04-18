/**
 * Title: users-routes.js
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/17/23
 * Last Modified by: Walter McCue
 * Last Modification Date: 04/17/23
 * Description: users api routing for the bcrs project
*/


// Require statements
const express = require('express');
const User = require('../models/user');
const router = express.Router();
const { debugLogger, errorLogger } = require('../logs/logger');
const createError = require('http-errors');
const Ajv = require('ajv');
const BaseResponse = require('../models/base-response');
const ErrorResponse = require('../models/error-response');

// Logging and Validation
const myFile = 'users-routes.js';
const ajv = new Ajv();

// Schema for validation


// findAllUsers

// findUserById

// createUser

// updateUser

// deleteUser


module.exports = router;
