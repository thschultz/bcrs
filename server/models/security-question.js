/**
 * Title: security.js
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/17/23
 * Last Modified by: Thomas Schultz
 * Last Modification Date: 04/22/23
 * Description: security question model for the bcrs project
 */

//require statements
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//defining security schema
let SecurityQuestionSchema = new Schema(
  {
    text: { type: String },
    isDisabled: { type: Boolean, default: false },
  },
  { collection: "security" }
);

module.exports = mongoose.model("SecurityQuestion", SecurityQuestionSchema);
