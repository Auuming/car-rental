/**
 *  @swagger
 *  components:
 *    securitySchemes:
 *      bearerAuth:
 *        type: http
 *        scheme: bearer
 *        bearerFormat: JWT
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - name
 *          - telephone
 *          - email
 *          - password
 *        properties:
 *          id:
 *            type: string
 *            format: uuid
 *            description: The auto-generated id of the user
 *            example: d290f1ee-6c54-4b01-90e6-d701748f0851
 *          name:
 *            type: string
 *            description: User name
 *          telephone:
 *            type: string
 *            description: Telephone number
 *          email:
 *            type: string
 *            description: Email address
 *          password:
 *            type: string
 *            description: Password (min 6 characters)
 *          role:
 *            type: string
 *            enum: [user, admin]
 *            description: User role
 *            default: user
 *        example:
 *          name: John Doe
 *          telephone: 0812345678
 *          email: john@example.com
 *          password: password123
 *          role: user
 *      Login:
 *        type: object
 *        required:
 *          - email
 *          - password
 *        properties:
 *          email:
 *            type: string
 *            description: Email address
 *          password:
 *            type: string
 *            description: Password
 *        example:
 *          email: john@example.com
 *          password: password123
 *      ForgotPassword:
 *        type: object
 *        required:
 *          - email
 *        properties:
 *          email:
 *            type: string
 *            description: Email address
 *        example:
 *          email: john@example.com
 *      ResetPassword:
 *        type: object
 *        required:
 *          - password
 *        properties:
 *          password:
 *            type: string
 *            description: New password (min 6 characters)
 *        example:
 *          password: newpassword123
 *      AuthResponse:
 *        type: object
 *        properties:
 *          success:
 *            type: boolean
 *          token:
 *            type: string
 *            description: JWT token
 *          _id:
 *            type: string
 *          name:
 *            type: string
 *          email:
 *            type: string
 */
/**
 *  @swagger
 *  tags:
 *    name: Auth
 *    description: The authentication managing API
 */
/**
 *  @swagger
 *  /auth/register:
 *    post:
 *      summary: Register a new user
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      responses:
 *        200:
 *          description: User successfully registered
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/AuthResponse'
 *        400:
 *          description: Bad request - validation error
 */
/**
 *  @swagger
 *  /auth/login:
 *    post:
 *      summary: Login user
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Login'
 *      responses:
 *        200:
 *          description: User successfully logged in
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/AuthResponse'
 *        400:
 *          description: Invalid credentials
 *        401:
 *          description: Unauthorized
 */
/**
 *  @swagger
 *  /auth/me:
 *    get:
 *      summary: Get current logged in user
 *      tags: [Auth]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Current user information
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                  data:
 *                    $ref: '#/components/schemas/User'
 *        401:
 *          description: Not authorized
 */
/**
 *  @swagger
 *  /auth/logout:
 *    get:
 *      summary: Logout user
 *      tags: [Auth]
 *      responses:
 *        200:
 *          description: User successfully logged out
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                  data:
 *                    type: object
 */
/**
 *  @swagger
 *  /auth/forgotpassword:
 *    post:
 *      summary: Request password reset
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ForgotPassword'
 *      responses:
 *        200:
 *          description: Password reset email sent
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                  data:
 *                    type: string
 *                    example: Email sent
 *        400:
 *          description: Bad request
 *        404:
 *          description: User not found
 */
/**
 *  @swagger
 *  /auth/resetpassword/{resettoken}:
 *    put:
 *      summary: Reset password with token
 *      tags: [Auth]
 *      parameters:
 *        - in: path
 *          name: resettoken
 *          schema:
 *            type: string
 *          required: true
 *          description: Password reset token from email
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResetPassword'
 *      responses:
 *        200:
 *          description: Password successfully reset
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/AuthResponse'
 *        400:
 *          description: Invalid or expired token
 *        500:
 *          description: Server error
 */
/**
 *  @swagger
 *  /auth/favorites:
 *    get:
 *      summary: Get user's favorite rental car providers
 *      tags: [Auth]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: List of favorite rental car providers
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
 *                      $ref: '#/components/schemas/RentalCarProvider'
 *        401:
 *          description: Not authorized
 *        500:
 *          description: Server error
 */
/**
 *  @swagger
 *  /auth/favorites/{rentalCarProviderId}:
 *    post:
 *      summary: Add rental car provider to favorites
 *      tags: [Auth]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: rentalCarProviderId
 *          schema:
 *            type: string
 *          required: true
 *          description: The rental car provider id to add to favorites
 *      responses:
 *        200:
 *          description: Rental car provider added to favorites
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                  data:
 *                    type: array
 *                    items:
 *                      type: string
 *                      description: Array of favorite rental car provider IDs
 *        400:
 *          description: Already in favorites or bad request
 *        404:
 *          description: Rental car provider not found
 *        401:
 *          description: Not authorized
 *        500:
 *          description: Server error
 *    delete:
 *      summary: Remove rental car provider from favorites
 *      tags: [Auth]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: rentalCarProviderId
 *          schema:
 *            type: string
 *          required: true
 *          description: The rental car provider id to remove from favorites
 *      responses:
 *        200:
 *          description: Rental car provider removed from favorites
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                  data:
 *                    type: array
 *                    items:
 *                      type: string
 *                      description: Array of favorite rental car provider IDs
 *        400:
 *          description: Not in favorites or bad request
 *        401:
 *          description: Not authorized
 *        500:
 *          description: Server error
 */

const express = require('express');
const {register, login, getMe, logout, forgotPassword, resetPassword, addFavorite, removeFavorite, getFavorites} = require('../controllers/auth');

const router = express.Router();
const {protect} = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/logout',logout);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.get('/favorites', protect, getFavorites);
router.post('/favorites/:rentalCarProviderId', protect, addFavorite);
router.delete('/favorites/:rentalCarProviderId', protect, removeFavorite);

module.exports = router;