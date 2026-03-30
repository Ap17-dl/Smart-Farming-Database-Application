import { query, execute } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const markets = await query('SELECT * FROM MARKET ORDER BY MarketID DESC');
    return NextResponse.json(markets);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch markets', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { marketName, location } = await request.json();

    if (!marketName || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await execute(
      'INSERT INTO MARKET (MarketName, Location) VALUES (?, ?)',
      [marketName, location]
    );

    return NextResponse.json(
      {
        message: 'Market created successfully',
        marketId: result.insertId,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create market', details: error.message },
      { status: 500 }
    );
  }
}
