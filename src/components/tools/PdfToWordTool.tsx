"use client";

import { useState, useRef } from "react";
import { useTheme } from "../ThemeProvider";
import { Upload, Download, FileText, Loader2 } from "lucide-react";

export default function PdfToWordTool() {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { activePreset } = useTheme();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.type === "application/pdf") {
      setFile(f);
      setExtractedText(null);
    } else {
      alert("Please select a PDF file");
    }
  };

  const convert = async () => {
    if (!file) return;
    setIsConverting(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      // Use pdf.js to extract text
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item: any) => item.str).join(" ");
        fullText += `--- Page ${i} ---\n${pageText}\n\n`;
      }

      setExtractedText(fullText || "No text content found in this PDF.");
    } catch (err) {
      console.error(err);
      alert("Failed to extract text from PDF");
    } finally {
      setIsConverting(false);
    }
  };

  const downloadAsDocx = async () => {
    if (!extractedText) return;
    try {
      const { Document, Packer, Paragraph, TextRun } = await import("docx");
      const paragraphs = extractedText.split("\n").map(
        (line) => new Paragraph({ children: [new TextRun(line)] })
      );
      const doc = new Document({ sections: [{ children: paragraphs }] });
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${file?.name.replace(".pdf", "")}-converted.docx`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      // Fallback: download as .txt
      const blob = new Blob([extractedText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${file?.name.replace(".pdf", "")}-converted.txt`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-subtle)] p-5">
        <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={handleFile} />
        <button onClick={() => fileRef.current?.click()}
          className="w-full border-2 border-dashed border-[var(--border-subtle)] rounded-xl p-8 flex flex-col items-center gap-3 text-[var(--text-muted)] hover:border-[var(--border-hover)] hover:text-[var(--text-secondary)] transition-all">
          <Upload className="w-8 h-8" />
          <span className="text-sm font-medium">{file ? file.name : "Select a PDF file"}</span>
          <span className="text-xs">PDF files only</span>
        </button>
      </div>

      {file && !extractedText && (
        <button onClick={convert} disabled={isConverting}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white shadow-lg disabled:opacity-50 transition-all animate-fade-in"
          style={{ background: `linear-gradient(135deg, ${activePreset.accentPrimary}, ${activePreset.accentSecondary})` }}>
          {isConverting ? <><Loader2 className="w-4 h-4 animate-spin" /> Extracting text...</> : <><FileText className="w-4 h-4" /> Extract & Convert</>}
        </button>
      )}

      {extractedText && (
        <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-subtle)] p-5 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[var(--text-primary)]">Extracted Text</p>
            <button onClick={downloadAsDocx}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-lg transition-all"
              style={{ background: `linear-gradient(135deg, ${activePreset.accentPrimary}, ${activePreset.accentSecondary})` }}>
              <Download className="w-3.5 h-3.5" /> Download DOCX
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto bg-[var(--input-bg)] rounded-xl p-4 text-xs text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed font-mono">
            {extractedText}
          </div>
        </div>
      )}
    </div>
  );
}
