"use client";

import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Trash2, X } from "lucide-react";

export function BulkActionsBar({
  count,
  onClear,
  onPublish,
  onHide,
  onDelete,
  loading,
}: {
  count: number;
  onClear: () => void;
  onPublish: () => void;
  onHide: () => void;
  onDelete: () => void;
  loading?: boolean;
}) {
  if (count === 0) return null;

  return (
    <div className="bg-blue/10 border border-blue/30 rounded-2xl px-5 py-3 flex items-center gap-4 flex-wrap animate-fadeUp">
      <button onClick={onClear} className="flex items-center gap-1.5 text-sm font-semibold text-blue-2">
        <X className="w-4 h-4" />
        {count} selected
      </button>
      <div className="flex items-center gap-2 ml-auto">
        <Button variant="outline" size="sm" onClick={onPublish} disabled={loading}>
          <Eye className="w-3.5 h-3.5" /> Publish
        </Button>
        <Button variant="outline" size="sm" onClick={onHide} disabled={loading}>
          <EyeOff className="w-3.5 h-3.5" /> Hide
        </Button>
        <Button variant="danger" size="sm" onClick={onDelete} disabled={loading}>
          <Trash2 className="w-3.5 h-3.5" /> Delete
        </Button>
      </div>
    </div>
  );
}
