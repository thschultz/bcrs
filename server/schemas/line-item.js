/**
 * Title: line-item.js
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 05/01/23
 * Last Modified by: Walter McCue
 * Last Modification Date: 05/01/23
 * Description: line-item schema for the bcrs project
*/

//require statements
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// line item schema
const lineItemSchema = new Schema({
  serviceName: { type: String },
  price: { type: Number }
});

module.exports = lineItemSchema;
