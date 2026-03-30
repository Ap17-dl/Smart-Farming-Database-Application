import { query, execute } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET all farmers or search
export async function GET(request) {
  try {
    const farmers = await query('SELECT * FROM FARMER');

    return NextResponse.json({
      data: farmers,
      pagination: {
        total: farmers.length,
        page: 1,
        limit: 10,
        pages: 1,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch farmers', details: error.message },
      { status: 500 }
    );
  }
}

// POST create new farmer
export async function POST(request) {
  try {
    const { name, phone, address } = await request.json();

    if (!name || !phone || !address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await execute(
      'INSERT INTO FARMER (Name, Phone, Address) VALUES (?, ?, ?)',
      [name, phone, address]
    );

    return NextResponse.json(
      {
        message: 'Farmer created successfully',
        farmerId: result.insertId,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create farmer', details: error.message },
      { status: 500 }
    );
  }
}
