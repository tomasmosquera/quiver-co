"use client";

import { useRef, useState } from "react";
import { Upload, X, ImagePlus, Loader2, GripVertical } from "lucide-react";

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
  uploading: boolean;
  onUpload: (files: FileList) => void;
  onCancelUpload?: () => void;
}

export default function PhotoUploader({ images, onChange, uploading, onUpload, onCancelUpload }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const dragItem = useRef<number | null>(null);

  function handleDragStart(i: number) {
    dragItem.current = i;
  }

  function handleDragEnter(i: number) {
    setDragOver(i);
  }

  function handleDragEnd() {
    const from = dragItem.current;
    const to = dragOver;
    if (from === null || to === null || from === to) {
      dragItem.current = null;
      setDragOver(null);
      return;
    }
    const reordered = [...images];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    onChange(reordered);
    dragItem.current = null;
    setDragOver(null);
  }

  function removeImage(url: string) {
    onChange(images.filter(u => u !== url));
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 mb-3">
        {images.map((url, i) => (
          <div
            key={url}
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragEnter={() => handleDragEnter(i)}
            onDragEnd={handleDragEnd}
            onDragOver={e => e.preventDefault()}
            className={`relative aspect-square rounded-xl overflow-hidden bg-[#F9FAFB] border-2 transition-all cursor-grab active:cursor-grabbing ${
              dragOver === i ? "border-[#3B82F6] scale-95 opacity-70" : "border-[#E5E7EB]"
            }`}
          >
            <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />

            {/* Etiqueta principal */}
            {i === 0 && (
              <span className="absolute top-1.5 left-1.5 bg-[#111827] text-white text-xs px-2 py-0.5 rounded-full select-none">
                Principal
              </span>
            )}

            {/* Grip hint */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-white/70 pointer-events-none">
              <GripVertical className="w-4 h-4" />
            </div>

            {/* Botón eliminar */}
            <button
              onMouseDown={e => e.stopPropagation()}
              onClick={() => removeImage(url)}
              className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 z-10"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {images.length < 8 && (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-xl border-2 border-dashed border-[#D1D5DB] hover:border-[#3B82F6] flex flex-col items-center justify-center gap-1.5 text-[#9CA3AF] hover:text-[#3B82F6] transition-all disabled:opacity-50"
          >
            {uploading
              ? <Loader2 className="w-5 h-5 animate-spin" />
              : <><ImagePlus className="w-5 h-5" /><span className="text-xs">Agregar</span></>
            }
          </button>
        )}
      </div>

      <button
        onClick={() => fileRef.current?.click()}
        disabled={uploading || images.length >= 8}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-[#D1D5DB] hover:border-[#3B82F6] rounded-xl text-sm text-[#6B7280] hover:text-[#3B82F6] transition-all disabled:opacity-50"
      >
        <Upload className="w-4 h-4" />
        {uploading ? "Subiendo..." : "Seleccionar fotos"}
      </button>
      {uploading && onCancelUpload && (
        <button
          type="button"
          onClick={onCancelUpload}
          className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 border border-red-200 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <X className="w-4 h-4" />
          Cancelar subida
        </button>
      )}

      <p className="text-xs text-[#9CA3AF] text-center mt-2">
        JPG, PNG o WEBP · Máx. 8 fotos · {images.length}/8 · Arrastra para reordenar
      </p>
      <p className="text-xs text-[#9CA3AF] text-center mt-1">
        Las fotos grandes se optimizan automáticamente antes de subirlas
      </p>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) onUpload(e.target.files);
          e.currentTarget.value = "";
        }}
      />
    </div>
  );
}
