# 🎬 Amharic Screenplay Writing App

## 📖 Overview

This is a full-stack web application that allows users to write and manage screenplays in the Amharic language. Built using Laravel, React, Inertia.js, and MongoDB, the app provides a modern development experience with a seamless bridge between backend and frontend.

---

## 🛠 Built With

- **Laravel** – PHP backend framework  
- **React** – Frontend JavaScript library  
- **Inertia.js** – Middleware that connects Laravel and React  
- **MongoDB** – NoSQL database for flexible document storage  

---

## 🚀 Getting Started

Follow the instructions below to run the project on your local development environment.

---

### 🔧 Prerequisites

Make sure the following tools are installed:

- [Git](https://git-scm.com/downloads)  
- [PHP >= 8.0](https://www.php.net/)  
- [Composer](https://getcomposer.org/)  
- [Node.js & npm](https://nodejs.org/)  
- [MongoDB Community Server](https://www.mongodb.com/try/download/community)  
  - During setup, include **MongoDB Compass** (GUI)  
- **MongoDB PHP Extension** (`mongodb.dll` for Windows)  
  - Ensure it’s enabled in your `php.ini` file  

---

## 📥 Clone the Repository

```bash
git clone https://github.com/Firaol-Qannoo/Amharic_Screenplay_writing_app.git
cd Amharic_Screenplay_writing_app



Project Setup
Install backend dependencies:

composer install


Install frontend dependencies:

npm install


Copy the environment file and generate app key:

cp .env.example .env
php artisan key:generate


Configure Environment Variables
Open the .env file and add or update the following values:

MongoDB Configuration

DB_CONNECTION=mongodb
DB_HOST=127.0.0.1
DB_PORT=27017
DB_DATABASE=amharicScreenplay
DB_USERNAME=
DB_PASSWORD=

If your MongoDB instance doesn’t require authentication locally, leave DB_USERNAME and DB_PASSWORD empty.

Email Configuration
To enable email sending features (like password resets and notifications), add the following settings:

MAIL_MAILER=smtp
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USERNAME=your_email@example.com
MAIL_PASSWORD=your_email_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your_email@example.com
MAIL_FROM_NAME="${APP_NAME}"

Note: These email credentials are personal and private. We cannot share them publicly or commit them to the repo. You must get your own credentials from your email provider.

How to Get Email Credentials
Mailtrap (for testing): Create a free account at mailtrap.io, create an inbox, and use the SMTP details provided.
Gmail: If you use Gmail with 2FA enabled, generate an App Password for SMTP.
Other providers (SendGrid, Outlook, etc.): Refer to their documentation for SMTP credentials.

Final Steps
Clear and cache your config:

php artisan config:clear
php artisan config:cache
Run the Laravel development server:

php artisan serve


Run the React frontend development server:

npm run dev