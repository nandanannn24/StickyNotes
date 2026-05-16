"use client";

import { useState, useRef } from "react";
import { useTheme } from "../ThemeProvider";
import { Upload, Download, X, ImageIcon } from "lucide-react";

export default function ImageToPdfTool() {
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { activePreset } = useTheme();

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.filter((f) => f.type.startsWith("image/")).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (idx: number) => {
    URL.revokeObjectURL(images[idx].preview);
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const convertToPdf = async () => {
    if (images.length === 0) return;
    setIsConverting(true);
    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF();

      for (let i = 0; i < images.length; i++) {
        if (i > 0) pdf.addPage();
        const img = images[i];
        const dataUrl = await readFileAsDataUrl(img.file);
        const dims = await getImageDimensions(dataUrl);
        const pageW = pdf.internal.pageSize.getWidth();
        const pageH = pdf.internal.pageSize.getHeight();
        const ratio = Math.min(pageW / dims.width, pageH / dims.height) * 0.9;
        const w = dims.width * ratio;
        const h = dims.height * ratio;
        const x = (pageW - w) / 2;
        const y = (pageH - h) / 2;
        pdf.addImage(dataUrl, "JPEG", x, y, w, h);
      }

      pdf.save(`images-to-pdf-${Date.now()}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Conversion failed");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-subtle)] p-5">
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
        <button onClick={() => fileRef.current?.click()}
          className="w-full border-2 border-dashed border-[var(--border-subtle)] rounded-xl p-8 flex flex-col items-center gap-3 text-[var(--text-muted)] hover:border-[var(--border-hover)] hover:text-[var(--text-secondary)] transition-all">
          <Upload className="w-8 h-8" />
          <span className="text-sm font-medium">Click to add images</span>
          <span className="text-xs">PNG, JPG, WEBP supported</span>
        </button>
      </div>

      {images.length > 0 && (
        <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-subtle)] p-5 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[var(--text-primary)]">{images.length} image(s)</p>
            <button onClick={() => { images.forEach((i) => URL.revokeObjectURL(i.preview)); setImages([]); }}
              className="text-xs text-red-400 hover:text-red-300">Clear all</button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {images.map((img, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden bg-black/20 aspect-square">
                <img src={img.preview} alt="" className="w-full h-full object-cover" />
                <button onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 p-1 rounded-lg bg-black/60 hover:bg-black/80 text-white"><X className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
          <button onClick={convertToPdf} disabled={isConverting}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white shadow-lg disabled:opacity-50 transition-all"
            style={{ background: `linear-gradient(135deg, ${activePreset.accentPrimary}, ${activePreset.accentSecondary})` }}>
            <Download className="w-4 h-4" />
            {isConverting ? "Converting..." : "Convert to PDF"}
          </button>
        </div>
      )}
    </div>
  );
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.src = dataUrl;
  });
}
