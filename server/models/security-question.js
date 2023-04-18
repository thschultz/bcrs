/**
 * Title: security.js
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/17/23
 * Last Modified by: Walter McCue
 * Last Modification Date: 04/17/23
 * Description: security question model for the bcrs project
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let SecurityQuestionSchema = new Schema(
  {
    text: { type: String },
    isDisabled: { type: Boolean, default: false },
  },
  { collection: "security" }
);

module.exports = mongoose.model("SecurityQuestion", SecurityQuestionSchema);
