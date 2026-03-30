'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EditCropDialogProps {
  crop: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditCropDialog({
  crop,
  onClose,
  onSuccess,
}: EditCropDialogProps) {
  const [formData, setFormData] = useState({
    cropName: crop.CropName,
    season: crop.Season,
    duration: crop.Duration.toString(),
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
    setLoading(true);

    try {
      const res = await fetch(`/api/crops/${crop.CropID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName: formData.cropName,
          season: formData.season,
          duration: parseInt(formData.duration),
        }),
      });

      if (res.ok) {
        toast.success('Crop updated successfully');
        onSuccess();
      } else {
        toast.error('Failed to update crop');
      }
    } catch (error) {
      toast.error('Error updating crop');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-card border-accent/20">
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit Crop</DialogTitle>
          <DialogDescription>Update crop information</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-foreground font-medium mb-2 block">Crop Name</Label>
            <Input
              name="cropName"
              value={formData.cropName}
              onChange={handleChange}
              className="border-accent/30"
            />
          </div>

          <div>
            <Label className="text-foreground font-medium mb-2 block">Season</Label>
            <Select value={formData.season} onValueChange={handleSeasonChange}>
              <SelectTrigger className="border-accent/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-accent/20">
                {seasons.map(season => (
                  <SelectItem key={season} value={season}>{season}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-foreground font-medium mb-2 block">Duration (days)</Label>
            <Input
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              type="number"
              min="1"
              className="border-accent/30"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary hover:bg-primary/90 text-white"
            >
              {loading ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
