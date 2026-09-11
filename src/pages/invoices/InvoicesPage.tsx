import { useState } from "react";
import { Plus, Search, Download, Eye, Send, MoreHorizontal, AlertTriangle, FileText, Printer, Mail } from "lucide-react";
import StatusBadge from "../../components/ui/StatusBadge";
import { invoices } from "../../data/mockData";
import PDFPreviewModal from "../../components/pdf/PDFPreviewModal";
import type { PDFData } from "../../components/pdf/PDFDocument";

const moreInvoices = [
  { id: "INV-2025-0084", client: "Sampath Bank", amount: 750000, currency: "LKR", status: "draft", dueDate: "2025-04-15", project: "Core Banking Integration", issueDate: "2025-03-05" },
  { id: "INV-2025-0083", client: "Hayleys Group", amount: 185000, currency: "LKR", status: "paid", dueDate: "2025-03-01", project: "IT Consulting", issueDate: "2025-02-10" },
  { id: "INV-2025-0082", client: "NDB Bank", amount: 920000, currency: "LKR", status: "paid", dueDate: "2025-02-15", project: "ERP Implementation", issueDate: "2025-01-20" },
];
const allInvoices = [...invoices, ...moreInvoices];

const tabs = ["All", "Draft", "Pending", "Partial", "Paid", "Overdue"];

function makeInvoicePDFData(inv: typeof allInvoices[0]): PDFData {
  return {
    type: "invoice",
    docNumber: `MC-INV-2026-${inv.id.replace("INV-2025-", "").padStart(6, "0")}`,
    date: inv.issueDate,
    dueDate: inv.dueDate,
    currency: inv.currency,
    paymentStatus: inv.status as PDFData["paymentStatus"],
    watermark: inv.status === "paid" ? "PAID" : inv.status === "overdue" ? "OVERDUE" : undefined,
    customer: {
      name: inv.client,
      address: "No. 1, Main Street, Colombo 01, Sri Lanka",
      email: `accounts@${inv.client.toLowerCase().replace(/\s+/g, "")}.lk`,
      phone: "+94 11 000 0000",
    },
    items: [
      { no: 1, description: (inv as { project?: string }).project ?? "Professional Services", qty: 1, unit: "Pcs", unitPrice: inv.amount * 0.9, discount: 0, tax: 10, total: inv.amount },
    ],
    subtotal: inv.amount * 0.9,
    discountTotal: 0,
    taxTotal: inv.amount * 0.1,
    grandTotal: inv.amount,
    balanceDue: inv.status === "paid" ? 0 : inv.amount,
    amountPaid: inv.status === "paid" ? inv.amount : inv.status === "partial" ? inv.amount * 0.5 : 0,
    terms: "Payment is due within 30 days of invoice date. Late payments may attract a 2% per month interest charge.",
    preparedBy: "Accounts Department",
  };
}

