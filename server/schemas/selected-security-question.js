/**
 * Title: selected-security-questions.js
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/17/23
 * Last Modified by: Walter McCue
 * Last Modification Date: 04/17/23
 * Description: selected security questions schema for the bcrs project
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let selectedSecurityQuestionSchema = new Schema({
  questionText: { type: String },
  answerText: { type: String }
})

module.exports = selectedSecurityQuestionSchema;
