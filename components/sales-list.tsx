'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2, Search } from 'lucide-react';
import { useState } from 'react';
import EditSaleDialog from './edit-sale-dialog';

interface SalesListProps {
  sales: any[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onDelete: (id: number) => void;
  search: string;
  onSearchChange: (search: string) => void;
}

export default function SalesList({
  sales,
  loading,
  currentPage,
  totalPages,
  onPageChange,
  onDelete,
  search,
  onSearchChange,
}: SalesListProps) {
  const [editingSale, setEditingSale] = useState<any>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by crop name or market..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-accent/20">
              <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Crop</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Market</th>
              <th className="text-right py-3 px-4 font-semibold text-foreground">Quantity</th>
              <th className="text-right py-3 px-4 font-semibold text-foreground">Price (₹)</th>
              <th className="text-right py-3 px-4 font-semibold text-foreground">Revenue (₹)</th>
              <th className="text-right py-3 px-4 font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-muted-foreground">
                  Loading...
                </td>
              </tr>
            ) : sales.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-muted-foreground">
                  No sales found
                </td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr key={sale.SaleID} className="border-b border-accent/10 hover:bg-secondary/50 transition-colors">
                  <td className="py-3 px-4">{formatDate(sale.Date)}</td>
                  <td className="py-3 px-4 font-medium">{sale.CropName}</td>
                  <td className="py-3 px-4">{sale.MarketName}</td>
                  <td className="py-3 px-4 text-right">{sale.Quantity}</td>
                  <td className="py-3 px-4 text-right">{sale.Price}</td>
                  <td className="py-3 px-4 text-right font-bold text-accent">₹{(Number(sale.Revenue) || 0).toFixed(2)}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setEditingSale(sale)}
                      className="text-primary hover:text-primary/80 mr-2 inline-flex items-center gap-1"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(sale.SaleID)}
                      className="text-destructive hover:text-destructive/80 inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-4">
        <div className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="text-xs"
          >
            First
          </Button>
          <Button
            variant="outline"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="text-xs"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="text-xs"
          >
            Next
          </Button>
          <Button
            variant="outline"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="text-xs"
          >
            Last
          </Button>
        </div>
      </div>

      {/* Edit Dialog */}
      {editingSale && (
        <EditSaleDialog
          sale={editingSale}
          onClose={() => setEditingSale(null)}
          onSuccess={() => {
            setEditingSale(null);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
