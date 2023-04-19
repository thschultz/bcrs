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
const addFormats = require("ajv-formats");
const BaseResponse = require('../services/base-response');
const ErrorResponse = require('../services/error-response');

// Logging and Validation
const myFile = 'services-routes.js';
const ajv = new Ajv();
addFormats(ajv);

// Schema for validation
const serviceSchema = {
  type: 'object',
  properties: {
    serviceName: {type: 'string'},
    price: {type: 'number'}
  },
  required: ['serviceName', 'price'],
  additionalProperties: false
}

const serviceUpdateSchema = {
  type: 'object',
  properties: {
    serviceName: {type: 'string'},
    price: {type: 'number'},
    dateModified: {type: 'object'},

  },
  required: ['serviceName', 'price', 'dateModified'],
  additionalProperties: false
}


/**
 * @openapi
 * /api/services:
 *   get:
 *     tags:
 *       - Services
 *     name: findAllServices
 *     description: API to show all services
 *     summary: Find all services
 *     responses:
 *       '200':
 *         description: All services
 *       '500':
 *         description: Server Exception
 */

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


/**
 * findServiceById
 * @openapi
 * /api/services/{id}:
 *   get:
 *     tags:
 *       - Services
 *     description:  API for returning a service document
 *     summary: returns an service document
 *     parameters:
 *       - _id:
 *         in: path
 *         required: true
 *         description: Service ID
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Service document
 *       '500':
 *         description: Server exception
 */

// findServiceById
router.get("/:id", async (req, res) => {
  try {

    // Finds service by id
    Service.findOne({ _id: req.params.id }, function (err, service) {

      // Server error
      if (err) {
        console.log(err);
        const findByIdError = new ErrorResponse(500, "Internal server error", err);
        errorLogger({ filename: myFile, message: "Internal server error" });
        res.status(500).send(findByIdError.toObject());
        return
      }

      // Successful query
      console.log(service);
      const findByIdResponse = new BaseResponse(200, "Query Successful", service);
      debugLogger({ filename: myFile, message: service });
      res.json(findByIdResponse.toObject());
    })

  // Server error
  } catch (e) {
    console.log(e);
    const findByIdError = new ErrorResponse(500, "Internal server error", e);
    errorLogger({ filename: myFile, message: "Internal server error" });
    res.status(200).send(findByIdError.toObject());
  }
});


/**
 * createService
 * @openapi
 * /api/services:
 *   post:
 *     tags:
 *       - Services
 *     name: createService
 *     description: API for adding a new service document to MongoDB Atlas
 *     summary: Creates a new service document
 *     requestBody:
 *       description: Service information
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - serviceName
 *               - price
 *             properties:
 *                serviceName:
 *                   description: Name of service
 *                   type: string
 *                price:
 *                   description: Service price
 *                   type: number
 *     responses:
 *       '200':
 *         description: Service added
 *       '500':
 *         description: Server Exception
 */

// createService
router.post('/', async (req, res) => {
  try {

    // New service Object
    let newService = {
      serviceName: req.body.serviceName,
      price: req.body.price
    }

    // Checks current request body against the schema
    const validator = ajv.compile(serviceSchema);
    const valid = validator(newService)

    // If invalid return 400 Error
    if (!valid) {
      console.log('Bad Request, unable to validate');
      const createServiceError = new ErrorResponse(400, 'Bad Request, unable to validate', valid);
      errorLogger({ filename: myFile, message: "Bad Request, unable to validate" });
      res.status(400).send(createServiceError.toObject());
      return
    }

    // If valid, attempts tp create service
    Service.create(newService, function(err, service) {

      // Server error
      if (err) {
        console.log(err);
        const createServiceError = new ErrorResponse(500, 'Internal server error', e.message);
        errorLogger({ filename: myFile, message: "Internal server error" });
        res.status(500).send(createServiceError.toObject());
        return
      }

      // Successfully creates service
      console.log(service);
      const createServiceResponse = new BaseResponse(200, 'Service created', service);
      debugLogger({ filename: myFile, message: service });
      res.json(createServiceResponse.toObject());
    })

  // Server error
  } catch (e) {
    console.log(e);
    const createServiceError = new ErrorResponse(500, 'Internal server error', e.message);
    errorLogger({ filename: myFile, message: "Internal server error" });
    res.status(500).send(createServiceError.toObject());
  }
})


