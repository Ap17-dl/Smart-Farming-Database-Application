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

interface EditFarmerDialogProps {
  farmer: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditFarmerDialog({
  farmer,
  onClose,
  onSuccess,
}: EditFarmerDialogProps) {
  const [formData, setFormData] = useState({
    name: farmer.Name,
    phone: farmer.Phone,
    address: farmer.Address,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/farmers/${farmer.FarmerID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success('Farmer updated successfully');
        onSuccess();
      } else {
        toast.error('Failed to update farmer');
      }
    } catch (error) {
      toast.error('Error updating farmer');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-card border-accent/20">
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit Farmer</DialogTitle>
          <DialogDescription>Update farmer information</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-foreground font-medium mb-2 block">Name</Label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border-accent/30"
            />
          </div>

          <div>
            <Label className="text-foreground font-medium mb-2 block">Phone</Label>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              type="tel"
              className="border-accent/30"
            />
          </div>

          <div>
            <Label className="text-foreground font-medium mb-2 block">Address</Label>
            <Input
              name="address"
              value={formData.address}
              onChange={handleChange}
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
