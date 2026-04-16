"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Tag } from "lucide-react";

interface GalleryImage {
  id: string;
  url: string;
}

interface Props {
  images: GalleryImage[];
  title: string;
}

export default function ImageGallery({ images, title }: Props) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const prev = useCallback(() => {
    setActive(i => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => {
    setActive(i => (i + 1) % images.length);
  }, [images.length]);

  const prevLight = useCallback(() => {
    setLightbox(i => i === null ? null : (i - 1 + images.length) % images.length);
  }, [images.length]);

  const nextLight = useCallback(() => {
    setLightbox(i => i === null ? null : (i + 1) % images.length);
  }, [images.length]);

  // Teclado en lightbox
  useEffect(() => {
    if (lightbox === null) return;
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowLeft")  prevLight();
      if (e.key === "ArrowRight") nextLight();
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, prevLight, nextLight]);

  // Bloquear scroll cuando lightbox está abierto
  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  if (images.length === 0) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
        <div className="aspect-[4/3] bg-[#F9FAFB] flex items-center justify-center text-[#D1D5DB]">
          <Tag className="w-16 h-16" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
        {/* Foto principal */}
        <div
          className="relative aspect-[4/3] bg-[#F9FAFB] cursor-zoom-in group"
          onClick={() => setLightbox(active)}
        >
          <img
            src={images[active].url}
            alt={title}
            className="w-full h-full object-cover"
          />
          {/* Flecha izquierda */}
          {images.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); prev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-5 h-5 text-[#111827]" />
              </button>
              <button
                onClick={e => { e.stopPropagation(); next(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-5 h-5 text-[#111827]" />
              </button>
              {/* Contador */}
              <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
                {active + 1} / {images.length}
              </span>
            </>
          )}
          {/* Hint zoom */}
          <span className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            Clic para ampliar
          </span>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 p-3 overflow-x-auto">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setActive(i)}
                className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  i === active
                    ? "border-[#3B82F6] opacity-100"
                    : "border-transparent opacity-60 hover:opacity-90"
                }`}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); prevLight(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={e => { e.stopPropagation(); nextLight(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}

          <img
            src={images[lightbox].url}
            alt={title}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl"
            onClick={e => e.stopPropagation()}
          />

          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); setLightbox(i); }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === lightbox ? "bg-white scale-125" : "bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
