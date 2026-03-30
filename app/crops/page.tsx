'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/navigation';
import CropsList from '@/components/crops-list';
import CropForm from '@/components/crop-form';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function CropsPage() {
  const [crops, setCrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchCrops();
  }, [currentPage, search, refreshTrigger]);

  const fetchCrops = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/crops', window.location.origin);
      url.searchParams.set('page', currentPage.toString());
      if (search) url.searchParams.set('search', search);

      const res = await fetch(url);
      const data = await res.json();
      setCrops(data.data || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      toast.error('Failed to fetch crops - ensure database is connected');
      setCrops([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this crop?')) {
      try {
        const res = await fetch(`/api/crops/${id}`, { method: 'DELETE' });
        if (res.ok) {
          toast.success('Crop deleted successfully');
          setRefreshTrigger(prev => prev + 1);
        } else {
          toast.error('Failed to delete crop');
        }
      } catch (error) {
        toast.error('Error deleting crop');
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Crop Management</h1>
          <p className="text-muted-foreground">Create, view, and manage crop records</p>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">View Crops</TabsTrigger>
            <TabsTrigger value="add">Add New Crop</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-6">
            <Card className="bg-white dark:bg-card border-accent/20">
              <CropsList
                crops={crops}
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
              <CropForm onSubmit={handleFormSubmit} />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
