'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2, Search } from 'lucide-react';
import { useState } from 'react';
import EditCropDialog from './edit-crop-dialog';

interface CropsListProps {
  crops: any[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onDelete: (id: number) => void;
  search: string;
  onSearchChange: (search: string) => void;
}

export default function CropsList({
  crops,
  loading,
  currentPage,
  totalPages,
  onPageChange,
  onDelete,
  search,
  onSearchChange,
}: CropsListProps) {
  const [editingCrop, setEditingCrop] = useState<any>(null);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by crop name or season..."
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
              <th className="text-left py-3 px-4 font-semibold text-foreground">Crop Name</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Season</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Duration (days)</th>
              <th className="text-right py-3 px-4 font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-muted-foreground">
                  Loading...
                </td>
              </tr>
            ) : crops.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-muted-foreground">
                  No crops found
                </td>
              </tr>
            ) : (
              crops.map((crop) => (
                <tr key={crop.CropID} className="border-b border-accent/10 hover:bg-secondary/50 transition-colors">
                  <td className="py-3 px-4 font-medium">{crop.CropName}</td>
                  <td className="py-3 px-4">{crop.Season}</td>
                  <td className="py-3 px-4">{crop.Duration}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setEditingCrop(crop)}
                      className="text-primary hover:text-primary/80 mr-2 inline-flex items-center gap-1"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(crop.CropID)}
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
      {editingCrop && (
        <EditCropDialog
          crop={editingCrop}
          onClose={() => setEditingCrop(null)}
          onSuccess={() => {
            setEditingCrop(null);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
