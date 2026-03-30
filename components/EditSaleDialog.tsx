'use client';

import { useState, useEffect } from 'react';
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

interface EditSaleDialogProps {
  sale: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditSaleDialog({
  sale,
  onClose,
  onSuccess,
}: EditSaleDialogProps) {
  const [formData, setFormData] = useState({
    date: sale.Date,
    quantity: sale.Quantity.toString(),
    price: sale.Price.toString(),
    cropId: sale.CropID.toString(),
    marketId: sale.MarketID.toString(),
  });
  const [crops, setCrops] = useState<any[]>([]);
  const [markets, setMarkets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [revenue, setRevenue] = useState(sale.Revenue);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.quantity && formData.price) {
      setRevenue(parseFloat(formData.quantity) * parseFloat(formData.price));
    }
  }, [formData.quantity, formData.price]);

  const fetchData = async () => {
    try {
      const [cropsRes, marketsRes] = await Promise.all([
        fetch('/api/crops?limit=999'),
        fetch('/api/markets'),
      ]);
      const cropsData = await cropsRes.json();
      const marketsData = await marketsRes.json();

      setCrops(cropsData.data || []);
      setMarkets(marketsData || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCropChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      cropId: value,
    }));
  };

  const handleMarketChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      marketId: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/sales/${sale.SaleID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: formData.date,
          quantity: parseFloat(formData.quantity),
          price: parseFloat(formData.price),
          cropId: parseInt(formData.cropId),
          marketId: parseInt(formData.marketId),
        }),
      });

      if (res.ok) {
        toast.success('Sale updated successfully');
        onSuccess();
      } else {
        toast.error('Failed to update sale');
      }
    } catch (error) {
      toast.error('Error updating sale');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-card border-accent/20">
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit Sale</DialogTitle>
          <DialogDescription>Update sale information</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <Label className="text-foreground font-medium mb-2 block">Date</Label>
            <Input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className="border-accent/30"
            />
          </div>

          <div>
            <Label className="text-foreground font-medium mb-2 block">Crop</Label>
            <Select value={formData.cropId} onValueChange={handleCropChange}>
              <SelectTrigger className="border-accent/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-accent/20">
                {crops.map(crop => (
                  <SelectItem key={crop.CropID} value={crop.CropID.toString()}>
                    {crop.CropName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-foreground font-medium mb-2 block">Market</Label>
            <Select value={formData.marketId} onValueChange={handleMarketChange}>
              <SelectTrigger className="border-accent/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-accent/20">
                {markets.map(market => (
                  <SelectItem key={market.MarketID} value={market.MarketID.toString()}>
                    {market.MarketName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-foreground font-medium mb-2 block">Quantity</Label>
            <Input
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              type="number"
              step="0.01"
              min="0"
              className="border-accent/30"
            />
          </div>

          <div>
            <Label className="text-foreground font-medium mb-2 block">Price (₹)</Label>
            <Input
              name="price"
              value={formData.price}
              onChange={handleChange}
              type="number"
              step="0.01"
              min="0"
              className="border-accent/30"
            />
          </div>

          {revenue > 0 && (
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-3">
              <div className="text-sm text-muted-foreground">Calculated Revenue</div>
              <div className="text-2xl font-bold text-accent">₹{revenue.toFixed(2)}</div>
            </div>
          )}

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
