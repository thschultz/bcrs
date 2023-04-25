/**
 * Title: role.js
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/24/23
 * Last Modified by: Walter McCue
 * Last Modification Date: 04/24/23
 * Description: role model for the bcrs project
 */

//require statements
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//defining security schema
let RoleSchema = new Schema(
  {
    text: { type: String },
    isDisabled: { type: Boolean, default: false },
  },
  { collection: "roles" }
);

module.exports = mongoose.model("Role", RoleSchema);
