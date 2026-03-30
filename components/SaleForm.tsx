'use client';

import { useState, useEffect } from 'react';
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

interface SaleFormProps {
  onSubmit?: () => void;
}

export default function SaleForm({ onSubmit }: SaleFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    quantity: '',
    price: '',
    cropId: '',
    marketId: '',
  });
  const [crops, setCrops] = useState<any[]>([]);
  const [markets, setMarkets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.quantity && formData.price) {
      setRevenue(parseFloat(formData.quantity) * parseFloat(formData.price));
    } else {
      setRevenue(0);
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
      toast.error('Failed to load crops and markets');
      console.error(error);
    } finally {
      setLoadingData(false);
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

    if (!formData.date || !formData.quantity || !formData.price || !formData.cropId || !formData.marketId) {
      toast.error('All fields are required');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/sales', {
        method: 'POST',
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
        toast.success('Sale created successfully');
        setFormData({
          date: new Date().toISOString().split('T')[0],
          quantity: '',
          price: '',
          cropId: '',
          marketId: '',
        });
        onSubmit?.();
      } else {
        toast.error('Failed to create sale');
      }
    } catch (error) {
      toast.error('Error creating sale');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      <div>
        <Label htmlFor="date" className="text-foreground font-medium mb-2 block">Date</Label>
        <Input
          id="date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          className="border-accent/30"
        />
      </div>

      <div>
        <Label htmlFor="cropId" className="text-foreground font-medium mb-2 block">Crop</Label>
        <Select value={formData.cropId} onValueChange={handleCropChange}>
          <SelectTrigger className="border-accent/30">
            <SelectValue placeholder="Select a crop" />
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
        <Label htmlFor="marketId" className="text-foreground font-medium mb-2 block">Market</Label>
        <Select value={formData.marketId} onValueChange={handleMarketChange}>
          <SelectTrigger className="border-accent/30">
            <SelectValue placeholder="Select a market" />
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
        <Label htmlFor="quantity" className="text-foreground font-medium mb-2 block">Quantity</Label>
        <Input
          id="quantity"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          placeholder="Enter quantity"
          type="number"
          step="0.01"
          min="0"
          className="border-accent/30"
        />
      </div>

      <div>
        <Label htmlFor="price" className="text-foreground font-medium mb-2 block">Price (₹)</Label>
        <Input
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Enter price per unit"
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
          'Add Sale'
        )}
      </Button>
    </form>
  );
}
