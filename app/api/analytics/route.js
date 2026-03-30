import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Get total farmers
    const farmersResult = await query('SELECT COUNT(*) as count FROM FARMER');
    const totalFarmers = farmersResult[0].count;

    // Get total crops
    const cropsResult = await query('SELECT COUNT(*) as count FROM CROP');
    const totalCrops = cropsResult[0].count;

    // Get total sales
    const salesCountResult = await query('SELECT COUNT(*) as count FROM SALE');
    const totalSales = salesCountResult[0].count;

    // Get total revenue
    const revenueResult = await query(
      'SELECT SUM(Quantity * Price) as total FROM SALE'
    );
    const totalRevenue = revenueResult[0]?.total || 0;

    // Get revenue by crop
    const cropRevenueResult = await query(
      `
        SELECT 
          c.CropID,
          c.CropName,
          SUM(s.Quantity * s.Price) as revenue,
          SUM(s.Quantity) as totalQuantity
        FROM CROP c
        LEFT JOIN SALE s ON c.CropID = s.CropID
        GROUP BY c.CropID, c.CropName
        ORDER BY revenue DESC
      `
    );

    // Get sales trend (last 90 days or all if less)
    const salesTrendResult = await query(
      `
        SELECT 
          DATE(Date) as date,
          COUNT(*) as count,
          SUM(Quantity * Price) as revenue
        FROM SALE
        GROUP BY DATE(Date)
        ORDER BY date DESC
        LIMIT 90
      `
    );

    // Get total land area
    const landResult = await query('SELECT SUM(Area) as total FROM LAND');
    const totalLandArea = landResult[0]?.total || 0;

    return NextResponse.json({
      dashboard: {
        totalFarmers,
        totalCrops,
        totalSales,
        totalRevenue: parseFloat(totalRevenue),
        totalLandArea: parseFloat(totalLandArea),
      },
      cropRevenue: cropRevenueResult,
      salesTrend: salesTrendResult,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch analytics', details: error.message },
      { status: 500 }
    );
  }
}
