/**
 * Title: invoice-routes.js
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 05/01/23
 * Last Modified by: Carl Logan
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
const myFile = "invoice-routes.js";
const ajv = new Ajv();

// Schema for  create and update validation
const invoiceSchema = {
  type: "object",
  required: [
    "lineItems",
    "partsAmount",
    "laborAmount",
    "lineItemTotal",
    "total",
  ],
  additionalProperties: false,
  properties: {
    lineItems: {
      type: "array",
      additionalProperties: false,
      items: {
        type: "object",
        properties: {
          serviceName: { type: "string" },
          price: { type: "number" },
        },
        required: ["serviceName", "price"],
        additionalProperties: false,
      },
    },
    partsAmount: { type: "number" },
    laborAmount: { type: "number" },
    lineItemTotal: { type: "number" },
    total: { type: "number" },
  },
};

/**
 * API: http://localhost:3000/api/invoices
 */

// createInvoice

/**
 * createInvoice
 * @openapi
 * /api/invoices/{userName}:
 *   post:
 *     tags:
 *       - Invoices
 *     description: API that creates a new invoice
 *     summary: Creates a new invoice.
 *     parameters:
 *        - name: userName
 *          in: path
 *          required: true
 *          description: Username
 *          schema:
 *            type: string
 *     requestBody:
 *       description: Invoice data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lineItems
 *               - partsAmount
 *               - laborAmount
 *               - lineItemTotal
 *               - total
 *             properties:
 *               lineItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - serviceName
 *                     - price
 *                   properties:
 *                     serviceName:
 *                       type: string
 *                     price:
 *                       type: number
 *               partsAmount:
 *                 type: number
 *               laborAmount:
 *                 type: number
 *               lineItemTotal:
 *                 type: number
 *               total:
 *                 type: number
 *     responses:
 *       '200':
 *         description: Invoice successfully created
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Null record
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */

router.post("/:userName", async (req, res) => {
  try {
    const newInvoice = {
      userName: req.params.userName,
      lineItems: req.body.lineItems,
      partsAmount: req.body.partsAmount,
      laborAmount: req.body.laborAmount,
      lineItemTotal: req.body.lineItemTotal,
      total: req.body.total,
    };
    console.log(newInvoice);

    const validator = ajv.compile(invoiceSchema);
    const valid = validator(req.body);

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

    Invoice.create(newInvoice, function (err, invoice) {
      if (err) {
        console.log(err);
        const createInvoiceMongodbErrorResponse = new ErrorResponse(
          "500",
          "Internal server error",
          err
        );
        res.status(500).send(createInvoiceMongodbErrorResponse.toObject());
      } else {
        console.log(invoice);
        const createInvoiceResponse = new BaseResponse(
          "200",
          "Query successful",
          invoice
        );
        res.json(createInvoiceResponse.toObject());
      }
    });
  } catch (e) {
    console.log(e);
    const createInvoiceCatchErrorResponse = new ErrorResponse(
      "500",
      "Internal server error",
      e.message
    );
    res.status(500).send(createInvoiceCatchErrorResponse.toObject());
  }
});

//findPurchasesByService

/**
 * findPurchaseByService
 * @openapi
 * /api/invoices/purchases-graph:
 *   get:
 *     tags:
 *       - Invoices
 *     description:  API for finding purchase by service
 *     summary: view purchases by service
 *     responses:
 *       '200':
 *         description: Success
 *       '400':
 *         description: Bad Request route.params.id is not a number
 *       '404':
 *         description: Not Found
 *       '500':
 *         description: server error
 */
router.get("/purchases-graph", async (req, res) => {
  try {
    Invoice.aggregate(
      [
        {
          $unwind: "$lineItems",
        },
        {
          $group: {
            _id: {
              serviceName: "$lineItems.serviceName",
              price: "$lineItems.price",
            },
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            "_id.serviceName": 1,
          },
        },
      ],
      function (err, purchaseGraph) {
        if (err) {
          console.log(err);
          const findPurchaseByServiceGraphMongodbErrorResponse =
            new ErrorResponse("500", "Internal server error", err);
          res
            .status(500)
            .send(findPurchaseByServiceGraphMongodbErrorResponse.toObject());
        } else {
          console.log(purchaseGraph);
          const findPurchaseByServiceGraphResponse = new BaseResponse(
            "200",
            "Query successful",
            purchaseGraph
          );
          res.json(findPurchaseByServiceGraphResponse.toObject());
        }
      }
    );
  } catch (e) {
    console.log(e);
    const findPurchaseByServiceCatchErrorResponse = new ErrorResponse(
      "500",
      "Internal server error",
      e.message
    );
    res.status(500).send(findPurchaseByServiceCatchErrorResponse.toObject());
  }
});

module.exports = router;
