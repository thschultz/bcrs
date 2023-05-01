/**
 * Title: invoice.js
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 05/01/23
 * Last Modified by: Walter McCue
 * Last Modification Date: 05/01/23
 * Description: invoice model for the bcrs project
 */

// require statements
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// import line item schema
const lineItemDocument = require("../schemas/line-item");

// defining invoice schema
const invoiceSchema = new Schema({
  userName: { type: String },
  lineItems: [lineItemDocument],
  partsAmount: { type: Number },
  laborAmount: { type: Number },
  lineItemTotal: { type: Number },
  total: { type: Number },
  orderDate: { type: Date, default: new Date() },
});

module.exports = mongoose.model("Invoice", invoiceSchema);
