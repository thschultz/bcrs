/**
 * Title: service.js
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/19/23
 * Last Modified by: Walter McCue
 * Last Modification Date: 04/1/23
 * Description: service model for the bcrs project
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let ServiceSchema = new Schema(
  {
    serviceName: { type: String },
    price: { type: Number },
    isDisabled: { type: Boolean, default: false },
    dateCreated: { type: Date, default: new Date() },
    dateModified: { type: Date },
  },
  { collection: "services" }
);

module.exports = mongoose.model("Service", ServiceSchema);
