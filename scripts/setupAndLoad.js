const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupAndLoadData() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'smart_farming',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  const connection = await pool.getConnection();
  
  try {
    console.log('Dropping old tables...');
    
    // Drop tables in reverse order of creation
    const tables = ['SENSOR_DATA', 'SENSOR', 'SALE', 'MARKET', 'PLANTING', 'CROP', 'LAND', 'FARMER'];
    for (const table of tables) {
      try {
        await connection.execute(`DROP TABLE IF EXISTS ${table}`);
      } catch (e) {
        // Ignore errors
      }
    }
    
    console.log('Creating new tables with proper schema...');
    
    const createTables = [
      `CREATE TABLE FARMER (
        FarmerID INT AUTO_INCREMENT PRIMARY KEY,
        Name VARCHAR(100) NOT NULL,
        Phone VARCHAR(20),
        Address VARCHAR(255),
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE LAND (
        LandID INT AUTO_INCREMENT PRIMARY KEY,
        Location VARCHAR(255),
        Area DECIMAL(10, 2),
        SoilType VARCHAR(100),
        FarmerID INT NOT NULL,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (FarmerID) REFERENCES FARMER(FarmerID) ON DELETE CASCADE
      )`,
      
      `CREATE TABLE CROP (
        CropID INT AUTO_INCREMENT PRIMARY KEY,
        CropName VARCHAR(100) NOT NULL,
        Season VARCHAR(50),
        Duration INT COMMENT 'Duration in days',
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE PLANTING (
        PlantingID INT AUTO_INCREMENT PRIMARY KEY,
        Date DATE,
        LandID INT NOT NULL,
        CropID INT NOT NULL,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (LandID) REFERENCES LAND(LandID) ON DELETE CASCADE,
        FOREIGN KEY (CropID) REFERENCES CROP(CropID) ON DELETE CASCADE
      )`,
      
      `CREATE TABLE SENSOR (
        SensorID INT AUTO_INCREMENT PRIMARY KEY,
        SensorType VARCHAR(100),
        LandID INT NOT NULL,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (LandID) REFERENCES LAND(LandID) ON DELETE CASCADE
      )`,
      
      `CREATE TABLE SENSOR_DATA (
        DataID INT AUTO_INCREMENT PRIMARY KEY,
        Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        Value DECIMAL(10, 2),
        SensorID INT NOT NULL,
        FOREIGN KEY (SensorID) REFERENCES SENSOR(SensorID) ON DELETE CASCADE
      )`,
      
      `CREATE TABLE MARKET (
        MarketID INT AUTO_INCREMENT PRIMARY KEY,
        MarketName VARCHAR(100) NOT NULL,
        Location VARCHAR(255),
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE SALE (
        SaleID INT AUTO_INCREMENT PRIMARY KEY,
        Date DATE,
        Quantity DECIMAL(10, 2),
        Price DECIMAL(10, 2),
        CropID INT NOT NULL,
        MarketID INT NOT NULL,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (CropID) REFERENCES CROP(CropID) ON DELETE CASCADE,
        FOREIGN KEY (MarketID) REFERENCES MARKET(MarketID) ON DELETE CASCADE
      )`
    ];

    for (const createSql of createTables) {
      await connection.execute(createSql);
    }

    console.log('Creating indexes...');
    const indexes = [
      'CREATE INDEX idx_farmer_id ON LAND(FarmerID)',
      'CREATE INDEX idx_land_id ON PLANTING(LandID)',
      'CREATE INDEX idx_crop_id ON PLANTING(CropID)',
      'CREATE INDEX idx_sensor_id ON SENSOR_DATA(SensorID)',
      'CREATE INDEX idx_sale_crop ON SALE(CropID)',
      'CREATE INDEX idx_sale_market ON SALE(MarketID)'
    ];

    for (const indexSql of indexes) {
      try {
        await connection.execute(indexSql);
      } catch (e) {
        // Ignore if index already exists
      }
    }

    console.log('\nLoading comprehensive data...\n');
    
    console.log('Inserting farmers...');
    const farmers = [
      ['Rajesh Kumar', '9876543210', 'Village Ramnagar, Uttar Pradesh'],
      ['Anita Sharma', '9123456789', 'Village Sundarpur, Punjab'],
      ['Mohammad Ali', '9988776655', 'Village Greenfield, Haryana'],
      ['Priya Patel', '9871234567', 'Village Chandanpur, Gujarat'],
      ['Suresh Yadav', '9765432100', 'Village Lakshmipur, Madhya Pradesh']
    ];
    
    let farmerIds = [];
    for (const farmer of farmers) {
      const result = await connection.execute(
        'INSERT INTO FARMER (Name, Phone, Address) VALUES (?, ?, ?)',
        farmer
      );
      farmerIds.push(result[0].insertId);
    }
    console.log(`  ✓ ${farmerIds.length} farmers inserted`);

    console.log('Inserting lands...');
    const lands = [
      ['Plot A, Ramnagar', 5.50, 'Alluvial', farmerIds[0]],
      ['Plot B, Ramnagar', 3.25, 'Clay', farmerIds[0]],
      ['Field 1, Sundarpur', 8.00, 'Loamy', farmerIds[1]],
      ['Field 2, Greenfield', 6.75, 'Sandy', farmerIds[2]],
      ['Plot C, Chandanpur', 4.00, 'Black Soil', farmerIds[3]],
      ['Plot D, Lakshmipur', 7.50, 'Red Soil', farmerIds[4]]
    ];
    
    let landIds = [];
    for (const land of lands) {
      const result = await connection.execute(
        'INSERT INTO LAND (Location, Area, SoilType, FarmerID) VALUES (?, ?, ?, ?)',
        land
      );
      landIds.push(result[0].insertId);
    }
    console.log(`  ✓ ${landIds.length} lands inserted`);

    console.log('Inserting crops...');
    const crops = [
      ['Rice', 'Kharif', 120],
      ['Wheat', 'Rabi', 150],
      ['Sugarcane', 'Kharif', 365],
      ['Cotton', 'Kharif', 180],
      ['Mustard', 'Rabi', 110],
      ['Maize', 'Kharif', 100]
    ];
    
    let cropIds = [];
    for (const crop of crops) {
      const result = await connection.execute(
        'INSERT INTO CROP (CropName, Season, Duration) VALUES (?, ?, ?)',
        crop
      );
      cropIds.push(result[0].insertId);
    }
    console.log(`  ✓ ${cropIds.length} crops inserted`);

    console.log('Inserting plantings...');
    const plantings = [
      ['2025-06-15', landIds[0], cropIds[0]],
      ['2025-11-01', landIds[1], cropIds[1]],
      ['2025-06-20', landIds[2], cropIds[2]],
      ['2025-07-01', landIds[3], cropIds[3]],
      ['2025-10-15', landIds[4], cropIds[4]],
      ['2025-06-25', landIds[5], cropIds[5]]
    ];
    
    for (const planting of plantings) {
      await connection.execute(
        'INSERT INTO PLANTING (Date, LandID, CropID) VALUES (?, ?, ?)',
        planting
      );
    }
    console.log(`  ✓ ${plantings.length} plantings inserted`);

    console.log('Inserting sensors...');
    const sensors = [
      ['Temperature', landIds[0]],
      ['Humidity', landIds[0]],
      ['Soil Moisture', landIds[1]],
      ['Temperature', landIds[2]],
      ['pH Sensor', landIds[3]],
      ['Soil Moisture', landIds[4]],
      ['Humidity', landIds[5]]
    ];
    
    let sensorIds = [];
    for (const sensor of sensors) {
      const result = await connection.execute(
        'INSERT INTO SENSOR (SensorType, LandID) VALUES (?, ?)',
        sensor
      );
      sensorIds.push(result[0].insertId);
    }
    console.log(`  ✓ ${sensorIds.length} sensors inserted`);

    console.log('Inserting sensor data...');
    const sensorData = [
      ['2025-07-01 08:00:00', 32.5, sensorIds[0]],
      ['2025-07-01 08:00:00', 78.2, sensorIds[1]],
      ['2025-07-01 08:00:00', 45.0, sensorIds[2]],
      ['2025-07-01 12:00:00', 35.1, sensorIds[0]],
      ['2025-07-01 12:00:00', 65.8, sensorIds[1]],
      ['2025-07-01 12:00:00', 42.3, sensorIds[2]],
      ['2025-07-02 08:00:00', 30.2, sensorIds[3]],
      ['2025-07-02 08:00:00', 6.8, sensorIds[4]],
      ['2025-07-02 08:00:00', 50.1, sensorIds[5]],
      ['2025-07-02 12:00:00', 33.7, sensorIds[3]],
      ['2025-07-02 12:00:00', 7.1, sensorIds[4]],
      ['2025-07-02 12:00:00', 48.5, sensorIds[5]],
      ['2025-07-03 08:00:00', 29.8, sensorIds[0]],
      ['2025-07-03 08:00:00', 80.5, sensorIds[1]],
      ['2025-07-03 08:00:00', 55.0, sensorIds[6]]
    ];
    
    for (const data of sensorData) {
      await connection.execute(
        'INSERT INTO SENSOR_DATA (Timestamp, Value, SensorID) VALUES (?, ?, ?)',
        data
      );
    }
    console.log(`  ✓ ${sensorData.length} sensor data points inserted`);

    console.log('Inserting markets...');
    const markets = [
      ['Krishi Mandi', 'Lucknow, UP'],
      ['Anaj Mandi', 'Amritsar, Punjab'],
      ['Sabzi Mandi', 'Delhi'],
      ['Kisan Bazaar', 'Ahmedabad, Gujarat']
    ];
    
    let marketIds = [];
    for (const market of markets) {
      const result = await connection.execute(
        'INSERT INTO MARKET (MarketName, Location) VALUES (?, ?)',
        market
      );
      marketIds.push(result[0].insertId);
    }
    console.log(`  ✓ ${marketIds.length} markets inserted`);

    console.log('Inserting sales...');
    const sales = [
      ['2025-10-15', 500, 22.50, cropIds[0], marketIds[0]],
      ['2025-10-20', 300, 25.00, cropIds[0], marketIds[1]],
      ['2026-03-10', 800, 28.00, cropIds[1], marketIds[0]],
      ['2026-03-15', 450, 30.00, cropIds[1], marketIds[2]],
      ['2025-12-01', 1000, 35.50, cropIds[2], marketIds[1]],
      ['2025-11-25', 200, 55.00, cropIds[3], marketIds[3]],
      ['2026-02-20', 350, 45.00, cropIds[4], marketIds[2]],
      ['2025-10-30', 600, 18.00, cropIds[5], marketIds[0]]
    ];
    
    for (const sale of sales) {
      await connection.execute(
        'INSERT INTO SALE (Date, Quantity, Price, CropID, MarketID) VALUES (?, ?, ?, ?, ?)',
        sale
      );
    }
    console.log(`  ✓ ${sales.length} sales inserted`);

    console.log('\n✓ Database setup and data loading completed successfully!\n');
    
    // Show summary
    const [farmerCount] = await connection.execute('SELECT COUNT(*) as count FROM FARMER');
    const [landCount] = await connection.execute('SELECT COUNT(*) as count FROM LAND');
    const [cropCount] = await connection.execute('SELECT COUNT(*) as count FROM CROP');
    const [plantingCount] = await connection.execute('SELECT COUNT(*) as count FROM PLANTING');
    const [sensorCount] = await connection.execute('SELECT COUNT(*) as count FROM SENSOR');
    const [sensorDataCount] = await connection.execute('SELECT COUNT(*) as count FROM SENSOR_DATA');
    const [marketCount] = await connection.execute('SELECT COUNT(*) as count FROM MARKET');
    const [saleCount] = await connection.execute('SELECT COUNT(*) as count FROM SALE');
    const [totalRevenue] = await connection.execute('SELECT SUM(Quantity * Price) as total FROM SALE');
    
    console.log('📊 Complete Database Summary:');
    console.log(`  👨‍🌾 Farmers: ${farmerCount[0].count}`);
    console.log(`  🏞️  Lands: ${landCount[0].count}`);
    console.log(`  🌾 Crops: ${cropCount[0].count}`);
    console.log(`  🌱 Plantings: ${plantingCount[0].count}`);
    console.log(`  📡 Sensors: ${sensorCount[0].count}`);
    console.log(`  📊 Sensor Data Points: ${sensorDataCount[0].count}`);
    console.log(`  🏪 Markets: ${marketCount[0].count}`);
    console.log(`  💰 Sales: ${saleCount[0].count}`);
    console.log(`  📈 Total Revenue: ₹${(Number(totalRevenue[0].total)?.toFixed(2) || '0.00')}`);
    
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  } finally {
    connection.release();
    await pool.end();
  }
}

setupAndLoadData();
