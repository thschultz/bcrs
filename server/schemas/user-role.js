/**
 * Title: user-role.js
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/17/23
 * Last Modified by: Walter McCue
 * Last Modification Date: 04/18/23 by Thomas Schultz
 * Description: user roles schema for the bcrs project
*/

//require statements
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//define user role schema
let userRoleSchema = new Schema({
  text: {type: String, default: 'standard'}
})

module.exports = userRoleSchema;
