import { useState } from "react";
import { FileText, Download, Eye, CreditCard, AlertCircle, CheckCircle2, Clock, MoreHorizontal, Search, TrendingUp } from "lucide-react";
import PDFPreviewModal from "../../components/pdf/PDFPreviewModal";
import type { PDFData } from "../../components/pdf/PDFDocument";

interface BillingStatement {
  id: string;
  docNumber: string;
  customer: string;
  period: string;
  billingDate: string;
  dueDate: string;
  previousBalance: number;
  currentCharges: number;
  payments: number;
  credits: number;
  adjustments: number;
  balanceDue: number;
  status: "unpaid" | "partial" | "paid" | "overdue";
  currency: string;
}

const statements: BillingStatement[] = [
  {
    id: "BS-001", docNumber: "MC-BILL-2026-000001",
    customer: "Sampath Bank PLC", period: "March 2026",
    billingDate: "2026-03-31", dueDate: "2026-04-30",
    previousBalance: 320000, currentCharges: 185000, payments: 320000, credits: 0, adjustments: 0,
    balanceDue: 185000, status: "unpaid", currency: "LKR",
  },
  {
    id: "BS-002", docNumber: "MC-BILL-2026-000002",
    customer: "John Keells Holdings", period: "March 2026",
    billingDate: "2026-03-31", dueDate: "2026-04-30",
    previousBalance: 0, currentCharges: 450000, payments: 225000, credits: 0, adjustments: -10000,
    balanceDue: 215000, status: "partial", currency: "LKR",
  },
  {
    id: "BS-003", docNumber: "MC-BILL-2026-000003",
    customer: "NDB Bank", period: "February 2026",
    billingDate: "2026-02-28", dueDate: "2026-03-31",
    previousBalance: 0, currentCharges: 920000, payments: 920000, credits: 0, adjustments: 0,
    balanceDue: 0, status: "paid", currency: "LKR",
  },
  {
    id: "BS-004", docNumber: "MC-BILL-2026-000004",
    customer: "Lanka Retail PLC", period: "February 2026",
    billingDate: "2026-02-28", dueDate: "2026-03-28",
    previousBalance: 150000, currentCharges: 230000, payments: 0, credits: 0, adjustments: 0,
    balanceDue: 380000, status: "overdue", currency: "LKR",
  },
  {
    id: "BS-005", docNumber: "MC-BILL-2026-000005",
    customer: "Hayleys Group", period: "March 2026",
    billingDate: "2026-03-31", dueDate: "2026-04-30",
    previousBalance: 0, currentCharges: 310000, payments: 310000, credits: 0, adjustments: 0,
    balanceDue: 0, status: "paid", currency: "LKR",
  },
];

const statusConfig: Record<BillingStatement["status"], { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  unpaid:   { label: "Unpaid",         bg: "bg-amber-50",   text: "text-amber-700",  icon: <Clock size={11} /> },
  partial:  { label: "Partial",        bg: "bg-blue-50",    text: "text-blue-700",   icon: <CreditCard size={11} /> },
  paid:     { label: "Paid",           bg: "bg-emerald-50", text: "text-emerald-700",icon: <CheckCircle2 size={11} /> },
  overdue:  { label: "Overdue",        bg: "bg-red-50",     text: "text-red-700",    icon: <AlertCircle size={11} /> },
};

function makeBillingPDFData(s: BillingStatement): PDFData {
  const charges = [
    { no: 1, description: `${s.period} — Professional Services`, qty: 1, unit: "Month", unitPrice: s.currentCharges * 0.7, discount: 0, tax: 15, total: s.currentCharges * 0.7 * 1.15 },
    { no: 2, description: `${s.period} — Infrastructure & Hosting`, qty: 1, unit: "Month", unitPrice: s.currentCharges * 0.2, discount: 0, tax: 0, total: s.currentCharges * 0.2 },
    { no: 3, description: `${s.period} — Support & Maintenance`, qty: 1, unit: "Month", unitPrice: s.currentCharges * 0.1, discount: 0, tax: 0, total: s.currentCharges * 0.1 },
  ];
  return {
    type: "billing",
    docNumber: s.docNumber,
    date: s.billingDate,
    dueDate: s.dueDate,
    currency: s.currency,
    paymentStatus: s.status,
    watermark: s.status === "paid" ? "PAID" : s.status === "overdue" ? "OVERDUE" : undefined,
    customer: {
      name: s.customer,
      address: "No. 1, Corporate Drive, Colombo 01, Sri Lanka",
      email: `billing@${s.customer.toLowerCase().replace(/\s+/g, "")}.lk`,
      phone: "+94 11 000 0000",
    },
    items: charges,
    subtotal: s.currentCharges,
    discountTotal: 0,
    taxTotal: s.currentCharges * 0.15,
    grandTotal: s.balanceDue > 0 ? s.balanceDue : s.currentCharges,
    balanceDue: s.balanceDue,
    amountPaid: s.payments,
    refNumber: `Billing Period: ${s.period}`,
    notes: `Previous balance: LKR ${s.previousBalance.toLocaleString()} · Payments received: LKR ${s.payments.toLocaleString()}`,
    terms: "Payment is due within 30 days. Late payments attract a surcharge of 2% per month.",
    preparedBy: "Accounts Receivable Team",
  };
}

