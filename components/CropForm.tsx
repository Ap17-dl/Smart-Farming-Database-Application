'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CropFormProps {
  onSubmit?: () => void;
}

export default function CropForm({ onSubmit }: CropFormProps) {
  const [formData, setFormData] = useState({
    cropName: '',
    season: '',
    duration: '',
  });
  const [loading, setLoading] = useState(false);

  const seasons = ['Kharif', 'Rabi', 'Summer', 'Winter'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSeasonChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      season: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.cropName || !formData.season || !formData.duration) {
      toast.error('All fields are required');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/crops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName: formData.cropName,
          season: formData.season,
          duration: parseInt(formData.duration),
        }),
      });

      if (res.ok) {
        toast.success('Crop created successfully');
        setFormData({ cropName: '', season: '', duration: '' });
        onSubmit?.();
      } else {
        toast.error('Failed to create crop');
      }
    } catch (error) {
      toast.error('Error creating crop');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      <div>
        <Label htmlFor="cropName" className="text-foreground font-medium mb-2 block">Crop Name</Label>
        <Input
          id="cropName"
          name="cropName"
          value={formData.cropName}
          onChange={handleChange}
          placeholder="Enter crop name"
          className="border-accent/30"
        />
      </div>

      <div>
        <Label htmlFor="season" className="text-foreground font-medium mb-2 block">Season</Label>
        <Select value={formData.season} onValueChange={handleSeasonChange}>
          <SelectTrigger className="border-accent/30">
            <SelectValue placeholder="Select a season" />
          </SelectTrigger>
          <SelectContent className="border-accent/20">
            {seasons.map(season => (
              <SelectItem key={season} value={season}>{season}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="duration" className="text-foreground font-medium mb-2 block">Duration (days)</Label>
        <Input
          id="duration"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          placeholder="Enter duration in days"
          type="number"
          min="1"
          className="border-accent/30"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-primary/90 text-white"
      >
        {loading ? (
          <>
            <Spinner className="w-4 h-4 mr-2" />
            Creating...
          </>
        ) : (
          'Add Crop'
        )}
      </Button>
    </form>
  );
}
