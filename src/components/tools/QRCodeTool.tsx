"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "../ThemeProvider";
import { Download, Copy, Check } from "lucide-react";

export default function QRCodeTool() {
  const [text, setText] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [size, setSize] = useState(256);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { activePreset } = useTheme();

  const generateQR = async () => {
    if (!text.trim()) return;
    setIsGenerating(true);
    try {
      const QRCode = (await import("qrcode")).default;
      const dataUrl = await QRCode.toDataURL(text.trim(), {
        width: size,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
        errorCorrectionLevel: "M",
      });
      setQrDataUrl(dataUrl);
    } catch (err) {
      console.error("QR generation failed:", err);
      alert("Failed to generate QR code. Input might be too long.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `qrcode-${Date.now()}.png`;
    link.click();
  };

  const copyQR = async () => {
    if (!qrDataUrl) return;
    try {
      const res = await fetch(qrDataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      downloadQR();
    }
  };

  useEffect(() => {
    if (text.trim()) {
      const timer = setTimeout(generateQR, 500);
      return () => clearTimeout(timer);
    } else {
      setQrDataUrl(null);
    }
  }, [text, size]);

  return (
    <div className="space-y-6">
      <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-subtle)] p-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">Content</label>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3}
            placeholder="Enter text, URL, or any content..."
            className="w-full bg-[var(--input-bg)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/50 outline-none border border-[var(--border-subtle)] focus:border-[var(--accent-violet)]/50 resize-none transition-colors" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">Size: {size}px</label>
          <input type="range" min={128} max={512} step={64} value={size} onChange={(e) => setSize(Number(e.target.value))}
            className="w-full accent-[var(--accent-violet)]" />
        </div>
      </div>

      {qrDataUrl && (
        <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-subtle)] p-5 flex flex-col items-center gap-4 animate-fade-in">
          <div className="bg-white rounded-xl p-4 shadow-inner">
            <img src={qrDataUrl} alt="QR Code" width={size} height={size} className="block" />
          </div>
          <canvas ref={canvasRef} className="hidden" />
          <div className="flex items-center gap-3">
            <button onClick={downloadQR}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl active:scale-[0.97]"
              style={{ background: `linear-gradient(135deg, ${activePreset.accentPrimary}, ${activePreset.accentSecondary})` }}>
              <Download className="w-4 h-4" /> Download PNG
            </button>
            <button onClick={copyQR}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.97] border ${
                copied ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" : "bg-[var(--btn-secondary-bg)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:bg-[var(--btn-secondary-hover)]"
              }`}>
              {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
