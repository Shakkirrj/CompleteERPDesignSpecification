import { useState } from "react";
import { Plus, Search, Eye, Send, Download, Copy, Check, ArrowRight, FileText, MoreHorizontal, X } from "lucide-react";
import StatusBadge from "../../components/ui/StatusBadge";
import Avatar from "../../components/ui/Avatar";
import PDFPreviewModal from "../../components/pdf/PDFPreviewModal";
import type { PDFData } from "../../components/pdf/PDFDocument";
import ActionFeedback, { type ActionFeedbackData } from "../../components/ui/ActionFeedback";

const quotationStatuses = ["All", "Draft", "Sent", "Viewed", "Negotiation", "Approved", "Rejected", "Expired", "Converted"];

const quotations = [
  {
    id: "QT-2025-0024", client: "Sampath Bank", contact: "Nuwan Perera", salesperson: "Chamara Wickramasinghe",
    date: "2025-03-08", validUntil: "2025-04-07", currency: "LKR",
    subtotal: 5500000, discount: 250000, tax: 572000, total: 5822000,
    status: "sent", items: 3, approvalStatus: "pending", notes: "ERP + Mobile Integration package",
  },
  {
    id: "QT-2025-0023", client: "John Keells Holdings", contact: "Prasanna Gunawardena", salesperson: "Priya Jayawardena",
    date: "2025-03-06", validUntil: "2025-04-05", currency: "LKR",
    subtotal: 9200000, discount: 460000, tax: 1007200, total: 9747200,
    status: "negotiation", items: 5, approvalStatus: "approved", notes: "Multi-module ERP implementation",
  },
  {
    id: "QT-2025-0022", client: "Lanka Retail PLC", contact: "Dilrukshi Perera", salesperson: "Chamara Wickramasinghe",
    date: "2025-02-28", validUntil: "2025-03-28", currency: "LKR",
    subtotal: 4200000, discount: 0, tax: 462000, total: 4662000,
    status: "converted", items: 2, approvalStatus: "approved", notes: "Converted to PRJ001",
  },
  {
    id: "QT-2025-0021", client: "NDB Bank", contact: "Thilina Abeysekara", salesperson: "Chamara Wickramasinghe",
    date: "2025-02-20", validUntil: "2025-03-20", currency: "LKR",
    subtotal: 1980000, discount: 80000, tax: 209000, total: 2109000,
    status: "approved", items: 2, approvalStatus: "approved", notes: "IT Support retainer + Hosting",
  },
  {
    id: "QT-2025-0020", client: "Cargills Food City", contact: "Roshan Silva", salesperson: "Chamara Wickramasinghe",
    date: "2025-02-10", validUntil: "2025-03-10", currency: "LKR",
    subtotal: 1700000, discount: 50000, tax: 182000, total: 1832000,
    status: "expired", items: 3, approvalStatus: null, notes: "POS integration proposal",
  },
  {
    id: "QT-2025-0019", client: "Hayleys Group", contact: "Dilini Jayasinghe", salesperson: "Chamara Wickramasinghe",
    date: "2025-03-09", validUntil: "2025-04-08", currency: "LKR",
    subtotal: 3100000, discount: 100000, tax: 330000, total: 3330000,
    status: "draft", items: 2, approvalStatus: null, notes: "Cloud migration + DevOps",
  },
];

const statusWorkflow = ["Draft","Sent","Viewed","Negotiation","Approved","Rejected","Expired","Converted","Cancelled"];
const salespeople = ["Chamara Wickramasinghe", "Priya Jayawardena", "Dilshan Fernando", "Ishara Madushani"];

type NewQuotation = { id: string; client: string; contact: string; salesperson: string; date: string; validUntil: string; currency: string; subtotal: number; discount: number; tax: number; total: number; status: string; items: number; approvalStatus: string | null; notes: string };

