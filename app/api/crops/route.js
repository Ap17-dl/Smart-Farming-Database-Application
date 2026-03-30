import { query, execute } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET all crops or search
export async function GET(request) {
  try {
    const crops = await query('SELECT * FROM CROP');

    return NextResponse.json({
      data: crops,
      pagination: {
        total: crops.length,
        page: 1,
        limit: 10,
        pages: 1,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch crops', details: error.message },
      { status: 500 }
    );
  }
}

// POST create new crop
export async function POST(request) {
  try {
    const { cropName, season, duration } = await request.json();

    if (!cropName || !season || duration === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await execute(
      'INSERT INTO CROP (CropName, Season, Duration) VALUES (?, ?, ?)',
      [cropName, season, duration]
    );

    return NextResponse.json(
      {
        message: 'Crop created successfully',
        cropId: result.insertId,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create crop', details: error.message },
      { status: 500 }
    );
  }
}
