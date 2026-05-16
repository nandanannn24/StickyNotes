"use client";

import { useState, useRef } from "react";
import { useTheme } from "../ThemeProvider";
import { Upload, Download, Loader2, FileText } from "lucide-react";

export default function WordToPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { activePreset } = useTheme();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && (f.name.endsWith(".docx") || f.name.endsWith(".doc"))) {
      setFile(f);
      setHtmlContent(null);
    } else {
      alert("Please select a Word document (.docx)");
    }
  };

  const convert = async () => {
    if (!file) return;
    setIsConverting(true);
    try {
      const mammoth = (await import("mammoth")).default;
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setHtmlContent(result.value);
    } catch (err) {
      console.error(err);
      alert("Failed to read Word document");
    } finally {
      setIsConverting(false);
    }
  };

  const downloadPdf = async () => {
    if (!htmlContent) return;
    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ unit: "mm", format: "a4" });
      // Strip HTML tags for plain text approach
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlContent;
      const text = tempDiv.textContent || tempDiv.innerText || "";
      const lines = pdf.splitTextToSize(text, 180);
      let y = 15;
      const pageH = pdf.internal.pageSize.getHeight();

      for (const line of lines) {
        if (y > pageH - 15) { pdf.addPage(); y = 15; }
        pdf.text(line, 15, y);
        y += 6;
      }

      pdf.save(`${file?.name.replace(/\.docx?$/, "")}-converted.pdf`);
    } catch (err) {
      console.error(err);
      alert("PDF generation failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-subtle)] p-5">
        <input ref={fileRef} type="file" accept=".docx,.doc" className="hidden" onChange={handleFile} />
        <button onClick={() => fileRef.current?.click()}
          className="w-full border-2 border-dashed border-[var(--border-subtle)] rounded-xl p-8 flex flex-col items-center gap-3 text-[var(--text-muted)] hover:border-[var(--border-hover)] hover:text-[var(--text-secondary)] transition-all">
          <Upload className="w-8 h-8" />
          <span className="text-sm font-medium">{file ? file.name : "Select a Word document"}</span>
          <span className="text-xs">.docx files supported</span>
        </button>
      </div>

      {file && !htmlContent && (
        <button onClick={convert} disabled={isConverting}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white shadow-lg disabled:opacity-50 transition-all animate-fade-in"
          style={{ background: `linear-gradient(135deg, ${activePreset.accentPrimary}, ${activePreset.accentSecondary})` }}>
          {isConverting ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : <><FileText className="w-4 h-4" /> Convert to PDF</>}
        </button>
      )}

      {htmlContent && (
        <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-subtle)] p-5 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[var(--text-primary)]">Preview</p>
            <button onClick={downloadPdf}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-lg transition-all"
              style={{ background: `linear-gradient(135deg, ${activePreset.accentPrimary}, ${activePreset.accentSecondary})` }}>
              <Download className="w-3.5 h-3.5" /> Download PDF
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto bg-[var(--input-bg)] rounded-xl p-4 text-xs text-[var(--text-secondary)] leading-relaxed prose prose-sm"
            dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
      )}
    </div>
  );
}
