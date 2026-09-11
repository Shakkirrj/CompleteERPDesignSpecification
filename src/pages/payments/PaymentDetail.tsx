import { useState } from "react";
import {
  ArrowLeft, CheckCircle2, XCircle, RefreshCw, FileText, Mail,
  Download, ExternalLink, Edit3, Plus, Clock, User, Building2,
  Banknote, CreditCard, AlertTriangle, Shield, MoreHorizontal,
} from "lucide-react";
import type { Payment } from "./paymentsData";
import { statusCfg, reconcileCfg, methodLabels } from "./paymentsData";
import type { ActionFeedbackData } from "../../components/ui/ActionFeedback";

interface Props {
  payment: Payment;
  onBack: () => void;
  onFeedback: (data: ActionFeedbackData) => void;
}

const auditLog = [
  { action: "Payment Created",    user: "Amali De Silva",    time: "10:30",  color: "bg-blue-500"    },
  { action: "Document Uploaded",  user: "Amali De Silva",    time: "10:32",  color: "bg-slate-400"   },
  { action: "Sent for Verification", user: "System",         time: "10:32",  color: "bg-amber-500"   },
  { action: "Payment Verified",   user: "Priya Jayawardena", time: "14:15",  color: "bg-emerald-500" },
  { action: "Receipt Generated",  user: "System",            time: "14:15",  color: "bg-violet-500"  },
  { action: "Reconciled",         user: "Rajith Kumara",     time: "16:00",  color: "bg-blue-600"    },
];

