# AutoLease - Car Rental Backend System

A scalable backend system for a **Car Rental Platform** built with **Node.js**, **Express**, **MongoDB**, **BullMQ**, and **Redis**, designed for high performance booking system, queue-based waitlist management, automated email-notifications, and secure payment integration*.

---

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Car-RentalAPI.git
   cd car-rental-api

2. **Install dependencies**
   ```bash
   npm install

4. **Set up your .env file**
    ```bash
   PORT=8000
   MONGODB_URI=your_mongodb_uri_here
   CORS_ORIGIN=*
   ACCESS_TOKEN_SECRET=your_access_token_secret_here
   ACCESS_TOKEN_EXPIRY=40m
   REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
   REFRESH_TOKEN_EXPIRY=10d
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password

6. **Start the server**
   ```bash
   npm run dev

## Features

- **Car Management** — Add, update, and manage cars with availability tracking.
- **User Management** — Secure authentication and role-based access control.
- **Booking System** — Rent cars with real-time availability checks.
- **Waitlist Mechanism** — Automatic queue management using **BullMQ** when cars are unavailable.
- **Email Notifications** — Automatic emails when a waitlisted user's turn comes or fallback triggers.
- **Car Return Process** — Requires uploading 4 images (front, back, left, right) before confirming return.
- **Payment Integration** - Secured online-payments using Razorpay with order creation, payment verification & booking status updates.
- **Admin Notifications** — Email alerts for car returns.

---

## Tech Stack

- **Backend Framework:** Node.js + Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Queue System:** BullMQ + Redis
- **Authentication:** JWT + Bcrypt.js
- **Email Service:** Nodemailer
- **Payment Service:** Razorpay

---

## Database Schema

<img width="1123" height="634" alt="image" src="https://github.com/user-attachments/assets/907649e4-a907-43d5-b8a0-34e248b35794" />

---

## API Modules

### **Authentication**
- Register new users
- Login and issue Access/Refresh tokens
- Secure password hashing

### **Car Management**
- Add, update, or delete car listings
- Manage availability and rental status

### **Booking**
- Check car availability
- Rent cars instantly if available
- Join waitlist when cars are unavailable

### **Waitlist Management**
- Queue users for unavailable cars
- Automatic notification when a car becomes available
- Fallback logic if a user doesn’t respond in time

### **Email Notifications**

The backend sends automated emails in these cases:
1. **Waitlist Turn** — User is notified when their waitlisted car is available.
2. **Waitlist Fallback** — User is notified when their waitlist request expires.
3. **Car Return** — Admin receives uploaded car images for inspection.

---

## System Architecture Diagram
_____
<img width="906" height="389" alt="image" src="https://github.com/user-attachments/assets/e99f6ede-c31f-470b-959b-8cd422f2bfcf" />

### **Architecture Layers**
#### 1. Client Layer
- Frontend application or Postman sends HTTP requests to the backend.

#### 2. API & Security Layer
- **Express Server(API Gateway)** receives all incoming requests.
- **JWT Authentication & RBAC Middleware** validates user identity and access permissions.

#### 3. Controller Layer
- Responsible for request routing and response handling:
  - `UserController`
  - `CarController`
  - `PaymentController`

#### 4. Service Layer
- Contains all core business logic:
  - `UserService` – user management and profile handling
  - `CarService` – car availability, booking logic
  - `WaitlistService` – waitlist orchestration and async processing
  - `PaymentService` – payment flow and booking confirmation
  - `EmailService` – notification handling

#### 5. Repository Layer
- Abstracts database operations and isolates persistence logic:
  - `UserRepository`
  - `CarRepository`
  - `BookingRepository`

#### 6. Data & Messaging Layer
- **MongoDB** – persistent storage for users, cars, and bookings
- **Redis (ZSET)** – efficient waitlist management
- **BullMQ** – background job processing for waitlist notifications

#### 7. External Integrations
- **Razorpay** – payment creation and verification
- **Nodemailer** – email notifications (booking confirmation & waitlist alerts)



### End-to-End Backend Workflow
1. User sends an HTTP request via frontend/Postman.
2. API Gateway forwards the request through JWT Auth Middleware.
3. Authorized requests are routed to the appropriate controller.
4. Controllers delegate business logic to service classes.
5. Services interact with repositories for database operations.
6. If a car is unavailable, users are added to a Redis waitlist and processed asynchronously using BullMQ.
7. Payments are handled via Razorpay and booking data is persisted in MongoDB.
8. Email notifications are sent via SMTP for confirmations and waitlist updates.


## API Reference

---

### Register User 

```http
POST /api/v1/users/register
```
| Parameter  | Type     | Description                  |
| :--------- | :------- | :--------------------------- |
| `name`     | `string` |  Full name(**Required**.) |
| `email`    | `string` |  Email(**Required**.)     |
| `password` | `string` |  Password(**Required**.)  |
| `role`     | `string` | Role - "User" or "Admin" (**Required**.)      |

**Description** -
Registers a new user by validating inputs, hashing the password using bcrypt, and storing the user securely in the database.

### Request
___________
<img width="490" height="312" alt="image" src="https://github.com/user-attachments/assets/78cb551a-6b53-44a0-9df4-b170c3b2b6a0" />

### Response
____
<img width="555" height="401" alt="image" src="https://github.com/user-attachments/assets/156d5dca-517d-4523-8686-051e5333deee" />

### Login User

```http
POST /api/v1/users/login
```

| Parameter  | Type     | Description              |
| :--------- | :------- | :----------------------- |
| `email`    | `string` | Email (**Required**.)    |
| `password` | `string` | Password (**Required**.) |

**Description** -
Authenticates an existing user by validating credentials, securely comparing the hashed password using bcrypt, and generating a JWT token for authorized access to protected APIs.

### Request
___________
<img width="491" height="261" alt="image" src="https://github.com/user-attachments/assets/ba49d75e-c4c9-4932-9bdf-c3b35b17e7d2" />

### Response
____
<img width="604" height="479" alt="image" src="https://github.com/user-attachments/assets/547f4d98-d238-43b2-bb54-562e9f90ae24" />

###  Get User Details by ID

```http
GET /api/v1/users/{id}
```

| Parameter | Type     | Description             |
| :-------- | :------- | :---------------------- |
| `id`      | `string` | User ID (**Required**.) |

**Description** –
- Retrieves user details using the user ID provided as a path parameter. 
- The request is authorized using a JWT token, and sensitive fields such as passwords are excluded from the response.

## Request
- **Path Parameter** : id – User ID (e.g., HK0X)
- **Headers** - Authorization: Bearer <JWT_TOKEN>
<img width="893" height="159" alt="image" src="https://github.com/user-attachments/assets/ae052dc6-366f-466e-a134-d5a98a015711" />

## Response
_______
<img width="430" height="344" alt="image" src="https://github.com/user-attachments/assets/fc3165e7-a656-4c7f-a689-ab4bc7112338" />

###  Get User Details by Email (Admin Only)

```http
GET /api/v1/users/
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email`   | `string` | User email (**Required**.) |


**Description** –
- Fetches user details using the email address provided in the request body.
- This endpoint is restricted to Admin users only and is protected using JWT authentication with role-based access control.

## Request
- **Headers** - Authorization: Bearer <JWT_TOKEN>
<img width="490" height="238" alt="image" src="https://github.com/user-attachments/assets/93dc2950-2ccb-4727-9d45-6e3f94b44fbb" />

## Response 
___
<img width="1030" height="494" alt="image" src="https://github.com/user-attachments/assets/e8f4120e-c468-4857-9af7-703cef74680e" />


### Logout User

```http
POST /api/v1/users/logout
```

| Parameter | Type | Description     |
| :-------- | :--- | :-------------- |
| —         | —    | No request body |

**Description** –
- Clears accessToken and refreshToken cookies from the client.
- Prevents further access to protected APIs after logout.

## Request
- **Headers** - Authorization: Bearer <JWT_TOKEN>
<img width="461" height="58" alt="image" src="https://github.com/user-attachments/assets/c2bc0cd0-56d7-4210-99ea-21b723b1f1f6" />

## Response
____
<img width="425" height="146" alt="image" src="https://github.com/user-attachments/assets/fb60c9b1-f831-4e2d-a211-c88a79a4c461" />

###  Add Car to Inventory (Admin Only)

```http
POST /api/v1/cars
```

| Parameter      | Type     | Description                                             |
| :------------- | :------- | :------------------------------------------------------ |
| `manufacturer` | `string` | Car manufacturer (**Required**.)                        |
| `model`        | `string` | Car model name (**Required**.)                          |
| `year`         | `string` | Manufacturing year (**Required**.)                      |
| `pricePerDay`  | `string` | Rental price per day (**Required**.)                    |
| `count`        | `string` | Number of cars available for this model (**Required**.) |


**Description** –
- Adds a new car to the system with manufacturer details, model information, pricing, and available stock count. 
- This endpoint is restricted to Admin users only and is secured using JWT authentication with role-based access control.

## Request
____
<img width="420" height="333" alt="image" src="https://github.com/user-attachments/assets/49281cde-90c1-4caf-8d40-1ee119c4fe3d" />

## Response
____
<img width="479" height="483" alt="image" src="https://github.com/user-attachments/assets/abe0cd9f-7d0e-4844-9491-142f87633177" />


###  Rent Car(User/Admin)

```http
POST /api/v1/cars/{carId}/rent
```

| Parameter   | Type                  | Description                       |
| :---------- | :-------------------- | :-------------------------------- |
| `carId`     | `string`              | Car ID (**Required**.)            |
| `email`     | `string`              | User email (**Required**.)        |
| `startDate` | `string (YYYY-MM-DD)` | Rental start date (**Required**.) |
| `endDate`   | `string (YYYY-MM-DD)` | Rental end date (**Required**.)   |

**Description** –
- Allows a user to rent a car for a specified date range. The system checks car availability, validates booking dates, and creates a booking record.
- If the car is unavailable, the user is added to a waitlist for asynchronous processing.

## Request
____
<img width="493" height="289" alt="image" src="https://github.com/user-attachments/assets/bbf48a6e-ab25-496c-ac21-0da2e0137387" />

## Response
____
<img width="818" height="545" alt="image" src="https://github.com/user-attachments/assets/9a67dfab-2754-4c84-a672-591f2f1ca9b0" />




