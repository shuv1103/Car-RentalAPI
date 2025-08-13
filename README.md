# Car Rental Backend API

A scalable backend system for a **Car Rental Platform** built with **Node.js**, **Express**, **MongoDB**, **BullMQ**, and **Redis**, designed for high performance, queue-based waitlist management, automated notifications, and secure image uploads using **AWS S3**.

---

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/car-rental-backend.git
   cd car-rental-backend

2. **Install dependencies**
   ```bash
   npm install

4. **Set up your .env file**
    ```bash
    PORT=5000
    MONGO_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    REDIS_URL=your_redis_url
    AWS_ACCESS_KEY_ID=your_aws_access_key
    AWS_SECRET_ACCESS_KEY=your_aws_secret
    S3_BUCKET_NAME=your_s3_bucket_name
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
- **Damage Check Workflow** — Images sent to the admin for verification; optionally integrated with AI damage detection.
- **AWS S3 Integration** — For secure, scalable car image storage.
- **Admin Notifications** — Email alerts for car returns and damage reports.

---

## Tech Stack

- **Backend Framework:** Node.js + Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Queue System:** BullMQ + Redis
- **File Storage:** AWS S3
- **Authentication:** JWT + Bcrypt.js
- **Email Service:** Nodemailer
- **Optional AI Service:** Deep learning model for damage detection

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

### **Car Return**
- Upload 4 mandatory images before confirming return
- Notify admin via email for verification
- Optional damage detection AI integration

---

## Email Notifications

The backend sends automated emails in these cases:
1. **Waitlist Turn** — User is notified when their waitlisted car is available.
2. **Waitlist Fallback** — User is notified when their waitlist request expires.
3. **Car Return** — Admin receives uploaded car images for inspection.
4. **Damage Detection** — Admin receives AI-detected damage report (if enabled).

---



   