export default function InvoicesPage() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [pdfInv, setPdfInv] = useState<typeof allInvoices[0] | null>(null);

  const statusMap: Record<number, string | null> = { 0: null, 1: "draft", 2: "pending", 3: "partial", 4: "paid", 5: "overdue" };
  const filtered = allInvoices.filter(inv => {
    const matchStatus = !statusMap[tab] || inv.status === statusMap[tab];
    const matchSearch = !search || inv.id.toLowerCase().includes(search.toLowerCase()) || inv.client.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalOutstanding = allInvoices.filter(i => ["pending","partial","overdue"].includes(i.status)).reduce((a, i) => a + i.amount, 0);
  const totalOverdue = allInvoices.filter(i => i.status === "overdue").reduce((a, i) => a + i.amount, 0);
  const totalPaidMTD = allInvoices.filter(i => i.status === "paid").reduce((a, i) => a + i.amount, 0);

  return (
    <>
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Invoices</h2>
          <p className="text-sm text-slate-500 mt-0.5">{allInvoices.length} invoices · Current period</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 text-sm border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors">
            <Download size={14} /> Export
          </button>
          <button className="flex items-center gap-2 text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors font-medium">
            <Plus size={14} /> Create Invoice
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Outstanding", value: `LKR ${(totalOutstanding/1000000).toFixed(2)}M`, sub: "Pending + Overdue", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
          { label: "Overdue Amount", value: `LKR ${(totalOverdue/1000).toFixed(0)}K`, sub: "1 invoice", color: "text-red-700", bg: "bg-red-50", border: "border-red-200" },
          { label: "Paid This Month", value: `LKR ${(totalPaidMTD/1000000).toFixed(2)}M`, sub: "3 invoices", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
          { label: "Total Invoiced", value: `LKR ${(allInvoices.reduce((a,i) => a+i.amount, 0)/1000000).toFixed(2)}M`, sub: "Current quarter", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
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
          <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700 flex-1">
            <strong>INV-2025-0089</strong> from Lanka Retail PLC is overdue by 10 days (LKR 680,000).
          </p>
          <button className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1">Send Reminder <Send size={10} /></button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <div className="flex items-center gap-1">
            {tabs.map((t, i) => (
              <button
                key={t}
                onClick={() => setTab(i)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === i ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50"}`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-7 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-44" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                <th className="pl-5 pr-3 py-3 text-left"><input type="checkbox" className="rounded border-slate-300" /></th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Invoice #</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Client</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Project</th>
                <th className="px-3 py-3 text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Amount</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Issue Date</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Due Date</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Status</th>
                <th className="pr-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(inv => (
                <tr key={inv.id} className={`hover:bg-slate-50 transition-colors cursor-pointer ${inv.status === "overdue" ? "bg-red-50/30" : ""}`}>
                  <td className="pl-5 pr-3 py-3" onClick={e => e.stopPropagation()}><input type="checkbox" className="rounded border-slate-300" /></td>
                  <td className="px-3 py-3">
                    <span className="font-mono text-sm font-medium text-blue-600">{inv.id}</span>
                  </td>
                  <td className="px-3 py-3"><span className="text-sm text-slate-700 font-medium">{inv.client}</span></td>
                  <td className="px-3 py-3"><span className="text-xs text-slate-500">{inv.project}</span></td>
                  <td className="px-3 py-3 text-right">
                    <span className="text-sm font-semibold text-slate-800">LKR {inv.amount.toLocaleString()}</span>
                  </td>
                  <td className="px-3 py-3"><span className="text-xs text-slate-500">{inv.issueDate}</span></td>
                  <td className="px-3 py-3">
                    <span className={`text-xs ${inv.status === "overdue" ? "text-red-600 font-semibold" : "text-slate-500"}`}>{inv.dueDate}</span>
                  </td>
                  <td className="px-3 py-3"><StatusBadge status={inv.status} /></td>
                  <td className="pr-5 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg" title="View"><Eye size={13} className="text-slate-400" /></button>
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg" title="Send"><Send size={13} className="text-slate-400" /></button>
                      <button onClick={e => { e.stopPropagation(); setPdfInv(inv); }} className="p-1.5 hover:bg-blue-50 rounded-lg" title="Preview PDF"><FileText size={13} className="text-blue-500" /></button>
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg"><MoreHorizontal size={13} className="text-slate-400" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
          <p className="text-xs text-slate-500">Showing {filtered.length} of {allInvoices.length} invoices</p>
          <div className="flex items-center gap-1">
            {[1,2,3].map(p => (
              <button key={p} className={`px-2.5 py-1.5 text-xs border rounded-lg ${p === 1 ? "bg-blue-600 text-white border-blue-600" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>

    {pdfInv && (
      <PDFPreviewModal
        data={makeInvoicePDFData(pdfInv)}
        onClose={() => setPdfInv(null)}
      />
    )}
  </>
  );
}
