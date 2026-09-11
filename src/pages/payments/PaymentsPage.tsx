import { useState, useCallback } from "react";
import {
  Search, Filter, Plus, Download, RefreshCw, Eye, CheckCircle2,
  FileText, Mail, ChevronDown, X,
  ArrowUpRight, ArrowDownLeft,
} from "lucide-react";
import ActionFeedback, { type ActionFeedbackData } from "../../components/ui/ActionFeedback";
import PaymentDetail from "./PaymentDetail";
import RecordPaymentForm from "./RecordPaymentForm";
import { mockPayments, statusCfg, reconcileCfg, methodLabels, type Payment } from "./paymentsData";
import PDFPreviewModal from "../../components/pdf/PDFPreviewModal";
import type { PDFData } from "../../components/pdf/PDFDocument";

type View = "list" | "detail" | "new";

const KPI_CARDS = [
  { label: "Total Payments",         value: "LKR 25.87M",  sub: "All time",            color: "text-slate-800",   bg: "bg-slate-50",    border: "border-slate-200"  },
  { label: "Received Today",         value: "LKR 0",       sub: "0 payments",          color: "text-slate-500",   bg: "bg-slate-50",    border: "border-slate-200"  },
  { label: "Received This Month",    value: "LKR 2.50M",   sub: "3 payments",          color: "text-emerald-700", bg: "bg-emerald-50",  border: "border-emerald-200"},
  { label: "Pending Verification",   value: "1",           sub: "Needs review",        color: "text-amber-700",   bg: "bg-amber-50",    border: "border-amber-200"  },
  { label: "Pending Reconciliation", value: "2",           sub: "Unmatched",           color: "text-blue-700",    bg: "bg-blue-50",     border: "border-blue-200"   },
  { label: "Refunds",                value: "0",           sub: "This month",          color: "text-violet-700",  bg: "bg-violet-50",   border: "border-violet-200" },
  { label: "Outstanding Receivables",value: "LKR 3.60M",   sub: "3 clients",           color: "text-red-700",     bg: "bg-red-50",      border: "border-red-200"    },
  { label: "Outstanding Payables",   value: "LKR 0.48M",   sub: "Vendor payments",     color: "text-orange-700",  bg: "bg-orange-50",   border: "border-orange-200" },
];

function buildReceiptPDF(payment: Payment): PDFData {
  return {
    type: "receipt",
    docNumber: payment.receiptNo ?? payment.id,
    date: payment.date,
    currency: payment.currency,
    exchangeRate: payment.currency !== "LKR" ? payment.exchangeRate : undefined,
    paymentMethod: methodLabels[payment.method],
    paymentStatus: "paid",
    watermark: "PAID",
    customer: {
      name: payment.clientName,
      company: payment.clientCompany,
      address: "—",
      email: "—",
      phone: "—",
    },
    items: [{
      no: 1,
      description: payment.description + (payment.invoiceNo ? ` (${payment.invoiceNo})` : ""),
      qty: 1, unit: "pmt", unitPrice: payment.amount,
      discount: 0, tax: 0, total: payment.amount,
    }],
    subtotal: payment.amount, discountTotal: 0, taxTotal: 0,
    grandTotal: payment.amount, amountPaid: payment.amount, balanceDue: 0,
    terms: "This receipt confirms payment received. Please retain for your records.",
  };
}

