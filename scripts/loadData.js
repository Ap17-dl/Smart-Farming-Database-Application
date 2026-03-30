const mysql = require('mysql2/promise');
require('dotenv').config();

async function loadData() {
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
    console.log('Clearing existing data...');
    
    // Clear existing data in correct order (respecting foreign keys)
    await connection.execute('DELETE FROM SENSOR_DATA');
    await connection.execute('DELETE FROM SENSOR');
    await connection.execute('DELETE FROM SALE');
    await connection.execute('DELETE FROM MARKET');
    await connection.execute('DELETE FROM PLANTING');
    await connection.execute('DELETE FROM CROP');
    await connection.execute('DELETE FROM LAND');
    await connection.execute('DELETE FROM FARMER');
    
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

    console.log('\n✓ All data loaded successfully!\n');
    
    // Show summary
    const [farmerCount] = await connection.execute('SELECT COUNT(*) as count FROM FARMER');
    const [cropCount] = await connection.execute('SELECT COUNT(*) as count FROM CROP');
    const [saleCount] = await connection.execute('SELECT COUNT(*) as count FROM SALE');
    const [sensorDataCount] = await connection.execute('SELECT COUNT(*) as count FROM SENSOR_DATA');
    const [totalRevenue] = await connection.execute('SELECT SUM(Quantity * Price) as total FROM SALE');
    
    console.log('📊 Database Summary:');
    console.log(`  👨‍🌾 Farmers: ${farmerCount[0].count}`);
    console.log(`  🌾 Crops: ${cropCount[0].count}`);
    console.log(`  📊 Sales: ${saleCount[0].count}`);
    console.log(`  📡 Sensor Data Points: ${sensorDataCount[0].count}`);
    console.log(`  💰 Total Revenue: ₹${(totalRevenue[0].total?.toFixed(2) || 0)}`);
    
  } catch (error) {
    console.error('✗ Error loading data:', error.message);
  } finally {
    connection.release();
    await pool.end();
  }
}

loadData();
