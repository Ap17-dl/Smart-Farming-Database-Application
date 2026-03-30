import { query, execute } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET single farmer
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const farmers = await query('SELECT * FROM FARMER WHERE FarmerID = ?', [id]);

    if (farmers.length === 0) {
      return NextResponse.json(
        { error: 'Farmer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(farmers[0]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch farmer', details: error.message },
      { status: 500 }
    );
  }
}

// UPDATE farmer
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { name, phone, address } = await request.json();

    if (!name || !phone || !address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await execute(
      'UPDATE FARMER SET Name = ?, Phone = ?, Address = ? WHERE FarmerID = ?',
      [name, phone, address, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Farmer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Farmer updated successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update farmer', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE farmer
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const result = await execute(
      'DELETE FROM FARMER WHERE FarmerID = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Farmer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Farmer deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete farmer', details: error.message },
      { status: 500 }
    );
  }
}
