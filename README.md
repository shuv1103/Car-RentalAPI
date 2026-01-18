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



   


