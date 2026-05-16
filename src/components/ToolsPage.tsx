"use client";

import { useState } from "react";
import { useTheme } from "./ThemeProvider";
import { QrCode, FileText, Image, ArrowRightLeft } from "lucide-react";
import QRCodeTool from "./tools/QRCodeTool";
import ImageToPdfTool from "./tools/ImageToPdfTool";
import PdfToWordTool from "./tools/PdfToWordTool";
import WordToPdfTool from "./tools/WordToPdfTool";

const TOOLS = [
  { id: "qrcode", name: "QR Code Generator", icon: QrCode, desc: "Generate QR codes from any text or URL" },
  { id: "img2pdf", name: "Image to PDF", icon: Image, desc: "Convert images to PDF documents" },
  { id: "pdf2word", name: "PDF to Word", icon: FileText, desc: "Extract text from PDF to Word format" },
  { id: "word2pdf", name: "Word to PDF", icon: ArrowRightLeft, desc: "Convert Word documents to PDF" },
] as const;

type ToolId = (typeof TOOLS)[number]["id"];

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  const { activePreset } = useTheme();

  const renderTool = () => {
    switch (activeTool) {
      case "qrcode": return <QRCodeTool />;
      case "img2pdf": return <ImageToPdfTool />;
      case "pdf2word": return <PdfToWordTool />;
      case "word2pdf": return <WordToPdfTool />;
      default: return null;
    }
  };

  if (activeTool) {
    const tool = TOOLS.find((t) => t.id === activeTool)!;
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <button
          onClick={() => setActiveTool(null)}
          className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-6 transition-colors"
        >
          ← Back to Tools
        </button>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
            style={{ background: `linear-gradient(135deg, ${activePreset.accentPrimary}, ${activePreset.accentSecondary})` }}>
            <tool.icon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">{tool.name}</h2>
            <p className="text-xs text-[var(--text-muted)]">{tool.desc}</p>
          </div>
        </div>
        {renderTool()}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">🛠️ Productivity Tools</h2>
        <p className="text-sm text-[var(--text-muted)]">Quick utilities to boost your workflow</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TOOLS.map((tool) => (
          <button key={tool.id} onClick={() => setActiveTool(tool.id)}
            className="group text-left p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)]
                       hover:border-[var(--border-hover)] hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-transform group-hover:scale-110"
                style={{ background: `linear-gradient(135deg, ${activePreset.accentPrimary}, ${activePreset.accentSecondary})` }}>
                <tool.icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">{tool.name}</h3>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">{tool.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
