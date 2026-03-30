import { query, execute } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET single sale
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const sales = await query(
      `
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
        WHERE s.SaleID = ?
      `,
      [id]
    );

    if (sales.length === 0) {
      return NextResponse.json(
        { error: 'Sale not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(sales[0]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch sale', details: error.message },
      { status: 500 }
    );
  }
}

// UPDATE sale
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { date, quantity, price, cropId, marketId } = await request.json();

    if (!date || quantity === undefined || price === undefined || !cropId || !marketId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await execute(
      'UPDATE SALE SET Date = ?, Quantity = ?, Price = ?, CropID = ?, MarketID = ? WHERE SaleID = ?',
      [date, quantity, price, cropId, marketId, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Sale not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Sale updated successfully',
      revenue: quantity * price,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update sale', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE sale
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const result = await execute(
      'DELETE FROM SALE WHERE SaleID = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Sale not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Sale deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete sale', details: error.message },
      { status: 500 }
    );
  }
}
