import { query, execute } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const data = await query(`
      SELECT 
        sd.DataID,
        sd.Timestamp,
        sd.Value,
        s.SensorID,
        s.SensorType,
        l.Location,
        l.LandID
      FROM SENSOR_DATA sd
      JOIN SENSOR s ON sd.SensorID = s.SensorID
      JOIN LAND l ON s.LandID = l.LandID
      ORDER BY sd.Timestamp DESC
    `);

    return NextResponse.json({
      data,
      pagination: {
        total: data.length,
        page: 1,
        limit: 20,
        pages: 1,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch sensor data', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { sensorId, value } = await request.json();

    if (!sensorId || value === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await execute(
      'INSERT INTO SENSOR_DATA (SensorID, Value, Timestamp) VALUES (?, ?, NOW())',
      [sensorId, value]
    );

    return NextResponse.json(
      {
        message: 'Sensor data recorded successfully',
        dataId: result.insertId,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to record sensor data', details: error.message },
      { status: 500 }
    );
  }
}
