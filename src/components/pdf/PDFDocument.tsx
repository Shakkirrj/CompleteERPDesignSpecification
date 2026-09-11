import { useRef } from "react";
import mcLogo from "../../assets/merncrest-logo.png";
import { useSettings } from "../../context/SettingsContext";

/* ─── Types ─── */
export interface LineItem {
  no: number;
  description: string;
  qty: number;
  unit: string;
  unitPrice: number;
  discount: number;   // %
  tax: number;        // %
  total: number;
}

export interface PDFData {
  type: "invoice" | "quotation" | "receipt" | "billing";
  docNumber: string;
  date: string;
  dueDate?: string;
  validUntil?: string;
  currency: string;
  exchangeRate?: number;
  salesperson?: string;
  refNumber?: string;
  paymentMethod?: string;
  paymentStatus?: "unpaid" | "partial" | "paid" | "overdue" | "void" | "refunded";
  amountPaid?: number;
  watermark?: "DRAFT" | "PAID" | "CANCELLED" | "VOID" | "PROFORMA" | "OVERDUE";
  customer: {
    name: string;
    company?: string;
    address: string;
    email: string;
    phone: string;
    taxNo?: string;
  };
  items: LineItem[];
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  grandTotal: number;
  balanceDue?: number;
  terms?: string;
  notes?: string;
  preparedBy?: string;
}