function NewQuotationModal({ onClose, onSave }: { onClose: () => void; onSave: (q: NewQuotation) => void }) {
  const today = new Date().toISOString().split("T")[0];
  const valid = new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0];
  const [form, setForm] = useState({ client: "", contact: "", salesperson: salespeople[0], currency: "LKR", validUntil: valid, notes: "", discount: "0" });
  const [items, setItems] = useState([{ desc: "", qty: "1", unitPrice: "" }]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function addItem() { setItems(prev => [...prev, { desc: "", qty: "1", unitPrice: "" }]); }
  function removeItem(i: number) { setItems(prev => prev.filter((_, idx) => idx !== i)); }
  function updateItem(i: number, field: string, val: string) { setItems(prev => prev.map((it, idx) => idx === i ? { ...it, [field]: val } : it)); }

  const subtotal = items.reduce((s, it) => s + (Number(it.qty) || 0) * (Number(it.unitPrice) || 0), 0);
  const discountAmt = Math.min(Number(form.discount) || 0, subtotal);
  const tax = Math.round((subtotal - discountAmt) * 0.15);
  const total = subtotal - discountAmt + tax;

  function validate() {
    const e: Record<string, string> = {};
    if (!form.client.trim()) e.client = "Client name required";
    if (!form.contact.trim()) e.contact = "Contact name required";
    if (items.every(it => !it.desc.trim() || !it.unitPrice)) e.items = "Add at least one line item";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    const n = Math.floor(Math.random() * 9000) + 1000;
    onSave({ id: `QT-2026-${n}`, client: form.client.trim(), contact: form.contact.trim(), salesperson: form.salesperson, date: today, validUntil: form.validUntil, currency: form.currency, subtotal, discount: discountAmt, tax, total, status: "draft", items: items.filter(it => it.desc).length, approvalStatus: null, notes: form.notes.trim() });
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>New Quotation</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"><X size={16} /></button>
        </div>
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Client / Company *</label>
              <input value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))}
                placeholder="e.g. Sampath Bank PLC"
                className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.client ? "border-red-400" : "border-slate-200"}`} />
              {errors.client && <p className="text-xs text-red-500 mt-1">{errors.client}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Contact Person *</label>
              <input value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))}
                placeholder="e.g. Nuwan Perera"
                className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.contact ? "border-red-400" : "border-slate-200"}`} />
              {errors.contact && <p className="text-xs text-red-500 mt-1">{errors.contact}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Salesperson</label>
              <select value={form.salesperson} onChange={e => setForm(f => ({ ...f, salesperson: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                {salespeople.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Valid Until</label>
              <input type="date" value={form.validUntil} onChange={e => setForm(f => ({ ...f, validUntil: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          {/* Line items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-600">Line Items *</label>
              <button onClick={addItem} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"><Plus size={11} /> Add Item</button>
            </div>
            {errors.items && <p className="text-xs text-red-500 mb-2">{errors.items}</p>}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="grid grid-cols-12 bg-slate-50 px-3 py-2 gap-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wide border-b border-slate-200">
                <div className="col-span-6">Description</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-3 text-right">Unit Price</div>
                <div className="col-span-1" />
              </div>
              {items.map((it, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 px-3 py-2 border-b border-slate-50 last:border-0 items-center">
                  <div className="col-span-6">
                    <input value={it.desc} onChange={e => updateItem(i, "desc", e.target.value)}
                      placeholder="Service description"
                      className="w-full text-sm border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div className="col-span-2">
                    <input type="number" min="1" value={it.qty} onChange={e => updateItem(i, "qty", e.target.value)}
                      className="w-full text-sm border border-slate-200 rounded-lg px-2 py-1.5 text-center focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div className="col-span-3">
                    <input type="number" min="0" value={it.unitPrice} onChange={e => updateItem(i, "unitPrice", e.target.value)}
                      placeholder="0"
                      className="w-full text-sm border border-slate-200 rounded-lg px-2 py-1.5 text-right focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    {items.length > 1 && (
                      <button onClick={() => removeItem(i)} className="text-slate-300 hover:text-red-500 transition-colors"><X size={12} /></button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals + notes */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Notes</label>
              <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                rows={3} placeholder="Internal notes or client message..."
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <div className="bg-slate-50 rounded-xl border border-slate-200 px-4 py-3 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-slate-500">Subtotal</span><span className="font-mono font-semibold text-slate-800">LKR {subtotal.toLocaleString()}</span></div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-500 flex-1">Discount</span>
                <input type="number" min="0" max={subtotal} value={form.discount} onChange={e => setForm(f => ({ ...f, discount: e.target.value }))}
                  className="w-28 text-right border border-slate-200 rounded-lg px-2 py-1 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white" />
              </div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">VAT 15%</span><span className="font-mono font-semibold text-slate-700">LKR {tax.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm border-t border-slate-200 pt-2 font-bold"><span>Total</span><span className="font-mono text-emerald-700">LKR {total.toLocaleString()}</span></div>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-5 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors">Save as Draft</button>
        </div>
      </div>
    </div>
  );
}

const statusColors: Record<string, string> = {
  draft: "bg-slate-100 text-slate-600",
  sent: "bg-blue-50 text-blue-700",
  viewed: "bg-cyan-50 text-cyan-700",
  negotiation: "bg-amber-50 text-amber-700",
  approved: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
  expired: "bg-slate-100 text-slate-400",
  converted: "bg-violet-50 text-violet-700",
  cancelled: "bg-red-50 text-red-400",
};

function makeQuoPDFData(q: typeof quotations[0]): PDFData {
  const lineItems = Array.from({ length: q.items }, (_, i) => ({
    no: i + 1,
    description: i === 0 ? q.notes : `Service Package ${String.fromCharCode(65 + i)}`,
    qty: 1,
    unit: "Svc",
    unitPrice: q.subtotal / q.items,
    discount: i === 0 && q.discount > 0 ? Math.round((q.discount / q.subtotal) * 100) : 0,
    tax: 15,
    total: q.subtotal / q.items,
  }));
  return {
    type: "quotation",
    docNumber: `MC-QUO-2026-${q.id.replace("QT-2025-0", "").padStart(6, "0")}`,
    date: q.date,
    validUntil: q.validUntil,
    currency: q.currency,
    salesperson: q.salesperson,
    watermark: q.status === "draft" ? "DRAFT" : undefined,
    customer: {
      name: q.contact,
      company: q.client,
      address: "No. 1, Main Street, Colombo 01, Sri Lanka",
      email: `procurement@${q.client.toLowerCase().replace(/\s+/g, "")}.lk`,
      phone: "+94 11 000 0000",
    },
    items: lineItems,
    subtotal: q.subtotal,
    discountTotal: q.discount,
    taxTotal: q.tax,
    grandTotal: q.total,
    terms: "This quotation is valid for 30 days from the date of issue. Prices are subject to change after validity period. 50% advance payment required before project commencement.",
  };
}

export default function QuotationsPage() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [allQuotations, setAllQuotations] = useState(quotations);
  const [selected, setSelected] = useState<typeof quotations[0] | null>(null);
  const [pdfQuo, setPdfQuo] = useState<typeof quotations[0] | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [feedback, setFeedback] = useState<ActionFeedbackData | null>(null);

  const filtered = allQuotations.filter(q => {
    const matchStatus = statusFilter === "All" || q.status === statusFilter.toLowerCase();
    const matchSearch = !search || q.id.toLowerCase().includes(search.toLowerCase()) || q.client.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalValue = allQuotations.reduce((a, q) => a + q.total, 0);
  const totalConverted = allQuotations.filter(q => q.status === "converted").length;

  function handleNewQuotation(q: NewQuotation) {
    setAllQuotations(prev => [q as typeof quotations[0], ...prev]);
    setShowNew(false);
    setFeedback({ type: "success", title: "Quotation Created", message: `Draft quotation for ${q.client} saved.`, ref: q.id, refLabel: "Quotation ID" });
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Quotations</h2>
          <p className="text-sm text-slate-500 mt-0.5">{quotations.length} quotations · {totalConverted} converted</p>
        </div>
        <button onClick={() => setShowNew(true)} className="flex items-center gap-2 text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors font-medium">
          <Plus size={14} /> Create Quotation
        </button>
      </div>

      {/* Status workflow */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-3">Quotation Lifecycle</p>
        <div className="flex items-center gap-1 flex-wrap">
          {statusWorkflow.map((s, i) => (
            <div key={s} className="flex items-center gap-1">
              <span className={`text-[10px] font-semibold px-2 py-1 rounded-lg ${statusColors[s.toLowerCase()] ?? "bg-slate-100 text-slate-500"}`}>{s}</span>
              {i < statusWorkflow.length - 1 && <ArrowRight size={9} className="text-slate-300" />}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Quoted Value", value: `LKR ${(totalValue/1000000).toFixed(2)}M`, color: "text-slate-800" },
          { label: "Pending Approval", value: quotations.filter(q => q.approvalStatus === "pending").length, color: "text-amber-600" },
          { label: "Converted", value: totalConverted, color: "text-emerald-600" },
          { label: "Expiring Soon", value: quotations.filter(q => q.status === "sent" || q.status === "viewed").length, color: "text-orange-600" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 px-4 py-3">
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className={`text-xl font-bold ${s.color} mt-0.5`} style={{ fontFamily: "var(--font-display)" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters & table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex gap-1 flex-wrap">
            {quotationStatuses.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${statusFilter === s ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-50 border border-slate-200"}`}
              >
                {s}
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
              <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Quotation</th>
              <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Client</th>
              <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Salesperson</th>
              <th className="px-3 py-3 text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Total</th>
              <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Valid Until</th>
              <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(q => (
              <tr
                key={q.id}
                className="hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => setSelected(q)}
              >
                <td className="px-5 py-3">
                  <p className="font-mono text-xs font-semibold text-blue-600">{q.id}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{q.items} item{q.items > 1 ? "s" : ""}</p>
                </td>
                <td className="px-3 py-3">
                  <p className="text-sm font-semibold text-slate-800">{q.client}</p>
                  <p className="text-xs text-slate-400">{q.contact}</p>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1.5">
                    <Avatar name={q.salesperson} size="xs" />
                    <span className="text-xs text-slate-600">{q.salesperson.split(" ")[0]}</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-right">
                  <p className="text-sm font-bold text-slate-900">LKR {q.total.toLocaleString()}</p>
                  {q.discount > 0 && <p className="text-[10px] text-emerald-600">-LKR {q.discount.toLocaleString()} disc.</p>}
                </td>
                <td className="px-3 py-3">
                  <span className={`text-xs ${new Date(q.validUntil) < new Date() ? "text-red-500 font-semibold" : "text-slate-500"}`}>{q.validUntil}</span>
                </td>
                <td className="px-3 py-3"><StatusBadge status={q.status} /></td>
                <td className="px-5 py-3" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 hover:bg-slate-100 rounded-lg" title="View"><Eye size={13} className="text-slate-400" /></button>
                    {q.status === "draft" && <button className="p-1.5 hover:bg-slate-100 rounded-lg" title="Send"><Send size={13} className="text-slate-400" /></button>}
                    <button className="p-1.5 hover:bg-slate-100 rounded-lg" title="Download PDF"><Download size={13} className="text-slate-400" /></button>
                    <button className="p-1.5 hover:bg-slate-100 rounded-lg" title="Duplicate"><Copy size={13} className="text-slate-400" /></button>
                    <button className="p-1.5 hover:bg-slate-100 rounded-lg"><MoreHorizontal size={13} className="text-slate-400" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end" onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg bg-white h-full shadow-2xl overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
              <div>
                <p className="font-mono text-sm font-bold text-blue-600">{selected.id}</p>
                <p className="text-xs text-slate-400 mt-0.5">{selected.client}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={selected.status} />
                <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-slate-100 rounded-lg"><X size={16} className="text-slate-400" /></button>
              </div>
            </div>

            <div className="p-5 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Client", value: selected.client },
                  { label: "Contact", value: selected.contact },
                  { label: "Salesperson", value: selected.salesperson },
                  { label: "Date", value: selected.date },
                  { label: "Valid Until", value: selected.validUntil },
                  { label: "Currency", value: selected.currency },
                ].map(f => (
                  <div key={f.label}>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{f.label}</p>
                    <p className="text-sm text-slate-800 mt-0.5">{f.value}</p>
                  </div>
                ))}
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200">
                  <p className="text-xs font-semibold text-slate-600">Pricing Summary</p>
                </div>
                <div className="px-4 py-3 space-y-2">
                  <div className="flex justify-between"><span className="text-sm text-slate-600">Subtotal</span><span className="text-sm font-semibold text-slate-800">LKR {selected.subtotal.toLocaleString()}</span></div>
                  {selected.discount > 0 && <div className="flex justify-between"><span className="text-sm text-emerald-600">Discount</span><span className="text-sm font-semibold text-emerald-600">-LKR {selected.discount.toLocaleString()}</span></div>}
                  <div className="flex justify-between"><span className="text-sm text-slate-600">Tax (VAT 15%)</span><span className="text-sm font-semibold text-slate-800">LKR {selected.tax.toLocaleString()}</span></div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 mt-2">
                    <span className="text-sm font-bold text-slate-900">Total</span>
                    <span className="text-base font-bold text-slate-900">LKR {selected.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {selected.notes && (
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Notes</p>
                  <p className="text-sm text-slate-700 bg-slate-50 rounded-lg px-3 py-2.5 border border-slate-200">{selected.notes}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                {selected.status === "draft" && (
                  <button className="flex items-center gap-1.5 text-xs bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-lg font-medium transition-colors">
                    <Send size={12} /> Send to Client
                  </button>
                )}
                {(selected.status === "sent" || selected.status === "viewed" || selected.status === "negotiation") && (
                  <button className="flex items-center gap-1.5 text-xs bg-emerald-600 text-white hover:bg-emerald-700 px-3 py-2 rounded-lg font-medium transition-colors">
                    <Check size={12} /> Mark Approved
                  </button>
                )}
                {selected.status === "approved" && (
                  <button className="flex items-center gap-1.5 text-xs bg-violet-600 text-white hover:bg-violet-700 px-3 py-2 rounded-lg font-medium transition-colors">
                    <ArrowRight size={12} /> Convert to Invoice
                  </button>
                )}
                <button
                  onClick={() => { setPdfQuo(selected); setSelected(null); }}
                  className="flex items-center gap-1.5 text-xs bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg transition-colors font-medium"
                >
                  <FileText size={12} /> Preview PDF
                </button>
                <button className="flex items-center gap-1.5 text-xs border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-lg transition-colors">
                  <Copy size={12} /> Duplicate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {pdfQuo && (
        <PDFPreviewModal
          data={makeQuoPDFData(pdfQuo)}
          onClose={() => setPdfQuo(null)}
        />
      )}
      {showNew && <NewQuotationModal onClose={() => setShowNew(false)} onSave={handleNewQuotation} />}
      <ActionFeedback data={feedback} onDismiss={() => setFeedback(null)} />
    </div>
  );
}
