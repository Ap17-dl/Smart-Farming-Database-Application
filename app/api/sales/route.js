import { query, execute } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET all sales with revenue calculation
export async function GET(request) {
  try {
    const sales = await query(`
      SELECT 
        s.SaleID,
        s.Date,
        s.Quantity,
        s.Price,
        (s.Quantity * s.Price) as Revenue,
        s.CropID,
        c.CropName,
        s.MarketID,
        m.MarketName
      FROM SALE s
      JOIN CROP c ON s.CropID = c.CropID
      JOIN MARKET m ON s.MarketID = m.MarketID
    `);

    // Calculate total revenue
    const revenueResult = await query(
      'SELECT SUM(Quantity * Price) as totalRevenue FROM SALE'
    );
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    return NextResponse.json({
      data: sales,
      totalRevenue,
      pagination: {
        total: sales.length,
        page: 1,
        limit: 10,
        pages: 1,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch sales', details: error.message },
      { status: 500 }
    );
  }
}

// POST create new sale
export async function POST(request) {
  try {
    const { date, quantity, price, cropId, marketId } = await request.json();

    if (!date || quantity === undefined || price === undefined || !cropId || !marketId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await execute(
      'INSERT INTO SALE (Date, Quantity, Price, CropID, MarketID) VALUES (?, ?, ?, ?, ?)',
      [date, quantity, price, cropId, marketId]
    );

    return NextResponse.json(
      {
        message: 'Sale created successfully',
        saleId: result.insertId,
        revenue: quantity * price,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create sale', details: error.message },
      { status: 500 }
    );
  }
}
