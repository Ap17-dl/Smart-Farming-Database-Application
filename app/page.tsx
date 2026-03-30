'use client';

import { Key, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Link from 'next/link';
import { Leaf } from 'lucide-react';
import Navigation from '@/components/navigation';

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/analytics');
        const data = await res.json();
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  const dashboard = analytics?.dashboard || {};
  const cropRevenue = analytics?.cropRevenue || [];
  const salesTrend = analytics?.salesTrend || [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8 mt-16">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="w-6 h-6 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Smart Farming Dashboard</h1>
          </div>
          <p className="text-muted-foreground">Monitor your farm operations and revenue analytics</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="bg-white dark:bg-card border-accent/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Farmers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{dashboard.totalFarmers || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-card border-accent/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Crops</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{dashboard.totalCrops || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-card border-accent/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{dashboard.totalSales || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-card border-accent/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Land Area</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{(dashboard.totalLandArea || 0).toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">hectares</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-card border-accent/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">₹{(dashboard.totalRevenue || 0).toFixed(0)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue by Crop */}
          <Card className="bg-white dark:bg-card border-accent/20">
            <CardHeader>
              <CardTitle>Revenue by Crop</CardTitle>
              <CardDescription>Total revenue distribution across crops</CardDescription>
            </CardHeader>
            <CardContent>
              {cropRevenue.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={cropRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="CropName" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="hsl(var(--color-primary))" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No crop revenue data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sales Trend */}
          <Card className="bg-white dark:bg-card border-accent/20">
            <CardHeader>
              <CardTitle>Sales Trend</CardTitle>
              <CardDescription>Revenue over time</CardDescription>
            </CardHeader>
            <CardContent>
              {salesTrend.length > 0 ? (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {salesTrend.map((trend: { revenue: any; date: string | number | Date; }, idx: Key | null | undefined) => {
                    const revenue = Number(trend.revenue) || 0;
                    const maxRevenue = Math.max(...salesTrend.map((t: any) => Number(t.revenue) || 0));
                    const percentage = (revenue / maxRevenue) * 100;
                    const dateStr = new Date(trend.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
                    
                    return (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="min-w-fit text-sm font-medium text-muted-foreground">
                          {dateStr}
                        </div>
                        <div className="flex-1">
                          <div className="bg-secondary rounded-full h-6 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-right text-sm font-semibold text-accent min-w-fit">
                          ₹{revenue.toFixed(0)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No sales trend data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Link href="/farmers" className="block">
            <Card className="bg-white dark:bg-card border-accent/20 hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Manage Farmers</CardTitle>
                <CardDescription>View and manage farmer records</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/crops" className="block">
            <Card className="bg-white dark:bg-card border-accent/20 hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Manage Crops</CardTitle>
                <CardDescription>View and manage crop information</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/sales" className="block">
            <Card className="bg-white dark:bg-card border-accent/20 hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Manage Sales</CardTitle>
                <CardDescription>Track sales and revenue</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </main>
  );
}