/**
 * updateServiceById
 * @openapi
 * /api/services/{id}:
 *   put:
 *     tags:
 *       - Services
 *     name: updateService
 *     description: API for updating an existing document in MongoDB.
 *     summary: Updates a document in MongoDB.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Id to filter the collection by.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Service information
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - serviceName
 *               - price
 *             properties:
 *               serviceName:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       '200':
 *         description: Updated service
 *       '500':
 *         description: Server Exception
 */

// updateService
router.put("/:id", async (req, res) => {
  try {

    // Finds Service by id
    Service.findOne({ _id: req.params.id }, function (err, service) {

      //server error
      if (err) {
        console.log(err);
        const updateError = new ErrorResponse(500, "Internal server error", err);
        errorLogger({ filename: myFile, message: "Internal server error" });
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

      // Checks current request body against the schema
      const validator = ajv.compile(serviceUpdateSchema);
      const valid = validator(service)

      // If invalid return 400 Error
      if (!valid) {
        console.log('Bad Request, unable to validate');
        const createServiceError = new ErrorResponse(400, 'Bad Request, unable to validate', valid);
        errorLogger({ filename: myFile, message: "Bad Request, unable to validate" });
        res.status(400).send(createServiceError.toObject());
        return
      }

      service.save(function (err, savedService) {

        // Server error if unable to updated the selected service
        if (err) {
          console.log(err);
          const savedError = new ErrorResponse(500, "Internal server error", err);
          errorLogger({ filename: myFile, message: "Internal server error" });
          res.status(500).send(savedError.toObject());
          return
        }

        // Successfully updates the service
        console.log(savedService);
        const savedServiceResponse = new BaseResponse(200, "Query successful", savedService);
        debugLogger({ filename: myFile, message: savedService });
        res.json(savedServiceResponse.toObject());
      })
    })

    //Server error
  } catch (e) {
    console.log(e);
    const updateServiceErrorResponse = new ErrorResponse(500, "Internal server error", e.message);
    errorLogger({ filename: myFile, message: "Internal server error" });
    res.status(500).send(updateServiceErrorResponse.toObject());
  }
});


/**
 * deleteServiceById
 * @openapi
 * /api/services/{id}:
 *   delete:
 *     tags:
 *       - Services
 *     name: deleteService
 *     description: API for deleting a document.
 *     summary: Sets the isDisabled status to true.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Id of the document to remove.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Service disabled
 *       '500':
 *         description: Server Exception
 */

// deleteService
router.delete('/:id', async (req, res) => {
  try {

    // finds Service by id
    Service.findOne({'_id': req.params.id}, function(err, service) {

      // Server error
      if (err) {
        console.log(err);
        const deleteServiceError = new ErrorResponse(500, 'Internal server error', err.message);
        errorLogger({ filename: myFile, message: "Internal server error" });
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
          errorLogger({ filename: myFile, message: "Internal server error" });
          res.json(500).send(savedServiceError.toObject());
          return
        }

        // Successfully saves the disabled status
        console.log(savedService);
        const savedServiceResponse = new BaseResponse(200, 'Successful Query', savedService);
        debugLogger({ filename: myFile, message: savedService });
        res.json(savedServiceResponse.toObject());
      })
    })

    // Server error
  } catch (e) {
    console.log(e);
    const deleteServiceError = new ErrorResponse(500, 'Internal server error',  e.message);
    errorLogger({ filename: myFile, message: "Internal server error" });
    res.status(500).send(deleteServiceError.toObject());
  }
})

module.exports = router;
