/**
 * Title: user.js
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/17/23
 * Last Modified by: Jamal Damir
 * Last Modification Date: 04/17/23
 * Description: user model for the bcrs project
 */

// Require Statements
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userRoleSchema = require("../schemas/user-role");
const selectedSecurityQuestionSchema = require("../schemas/selected-security-question");

// Defining user schema
let userSchema = new Schema(
  {
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    phoneNumber: { type: String },
    address: { type: String },
    email: { type: String },
    isDisabled: { type: Boolean, default: false },
    role: userRoleSchema,
    selectedSecurityQuestionS: [selectedSecurityQuestionSchema],
    dateCreated: { type: Date, default: new Date() },
    dateModified: { type: Date },
  },
  { collection: "users" }
);

// Exports user schema
module.exports = mongoose.model("User", userSchema);