export default function BillingPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | BillingStatement["status"]>("all");
  const [pdfStmt, setPdfStmt] = useState<BillingStatement | null>(null);
  const [selected, setSelected] = useState<BillingStatement | null>(null);

  const filtered = statements.filter(s => {
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    const matchSearch = !search || s.customer.toLowerCase().includes(search.toLowerCase()) || s.docNumber.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalOutstanding = statements.filter(s => s.status !== "paid").reduce((a, s) => a + s.balanceDue, 0);
  const totalOverdue = statements.filter(s => s.status === "overdue").reduce((a, s) => a + s.balanceDue, 0);
  const totalPaid = statements.filter(s => s.status === "paid").reduce((a, s) => a + s.currentCharges, 0);
  const totalBilled = statements.reduce((a, s) => a + s.currentCharges, 0);

  return (
    <>
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Billing</h2>
          <p className="text-sm text-slate-500 mt-0.5">{statements.length} statements · Current quarter</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 text-sm border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors">
            <Download size={14} /> Export
          </button>
          <button className="flex items-center gap-2 text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors font-medium">
            <FileText size={14} /> New Statement
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Outstanding", value: `LKR ${(totalOutstanding / 1000).toFixed(0)}K`, sub: `${statements.filter(s => s.status !== "paid").length} statements`, color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
          { label: "Overdue Amount", value: `LKR ${(totalOverdue / 1000).toFixed(0)}K`, sub: `${statements.filter(s => s.status === "overdue").length} overdue`, color: "text-red-700", bg: "bg-red-50", border: "border-red-200" },
          { label: "Collected (Period)", value: `LKR ${(totalPaid / 1000000).toFixed(2)}M`, sub: `${statements.filter(s => s.status === "paid").length} statements`, color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
          { label: "Total Billed", value: `LKR ${(totalBilled / 1000000).toFixed(2)}M`, sub: "Current quarter", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl px-4 py-4`}>
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className={`text-lg font-bold ${s.color} mt-0.5`} style={{ fontFamily: "var(--font-display)" }}>{s.value}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Overdue alert */}
      {totalOverdue > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700 flex-1">
            <strong>1 billing statement</strong> is overdue — LKR {totalOverdue.toLocaleString()} outstanding from Lanka Retail PLC since Feb 2026.
          </p>
          <button className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg font-medium transition-colors">Send Reminder</button>
        </div>
      )}

      {/* Filters + table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex gap-1">
            {(["all", "unpaid", "partial", "paid", "overdue"] as const).map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${statusFilter === f ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-50 border border-transparent"}`}
              >
                {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-7 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-44" />
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Statement</th>
              <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Customer</th>
              <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Period</th>
              <th className="px-3 py-3 text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Charges</th>
              <th className="px-3 py-3 text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Balance Due</th>
              <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Due Date</th>
              <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Status</th>
              <th className="pr-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(s => {
              const sc = statusConfig[s.status];
              return (
                <tr key={s.id} onClick={() => setSelected(s)} className={`hover:bg-slate-50 cursor-pointer transition-colors ${s.status === "overdue" ? "bg-red-50/20" : ""}`}>
                  <td className="px-5 py-3">
                    <p className="font-mono text-xs font-semibold text-blue-600">{s.docNumber}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{s.id}</p>
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-sm font-semibold text-slate-800">{s.customer}</p>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-xs text-slate-600">{s.period}</span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span className="text-sm font-semibold text-slate-800">{s.currency} {s.currentCharges.toLocaleString()}</span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span className={`text-sm font-bold ${s.balanceDue > 0 ? (s.status === "overdue" ? "text-red-600" : "text-amber-700") : "text-emerald-600"}`}>
                      {s.balanceDue > 0 ? `${s.currency} ${s.balanceDue.toLocaleString()}` : "—"}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`text-xs ${s.status === "overdue" ? "text-red-600 font-semibold" : "text-slate-500"}`}>{s.dueDate}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold ${sc.bg} ${sc.text}`}>
                      {sc.icon}{sc.label}
                    </span>
                  </td>
                  <td className="pr-5 py-3" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelected(s)} className="p-1.5 hover:bg-slate-100 rounded-lg" title="View Details">
                        <Eye size={13} className="text-slate-400" />
                      </button>
                      <button onClick={() => setPdfStmt(s)} className="p-1.5 hover:bg-blue-50 rounded-lg" title="Preview PDF">
                        <FileText size={13} className="text-blue-500" />
                      </button>
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg">
                        <MoreHorizontal size={13} className="text-slate-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
          <p className="text-xs text-slate-500">Showing {filtered.length} of {statements.length} statements</p>
        </div>
      </div>
    </div>

    {/* Statement detail drawer */}
    {selected && (
      <div className="fixed inset-0 bg-black/40 z-50 flex justify-end" onClick={() => setSelected(null)}>
        <div className="w-full max-w-md bg-white h-full shadow-2xl overflow-y-auto" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
            <div>
              <p className="font-mono text-sm font-bold text-blue-600">{selected.docNumber}</p>
              <p className="text-xs text-slate-400 mt-0.5">{selected.customer} · {selected.period}</p>
            </div>
            <div className="flex items-center gap-2">
              {(() => { const sc = statusConfig[selected.status]; return <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold ${sc.bg} ${sc.text}`}>{sc.icon}{sc.label}</span>; })()}
              <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <span className="text-slate-400 text-lg leading-none">×</span>
              </button>
            </div>
          </div>

          <div className="p-5 space-y-5">
            {/* Summary */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200">
                <p className="text-xs font-semibold text-slate-600">Billing Summary</p>
              </div>
              <div className="px-4 py-3 space-y-2.5">
                {[
                  { label: "Previous Balance", value: selected.previousBalance, color: "" },
                  { label: "Current Charges", value: selected.currentCharges, color: "" },
                  { label: "Payments Received", value: -selected.payments, color: "text-emerald-600" },
                  { label: "Credits Applied", value: -selected.credits, color: "text-blue-600" },
                  { label: "Adjustments", value: selected.adjustments, color: selected.adjustments < 0 ? "text-emerald-600" : "" },
                ].filter(r => r.value !== 0).map(r => (
                  <div key={r.label} className="flex justify-between text-sm">
                    <span className="text-slate-600">{r.label}</span>
                    <span className={`font-semibold ${r.color || "text-slate-800"}`}>
                      {r.value < 0 ? "−" : ""}{selected.currency} {Math.abs(r.value).toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-slate-200 pt-2 mt-2">
                  <span className="text-sm font-bold text-slate-900">Balance Due</span>
                  <span className={`text-base font-bold ${selected.balanceDue > 0 ? (selected.status === "overdue" ? "text-red-600" : "text-amber-700") : "text-emerald-600"}`}>
                    {selected.currency} {selected.balanceDue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: "Billing Date", value: selected.billingDate },
                { label: "Due Date", value: selected.dueDate },
                { label: "Billing Period", value: selected.period },
                { label: "Currency", value: selected.currency },
              ].map(f => (
                <div key={f.label} className="bg-slate-50 rounded-lg px-3 py-2.5">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{f.label}</p>
                  <p className="text-sm text-slate-800 mt-0.5 font-medium">{f.value}</p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => { setPdfStmt(selected); setSelected(null); }}
                className="flex items-center gap-1.5 text-xs bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-lg font-medium transition-colors"
              >
                <FileText size={12} /> Preview PDF
              </button>
              <button className="flex items-center gap-1.5 text-xs border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-lg transition-colors">
                <Download size={12} /> Download
              </button>
              {selected.status !== "paid" && (
                <button className="flex items-center gap-1.5 text-xs bg-emerald-600 text-white hover:bg-emerald-700 px-3 py-2 rounded-lg font-medium transition-colors">
                  <CreditCard size={12} /> Record Payment
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )}

    {pdfStmt && (
      <PDFPreviewModal
        data={makeBillingPDFData(pdfStmt)}
        onClose={() => setPdfStmt(null)}
      />
    )}
    </>
  );
}
