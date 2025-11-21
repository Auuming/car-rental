# API Request Examples (Non-Auth Endpoints)

Base URL: `http://localhost:5000/api/v1`

**Note:** Replace `YOUR_JWT_TOKEN` with your actual JWT token from login/register.
**Note:** Replace `PROVIDER_ID`, `BOOKING_ID`, etc. with actual IDs from your database.

---

## 1. Rental Car Providers Endpoints

### 1.1 Get All Rental Car Providers
**Public Endpoint** - No authentication required

```bash
curl -X GET http://localhost:5000/api/v1/rentalCarProviders
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "pagination": {
    "next": {
      "page": 2,
      "limit": 25
    }
  },
  "data": [
    {
      "_id": "609bda561452242d88d36e37",
      "name": "Happy Car Rental",
      "address": "121 Main Street",
      "tel": "02-2187000",
      "createdAt": "2024-01-15T10:00:00.000Z"
    },
    {
      "_id": "609bda561452242d88d36e38",
      "name": "Speed Rentals",
      "address": "456 Oak Avenue",
      "tel": "02-1234567",
      "createdAt": "2024-01-16T10:00:00.000Z"
    }
  ]
}
```

**With Query Parameters (pagination, sorting, filtering):**
```bash
curl -X GET "http://localhost:5000/api/v1/rentalCarProviders?page=1&limit=10&sort=name"
```

---

### 1.2 Get Single Rental Car Provider
**Public Endpoint** - No authentication required

```bash
curl -X GET http://localhost:5000/api/v1/rentalCarProviders/PROVIDER_ID
```

**Example:**
```bash
curl -X GET http://localhost:5000/api/v1/rentalCarProviders/609bda561452242d88d36e37
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "609bda561452242d88d36e37",
    "name": "Happy Car Rental",
    "address": "121 Main Street",
    "tel": "02-2187000",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### 1.3 Create Rental Car Provider
**Admin Only** - Requires authentication

```bash
curl -X POST http://localhost:5000/api/v1/rentalCarProviders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Premium Car Rentals",
    "address": "789 Park Boulevard",
    "tel": "02-9876543"
  }'
```

**Request Body:**
```json
{
  "name": "Premium Car Rentals",
  "address": "789 Park Boulevard",
  "tel": "02-9876543"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "609bda561452242d88d36e39",
    "name": "Premium Car Rentals",
    "address": "789 Park Boulevard",
    "tel": "02-9876543",
    "createdAt": "2024-01-20T10:00:00.000Z"
  }
}
```

---

### 1.4 Update Rental Car Provider
**Admin Only** - Requires authentication

```bash
curl -X PUT http://localhost:5000/api/v1/rentalCarProviders/PROVIDER_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Updated Car Rental Name",
    "address": "New Address",
    "tel": "02-1111111"
  }'
```

**Request Body:**
```json
{
  "name": "Updated Car Rental Name",
  "address": "New Address",
  "tel": "02-1111111"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "609bda561452242d88d36e37",
    "name": "Updated Car Rental Name",
    "address": "New Address",
    "tel": "02-1111111",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### 1.5 Delete Rental Car Provider
**Admin Only** - Requires authentication

```bash
curl -X DELETE http://localhost:5000/api/v1/rentalCarProviders/PROVIDER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Example:**
```bash
curl -X DELETE http://localhost:5000/api/v1/rentalCarProviders/609bda561452242d88d36e37 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {}
}
```

---

## 2. Bookings Endpoints

### 2.1 Get All Bookings
**Private Endpoint** - Requires authentication
- **Regular users:** See only their own bookings
- **Admins:** See all bookings

```bash
curl -X GET http://localhost:5000/api/v1/bookings \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (Regular User):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "609bda561452242d88d36e40",
      "date": "2024-12-25T10:00:00.000Z",
      "user": "609bda561452242d88d36e20",
      "rentalCarProvider": {
        "_id": "609bda561452242d88d36e37",
        "name": "Happy Car Rental",
        "address": "121 Main Street",
        "tel": "02-2187000"
      },
      "reminderSent": false,
      "createdAt": "2024-01-20T10:00:00.000Z"
    }
  ]
}
```

**Admin can also filter by rental car provider:**
```bash
curl -X GET "http://localhost:5000/api/v1/rentalCarProviders/PROVIDER_ID/bookings" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 2.2 Get Single Booking
**Private Endpoint** - Requires authentication

