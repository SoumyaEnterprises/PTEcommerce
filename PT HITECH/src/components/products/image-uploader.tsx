"use client";

import { useCallback, useRef, useState } from "react";
import { UploadCloud, X, Star } from "lucide-react";
import { cn } from "@/lib/cn";
import type { ProductImage } from "@/types";
import { toast } from "@/store/toast-store";

const MAX_FILES = 8;
const MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ImageUploader({
  images,
  onChange,
}: {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
}) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const list = Array.from(files);
      const accepted: ProductImage[] = [];

      for (const file of list) {
        if (images.length + accepted.length >= MAX_FILES) {
          toast.error("Too many images", `You can upload up to ${MAX_FILES} images per product.`);
          break;
        }
        if (!ACCEPTED_TYPES.includes(file.type)) {
          toast.error("Unsupported file type", `"${file.name}" must be JPG, PNG, or WEBP.`);
          continue;
        }
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
          toast.error("File too large", `"${file.name}" exceeds the ${MAX_SIZE_MB}MB limit.`);
          continue;
        }
        // Demo only: object URLs are local-session previews and are
        // never uploaded anywhere. A live build would upload `file` to
        // Supabase Storage here and use the returned public URL instead.
        const url = URL.createObjectURL(file);
        accepted.push({ id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, url, isThumbnail: false });
      }

      if (accepted.length === 0) return;

      const merged = [...images, ...accepted];
      if (!merged.some((i) => i.isThumbnail) && merged.length > 0) merged[0].isThumbnail = true;
      onChange(merged);
      toast.success(`${accepted.length} image(s) added`, "Previewed locally — not uploaded anywhere in this demo.");
    },
    [images, onChange]
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  }

  function setThumbnail(id: string) {
    onChange(images.map((img) => ({ ...img, isThumbnail: img.id === id })));
  }

  function removeImage(id: string) {
    const wasThumbnail = images.find((i) => i.id === id)?.isThumbnail;
    const remaining = images.filter((i) => i.id !== id);
    if (wasThumbnail && remaining.length > 0) remaining[0].isThumbnail = true;
    onChange(remaining);
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-2xl py-10 px-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors",
          dragActive ? "border-blue-2 bg-blue/5" : "border-border hover:border-border-2"
        )}
      >
        <UploadCloud className="w-8 h-8 text-blue-2" />
        <div className="text-sm font-semibold text-text">Drag & drop images here, or click to browse</div>
        <div className="text-xs text-text-3">JPG, PNG, or WEBP — up to {MAX_SIZE_MB}MB each, {MAX_FILES} images max</div>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {images.map((img) => (
            <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden border border-border bg-bg-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" className="w-full h-full object-contain p-1.5" />

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(img.id);
                }}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-lg bg-black/70 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setThumbnail(img.id);
                }}
                className={cn(
                  "absolute bottom-1.5 left-1.5 right-1.5 rounded-lg text-[10px] font-semibold py-1 flex items-center justify-center gap-1 transition-colors",
                  img.isThumbnail ? "bg-blue text-white" : "bg-black/60 text-white/80 opacity-0 group-hover:opacity-100"
                )}
              >
                <Star className="w-2.5 h-2.5" fill={img.isThumbnail ? "currentColor" : "none"} />
                {img.isThumbnail ? "Thumbnail" : "Set as thumbnail"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