/* ─── Formatters ─── */
function fmt(n: number, cur = "LKR") {
  return `${cur} ${n.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function numToWords(n: number): string {
  if (n > 9999999) return "";
  const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine",
    "Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  function below100(x: number): string {
    if (x < 20) return ones[x];
    return tens[Math.floor(x / 10)] + (x % 10 ? " " + ones[x % 10] : "");
  }
  function below1000(x: number): string {
    if (x < 100) return below100(x);
    return ones[Math.floor(x / 100)] + " Hundred" + (x % 100 ? " " + below100(x % 100) : "");
  }
  const int = Math.floor(n);
  const dec = Math.round((n - int) * 100);
  let result = "";
  if (int >= 1000000) { result += below1000(Math.floor(int / 1000000)) + " Million "; }
  if (int >= 1000)    { result += below1000(Math.floor((int % 1000000) / 1000)) + " Thousand "; }
  result += below1000(int % 1000);
  result = result.trim();
  if (dec > 0) result += ` and ${below100(dec)} Cents`;
  return result + " Only";
}

const paymentStatusStyles: Record<string, { bg: string; text: string; border: string; label: string }> = {
  unpaid:   { bg: "#FEF2F2", text: "#991B1B", border: "#FCA5A5", label: "UNPAID"         },
  partial:  { bg: "#FFFBEB", text: "#92400E", border: "#FCD34D", label: "PARTIALLY PAID" },
  paid:     { bg: "#F0FDF4", text: "#166534", border: "#86EFAC", label: "PAID"            },
  overdue:  { bg: "#FFF7ED", text: "#9A3412", border: "#FDBA74", label: "OVERDUE"         },
  void:     { bg: "#F8FAFC", text: "#475569", border: "#CBD5E1", label: "VOID"            },
  refunded: { bg: "#F5F3FF", text: "#5B21B6", border: "#C4B5FD", label: "REFUNDED"       },
};

const docTitles: Record<PDFData["type"], string> = {
  invoice:   "INVOICE",
  quotation: "QUOTATION",
  receipt:   "PAYMENT RECEIPT",
  billing:   "BILLING STATEMENT",
};

/* ══════════════════════════════════════════════
   PDF DOCUMENT COMPONENT — renders as A4 HTML
══════════════════════════════════════════════ */
export default function PDFDocument({ data, forPrint = false }: { data: PDFData; forPrint?: boolean }) {
  const { settings } = useSettings();
  const c   = settings;
  const ps  = data.paymentStatus ? paymentStatusStyles[data.paymentStatus] : null;
  const words = numToWords(data.grandTotal);

  const baseFont = '"Inter", "Helvetica Neue", Arial, sans-serif';
  const monoFont = '"JetBrains Mono", "Courier New", monospace';

  const s: Record<string, React.CSSProperties> = {
    page: {
      width: "210mm",
      minHeight: "297mm",
      margin: "0 auto",
      background: "#fff",
      fontFamily: baseFont,
      fontSize: "9.5pt",
      color: "#1e293b",
      position: "relative",
      boxSizing: "border-box",
      padding: "14mm 16mm 18mm 16mm",
      ...(forPrint ? {} : { boxShadow: "0 4px 40px rgba(0,0,0,0.14)" }),
    },
    watermark: {
      position: "absolute",
      top: "50%", left: "50%",
      transform: "translate(-50%,-50%) rotate(-45deg)",
      fontSize: "72pt",
      fontWeight: 900,
      letterSpacing: "0.05em",
      color: "rgba(0,0,0,0.06)",
      userSelect: "none",
      pointerEvents: "none",
      zIndex: 0,
      whiteSpace: "nowrap",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "10mm",
      paddingBottom: "6mm",
      borderBottom: `3px solid ${c.logoColor}`,
    },
    logoBlock: { display: "flex", alignItems: "center", gap: "10px" },
    logoMark: {
      width: "44px", height: "44px", borderRadius: "8px",
      background: c.logoColor, color: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 900, fontSize: "18pt", fontFamily: '"Plus Jakarta Sans",sans-serif',
    },
    companyName: { fontWeight: 800, fontSize: "12pt", color: "#0f172a", lineHeight: 1.2 },
    companyMeta: { fontSize: "7.5pt", color: "#64748b", lineHeight: 1.6, marginTop: "2px" },
    docBlock: { textAlign: "right" as const },
    docTitle: {
      fontSize: "22pt", fontWeight: 900, color: c.logoColor,
      letterSpacing: "0.08em", fontFamily: '"Plus Jakarta Sans",sans-serif',
    },
    docMeta: { fontSize: "8pt", color: "#64748b", lineHeight: 1.8, marginTop: "4px" },
    docMetaKey: { color: "#94a3b8" },
    docMetaVal: { color: "#1e293b", fontWeight: 600 },
    twoCol: {
      display: "grid", gridTemplateColumns: "1fr 1fr",
      gap: "8mm", marginBottom: "8mm",
    },
    section: { marginBottom: "6mm" },
    sectionLabel: {
      fontSize: "7pt", fontWeight: 700, textTransform: "uppercase" as const,
      letterSpacing: "0.08em", color: c.logoColor, marginBottom: "3px",
    },
    customerName: { fontSize: "11pt", fontWeight: 700, color: "#0f172a" },
    customerLine: { fontSize: "8.5pt", color: "#475569", lineHeight: 1.7 },
    table: { width: "100%", borderCollapse: "collapse" as const, marginBottom: "6mm" },
    th: {
      background: "#f8fafc", borderBottom: `2px solid ${c.logoColor}`,
      padding: "4px 6px", textAlign: "left" as const,
      fontSize: "7.5pt", fontWeight: 700, color: "#475569",
      textTransform: "uppercase" as const, letterSpacing: "0.04em",
    },
    thRight: { textAlign: "right" as const },
    td: {
      padding: "5px 6px", borderBottom: "1px solid #f1f5f9",
      fontSize: "8.5pt", color: "#334155", verticalAlign: "top" as const,
    },
    tdRight: { textAlign: "right" as const, fontFamily: monoFont, fontSize: "8pt" },
    tdNo: { color: "#94a3b8", width: "28px" },
    trAlt: { background: "#fafcff" },
    totalsTable: {
      width: "260px", marginLeft: "auto", marginBottom: "6mm",
      borderCollapse: "collapse" as const,
    },
    totalsRow: { borderBottom: "1px solid #f1f5f9" },
    totalsKey: { padding: "3px 8px 3px 0", fontSize: "8.5pt", color: "#64748b", textAlign: "right" as const },
    totalsVal: { padding: "3px 0 3px 8px", fontFamily: monoFont, fontSize: "8.5pt", textAlign: "right" as const, color: "#334155" },
    grandRow: {
      background: c.logoColor, borderRadius: "4px",
    },
    grandKey: {
      padding: "6px 8px 6px 10px", fontSize: "10pt", fontWeight: 800,
      color: "#fff", borderRadius: "4px 0 0 4px",
    },
    grandVal: {
      padding: "6px 10px 6px 8px", fontFamily: monoFont, fontSize: "10pt",
      fontWeight: 800, color: "#fff", textAlign: "right" as const, borderRadius: "0 4px 4px 0",
    },
    amountWords: {
      fontSize: "8pt", color: "#64748b", fontStyle: "italic",
      marginBottom: "6mm", textAlign: "right" as const,
    },
    payStatusBadge: {
      display: "inline-block",
      padding: "4px 14px",
      borderRadius: "20px",
      border: `2px solid ${ps?.border ?? "#e2e8f0"}`,
      background: ps?.bg ?? "#f8fafc",
      color: ps?.text ?? "#64748b",
      fontSize: "8.5pt",
      fontWeight: 800,
      letterSpacing: "0.06em",
      marginBottom: "4mm",
    },
    bankBox: {
      background: "#f8fafc", border: "1px solid #e2e8f0",
      borderRadius: "8px", padding: "5mm", marginBottom: "6mm",
    },
    bankTitle: { fontSize: "7pt", fontWeight: 700, color: c.logoColor, textTransform: "uppercase" as const, marginBottom: "4px", letterSpacing: "0.06em" },
    bankRow: { display: "flex", justifyContent: "space-between", marginBottom: "2px" },
    bankKey: { fontSize: "8pt", color: "#94a3b8" },
    bankVal: { fontSize: "8pt", fontWeight: 600, color: "#1e293b" },
    termsBox: {
      borderTop: "1px solid #e2e8f0",
      paddingTop: "5mm", marginTop: "4mm", marginBottom: "4mm",
    },
    termsTitle: { fontSize: "7pt", fontWeight: 700, color: "#64748b", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: "3px" },
    termsText: { fontSize: "8pt", color: "#64748b", lineHeight: 1.7 },
    sigRow: {
      display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
      gap: "8mm", marginTop: "8mm", marginBottom: "4mm",
    },
    sigBlock: { borderTop: "1px solid #cbd5e1", paddingTop: "3px" },
    sigLabel: { fontSize: "7.5pt", color: "#94a3b8" },
    sigName:  { fontSize: "8.5pt", fontWeight: 600, color: "#1e293b", marginTop: "2px" },
    footer: {
      position: "absolute" as const, bottom: "10mm", left: "16mm", right: "16mm",
      borderTop: "1px solid #e2e8f0", paddingTop: "4mm",
      display: "flex", justifyContent: "space-between", alignItems: "center",
    },
    footerLeft: { fontSize: "7.5pt", color: "#94a3b8" },
    footerRight: { fontSize: "7.5pt", color: "#94a3b8", textAlign: "right" as const },
    pageNum: { fontSize: "7.5pt", color: "#94a3b8" },
  };

  return (
    <div style={s.page}>
      {/* Watermark */}
      {data.watermark && <div style={s.watermark}>{data.watermark}</div>}

      {/* ── Header ── */}
      <div style={s.header}>
        <div style={s.logoBlock}>
          <img src={mcLogo} alt="MernCrest" style={{ width: "56px", height: "56px", objectFit: "contain", borderRadius: "4px" }} />
          <div>
            <div style={s.companyName}>{c.name}</div>
            <div style={s.companyMeta}>
              {c.address}<br />
              {c.phone} · {c.email}<br />
              Reg: {c.regNo} · {c.vatNo}
            </div>
          </div>
        </div>
        <div style={s.docBlock}>
          <div style={s.docTitle}>{docTitles[data.type]}</div>
          <div style={s.docMeta}>
            <table style={{ borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td style={{ ...s.docMeta, ...s.docMetaKey, paddingRight: "8px" }}>Number</td>
                  <td style={{ ...s.docMeta, ...s.docMetaVal }}>{data.docNumber}</td>
                </tr>
                <tr>
                  <td style={{ ...s.docMeta, ...s.docMetaKey, paddingRight: "8px" }}>Date</td>
                  <td style={{ ...s.docMeta, ...s.docMetaVal }}>{data.date}</td>
                </tr>
                {data.dueDate && <tr>
                  <td style={{ ...s.docMeta, ...s.docMetaKey, paddingRight: "8px" }}>Due Date</td>
                  <td style={{ ...s.docMeta, ...s.docMetaVal }}>{data.dueDate}</td>
                </tr>}
                {data.validUntil && <tr>
                  <td style={{ ...s.docMeta, ...s.docMetaKey, paddingRight: "8px" }}>Valid Until</td>
                  <td style={{ ...s.docMeta, ...s.docMetaVal }}>{data.validUntil}</td>
                </tr>}
                {data.refNumber && <tr>
                  <td style={{ ...s.docMeta, ...s.docMetaKey, paddingRight: "8px" }}>Reference</td>
                  <td style={{ ...s.docMeta, ...s.docMetaVal }}>{data.refNumber}</td>
                </tr>}
                <tr>
                  <td style={{ ...s.docMeta, ...s.docMetaKey, paddingRight: "8px" }}>Currency</td>
                  <td style={{ ...s.docMeta, ...s.docMetaVal }}>{data.currency}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Bill To / Bill From ── */}
      <div style={s.twoCol}>
        <div>
          <div style={s.sectionLabel}>Bill To</div>
          <div style={s.customerName}>{data.customer.name}</div>
          {data.customer.company && <div style={s.customerLine}>{data.customer.company}</div>}
          <div style={s.customerLine}>{data.customer.address}</div>
          <div style={s.customerLine}>{data.customer.email}</div>
          <div style={s.customerLine}>{data.customer.phone}</div>
          {data.customer.taxNo && <div style={s.customerLine}>VAT: {data.customer.taxNo}</div>}
        </div>
        <div>
          <div style={s.sectionLabel}>From</div>
          <div style={s.customerName}>{c.legalName}</div>
          <div style={s.customerLine}>{c.address}</div>
          <div style={s.customerLine}>{c.email}</div>
          <div style={s.customerLine}>{c.website}</div>
          {data.salesperson && <div style={{ ...s.customerLine, marginTop: "6px" }}>
            <span style={{ color: "#94a3b8" }}>Salesperson: </span>{data.salesperson}
          </div>}
        </div>
      </div>

      {/* Payment status badge */}
      {ps && <div><span style={s.payStatusBadge}>{ps.label}</span></div>}

      {/* ── Line items table ── */}
      {data.items.length > 0 && (
        <table style={s.table}>
          <thead>
            <tr>
              <th style={{ ...s.th, ...s.tdNo }}>#</th>
              <th style={s.th}>Description</th>
              <th style={{ ...s.th, ...s.thRight, width: "50px" }}>Qty</th>
              <th style={{ ...s.th, width: "40px" }}>Unit</th>
              <th style={{ ...s.th, ...s.thRight, width: "90px" }}>Unit Price</th>
              <th style={{ ...s.th, ...s.thRight, width: "50px" }}>Disc%</th>
              <th style={{ ...s.th, ...s.thRight, width: "40px" }}>Tax%</th>
              <th style={{ ...s.th, ...s.thRight, width: "100px" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, i) => (
              <tr key={item.no} style={i % 2 === 1 ? s.trAlt : {}}>
                <td style={{ ...s.td, ...s.tdNo }}>{item.no}</td>
                <td style={s.td}>{item.description}</td>
                <td style={{ ...s.td, ...s.tdRight }}>{item.qty}</td>
                <td style={s.td}>{item.unit}</td>
                <td style={{ ...s.td, ...s.tdRight }}>{fmt(item.unitPrice, data.currency)}</td>
                <td style={{ ...s.td, ...s.tdRight, color: item.discount > 0 ? "#dc2626" : "#94a3b8" }}>
                  {item.discount > 0 ? `${item.discount}%` : "—"}
                </td>
                <td style={{ ...s.td, ...s.tdRight, color: "#64748b" }}>{item.tax}%</td>
                <td style={{ ...s.td, ...s.tdRight, fontWeight: 600 }}>{fmt(item.total, data.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ── Totals ── */}
      <table style={s.totalsTable}>
        <tbody>
          <tr style={s.totalsRow}>
            <td style={s.totalsKey}>Subtotal</td>
            <td style={s.totalsVal}>{fmt(data.subtotal, data.currency)}</td>
          </tr>
          {data.discountTotal > 0 && (
            <tr style={s.totalsRow}>
              <td style={{ ...s.totalsKey, color: "#dc2626" }}>Discount</td>
              <td style={{ ...s.totalsVal, color: "#dc2626" }}>−{fmt(data.discountTotal, data.currency)}</td>
            </tr>
          )}
          {data.taxTotal > 0 && (
            <tr style={s.totalsRow}>
              <td style={s.totalsKey}>Tax</td>
              <td style={s.totalsVal}>{fmt(data.taxTotal, data.currency)}</td>
            </tr>
          )}
          <tr>
            <td style={{ ...s.grandKey, background: c.logoColor, borderRadius: "4px 0 0 4px" }}>TOTAL</td>
            <td style={{ ...s.grandVal, background: c.logoColor, borderRadius: "0 4px 4px 0" }}>{fmt(data.grandTotal, data.currency)}</td>
          </tr>
          {data.amountPaid !== undefined && data.amountPaid > 0 && (
            <tr style={s.totalsRow}>
              <td style={{ ...s.totalsKey, color: "#059669" }}>Amount Paid</td>
              <td style={{ ...s.totalsVal, color: "#059669" }}>−{fmt(data.amountPaid, data.currency)}</td>
            </tr>
          )}
          {data.balanceDue !== undefined && (
            <tr>
              <td style={{ ...s.totalsKey, fontWeight: 700, color: data.balanceDue > 0 ? "#dc2626" : "#059669" }}>Balance Due</td>
              <td style={{ ...s.totalsVal, fontWeight: 700, color: data.balanceDue > 0 ? "#dc2626" : "#059669" }}>{fmt(data.balanceDue, data.currency)}</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Amount in words */}
      {words && <div style={s.amountWords}>In Words: <em>{data.currency} {words}</em></div>}

      {/* ── Bank / Payment Info ── */}
      {(data.type === "invoice" || data.type === "receipt") && (
        <div style={s.bankBox}>
          <div style={s.bankTitle}>Payment Instructions</div>
          {[
            ["Bank",        c.bankName],
            ["Branch",      c.bankBranch],
            ["Account",     c.accountName],
            ["Acc. No.",    c.accountNo],
            ["SWIFT/BIC",   c.swiftCode],
            ["Reference",   data.docNumber],
          ].map(([k, v]) => (
            <div key={k} style={s.bankRow}>
              <span style={s.bankKey}>{k}</span>
              <span style={s.bankVal}>{v}</span>
            </div>
          ))}
          <div style={{ ...s.bankKey, marginTop: "6px", fontStyle: "italic" }}>{c.paymentRef}</div>
        </div>
      )}

      {/* ── Exchange rate ── */}
      {data.currency !== "LKR" && data.exchangeRate && (
        <div style={{ ...s.bankBox, marginBottom: "4mm" }}>
          <div style={s.bankTitle}>Currency Conversion</div>
          <div style={s.bankRow}>
            <span style={s.bankKey}>Exchange Rate</span>
            <span style={s.bankVal}>1 {data.currency} = {data.exchangeRate.toLocaleString()} LKR</span>
          </div>
          <div style={s.bankRow}>
            <span style={s.bankKey}>LKR Equivalent</span>
            <span style={s.bankVal}>{fmt(data.grandTotal * data.exchangeRate, "LKR")}</span>
          </div>
        </div>
      )}

      {/* ── Terms & Notes ── */}
      {(data.terms || data.notes) && (
        <div style={s.termsBox}>
          {data.terms && <>
            <div style={s.termsTitle}>Terms & Conditions</div>
            <div style={s.termsText}>{data.terms}</div>
          </>}
          {data.notes && <div style={{ ...s.termsText, marginTop: "4px", color: "#94a3b8" }}>{data.notes}</div>}
        </div>
      )}

      {/* ── Signatures ── */}
      <div style={s.sigRow}>
        <div style={s.sigBlock}>
          <div style={s.sigLabel}>Prepared By</div>
          <div style={s.sigName}>{data.preparedBy ?? data.salesperson ?? "Authorized Signatory"}</div>
        </div>
        <div style={s.sigBlock}>
          <div style={s.sigLabel}>Approved By</div>
          <div style={s.sigName}>Director / Manager</div>
        </div>
        <div style={s.sigBlock}>
          <div style={s.sigLabel}>Customer Acceptance</div>
          <div style={s.sigName}>Signature & Stamp</div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={s.footer}>
        <div style={s.footerLeft}>
          {c.website} · {c.email} · {c.phone}
        </div>
        <div style={s.pageNum}>Page 1 of 1 · Generated {new Date().toLocaleDateString("en-LK", { day: "2-digit", month: "short", year: "numeric" })}</div>
        <div style={{ ...s.footerRight, fontSize: "7pt", color: "#cbd5e1" }}>
          This is a computer-generated document.
        </div>
      </div>
    </div>
  );
}
