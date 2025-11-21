/**
 *  @swagger
 *  components:
 *    schemas:
 *      Booking:
 *        type: object
 *        required:
 *          - date
 *          - rentalCarProvider
 *        properties:
 *          id:
 *            type: string
 *            format: uuid
 *            description: The auto-generated id of the booking
 *            example: d290f1ee-6c54-4b01-90e6-d701748f0851
 *          date:
 *            type: string
 *            format: date-time
 *            description: Booking date
 *            example: 2024-12-25T10:00:00Z
 *          user:
 *            type: string
 *            description: User ID (auto-assigned from token)
 *          rentalCarProvider:
 *            type: string
 *            description: Rental car provider ID
 *          createdAt:
 *            type: string
 *            format: date-time
 *            description: Creation timestamp
 *        example:
 *          date: 2024-12-25T10:00:00Z
 *          rentalCarProvider: 609bda561452242d88d36e37
 *      BookingResponse:
 *        type: object
 *        properties:
 *          success:
 *            type: boolean
 *          count:
 *            type: number
 *            description: Number of bookings (for list responses)
 *          data:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/Booking'
 */
/**
 *  @swagger
 *  tags:
 *    name: Bookings
 *    description: The bookings managing API
 */
/**
 *  @swagger
 *  /bookings:
 *    get:
 *      summary: Returns the list of all bookings
 *      tags: [Bookings]
 *      security:
 *        - bearerAuth: []
 *      description: Regular users see only their bookings. Admins see all bookings.
 *      responses:
 *        200:
 *          description: The list of bookings
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                  count:
 *                    type: number
 *                  data:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Booking'
 *        401:
 *          description: Not authorized
 *        500:
 *          description: Server error
 */
/**
 *  @swagger
 *  /rentalCarProviders/{rentalCarProviderId}/bookings:
 *    post:
 *      summary: Create a new booking
 *      tags: [Bookings]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: rentalCarProviderId
 *          schema:
 *            type: string
 *          required: true
 *          description: The rental car provider id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - date
 *              properties:
 *                date:
 *                  type: string
 *                  format: date-time
 *                  description: Booking date
 *                  example: 2024-12-25T10:00:00Z
 *      responses:
 *        201:
 *          description: Booking successfully created
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                  data:
 *                    $ref: '#/components/schemas/Booking'
 *        400:
 *          description: Bad request - user already has 3 bookings or validation error
 *        404:
 *          description: Rental car provider not found
 *        500:
 *          description: Server error
 */
/**
 *  @swagger
 *  /bookings/{id}:
 *    get:
 *      summary: Get the booking by id
 *      tags: [Bookings]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: The booking id
 *      responses:
 *        200:
 *          description: The booking description by id
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                  data:
 *                    $ref: '#/components/schemas/Booking'
 *        404:
 *          description: The booking was not found
 *        500:
 *          description: Server error
 */
/**
 *  @swagger
 *  /bookings/{id}:
 *    put:
 *      summary: Update the booking by the id
 *      tags: [Bookings]
 *      security:
 *        - bearerAuth: []
 *      description: Users can only update their own bookings. Admins can update any booking.
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: The booking id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                date:
 *                  type: string
 *                  format: date-time
 *                  description: Booking date
 *                rentalCarProvider:
 *                  type: string
 *                  description: Rental car provider ID
 *      responses:
 *        200:
 *          description: The booking was updated
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                  data:
 *                    $ref: '#/components/schemas/Booking'
 *        401:
 *          description: Not authorized to update this booking
 *        404:
 *          description: The booking was not found
 *        500:
 *          description: Server error
 */
/**
 *  @swagger
 *  /bookings/{id}:
 *    delete:
 *      summary: Remove the booking by id
 *      tags: [Bookings]
 *      security:
 *        - bearerAuth: []
 *      description: Users can only delete their own bookings. Admins can delete any booking.
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: The booking id
 *      responses:
 *        200:
 *          description: The booking was deleted
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                  data:
 *                    type: object
 *        401:
 *          description: Not authorized to delete this booking
 *        404:
 *          description: The booking was not found
 *        500:
 *          description: Server error
 */

const express = require('express');
const { getBookings, getBooking, addBooking, updateBooking, deleteBooking } = require('../controllers/bookings');

const router = express.Router({mergeParams:true});

const {protect, authorize}= require('../middleware/auth');

router.route('/')
    .get(protect, getBookings)
    .post(protect, authorize('admin', 'user'), addBooking);
router.route('/:id')
    .get(protect, getBooking)
    .put(protect, authorize('admin', 'user'), updateBooking)
    .delete(protect, authorize('admin', 'user'), deleteBooking);

module.exports=router;

