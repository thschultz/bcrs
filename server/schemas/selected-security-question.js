/**
 * Title: selected-security-questions.js
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/17/23
 * Last Modified by: Thomas Schultz
 * Last Modification Date: 04/22/23
 * Description: selected security questions schema for the bcrs project
 */

//required statements
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//define selected security questions schema
let selectedSecurityQuestionSchema = new Schema({
  questionText: { type: String },
  answerText: { type: String }
})

module.exports = selectedSecurityQuestionSchema;
