import { useState, useRef, useEffect } from "react";
import PDFDocument, { type PDFData } from "./PDFDocument";

type PDFState =
  | "generating"
  | "ready"
  | "failed"
  | "downloading"
  | "downloaded"
  | "emailing"
  | "emailed"
  | "email-failed"
  | "no-permission";

interface Props {
  data: PDFData;
  onClose: () => void;
}

const docPrefix: Record<PDFData["type"], string> = {
  invoice:   "Invoice",
  quotation: "Quotation",
  receipt:   "Receipt",
  billing:   "Billing",
};

export default function PDFPreviewModal({ data, onClose }: Props) {
  const [pdfState, setPdfState] = useState<PDFState>("generating");
  const [zoom, setZoom] = useState(0.7);
  const [emailNote, setEmailNote] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  /* Simulate generation delay */
  useEffect(() => {
    const t = setTimeout(() => setPdfState("ready"), 1100);
    return () => clearTimeout(t);
  }, []);

  const filename = `${docPrefix[data.type]}_${data.docNumber}.pdf`;

  function handlePrint() {
    const content = printRef.current;
    if (!content) return;
    const w = window.open("", "_blank", "width=900,height=1100");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head>
      <meta charset="utf-8">
      <title>${filename}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #fff; }
        @media print { body { margin: 0; } }
      </style>
    </head><body>${content.innerHTML}</body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); }, 600);
  }

  function handleDownload() {
    setPdfState("downloading");
    setTimeout(() => {
      handlePrint();
      setPdfState("downloaded");
      setTimeout(() => setPdfState("ready"), 2000);
    }, 600);
  }

  function handleEmail() {
    setPdfState("emailing");
    setTimeout(() => {
      setPdfState("emailed");
      setEmailNote(`PDF sent to ${data.customer.email}`);
      setTimeout(() => { setPdfState("ready"); setEmailNote(null); }, 3000);
    }, 1500);
  }

  const zoomOptions = [0.5, 0.65, 0.8, 1.0, 1.2];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "rgba(0,0,0,0.82)" }}
    >
      {/* ── Toolbar ── */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-white/10"
           style={{ background: "#0f172a" }}>
        <div className="flex items-center gap-2 mr-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white"
               style={{ background: "#2563EB" }}>
            PDF
          </div>
          <div>
            <div className="text-white text-sm font-semibold leading-tight">{filename}</div>
            <div className="text-slate-400 text-xs">{data.docNumber}</div>
          </div>
        </div>

        <div className="flex items-center gap-1 ml-2 mr-4">
          {zoomOptions.map(z => (
            <button
              key={z}
              onClick={() => setZoom(z)}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                zoom === z
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {Math.round(z * 100)}%
            </button>
          ))}
          <button onClick={() => setZoom(z => Math.max(0.4, z - 0.1))}
                  className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded">−</button>
          <button onClick={() => setZoom(z => Math.min(1.5, z + 0.1))}
                  className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded">+</button>
        </div>

        <div className="flex-1" />

        {/* State indicator */}
        {pdfState === "generating" && (
          <span className="flex items-center gap-2 text-blue-400 text-sm">
            <span className="inline-block w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            Generating…
          </span>
        )}
        {pdfState === "downloading" && (
          <span className="flex items-center gap-2 text-amber-400 text-sm">
            <span className="inline-block w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            Preparing download…
          </span>
        )}
        {pdfState === "downloaded" && (
          <span className="flex items-center gap-2 text-green-400 text-sm">✓ Downloaded</span>
        )}
        {pdfState === "emailing" && (
          <span className="flex items-center gap-2 text-purple-400 text-sm">
            <span className="inline-block w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
            Sending email…
          </span>
        )}
        {pdfState === "emailed" && (
          <span className="flex items-center gap-2 text-green-400 text-sm">✓ {emailNote}</span>
        )}

        {/* Action buttons */}
        <button
          onClick={handleEmail}
          disabled={pdfState === "generating" || pdfState === "emailing"}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 bg-white/10 hover:bg-white/20 disabled:opacity-40 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Email
        </button>
        <button
          onClick={handlePrint}
          disabled={pdfState === "generating"}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 bg-white/10 hover:bg-white/20 disabled:opacity-40 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print
        </button>
        <button
          onClick={handleDownload}
          disabled={pdfState === "generating" || pdfState === "downloading"}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download PDF
        </button>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* ── Preview area ── */}
      <div className="flex-1 overflow-auto flex items-start justify-center py-8"
           style={{ background: "#1e293b" }}>
        {pdfState === "generating" ? (
          <div className="flex flex-col items-center justify-center gap-4 text-slate-400 mt-32">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <div className="text-sm">Generating document…</div>
          </div>
        ) : pdfState === "no-permission" ? (
          <div className="flex flex-col items-center justify-center gap-4 text-slate-400 mt-32">
            <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-3xl">🔒</div>
            <div className="text-base font-semibold text-slate-300">No Permission</div>
            <div className="text-sm">You are not authorized to view this document.</div>
          </div>
        ) : (
          <div
            ref={printRef}
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
              marginBottom: zoom < 1 ? `-${(1 - zoom) * 297 * 3.78}px` : "0",
            }}
          >
            <PDFDocument data={data} />
          </div>
        )}
      </div>
    </div>
  );
}
