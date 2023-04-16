/**
 * Title: logger.js
 * Author: Richard Krasso
 * Contributors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/15/23
 * Last Modified by: Walter McCue
 * Last Modification Date: 04/15/23
 * Description: logging for the bcrs project
*/

// Require statements
const { appendFileSync } =require('fs');
const { join } = require('path');

// Directory for logging
const debugLog = join(__dirname, 'debug.log')
const errorLog = join(__dirname, 'error.log')

// Function to collect date/time
const getDateTime = () => {
  const now = new Date()
  return now.toLocaleString('en-US')
}

// Successful operations are logged to the debug.log
module.exports.debugLogger = (data) => {
  const logString = `[${getDateTime()}] server\t ${data.filename} - ${data.message}\n`
  appendFileSync(debugLog, logString)
}

// Errors are logged to the error.log
module.exports.errorLogger = (data) => {
  const logString = `[${getDateTime()}] server\t ${data.filename} - ${data.message}\n`
  appendFileSync(errorLog, logString)
}
