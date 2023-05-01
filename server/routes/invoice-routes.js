/**
 * Title: invoice-routes.js
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 05/01/23
 * Last Modified by: Walter McCue
 * Last Modification Date: 05/01/23
 * Description: invoice api routing for the bcrs project
 */

// Require statements
const express = require("express");
const Invoice = require("../models/invoice");
const router = express.Router();
const { debugLogger, errorLogger } = require("../logs/logger");
const createError = require("http-errors");
const Ajv = require("ajv");
const BaseResponse = require("../services/base-response");
const ErrorResponse = require("../services/error-response");


// Logging and Validation
const myFile = "security-routes.js";
const ajv = new Ajv();

// Schema for  create and update validation
const invoiceSchema = {
  type: 'object',
  properties: {
    lineItems: {
      type: 'array',
      properties: {
        title: {type: 'string'},
        price: {type: 'number'},
      },
      additionalProperties: false,
      required: ['title', 'price']
    },
    partsAmount: {type: 'number'},
    priceAmount: {type: 'number'},
    laborAmount: {type: 'number'},
    lineItemTotal: {type: 'number'},
    total: {type: 'number'}
  },
  required: ['lineItems', 'partsAmount', 'priceAmount', 'laborAmount', 'lineItemTotal', 'total'],
  additionalProperties: false
}


/**
 * API: http://localhost:3000/api/invoices
 */


// createInvoice


//findPurchasesByService


module.exports = router;
