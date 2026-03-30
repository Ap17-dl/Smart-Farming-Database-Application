## Smart Farming Management System

- A simple web-based system for managing farm activities such as farmer records, crop details, sales tracking, and sensor monitoring.

## Overview

The Smart Farming Management System is a full-stack web application designed to streamline and manage agricultural operations through a centralized digital platform. It enables efficient handling of farmer records, crop details, sales transactions, and real-time sensor data.
The system is built using a MySQL database integrated with a dynamic web interface. All data is stored and managed in the SQL database, and any changes made directly to the database—such as inserting, updating, or deleting records—are instantly reflected on the website. This ensures real-time synchronization between the backend and frontend without the need for manual updates.
By combining database-driven functionality with an interactive user interface, the application provides a reliable and scalable solution for modern farm management and data tracking.
Also download Node modules files and put in the folder before running.

## Features
1. Dashboard
--> Displays total farmers, crops, and sales
--> Shows overall revenue
--> Provides quick navigation
2. Farmer Management
--> Add, view, update, and delete farmers
--> Search by name or phone
3. Crop Management
--> Add crops with season details
--> View and manage crop records
4. Sales Management
--> Record sales entries
--> Automatic revenue calculation
--> View sales history
5. Sensor Data
--> Store and view sensor readings
--> Supports multiple sensor types

# Tech Stack
# Frontend
- Next.js
- React
- Tailwind CSS
# Backend
- Node.js
- Next.js API Routes
# Database
- MySQL
# Database Tables
- FARMER
- LAND
- CROP
- PLANTING
- SENSOR
- SENSOR_DATA
- MARKET
- SALE

# Setup Instructions
- Prerequisites
--> Node.js
--> MySQL
# Steps
1. Install dependencies
>> pnpm install
2. Configure environment variables
>> DB_HOST=localhost
>> DB_USER=root
>> DB_PASSWORD=your_password
>> DB_NAME=smart_farming
3. Create database
>> CREATE DATABASE smart_farming;
4. Run the project
>> npm run dev

# Revenue Calculation
--> Revenue = Quantity × Price

# Functionality
--> CRUD operations for farmers, crops, and sales
--> Search functionality
--> Basic analytics on dashboard
--> Data stored and retrieved using MySQL

# Notes
Designed for academic and learning purposes
Demonstrates database integration with a web application
Simple and easy-to-understand structure

# Author
ANKUSH PRATHAM
24BCE1937
