const mysql = require('mysql2/promise');
require('dotenv').config();

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'smart_farming_dbms',
};

async function seedDatabase() {
  let connection;
  try {
    connection = await mysql.createConnection(config);
    console.log('✓ Connected to database');

    // Clear existing data (in reverse order of dependencies)
    await connection.execute('DELETE FROM sensor_data');
    await connection.execute('DELETE FROM sale');
    await connection.execute('DELETE FROM sensor');
    await connection.execute('DELETE FROM planting');
    await connection.execute('DELETE FROM market');
    await connection.execute('DELETE FROM crop');
    await connection.execute('DELETE FROM land');
    await connection.execute('DELETE FROM farmer');
    console.log('✓ Cleared existing data');

    // Insert Farmers
    await connection.execute(
      'INSERT INTO farmer (Name, Phone, Address) VALUES (?, ?, ?)',
      ['Rajesh Kumar', '9876543210', 'Village Ramnagar, Uttar Pradesh']
    );
    await connection.execute(
      'INSERT INTO farmer (Name, Phone, Address) VALUES (?, ?, ?)',
      ['Anita Sharma', '9123456789', 'Village Sundarpur, Punjab']
    );
    await connection.execute(
      'INSERT INTO farmer (Name, Phone, Address) VALUES (?, ?, ?)',
      ['Mohammad Ali', '9988776655', 'Village Greenfield, Haryana']
    );
    await connection.execute(
      'INSERT INTO farmer (Name, Phone, Address) VALUES (?, ?, ?)',
      ['Priya Patel', '9871234567', 'Village Chandanpur, Gujarat']
    );
    await connection.execute(
      'INSERT INTO farmer (Name, Phone, Address) VALUES (?, ?, ?)',
      ['Suresh Yadav', '9765432100', 'Village Lakshmipur, Madhya Pradesh']
    );
    console.log('✓ Inserted 5 farmers');

    // Insert Land
    const landData = [
      ['Plot A, Ramnagar', 5.50, 'Alluvial', 1],
      ['Plot B, Ramnagar', 3.25, 'Clay', 1],
      ['Field 1, Sundarpur', 8.00, 'Loamy', 2],
      ['Field 2, Greenfield', 6.75, 'Sandy', 3],
      ['Plot C, Chandanpur', 4.00, 'Black Soil', 4],
      ['Plot D, Lakshmipur', 7.50, 'Red Soil', 5],
    ];

    for (const land of landData) {
      await connection.execute(
        'INSERT INTO land (Location, Area, SoilType, FarmerID) VALUES (?, ?, ?, ?)',
        land
      );
    }
    console.log('✓ Inserted 6 land records');

    // Insert Crops
    const cropData = [
      ['Rice', 'Kharif', 120],
      ['Wheat', 'Rabi', 150],
      ['Sugarcane', 'Kharif', 365],
      ['Cotton', 'Kharif', 180],
      ['Mustard', 'Rabi', 110],
      ['Maize', 'Kharif', 100],
    ];

    for (const crop of cropData) {
      await connection.execute(
        'INSERT INTO crop (CropName, Season, Duration) VALUES (?, ?, ?)',
        crop
      );
    }
    console.log('✓ Inserted 6 crops');

    // Insert Planting
    const plantingData = [
      ['2025-06-15', 1, 1],
      ['2025-11-01', 2, 2],
      ['2025-06-20', 3, 3],
      ['2025-07-01', 4, 4],
      ['2025-10-15', 5, 5],
      ['2025-06-25', 6, 6],
    ];

    for (const planting of plantingData) {
      await connection.execute(
        'INSERT INTO planting (Date, LandID, CropID) VALUES (?, ?, ?)',
        planting
      );
    }
    console.log('✓ Inserted 6 planting records');

    // Insert Sensors
    const sensorData = [
      ['Temperature', 1],
      ['Humidity', 1],
      ['Soil Moisture', 2],
      ['Temperature', 3],
      ['pH Sensor', 4],
      ['Soil Moisture', 5],
      ['Humidity', 6],
    ];

    for (const sensor of sensorData) {
      await connection.execute(
        'INSERT INTO sensor (SensorType, LandID) VALUES (?, ?)',
        sensor
      );
    }
    console.log('✓ Inserted 7 sensors');

    // Insert Sensor Data
    const sensorDataRecords = [
      ['2025-07-01 08:00:00', 32.5, 1],
      ['2025-07-01 08:00:00', 78.2, 2],
      ['2025-07-01 08:00:00', 45.0, 3],
      ['2025-07-01 12:00:00', 35.1, 1],
      ['2025-07-01 12:00:00', 65.8, 2],
      ['2025-07-01 12:00:00', 42.3, 3],
      ['2025-07-02 08:00:00', 30.2, 4],
      ['2025-07-02 08:00:00', 6.8, 5],
      ['2025-07-02 08:00:00', 50.1, 6],
      ['2025-07-02 12:00:00', 33.7, 4],
      ['2025-07-02 12:00:00', 7.1, 5],
      ['2025-07-02 12:00:00', 48.5, 6],
      ['2025-07-03 08:00:00', 29.8, 1],
      ['2025-07-03 08:00:00', 80.5, 2],
      ['2025-07-03 08:00:00', 55.0, 7],
    ];

    for (const data of sensorDataRecords) {
      await connection.execute(
        'INSERT INTO sensor_data (Timestamp, Value, SensorID) VALUES (?, ?, ?)',
        data
      );
    }
    console.log('✓ Inserted 15 sensor data records');

    // Insert Markets
    const marketData = [
      ['Krishi Mandi', 'Lucknow, UP'],
      ['Anaj Mandi', 'Amritsar, Punjab'],
      ['Sabzi Mandi', 'Delhi'],
      ['Kisan Bazaar', 'Ahmedabad, Gujarat'],
    ];

    for (const market of marketData) {
      await connection.execute(
        'INSERT INTO market (MarketName, Location) VALUES (?, ?)',
        market
      );
    }
    console.log('✓ Inserted 4 markets');

    // Insert Sales
    const saleData = [
      ['2025-10-15', 500, 22.50, 1, 1],
      ['2025-10-20', 300, 25.00, 1, 2],
      ['2026-03-10', 800, 28.00, 2, 1],
      ['2026-03-15', 450, 30.00, 2, 3],
      ['2025-12-01', 1000, 35.50, 3, 2],
      ['2025-11-25', 200, 55.00, 4, 4],
      ['2026-02-20', 350, 45.00, 5, 3],
      ['2025-10-30', 600, 18.00, 6, 1],
    ];

    for (const sale of saleData) {
      await connection.execute(
        'INSERT INTO sale (Date, Quantity, Price, CropID, MarketID) VALUES (?, ?, ?, ?, ?)',
        sale
      );
    }
    console.log('✓ Inserted 8 sales records');

    // Verify data
    const [farmers] = await connection.execute('SELECT COUNT(*) as count FROM farmer');
    const [lands] = await connection.execute('SELECT COUNT(*) as count FROM land');
    const [crops] = await connection.execute('SELECT COUNT(*) as count FROM crop');
    const [plantings] = await connection.execute('SELECT COUNT(*) as count FROM planting');
    const [sensors] = await connection.execute('SELECT COUNT(*) as count FROM sensor');
    const [sensorDatas] = await connection.execute('SELECT COUNT(*) as count FROM sensor_data');
    const [markets] = await connection.execute('SELECT COUNT(*) as count FROM market');
    const [sales] = await connection.execute('SELECT COUNT(*) as count FROM sale');

    console.log('\n✓ Database seeding completed successfully!');
    console.log('\nData Summary:');
    console.log(`  Farmers: ${farmers[0].count}`);
    console.log(`  Land: ${lands[0].count}`);
    console.log(`  Crops: ${crops[0].count}`);
    console.log(`  Plantings: ${plantings[0].count}`);
    console.log(`  Sensors: ${sensors[0].count}`);
    console.log(`  Sensor Data: ${sensorDatas[0].count}`);
    console.log(`  Markets: ${markets[0].count}`);
    console.log(`  Sales: ${sales[0].count}`);

    await connection.end();
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
}

seedDatabase();
