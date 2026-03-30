-- Smart Farming Management System Database Schema
CREATE DATABASE IF NOT EXISTS smart_farming_dbms;
USE smart_farming_dbms;

-- Farmer Table
CREATE TABLE IF NOT EXISTS farmer (
  FarmerID INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(100) NOT NULL,
  Phone VARCHAR(20),
  Address VARCHAR(255)
);

-- Land Table
CREATE TABLE IF NOT EXISTS land (
  LandID INT AUTO_INCREMENT PRIMARY KEY,
  Location VARCHAR(255),
  Area DECIMAL(10, 2),
  SoilType VARCHAR(100),
  FarmerID INT,
  FOREIGN KEY (FarmerID) REFERENCES farmer(FarmerID) ON DELETE CASCADE
);

-- Crop Table
CREATE TABLE IF NOT EXISTS crop (
  CropID INT AUTO_INCREMENT PRIMARY KEY,
  CropName VARCHAR(100) NOT NULL,
  Season VARCHAR(50),
  Duration INT COMMENT 'Duration in days'
);

-- Planting Table
CREATE TABLE IF NOT EXISTS planting (
  PlantingID INT AUTO_INCREMENT PRIMARY KEY,
  Date DATE,
  LandID INT,
  CropID INT,
  FOREIGN KEY (LandID) REFERENCES land(LandID) ON DELETE CASCADE,
  FOREIGN KEY (CropID) REFERENCES crop(CropID) ON DELETE CASCADE
);

-- Sensor Table
CREATE TABLE IF NOT EXISTS sensor (
  SensorID INT AUTO_INCREMENT PRIMARY KEY,
  SensorType VARCHAR(100),
  LandID INT,
  FOREIGN KEY (LandID) REFERENCES land(LandID) ON DELETE CASCADE
);

-- Sensor Data Table
CREATE TABLE IF NOT EXISTS sensor_data (
  DataID INT AUTO_INCREMENT PRIMARY KEY,
  Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  Value DECIMAL(10, 2),
  SensorID INT,
  FOREIGN KEY (SensorID) REFERENCES sensor(SensorID) ON DELETE CASCADE
);

-- Market Table
CREATE TABLE IF NOT EXISTS market (
  MarketID INT AUTO_INCREMENT PRIMARY KEY,
  MarketName VARCHAR(100) NOT NULL,
  Location VARCHAR(255)
);

-- Sale Table
CREATE TABLE IF NOT EXISTS sale (
  SaleID INT AUTO_INCREMENT PRIMARY KEY,
  Date DATE,
  Quantity DECIMAL(10, 2),
  Price DECIMAL(10, 2),
  CropID INT,
  MarketID INT,
  FOREIGN KEY (CropID) REFERENCES crop(CropID) ON DELETE CASCADE,
  FOREIGN KEY (MarketID) REFERENCES market(MarketID) ON DELETE CASCADE
);


-- Farmers
INSERT INTO farmer (Name, Phone, Address) VALUES
('Rajesh Kumar', '9876543210', 'Village Ramnagar, Uttar Pradesh'),
('Anita Sharma', '9123456789', 'Village Sundarpur, Punjab'),
('Mohammad Ali', '9988776655', 'Village Greenfield, Haryana'),
('Priya Patel', '9871234567', 'Village Chandanpur, Gujarat'),
('Suresh Yadav', '9765432100', 'Village Lakshmipur, Madhya Pradesh');

-- Land
INSERT INTO land (Location, Area, SoilType, FarmerID) VALUES
('Plot A, Ramnagar', 5.50, 'Alluvial', 1),
('Plot B, Ramnagar', 3.25, 'Clay', 1),
('Field 1, Sundarpur', 8.00, 'Loamy', 2),
('Field 2, Greenfield', 6.75, 'Sandy', 3),
('Plot C, Chandanpur', 4.00, 'Black Soil', 4),
('Plot D, Lakshmipur', 7.50, 'Red Soil', 5);

-- Crops
INSERT INTO crop (CropName, Season, Duration) VALUES
('Rice', 'Kharif', 120),
('Wheat', 'Rabi', 150),
('Sugarcane', 'Kharif', 365),
('Cotton', 'Kharif', 180),
('Mustard', 'Rabi', 110),
('Maize', 'Kharif', 100);