```bash
curl -X GET http://localhost:5000/api/v1/bookings/BOOKING_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Example:**
```bash
curl -X GET http://localhost:5000/api/v1/bookings/609bda561452242d88d36e40 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "609bda561452242d88d36e40",
    "date": "2024-12-25T10:00:00.000Z",
    "user": "609bda561452242d88d36e20",
    "rentalCarProvider": {
      "_id": "609bda561452242d88d36e37",
      "name": "Happy Car Rental",
      "address": "121 Main Street",
      "tel": "02-2187000"
    },
    "reminderSent": false,
    "createdAt": "2024-01-20T10:00:00.000Z"
  }
}
```

---

### 2.3 Create Booking
**Private Endpoint** - Requires authentication
- **Regular users:** Can create up to 3 bookings
- **Admins:** No limit

```bash
curl -X POST http://localhost:5000/api/v1/rentalCarProviders/PROVIDER_ID/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "date": "2024-12-25T10:00:00.000Z"
  }'
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/v1/rentalCarProviders/609bda561452242d88d36e37/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "date": "2024-12-25T10:00:00.000Z"
  }'
```

**Request Body:**
```json
{
  "date": "2024-12-25T10:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "609bda561452242d88d36e41",
    "date": "2024-12-25T10:00:00.000Z",
    "user": "609bda561452242d88d36e20",
    "rentalCarProvider": "609bda561452242d88d36e37",
    "reminderSent": false,
    "createdAt": "2024-01-20T10:00:00.000Z"
  }
}
```

**Error Response (if user already has 3 bookings):**
```json
{
  "success": false,
  "message": "The user with ID 609bda561452242d88d36e20 has already made 3 bookings"
}
```

---

### 2.4 Update Booking
**Private Endpoint** - Requires authentication
- **Regular users:** Can only update their own bookings
- **Admins:** Can update any booking

```bash
curl -X PUT http://localhost:5000/api/v1/bookings/BOOKING_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "date": "2024-12-26T14:00:00.000Z"
  }'
```

**Example:**
```bash
curl -X PUT http://localhost:5000/api/v1/bookings/609bda561452242d88d36e40 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "date": "2024-12-26T14:00:00.000Z"
  }'
```

**Request Body:**
```json
{
  "date": "2024-12-26T14:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "609bda561452242d88d36e40",
    "date": "2024-12-26T14:00:00.000Z",
    "user": "609bda561452242d88d36e20",
    "rentalCarProvider": "609bda561452242d88d36e37",
    "reminderSent": false,
    "createdAt": "2024-01-20T10:00:00.000Z"
  }
}
```

**Error Response (if user tries to update someone else's booking):**
```json
{
  "success": false,
  "message": "User 609bda561452242d88d36e20 is not authorized to update this booking"
}
```

---

### 2.5 Delete Booking
**Private Endpoint** - Requires authentication
- **Regular users:** Can only delete their own bookings
- **Admins:** Can delete any booking

```bash
curl -X DELETE http://localhost:5000/api/v1/bookings/BOOKING_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Example:**
```bash
curl -X DELETE http://localhost:5000/api/v1/bookings/609bda561452242d88d36e40 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {}
}
```