export default function PaymentsPage() {
  const [view, setView] = useState<View>("list");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [receiptPayment, setReceiptPayment] = useState<Payment | null>(null);
  const [feedback, setFeedback] = useState<ActionFeedbackData | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterDirection, setFilterDirection] = useState<string>("ALL");
  const [filterMethod, setFilterMethod] = useState<string>("ALL");
  const [showFilters, setShowFilters] = useState(false);
  const [payments, setPayments] = useState<Payment[]>(mockPayments);

  const onFeedback = useCallback((data: ActionFeedbackData) => setFeedback(data), []);
  const onDismiss = useCallback(() => setFeedback(null), []);

  const filtered = payments.filter(p => {
    if (filterStatus !== "ALL" && p.status !== filterStatus) return false;
    if (filterDirection !== "ALL" && p.direction !== filterDirection) return false;
    if (filterMethod !== "ALL" && p.method !== filterMethod) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.id.toLowerCase().includes(q) || (p.receiptNo ?? "").toLowerCase().includes(q) ||
        p.clientName.toLowerCase().includes(q) || p.clientCompany.toLowerCase().includes(q) ||
        (p.invoiceNo ?? "").toLowerCase().includes(q) || (p.project ?? "").toLowerCase().includes(q) ||
        (p.bankRef ?? "").toLowerCase().includes(q);
    }
    return true;
  });

  function handleVerify(p: Payment) {
    setPayments(prev => prev.map(x => x.id === p.id ? { ...x, status: "VERIFIED", verifiedBy: "Priya Jayawardena", receiptNo: `REC-MC-2026-${String(Date.now()).slice(-6)}` } : x));
    onFeedback({
      type: "payment", title: "Payment Verified",
      message: "Receipt has been generated.",
      ref: `REC-MC-2026-${String(Date.now()).slice(-6)}`, refLabel: "Receipt No.",
      amount: `LKR ${p.amountLKR.toLocaleString()}`,
      actions: [{ label: "View Receipt", onClick: () => {}, primary: true }, { label: "Email", onClick: () => {} }],
    });
  }

  if (view === "new") {
    return (
      <>
        <RecordPaymentForm onBack={() => setView("list")} onFeedback={onFeedback} />
        <ActionFeedback data={feedback} onDismiss={onDismiss} />
      </>
    );
  }

  if (view === "detail" && selectedPayment) {
    return (
      <>
        <PaymentDetail payment={selectedPayment} onBack={() => setView("list")} onFeedback={onFeedback} />
        <ActionFeedback data={feedback} onDismiss={onDismiss} />
      </>
    );
  }

  return (
    <>
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Payments</h2>
            <p className="text-sm text-slate-500 mt-0.5">Record, verify, reconcile and manage all incoming and outgoing payments</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onFeedback({ type: "processing", title: "Syncing Payments…", message: "Fetching latest bank transactions." })}
              className="flex items-center gap-1.5 text-sm border border-slate-200 hover:bg-slate-50 px-3 py-2 rounded-lg text-slate-600 transition-colors">
              <RefreshCw size={13} /> Refresh
            </button>
            <button className="flex items-center gap-1.5 text-sm border border-slate-200 hover:bg-slate-50 px-3 py-2 rounded-lg text-slate-600 transition-colors">
              <Download size={13} /> Export
            </button>
            <button onClick={() => setView("new")}
              className="flex items-center gap-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
              <Plus size={13} /> Create Payment
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-3 xl:grid-cols-8">
          {KPI_CARDS.map(k => (
            <div key={k.label} className={`${k.bg} border ${k.border} rounded-xl px-3 py-3`}>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide leading-tight">{k.label}</p>
              <p className={`text-lg font-black ${k.color} mt-0.5 leading-none`} style={{ fontFamily: "var(--font-display)" }}>{k.value}</p>
              <p className="text-[10px] text-slate-400 mt-1">{k.sub}</p>
            </div>
          ))}
        </div>

        {/* Search + filter bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by Payment ID, Receipt No., Client, Invoice, Reference…"
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            {search && <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2"><X size={12} className="text-slate-400" /></button>}
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 text-sm px-3 py-2 border rounded-xl transition-colors ${showFilters ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 hover:bg-slate-50 text-slate-600"}`}>
            <Filter size={12} /> Filters {showFilters ? <ChevronDown size={10} className="rotate-180 transition-transform" /> : <ChevronDown size={10} />}
          </button>
          {/* Quick status filters */}
          <div className="flex items-center gap-1">
            {(["ALL","PENDING_VERIFICATION","VERIFIED","RECONCILED"] as const).map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${filterStatus === s ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                {s === "ALL" ? "All" : s === "PENDING_VERIFICATION" ? "Pending" : s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="bg-white border border-slate-200 rounded-xl p-4 grid grid-cols-4 gap-3 anim-slide-up">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Direction</label>
              <select value={filterDirection} onChange={e => setFilterDirection(e.target.value)}
                className="mt-1 w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="ALL">All Directions</option>
                <option value="INCOMING">Incoming</option>
                <option value="OUTGOING">Outgoing</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Method</label>
              <select value={filterMethod} onChange={e => setFilterMethod(e.target.value)}
                className="mt-1 w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="ALL">All Methods</option>
                {Object.entries(methodLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Date From</label>
              <input type="date" className="mt-1 w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Date To</label>
              <input type="date" className="mt-1 w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        )}

        {/* Payments table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">{filtered.length} payment{filtered.length !== 1 ? "s" : ""}</p>
            <p className="text-xs text-slate-400">Click a row to view full details</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-50 bg-slate-50/50">
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">Receipt # / ID</th>
                  <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Date</th>
                  <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Client / Company</th>
                  <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Invoice / Project</th>
                  <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Type</th>
                  <th className="px-3 py-3 text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Amount</th>
                  <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Method</th>
                  <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Status</th>
                  <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Reconciliation</th>
                  <th className="px-4 py-3 text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-5 py-12 text-center text-sm text-slate-400">
                      No payments found matching your filters.
                    </td>
                  </tr>
                ) : filtered.map(p => {
                  const sc = statusCfg[p.status];
                  const rc = reconcileCfg[p.reconciliationStatus];
                  return (
                    <tr key={p.id}
                      className="hover:bg-blue-50/30 cursor-pointer transition-colors group"
                      onClick={() => { setSelectedPayment(p); setView("detail"); }}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${p.direction === "INCOMING" ? "bg-emerald-50" : "bg-red-50"}`}>
                            {p.direction === "INCOMING"
                              ? <ArrowDownLeft size={11} className="text-emerald-600" />
                              : <ArrowUpRight  size={11} className="text-red-500" />}
                          </div>
                          <div>
                            {p.receiptNo && <p className="text-xs font-mono font-semibold text-blue-700">{p.receiptNo}</p>}
                            <p className="text-[10px] font-mono text-slate-400">{p.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-xs text-slate-600 whitespace-nowrap">{p.date}</td>
                      <td className="px-3 py-3">
                        <p className="text-sm font-medium text-slate-800 truncate max-w-36">{p.clientCompany}</p>
                        <p className="text-[10px] text-slate-400 truncate">{p.clientName}</p>
                      </td>
                      <td className="px-3 py-3">
                        <p className="text-xs font-mono text-slate-600">{p.invoiceNo ?? "—"}</p>
                        {p.project && <p className="text-[10px] text-slate-400 truncate max-w-28">{p.project}</p>}
                      </td>
                      <td className="px-3 py-3">
                        <span className="text-xs text-slate-600">{p.paymentType}</span>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <p className={`text-sm font-bold font-mono ${p.direction === "INCOMING" ? "text-emerald-700" : "text-red-700"}`}>
                          {p.direction === "INCOMING" ? "+" : "-"}{p.currency === "LKR" ? "LKR " : `${p.currency} `}{p.amount.toLocaleString()}
                        </p>
                        {p.currency !== "LKR" && <p className="text-[10px] text-slate-400">= LKR {p.amountLKR.toLocaleString()}</p>}
                      </td>
                      <td className="px-3 py-3 text-xs text-slate-600 whitespace-nowrap">{methodLabels[p.method]}</td>
                      <td className="px-3 py-3">
                        <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap w-fit ${sc.bg} ${sc.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${sc.dot}`} />{sc.label}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap w-fit ${rc.bg} ${rc.text}`}>{rc.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={e => { e.stopPropagation(); setSelectedPayment(p); setView("detail"); }}
                            title="View" className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors">
                            <Eye size={12} className="text-blue-600" />
                          </button>
                          {p.status === "PENDING_VERIFICATION" && (
                            <button onClick={e => { e.stopPropagation(); handleVerify(p); }}
                              title="Verify" className="p-1.5 hover:bg-emerald-100 rounded-lg transition-colors">
                              <CheckCircle2 size={12} className="text-emerald-600" />
                            </button>
                          )}
                          <button onClick={e => { e.stopPropagation(); setReceiptPayment(p); }}
                            title="Receipt" className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors">
                            <FileText size={12} className="text-slate-500" />
                          </button>
                          <button onClick={e => { e.stopPropagation(); onFeedback({ type: "email", title: "Receipt Emailed", message: `Sent to ${p.clientName}.`, ref: p.receiptNo }); }}
                            title="Email" className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors">
                            <Mail size={12} className="text-slate-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span>Showing {filtered.length} of {payments.length} payments</span>
            <div className="flex items-center gap-3">
              <span className="text-emerald-600 font-semibold">↓ Incoming: LKR {payments.filter(p => p.direction === "INCOMING").reduce((s,p) => s + p.amountLKR, 0).toLocaleString()}</span>
              <span className="text-red-500 font-semibold">↑ Outgoing: LKR {payments.filter(p => p.direction === "OUTGOING").reduce((s,p) => s + p.amountLKR, 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <ActionFeedback data={feedback} onDismiss={onDismiss} />
      {receiptPayment && (
        <PDFPreviewModal
          data={buildReceiptPDF(receiptPayment)}
          onClose={() => setReceiptPayment(null)}
        />
      )}
    </>
  );
}
