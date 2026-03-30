'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import SalesList from '@/components/SalesList';
import SaleForm from '@/components/SaleForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { TrendingUp, Calendar } from 'lucide-react';

export default function SalesPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [salesTrend, setSalesTrend] = useState<any[]>([]);
  const [cropRevenue, setCropRevenue] = useState<any[]>([]);

  useEffect(() => {
    fetchSales();
    fetchAnalytics();
  }, [currentPage, search, refreshTrigger]);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/sales', window.location.origin);
      url.searchParams.set('page', currentPage.toString());
      if (search) url.searchParams.set('search', search);

      const res = await fetch(url);
      const data = await res.json();
      setSales(data.data || []);
      setTotalPages(data.pagination?.pages || 1);
      setTotalRevenue(Number(data.totalRevenue) || 0);
    } catch (error) {
      toast.error('Failed to fetch sales - ensure database is connected');
      setSales([]);
      setTotalPages(1);
      setTotalRevenue(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics');
      const data = await res.json();
      setSalesTrend(data.salesTrend || []);
      setCropRevenue(data.cropRevenue || []);
    } catch (error) {
      console.error('Failed to fetch analytics');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this sale?')) {
      try {
        const res = await fetch(`/api/sales/${id}`, { method: 'DELETE' });
        if (res.ok) {
          toast.success('Sale deleted successfully');
          setRefreshTrigger(prev => prev + 1);
        } else {
          toast.error('Failed to delete sale');
        }
      } catch (error) {
        toast.error('Error deleting sale');
      }
    }
  };

  const handleFormSubmit = () => {
    setCurrentPage(1);
    setRefreshTrigger(prev => prev + 1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8 mt-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Sales Management</h1>
          <p className="text-muted-foreground">Create, view, and manage sales records with revenue analytics</p>
        </div>

        {/* Revenue Stats */}
        <Card className="bg-gradient-to-r from-primary to-accent text-white mb-6 border-0">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Total Revenue</CardTitle>
                <CardDescription className="text-white/80">All-time sales revenue</CardDescription>
              </div>
              <TrendingUp className="w-8 h-8 opacity-80" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">₹{totalRevenue.toFixed(0)}</div>
          </CardContent>
        </Card>

        {/* Sales Trend and Crop Revenue */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Trend */}
          <Card className="bg-white dark:bg-card border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Sales Trend
              </CardTitle>
              <CardDescription>Revenue over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {salesTrend.length > 0 ? (
                  salesTrend.map((trend, idx) => {
                    const revenue = Number(trend.revenue) || 0;
                    const maxRevenue = Math.max(...salesTrend.map((t: any) => Number(t.revenue) || 0));
                    const percentage = (revenue / maxRevenue) * 100;
                    return (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="min-w-fit text-sm font-medium text-muted-foreground">
                          {formatDate(trend.date)}
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
                  })
                ) : (
                  <p className="text-muted-foreground text-center py-4">No sales data available</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Crop-wise Revenue */}
          <Card className="bg-white dark:bg-card border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Revenue by Crop
              </CardTitle>
              <CardDescription>Top-performing crops</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {cropRevenue.length > 0 ? (
                  cropRevenue.map((crop, idx) => {
                    const revenue = Number(crop.revenue) || 0;
                    const maxRevenue = Math.max(...cropRevenue.map((c: any) => Number(c.revenue) || 0));
                    const percentage = (revenue / maxRevenue) * 100;
                    return (
                      <div key={idx}>
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <p className="font-semibold text-foreground">{crop.CropName}</p>
                            <p className="text-xs text-muted-foreground">{crop.totalQuantity ? Math.round(crop.totalQuantity) : 0} units sold</p>
                          </div>
                          <p className="font-bold text-accent">₹{revenue.toFixed(0)}</p>
                        </div>
                        <div className="bg-secondary rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-muted-foreground text-center py-4">No crop revenue data available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">View Sales</TabsTrigger>
            <TabsTrigger value="add">Add New Sale</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-6">
            <Card className="bg-white dark:bg-card border-accent/20">
              <SalesList
                sales={sales}
                loading={loading}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                onDelete={handleDelete}
                search={search}
                onSearchChange={setSearch}
              />
            </Card>
          </TabsContent>

          <TabsContent value="add" className="mt-6">
            <Card className="bg-white dark:bg-card border-accent/20 p-6">
              <SaleForm onSubmit={handleFormSubmit} />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