**Error Response (if user tries to delete someone else's booking):**
```json
{
  "success": false,
  "message": "User 609bda561452242d88d36e20 is not authorized to delete this booking"
}
```

---

## 3. Favorites Endpoints

### 3.1 Get User's Favorite Rental Car Providers
**Private Endpoint** - Requires authentication

```bash
curl -X GET http://localhost:5000/api/v1/auth/favorites \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "609bda561452242d88d36e37",
      "name": "Happy Car Rental",
      "address": "121 Main Street",
      "tel": "02-2187000"
    },
    {
      "_id": "609bda561452242d88d36e38",
      "name": "Speed Rentals",
      "address": "456 Oak Avenue",
      "tel": "02-1234567"
    }
  ]
}
```

**Empty Favorites Response:**
```json
{
  "success": true,
  "count": 0,
  "data": []
}
```

---

### 3.2 Add Rental Car Provider to Favorites
**Private Endpoint** - Requires authentication

```bash
curl -X POST http://localhost:5000/api/v1/auth/favorites/PROVIDER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/favorites/609bda561452242d88d36e37 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": [
    "609bda561452242d88d36e37",
    "609bda561452242d88d36e38"
  ]
}
```

**Error Response (Provider not found):**
```json
{
  "success": false,
  "msg": "Rental car provider not found"
}
```

**Error Response (Already in favorites):**
```json
{
  "success": false,
  "msg": "Rental car provider already in favorites"
}
```

---

### 3.3 Remove Rental Car Provider from Favorites
**Private Endpoint** - Requires authentication

```bash
curl -X DELETE http://localhost:5000/api/v1/auth/favorites/PROVIDER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Example:**
```bash
curl -X DELETE http://localhost:5000/api/v1/auth/favorites/609bda561452242d88d36e37 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": [
    "609bda561452242d88d36e38"
  ]
}
```

**Error Response (Not in favorites):**
```json
{
  "success": false,
  "msg": "Rental car provider not in favorites"
}
```

---

## Summary of Endpoints

### Rental Car Providers
| Method | Endpoint | Auth Required | Role Required |
|--------|----------|---------------|---------------|
| GET | `/api/v1/rentalCarProviders` | No | - |
| GET | `/api/v1/rentalCarProviders/:id` | No | - |
| POST | `/api/v1/rentalCarProviders` | Yes | Admin |
| PUT | `/api/v1/rentalCarProviders/:id` | Yes | Admin |
| DELETE | `/api/v1/rentalCarProviders/:id` | Yes | Admin |

### Bookings
| Method | Endpoint | Auth Required | Role Required |
|--------|----------|---------------|---------------|
| GET | `/api/v1/bookings` | Yes | User/Admin |
| GET | `/api/v1/bookings/:id` | Yes | User/Admin |
| POST | `/api/v1/rentalCarProviders/:id/bookings` | Yes | User/Admin |
| PUT | `/api/v1/bookings/:id` | Yes | User/Admin |
| DELETE | `/api/v1/bookings/:id` | Yes | User/Admin |

### Favorites
| Method | Endpoint | Auth Required | Role Required |
|--------|----------|---------------|---------------|
| GET | `/api/v1/auth/favorites` | Yes | User/Admin |
| POST | `/api/v1/auth/favorites/:rentalCarProviderId` | Yes | User/Admin |
| DELETE | `/api/v1/auth/favorites/:rentalCarProviderId` | Yes | User/Admin |

---

## Testing with Postman/Thunder Client

1. **Set Base URL:** `http://localhost:5000/api/v1`

2. **For authenticated requests:**
   - Go to Headers tab
   - Add header: `Authorization: Bearer YOUR_JWT_TOKEN`

3. **For POST/PUT requests:**
   - Set Content-Type: `application/json`
   - Add JSON body in Body tab

---

## Common Error Responses

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Not authorize to access this route"
}
```

**403 Forbidden (Wrong Role):**
```json
{
  "success": false,
  "message": "User role user is not authorized to access this route"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "No booking with the id of 609bda561452242d88d36e40"
}
```

**400 Bad Request:**
```json
{
  "success": false,
  "message": "The user with ID 609bda561452242d88d36e20 has already made 3 bookings"
}
```