-- Planting
INSERT INTO planting (Date, LandID, CropID) VALUES
('2025-06-15', 1, 1),
('2025-11-01', 2, 2),
('2025-06-20', 3, 3),
('2025-07-01', 4, 4),
('2025-10-15', 5, 5),
('2025-06-25', 6, 6);

-- Sensors
INSERT INTO sensor (SensorType, LandID) VALUES
('Temperature', 1),
('Humidity', 1),
('Soil Moisture', 2),
('Temperature', 3),
('pH Sensor', 4),
('Soil Moisture', 5),
('Humidity', 6);

-- Sensor Data
INSERT INTO sensor_data (Timestamp, Value, SensorID) VALUES
('2025-07-01 08:00:00', 32.5, 1),
('2025-07-01 08:00:00', 78.2, 2),
('2025-07-01 08:00:00', 45.0, 3),
('2025-07-01 12:00:00', 35.1, 1),
('2025-07-01 12:00:00', 65.8, 2),
('2025-07-01 12:00:00', 42.3, 3),
('2025-07-02 08:00:00', 30.2, 4),
('2025-07-02 08:00:00', 6.8, 5),
('2025-07-02 08:00:00', 50.1, 6),
('2025-07-02 12:00:00', 33.7, 4),
('2025-07-02 12:00:00', 7.1, 5),
('2025-07-02 12:00:00', 48.5, 6),
('2025-07-03 08:00:00', 29.8, 1),
('2025-07-03 08:00:00', 80.5, 2),
('2025-07-03 08:00:00', 55.0, 7);

-- Markets
INSERT INTO market (MarketName, Location) VALUES
('Krishi Mandi', 'Lucknow, UP'),
('Anaj Mandi', 'Amritsar, Punjab'),
('Sabzi Mandi', 'Delhi'),
('Kisan Bazaar', 'Ahmedabad, Gujarat');

-- Sales
INSERT INTO sale (Date, Quantity, Price, CropID, MarketID) VALUES
('2025-10-15', 500, 22.50, 1, 1),
('2025-10-20', 300, 25.00, 1, 2),
('2026-03-10', 800, 28.00, 2, 1),
('2026-03-15', 450, 30.00, 2, 3),
('2025-12-01', 1000, 35.50, 3, 2),
('2025-11-25', 200, 55.00, 4, 4),
('2026-02-20', 350, 45.00, 5, 3),
('2025-10-30', 600, 18.00, 6, 1);

SELECT * FROM farmer;
SELECT * FROM land;
SELECT * FROM crop;
SELECT * FROM planting;
SELECT * FROM sensor;
SELECT * FROM sensor_data;
SELECT * FROM market;
SELECT * FROM sale;


SELECT * FROM farmer
WHERE Name LIKE '%Raj%';

SELECT * FROM crop
WHERE Season = 'Kharif';

SELECT * FROM land
WHERE SoilType = 'Alluvial';

SELECT * FROM sensor_data
WHERE Value BETWEEN 30 AND 50;


UPDATE farmer
SET Phone = '9999999999'
WHERE FarmerID = 1;

UPDATE crop
SET Duration = 130
WHERE CropName = 'Rice';

SELECT * FROM farmer WHERE FarmerID = 1;
SELECT * FROM crop WHERE CropName = 'Rice';

-- per CROP
SELECT c.CropName,
SUM(s.Quantity * s.Price) AS Total_Revenue
FROM sale s
JOIN crop c ON s.CropID = c.CropID
GROUP BY c.CropName;

-- per Market
SELECT m.MarketName,
SUM(s.Quantity * s.Price) AS Revenue
FROM sale s
JOIN market m ON s.MarketID = m.MarketID
GROUP BY m.MarketName;

-- Total Revenue
SELECT SUM(Quantity * Price) AS Total_Revenue
FROM sale;

-- JOINS
SELECT f.Name AS Farmer,
l.Location,
c.CropName,
s.SensorType,
sd.Value,
m.MarketName,
(sa.Quantity * sa.Price) AS Revenue
FROM farmer f
JOIN land l ON f.FarmerID = l.FarmerID
JOIN planting p ON l.LandID = p.LandID
JOIN crop c ON p.CropID = c.CropID
JOIN sensor s ON l.LandID = s.LandID
JOIN sensor_data sd ON s.SensorID = sd.SensorID
JOIN sale sa ON c.CropID = sa.CropID
JOIN market m ON sa.MarketID = m.MarketID;

