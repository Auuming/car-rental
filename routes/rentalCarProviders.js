/**
 *  @swagger
 *  components:
 *    schemas:
 *      RentalCarProvider:
 *        type: object
 *        required:
 *          - name
 *          - address
 *          - tel
 *        properties:
 *          id:
 *            type: string
 *            format: uuid
 *            description: The auto-generated id of the rental car provider
 *            example: d290f1ee-6c54-4b01-90e6-d701748f0851
 *          name:
 *            type: string
 *            description: Rental car provider name
 *          address:
 *            type: string
 *            description: Address
 *          tel:
 *            type: string
 *            description: telephone number
 *        example:
 *          id: 609bda561452242d88d36e37
 *          name: Happy Car Rental
 *          address: 121 Main Street
 *          tel: 02-2187000
 */
/**
 *  @swagger
 *  tags:
 *    name: RentalCarProviders
 *    description: The rental car providers managing API
 */
/**
 *  @swagger
 *  /rentalCarProviders:
 *    get:
 *      summary: Returns the list of all the rental car providers
 *      tags: [RentalCarProviders]
 *      responses:
 *        200:
 *          description: The list of the rental car providers
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/RentalCarProvider'
 */
/**
 *  @swagger
 *  /rentalCarProviders/{id}:
 *    get:
 *      summary: Get the rental car provider by id
 *      tags: [RentalCarProviders]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: The rental car provider id
 *      responses:
 *        200:
 *          description: The rental car provider description by id
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/RentalCarProvider'
 *        404:
 *          description: The rental car provider was not found
 */
/**
 *  @swagger
 *  /rentalCarProviders:
 *    post:
 *      summary: Create a new rental car provider
 *      tags: [RentalCarProviders]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/RentalCarProvider'
 *      responses:
 *        201:
 *          description: The rental car provider was successfully created
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/RentalCarProvider'
 *        500:
 *          description: Some server error
 */
/**
 *  @swagger
 *  /rentalCarProviders/{id}:
 *    put:
 *      summary: Update the rental car provider by the id
 *      tags: [RentalCarProviders]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: The rental car provider id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/RentalCarProvider'
 *      responses:
 *        200:
 *          description: The rental car provider was updated
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/RentalCarProvider'
 *        404:
 *          description: The rental car provider was not found
 *        500:
 *          description: Some error happened
 */
/**
 *  @swagger
 *  /rentalCarProviders/{id}:
 *    delete:
 *      summary: Remove the rental car provider by id
 *      tags: [RentalCarProviders]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: The rental car provider id
 * 
 *      responses:
 *        200:
 *          description: The rental car provider was deleted
 *        404:
 *          description: The rental car provider was not found
 */

const express = require("express");
const {
  getRentalCarProviders,
  getRentalCarProvider,
  createRentalCarProvider,
  updateRentalCarProvider,
  deleteRentalCarProvider,
} = require("../controllers/rentalCarProviders");

//Include other resource routers
const appointmentRouter = require("./appointments");

const router = express.Router();
const { protect, authorize } = require("../middleware/auth");

//Re-route into other resource routers
router.use("/:rentalCarProviderId/appointments/", appointmentRouter);

router
  .route("/")
  .get(getRentalCarProviders)
  .post(protect, authorize("admin"), createRentalCarProvider);
router
  .route("/:id")
  .get(getRentalCarProvider)
  .put(protect, authorize("admin"), updateRentalCarProvider)
  .delete(protect, authorize("admin"), deleteRentalCarProvider);

module.exports = router;

