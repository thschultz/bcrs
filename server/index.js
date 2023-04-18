/**
 * Title: index.js
 * Author: Richard Krasso
 * Contributors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/16/23
 * Last Modified by: Walter McCue
 * Last Modification Date: 04/16/23
 * Description: server set up for the bcrs project
*/

/**
 * Require statements
 */
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const createError = require('http-errors');

const UsersRoute = require('./routes/users-routes');
const RolesRoute = require('./routes/roles-routes');
const SecurityRoute = require('./routes/security-routes');
const ServicesRoute = require('./routes/services-routes');

const app = express(); // Express variable.

/**
 * App configurations.
 */
app.use(express.json());
app.use(express.urlencoded({'extended': true}));
app.use(express.static(path.join(__dirname, '../dist/bcrs')));
app.use('/', express.static(path.join(__dirname, '../dist/bcrs')));

// default server port value.
const PORT = process.env.PORT || 3000;

// TODO: This line will be replaced with your database connection string (including username/password).
const CONN = 'mongodb+srv://bcrs_user:s3cret@cluster0.7n1vnyo.mongodb.net/?retryWrites=true&w=majority';

/**
 * Database connection.
 */
mongoose.connect(CONN).then(() => {
  console.log('Connection to the database was successful');
}).catch(err => {
  console.log('MongoDB Error: ' + err.message);
});

// API request/response can be made through the corresponding route
app.use('/api/users', UsersRoute);
app.use('/api/security', SecurityRoute);
app.use('/api/roles', RolesRoute);
app.use('/api/services', ServicesRoute);

// Error handler for 404 errors
app.use(function(req, res, next) {
  next(createError(404))
})

// Error handler for other errors
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.send({
    type: 'error',
    status: err.status,
    message: err.message,
    stack: req.app.get('env') === 'development' ? err.stack : undefined

  })
})

// Wire-up the Express server.
app.listen(PORT, () => {
  console.log('Application started and listening on PORT: ' + PORT);
})
