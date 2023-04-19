/**
 * Title: services-routes.js
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/17/23
 * Last Modified by: Walter McCue
 * Last Modification Date: 04/17/23
 * Description: services api routing for the bcrs project
*/


// Require statements
const express = require('express');
const Service = require("../models/service");
const router = express.Router();
const { debugLogger, errorLogger } = require('../logs/logger');
const createError = require('http-errors');
const Ajv = require('ajv');
const BaseResponse = require('../services/base-response');
const ErrorResponse = require('../services/error-response');

// Logging and Validation
const myFile = 'services-routes.js';
const ajv = new Ajv();


// findAllServices
router.get("/", async (req, res) => {
  try {

    Service.find({})
      .where("isDisabled")
      .equals(false)
      .exec(function (err, services) {

        // Server Error
        if (err) {
          const findAllError = new ErrorResponse(500, "Internal server error", err.message);
          res.status(500).send(findAllError.toObject());
          errorLogger({ filename: myFile, message: "Internal server error" });
          return;
        }

        // Successful Query
        console.log(services);
        const findAllResponse = new BaseResponse(200, "Query Successful", services);
        debugLogger({ filename: myFile, message: services });
        res.json(findAllResponse.toObject());
      });

    //Server Error
  } catch (e) {
    const findAllError = new ErrorResponse(500, "Internal server error", e.message );
    res.status(500).send(findAllError.toObject());
    errorLogger({ filename: myFile, message: "Internal server error" });
  }
});


// findServiceById
router.get("/:id", async (req, res) => {
  try {

    // Finds service by id
    Service.findOne({ _id: req.params.id }, function (err, service) {

      // Server error
      if (err) {
        console.log(err);
        const findByIdError = new ErrorResponse(500, "Internal server error", err);
        res.status(500).send(findByIdError.toObject());
        return
      }

      // Successful query
      console.log(service);
      const findByIdResponse = new BaseResponse(200, "Query Successful", service);
      res.json(findByIdResponse.toObject());
    })

  // Server error
  } catch (e) {
    console.log(e);
    const findByIdError = new ErrorResponse(500, "Internal server error", e);
    res.status(200).send(findByIdError.toObject());
  }
});


// createService
router.post('/', async (req, res) => {
  try {

    // New service Object
    let newService = {
      serviceName: req.body.serviceName,
      price: req.body.price
    }

    Service.create(newService, function(err, service) {

      // Server error
      if (err) {
        console.log(err);
        const createServiceError = new ErrorResponse(500, 'Internal server error', e.message);
        res.status(500).send(createServiceError.toObject());
        return
      }

      // Successfully creates service
      console.log(service);
      const createServiceResponse = new BaseResponse(200, 'Service created', service);
      res.json(createServiceResponse.toObject());
    })

  // Server error
  } catch (e) {
    console.log(e);
    const createServiceError = new ErrorResponse(500, 'Internal server error', e.message);
    res.status(500).send(createServiceError.toObject());
  }
})


// updateService
router.put("/:id", async (req, res) => {
  try {

    // Finds Service by id
    Service.findOne({ _id: req.params.id }, function (err, service) {

      //server error
      if (err) {
        console.log(err);
        const updateError = new ErrorResponse(500, "Internal server error", err);
        res.status(500).send(updateError.toObject());
        return
      }

      // If service is found, sets the service fields to be updated
      console.log(service);
      service.set({
        serviceName: req.body.serviceName,
        price: req.body.price,
        dateModified: new Date(),
      });
      service.save(function (err, savedService) {

        // Server error if unable to updated the selected service
        if (err) {
          console.log(err);
          const savedError = new ErrorResponse(500, "Internal server error", err);
          res.status(500).send(savedError.toObject());
          return
        }

        // Successfully updates the service
        console.log(savedService);
        const savedServiceResponse = new BaseResponse(200, "Query successful", savedService);
        res.json(savedServiceResponse.toObject());
      })
    })

    //Server error
  } catch (e) {
    console.log(e);
    const updateServiceErrorResponse = new ErrorResponse(500, "Internal server error", e.message);
    res.status(500).send(updateServiceErrorResponse.toObject());
  }
});


// deleteService
router.delete('/:id', async (req, res) => {
  try {

    // finds Service by id
    Service.findOne({'_id': req.params.id}, function(err, service) {

      // Server error
      if (err) {
        console.log(err);
        const deleteServiceError = new ErrorResponse(500, 'Internal server error', err.message);
        res.status(500).send(deleteServiceError.toObject());
        return
      }

      // sets disabled status instead of deleting the record
      console.log(service);
      service.set({
        isDisabled: true,
        dateModified: new Date()
      });
      service.save(function(err, savedService) {

        // Server error if unable to save the disabled status
        if (err) {
          console.log(err);
          const savedServiceError = new ErrorResponse(500, 'Internal server Error', err);
          res.json(500).send(savedServiceError.toObject());
          return
        }

        // Successfully saves the disabled status
        console.log(savedService);
        const savedServiceResponse = new BaseResponse(200, 'Successful Query', savedService);
        res.json(savedServiceResponse.toObject());
      })
    })

    // Server error
  } catch (e) {
    console.log(e);
    const deleteServiceError = new ErrorResponse(500, 'Internal server error',  e.message);
    res.status(500).send(deleteServiceError.toObject());
  }
})

module.exports = router;
