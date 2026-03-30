'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/navigation';
import FarmersList from '@/components/farmers-list';
import FarmerForm from '@/components/farmer-form';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function FarmersPage() {
  const [farmers, setFarmers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchFarmers();
  }, [currentPage, search, refreshTrigger]);

  const fetchFarmers = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/farmers', window.location.origin);
      url.searchParams.set('page', currentPage.toString());
      if (search) url.searchParams.set('search', search);

      const res = await fetch(url);
      const data = await res.json();
      setFarmers(data.data || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      toast.error('Failed to fetch farmers - ensure database is connected');
      setFarmers([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this farmer?')) {
      try {
        const res = await fetch(`/api/farmers/${id}`, { method: 'DELETE' });
        if (res.ok) {
          toast.success('Farmer deleted successfully');
          setRefreshTrigger(prev => prev + 1);
        } else {
          toast.error('Failed to delete farmer');
        }
      } catch (error) {
        toast.error('Error deleting farmer');
      }
    }
  };

  const handleFormSubmit = () => {
    setCurrentPage(1);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8 mt-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Farmer Management</h1>
          <p className="text-muted-foreground">Create, view, and manage farmer records</p>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">View Farmers</TabsTrigger>
            <TabsTrigger value="add">Add New Farmer</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-6">
            <Card className="bg-white dark:bg-card border-accent/20">
              <FarmersList
                farmers={farmers}
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
              <FarmerForm onSubmit={handleFormSubmit} />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