export default function PaymentDetail({ payment, onBack, onFeedback }: Props) {
  const [activeTab, setActiveTab] = useState<"summary" | "audit">("summary");
  const sc = statusCfg[payment.status];
  const rc = reconcileCfg[payment.reconciliationStatus];

  function handleVerify() {
    onFeedback({
      type: "payment",
      title: "Payment Verified",
      message: "Payment has been verified and receipt generated.",
      ref: payment.receiptNo ?? payment.id,
      refLabel: "Receipt No.",
      amount: `LKR ${payment.amountLKR.toLocaleString()}`,
      actions: [{ label: "View Receipt", onClick: () => {}, primary: true }, { label: "Close", onClick: () => {} }],
    });
  }

  function handleReceipt() {
    onFeedback({
      type: "receipt",
      title: "Receipt Generated",
      message: "Professional PDF receipt is ready.",
      ref: payment.receiptNo ?? payment.id,
      refLabel: "Receipt No.",
      amount: `LKR ${payment.amountLKR.toLocaleString()}`,
      actions: [{ label: "Download PDF", onClick: () => {}, primary: true }, { label: "Email", onClick: () => {} }],
    });
  }

  function handleEmail() {
    onFeedback({ type: "email", title: "Receipt Emailed", message: `Receipt sent to ${payment.clientName}.`, ref: payment.receiptNo });
  }

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft size={16} className="text-slate-500" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>{payment.id}</h2>
              {payment.receiptNo && <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-mono">{payment.receiptNo}</span>}
            </div>
            <p className="text-sm text-slate-500 mt-0.5">{payment.paymentType} · {payment.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {payment.status === "PENDING_VERIFICATION" && (
            <>
              <button onClick={handleVerify} className="flex items-center gap-1.5 text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg font-medium transition-colors">
                <CheckCircle2 size={13} /> Verify
              </button>
              <button
                onClick={() => onFeedback({ type: "error", title: "Payment Rejected", message: "Payment has been rejected. Notification sent to creator." })}
                className="flex items-center gap-1.5 text-sm border border-red-200 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg font-medium transition-colors">
                <XCircle size={13} /> Reject
              </button>
            </>
          )}
          {payment.status === "VERIFIED" && payment.reconciliationStatus !== "RECONCILED" && (
            <button
              onClick={() => onFeedback({ type: "success", title: "Payment Reconciled", message: "Bank transaction matched and reconciled.", ref: payment.id })}
              className="flex items-center gap-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-colors">
              <RefreshCw size={13} /> Reconcile
            </button>
          )}
          <button onClick={handleReceipt} className="flex items-center gap-1.5 text-sm border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-lg transition-colors">
            <FileText size={13} /> Receipt
          </button>
          <button onClick={handleEmail} className="flex items-center gap-1.5 text-sm border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-lg transition-colors">
            <Mail size={13} /> Email
          </button>
          <button className="p-2 border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors">
            <MoreHorizontal size={15} className="text-slate-500" />
          </button>
        </div>
      </div>

      {/* Status row */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${sc.bg} ${sc.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{sc.label}
        </span>
        <span className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full ${rc.bg} ${rc.text}`}>
          {rc.label}
        </span>
        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${payment.direction === "INCOMING" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
          {payment.direction}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {(["summary","audit"] as const).map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${activeTab === t ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700"}`}>
            {t === "audit" ? "Audit History" : "Summary"}
          </button>
        ))}
      </div>

      {activeTab === "summary" && (
        <div className="grid grid-cols-12 gap-4">
          {/* Main info */}
          <div className="col-span-8 space-y-4">
            {/* Amount */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
              <p className="text-sm text-slate-400 mb-1">Amount {payment.currency !== "LKR" ? `(${payment.currency})` : ""}</p>
              <p className="text-3xl font-black" style={{ fontFamily: "var(--font-display)" }}>
                {payment.currency === "LKR" ? "LKR " : `${payment.currency} `}{payment.amount.toLocaleString()}
              </p>
              {payment.currency !== "LKR" && (
                <p className="text-sm text-slate-400 mt-1">
                  = LKR {payment.amountLKR.toLocaleString()} @ {payment.exchangeRate} exchange rate
                </p>
              )}
            </div>

            {/* Payment info grid */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><Banknote size={14} />Payment Details</h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Payment Type",    value: payment.paymentType },
                  { label: "Direction",       value: payment.direction },
                  { label: "Payment Date",    value: payment.date },
                  { label: "Received Date",   value: payment.receivedDate ?? "—" },
                  { label: "Method",          value: methodLabels[payment.method] },
                  { label: "Bank",            value: payment.bank ?? "—" },
                  { label: "Bank Account",    value: payment.bankAccount ?? "—" },
                  { label: "Bank Reference",  value: payment.bankRef ?? payment.chequeNo ?? payment.onlineTxId ?? "—" },
                  { label: "Payer Name",      value: payment.payerName ?? "—" },
                  { label: "Payer Bank",      value: payment.payerBank ?? "—" },
                ].map(r => (
                  <div key={r.label}>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{r.label}</p>
                    <p className="text-sm text-slate-800 mt-0.5 font-mono">{r.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Description</p>
                <p className="text-sm text-slate-700">{payment.description}</p>
                {payment.notes && <p className="text-xs text-slate-500 mt-1">{payment.notes}</p>}
              </div>
            </div>

            {/* Client / Project / Invoice */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><Building2 size={14} />Relationships</h4>
              <div className="space-y-3">
                {[
                  { label: "Client",    value: `${payment.clientName} — ${payment.clientCompany}`, id: payment.clientId },
                  { label: "Project",   value: payment.project ?? "—",                              id: payment.projectId },
                  { label: "Invoice",   value: payment.invoiceNo ?? "—",                            id: payment.invoiceId },
                ].map(r => (
                  <div key={r.label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{r.label}</p>
                      <p className="text-sm text-slate-800 mt-0.5">{r.value}</p>
                    </div>
                    {r.id && r.value !== "—" && (
                      <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 border border-blue-200 hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors">
                        <ExternalLink size={10} /> View
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side info */}
          <div className="col-span-4 space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2"><Shield size={13} />Verification</h4>
              <div className="space-y-2.5">
                {[
                  { label: "Created By",  value: payment.createdBy,   icon: User },
                  { label: "Verified By", value: payment.verifiedBy ?? "Pending", icon: CheckCircle2 },
                  { label: "Approved By", value: payment.approvedBy ?? "Pending", icon: Shield },
                ].map(r => (
                  <div key={r.label} className="flex items-start gap-2">
                    <r.icon size={12} className="text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{r.label}</p>
                      <p className="text-xs text-slate-700">{r.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2"><Clock size={13} />Timestamps</h4>
              {[
                { label: "Created At", value: payment.createdAt.replace("T", " ") },
                { label: "Updated At", value: payment.updatedAt.replace("T", " ") },
              ].map(r => (
                <div key={r.label}>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{r.label}</p>
                  <p className="text-xs font-mono text-slate-700">{r.value}</p>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1.5">
              <h4 className="text-sm font-bold text-slate-800 mb-3">Quick Actions</h4>
              {[
                { label: "Generate Receipt", icon: FileText,    onClick: handleReceipt },
                { label: "Email Receipt",    icon: Mail,        onClick: handleEmail   },
                { label: "Download",         icon: Download,    onClick: () => onFeedback({ type: "success", title: "Downloading", message: "PDF is being prepared." }) },
                { label: "Add Note",         icon: Plus,        onClick: () => {} },
                { label: "Edit Payment",     icon: Edit3,       onClick: () => {} },
              ].map(a => (
                <button key={a.label} onClick={a.onClick}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-lg text-sm text-slate-700 text-left transition-colors">
                  <a.icon size={12} className="text-slate-400" /> {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "audit" && (
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h4 className="text-sm font-bold text-slate-800 mb-5">Audit Trail — {payment.id}</h4>
          <div className="space-y-0">
            {auditLog.map((entry, i) => (
              <div key={i} className="flex items-start gap-3 pb-5 relative">
                {i < auditLog.length - 1 && (
                  <div className="absolute left-3 top-6 w-px h-full bg-slate-100" />
                )}
                <div className={`w-6 h-6 rounded-full ${entry.color} flex items-center justify-center flex-shrink-0 z-10`}>
                  <span className="w-2 h-2 bg-white rounded-full" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{entry.action}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{entry.user} · {payment.date} {entry.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
