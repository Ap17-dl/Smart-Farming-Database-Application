import { query, execute } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET single crop
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const crops = await query('SELECT * FROM CROP WHERE CropID = ?', [id]);

    if (crops.length === 0) {
      return NextResponse.json(
        { error: 'Crop not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(crops[0]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch crop', details: error.message },
      { status: 500 }
    );
  }
}

// UPDATE crop
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { cropName, season, duration } = await request.json();

    if (!cropName || !season || duration === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await execute(
      'UPDATE CROP SET CropName = ?, Season = ?, Duration = ? WHERE CropID = ?',
      [cropName, season, duration, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Crop not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Crop updated successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update crop', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE crop
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const result = await execute(
      'DELETE FROM CROP WHERE CropID = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Crop not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Crop deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete crop', details: error.message },
      { status: 500 }
    );
  }
}
