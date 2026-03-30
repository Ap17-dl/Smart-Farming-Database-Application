const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'smart_farming',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const createTables = `
-- FARMER table
CREATE TABLE IF NOT EXISTS FARMER (
  FarmerID INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(100) NOT NULL,
  Phone VARCHAR(15) NOT NULL,
  Address VARCHAR(255) NOT NULL,
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- LAND table
CREATE TABLE IF NOT EXISTS LAND (
  LandID INT AUTO_INCREMENT PRIMARY KEY,
  Location VARCHAR(255) NOT NULL,
  Area DECIMAL(10, 2) NOT NULL,
  SoilType VARCHAR(50) NOT NULL,
  FarmerID INT NOT NULL,
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (FarmerID) REFERENCES FARMER(FarmerID) ON DELETE CASCADE
);

-- CROP table
CREATE TABLE IF NOT EXISTS CROP (
  CropID INT AUTO_INCREMENT PRIMARY KEY,
  CropName VARCHAR(100) NOT NULL,
  Season VARCHAR(50) NOT NULL,
  Duration INT NOT NULL,
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PLANTING table
CREATE TABLE IF NOT EXISTS PLANTING (
  PlantingID INT AUTO_INCREMENT PRIMARY KEY,
  Date DATE NOT NULL,
  LandID INT NOT NULL,
  CropID INT NOT NULL,
  Status VARCHAR(20) DEFAULT 'Active',
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (LandID) REFERENCES LAND(LandID) ON DELETE CASCADE,
  FOREIGN KEY (CropID) REFERENCES CROP(CropID) ON DELETE CASCADE
);

-- SENSOR table
CREATE TABLE IF NOT EXISTS SENSOR (
  SensorID INT AUTO_INCREMENT PRIMARY KEY,
  SensorType VARCHAR(50) NOT NULL,
  LandID INT NOT NULL,
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (LandID) REFERENCES LAND(LandID) ON DELETE CASCADE
);

-- SENSOR_DATA table
CREATE TABLE IF NOT EXISTS SENSOR_DATA (
  DataID INT AUTO_INCREMENT PRIMARY KEY,
  Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  Value DECIMAL(10, 2) NOT NULL,
  SensorID INT NOT NULL,
  FOREIGN KEY (SensorID) REFERENCES SENSOR(SensorID) ON DELETE CASCADE
);

-- MARKET table
CREATE TABLE IF NOT EXISTS MARKET (
  MarketID INT AUTO_INCREMENT PRIMARY KEY,
  MarketName VARCHAR(100) NOT NULL,
  Location VARCHAR(255) NOT NULL,
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SALE table
CREATE TABLE IF NOT EXISTS SALE (
  SaleID INT AUTO_INCREMENT PRIMARY KEY,
  Date DATE NOT NULL,
  Quantity DECIMAL(10, 2) NOT NULL,
  Price DECIMAL(10, 2) NOT NULL,
  CropID INT NOT NULL,
  MarketID INT NOT NULL,
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (CropID) REFERENCES CROP(CropID) ON DELETE CASCADE,
  FOREIGN KEY (MarketID) REFERENCES MARKET(MarketID) ON DELETE CASCADE
);

CREATE INDEX idx_farmer_id ON LAND(FarmerID);
CREATE INDEX idx_land_id ON PLANTING(LandID);
CREATE INDEX idx_crop_id ON PLANTING(CropID);
CREATE INDEX idx_sensor_id ON SENSOR_DATA(SensorID);
CREATE INDEX idx_sale_crop ON SALE(CropID);
CREATE INDEX idx_sale_market ON SALE(MarketID);
`;

async function setupDatabase() {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database...');

    const statements = createTables.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement.trim());
        console.log('✓ Executed:', statement.trim().substring(0, 50) + '...');
      }
    }

    await connection.end();
    console.log('\n✓ Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Database setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();
