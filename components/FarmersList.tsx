'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2, Search } from 'lucide-react';
import { useState } from 'react';
import EditFarmerDialog from './EditFarmerDialog';

interface FarmersListProps {
  farmers: any[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onDelete: (id: number) => void;
  search: string;
  onSearchChange: (search: string) => void;
}

export default function FarmersList({
  farmers,
  loading,
  currentPage,
  totalPages,
  onPageChange,
  onDelete,
  search,
  onSearchChange,
}: FarmersListProps) {
  const [editingFarmer, setEditingFarmer] = useState<any>(null);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or phone..."
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
              <th className="text-left py-3 px-4 font-semibold text-foreground">Name</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Phone</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Address</th>
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
            ) : farmers.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-muted-foreground">
                  No farmers found
                </td>
              </tr>
            ) : (
              farmers.map((farmer) => (
                <tr key={farmer.FarmerID} className="border-b border-accent/10 hover:bg-secondary/50 transition-colors">
                  <td className="py-3 px-4">{farmer.Name}</td>
                  <td className="py-3 px-4">{farmer.Phone}</td>
                  <td className="py-3 px-4 text-sm">{farmer.Address}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setEditingFarmer(farmer)}
                      className="text-primary hover:text-primary/80 mr-2 inline-flex items-center gap-1"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(farmer.FarmerID)}
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
      {editingFarmer && (
        <EditFarmerDialog
          farmer={editingFarmer}
          onClose={() => setEditingFarmer(null)}
          onSuccess={() => {
            setEditingFarmer(null);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
