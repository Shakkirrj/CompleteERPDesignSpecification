import { useState } from "react";
import {
  ArrowLeft, ArrowRight, Building2, FileText, Banknote,
  Upload, CheckCircle2, ChevronRight, X, Search, CreditCard,
} from "lucide-react";
import type { ActionFeedbackData } from "../../components/ui/ActionFeedback";
import { mockClients, PAYMENT_TYPES } from "./paymentsData";

interface Props {
  onBack: () => void;
  onFeedback: (data: ActionFeedbackData) => void;
}

type Step = "info" | "client" | "invoice" | "bank" | "amount" | "docs" | "review";

const STEPS: { id: Step; label: string; icon: React.ElementType }[] = [
  { id: "info",    label: "Payment Info",     icon: FileText    },
  { id: "client",  label: "Client / Company", icon: Building2   },
  { id: "invoice", label: "Invoice / Project",icon: FileText    },
  { id: "bank",    label: "Payment Method",   icon: CreditCard  },
  { id: "amount",  label: "Amount",           icon: Banknote    },
  { id: "docs",    label: "Documents",        icon: Upload      },
  { id: "review",  label: "Review & Submit",  icon: CheckCircle2},
];

export default function RecordPaymentForm({ onBack, onFeedback }: Props) {
  const [step, setStep] = useState<Step>("info");
  const [form, setForm] = useState({
    paymentType: "Client Payment",
    direction: "INCOMING",
    clientId: "",
    clientSearch: "",
    project: "",
    invoiceNo: "",
    service: "",
    paymentDate: new Date().toISOString().slice(0, 10),
    amount: "",
    currency: "LKR",
    exchangeRate: "1.00",
    method: "BANK_TRANSFER",
    bank: "Sampath Bank",
    bankAccount: "",
    transactionRef: "",
    payerName: "",
    payerBank: "",
    description: "",
    notes: "",
  });

  const stepIdx = STEPS.findIndex(s => s.id === step);
  const selectedClient = mockClients.find(c => c.id === form.clientId);

  function setField(k: string, v: string) {
    setForm(f => ({ ...f, [k]: v }));
  }

  function nextStep() {
    const next = STEPS[stepIdx + 1];
    if (next) setStep(next.id);
  }

  function prevStep() {
    const prev = STEPS[stepIdx - 1];
    if (prev) setStep(prev.id);
    else onBack();
  }

  function handleSubmit() {
    const payId = `PAY-2026-${String(Date.now()).slice(-6)}`;
    const recNo = `REC-MC-2026-${String(Date.now()).slice(-6)}`;
    onFeedback({
      type: "payment",
      title: "Payment Recorded Successfully",
      message: "Receipt has been generated and is ready to send.",
      ref: recNo,
      refLabel: "Receipt No.",
      amount: `${form.currency} ${Number(form.amount).toLocaleString()}`,
      autoDismiss: 0,
      actions: [
        { label: "View Receipt", onClick: () => {}, primary: true },
        { label: "Record Another", onClick: onBack },
      ],
    });
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft size={16} className="text-slate-500" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Record Payment</h2>
          <p className="text-sm text-slate-500 mt-0.5">Step {stepIdx + 1} of {STEPS.length} — {STEPS[stepIdx].label}</p>
        </div>
      </div>

      {/* Step progress */}
      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-2xl p-3 overflow-x-auto">
        {STEPS.map((s, i) => {
          const done = i < stepIdx;
          const active = s.id === step;
          return (
            <div key={s.id} className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => i <= stepIdx && setStep(s.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  active ? "bg-blue-600 text-white shadow-sm" :
                  done   ? "text-emerald-600 hover:bg-emerald-50" :
                           "text-slate-400"
                }`}
              >
                {done ? <CheckCircle2 size={11} /> : <s.icon size={11} />}
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {i < STEPS.length - 1 && <ChevronRight size={10} className="text-slate-300 flex-shrink-0" />}
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 anim-fade-in" key={step}>
        {/* Step A: Payment Info */}
        {step === "info" && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-slate-900">A. Payment Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Payment Type</label>
                <select value={form.paymentType} onChange={e => setField("paymentType", e.target.value)}
                  className="mt-1.5 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {PAYMENT_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Direction</label>
                <div className="flex gap-2 mt-1.5">
                  {["INCOMING","OUTGOING"].map(d => (
                    <button key={d} onClick={() => setField("direction", d)}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${form.direction === d ? (d === "INCOMING" ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-red-400 bg-red-50 text-red-700") : "border-slate-200 text-slate-600 hover:border-slate-300"}`}>
                      {d === "INCOMING" ? "↓ Incoming" : "↑ Outgoing"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Payment Date</label>
                <input type="date" value={form.paymentDate} onChange={e => setField("paymentDate", e.target.value)}
                  className="mt-1.5 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Description</label>
                <input value={form.description} onChange={e => setField("description", e.target.value)}
                  placeholder="Brief payment description" type="text"
                  className="mt-1.5 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>
        )}

        {/* Step B: Client */}
        {step === "client" && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-slate-900">B. Client / Company</h3>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Search Client</label>
              <div className="relative mt-1.5">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={form.clientSearch} onChange={e => setField("clientSearch", e.target.value)}
                  placeholder="Search by name or company…"
                  className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="space-y-2">
              {mockClients
                .filter(c => !form.clientSearch || c.name.toLowerCase().includes(form.clientSearch.toLowerCase()) || c.company.toLowerCase().includes(form.clientSearch.toLowerCase()))
                .map(c => (
                  <button key={c.id} onClick={() => { setField("clientId", c.id); setField("clientSearch", c.name); setField("payerName", c.company); }}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${form.clientId === c.id ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300"}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm ${form.clientId === c.id ? "bg-blue-600" : "bg-slate-400"}`}>
                      {c.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">{c.name}</p>
                      <p className="text-xs text-slate-500">{c.company}</p>
                    </div>
                    <div className="text-right text-xs">
                      <p className="text-slate-500">Outstanding</p>
                      <p className={`font-bold ${c.outstanding > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                        LKR {c.outstanding.toLocaleString()}
                      </p>
                    </div>
                  </button>
                ))}
            </div>
            {selectedClient && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <h4 className="text-sm font-bold text-slate-800">Client Summary — {selectedClient.company}</h4>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Total Invoiced",  value: `LKR ${selectedClient.totalInvoiced.toLocaleString()}`, color: "text-slate-800" },
                    { label: "Total Paid",       value: `LKR ${selectedClient.totalPaid.toLocaleString()}`,     color: "text-emerald-600" },
                    { label: "Outstanding",      value: `LKR ${selectedClient.outstanding.toLocaleString()}`,   color: selectedClient.outstanding > 0 ? "text-amber-600" : "text-emerald-600" },
                  ].map(s => (
                    <div key={s.label} className="bg-white border border-slate-100 rounded-xl p-3">
                      <p className="text-[10px] text-slate-500">{s.label}</p>
                      <p className={`text-sm font-bold mt-0.5 ${s.color}`}>{s.value}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Active Projects</p>
                  {selectedClient.projects.filter(p => p.status !== "Completed").map(p => (
                    <div key={p.id} className="flex items-center justify-between py-1.5 text-xs">
                      <span className="text-slate-700">{p.name}</span>
                      <span className="text-slate-400 font-mono">{p.id}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step C: Invoice / Project */}
        {step === "invoice" && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-slate-900">C. Invoice / Project</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Invoice Number</label>
                <input value={form.invoiceNo} onChange={e => setField("invoiceNo", e.target.value)}
                  placeholder="INV-MC-2026-000001" type="text"
                  className="mt-1.5 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Project</label>
                <select value={form.project} onChange={e => setField("project", e.target.value)}
                  className="mt-1.5 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select project…</option>
                  {(selectedClient?.projects ?? []).map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Service</label>
                <select value={form.service} onChange={e => setField("service", e.target.value)}
                  className="mt-1.5 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select service…</option>
                  {["Software Development","Web Development","Mobile App","Hosting","ERP","POS","Support","Consulting"].map(s => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step D: Bank / Method */}
        {step === "bank" && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-slate-900">D. Payment Method & Bank</h3>
            <div className="grid grid-cols-3 gap-3">
              {(["BANK_TRANSFER","CHEQUE","CASH","CARD","ONLINE","NEFT","RTGS","SWIFT"] as const).map(m => (
                <button key={m} onClick={() => setField("method", m)}
                  className={`p-3 border-2 rounded-xl text-left transition-all ${form.method === m ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300"}`}>
                  <p className={`text-sm font-semibold ${form.method === m ? "text-blue-700" : "text-slate-700"}`}>{m.replace(/_/g, " ")}</p>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Bank</label>
                <select value={form.bank} onChange={e => setField("bank", e.target.value)}
                  className="mt-1.5 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {["Sampath Bank","Commercial Bank","Bank of Ceylon","HSBC Sri Lanka","People's Bank","NSB"].map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Bank Account</label>
                <input value={form.bankAccount} onChange={e => setField("bankAccount", e.target.value)}
                  placeholder="Account number" type="text"
                  className="mt-1.5 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Transaction Reference</label>
                <input value={form.transactionRef} onChange={e => setField("transactionRef", e.target.value)}
                  placeholder="Bank reference / cheque no." type="text"
                  className="mt-1.5 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Payer Name</label>
                <input value={form.payerName} onChange={e => setField("payerName", e.target.value)}
                  placeholder="Payer / remitter name" type="text"
                  className="mt-1.5 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Payer Bank</label>
                <input value={form.payerBank} onChange={e => setField("payerBank", e.target.value)}
                  placeholder="Payer's bank name" type="text"
                  className="mt-1.5 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>
        )}

        {/* Step E: Amount */}
        {step === "amount" && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-slate-900">E. Amount & Currency</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Currency</label>
                <select value={form.currency} onChange={e => { setField("currency", e.target.value); setField("exchangeRate", e.target.value === "LKR" ? "1.00" : "316.50"); }}
                  className="mt-1.5 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {["LKR","USD","EUR","GBP","SGD","AUD"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Amount ({form.currency})</label>
                <input value={form.amount} onChange={e => setField("amount", e.target.value)}
                  placeholder="0.00" type="number" min="0"
                  className="mt-1.5 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Exchange Rate</label>
                <input value={form.exchangeRate} onChange={e => setField("exchangeRate", e.target.value)}
                  type="number" min="0" step="0.01"
                  disabled={form.currency === "LKR"}
                  className="mt-1.5 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-400" />
              </div>
            </div>
            {form.amount && form.currency !== "LKR" && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-xs text-blue-600">LKR Equivalent (Base Currency)</p>
                <p className="text-xl font-black text-blue-800 mt-0.5" style={{ fontFamily: "var(--font-display)" }}>
                  LKR {(Number(form.amount) * Number(form.exchangeRate)).toLocaleString()}
                </p>
                <p className="text-[10px] text-blue-500 mt-1">Original amount preserved: {form.currency} {Number(form.amount).toLocaleString()}</p>
              </div>
            )}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Notes</label>
              <textarea value={form.notes} onChange={e => setField("notes", e.target.value)}
                rows={2} placeholder="Additional notes…"
                className="mt-1.5 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
          </div>
        )}

        {/* Step F: Documents */}
        {step === "docs" && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-slate-900">F. Supporting Documents</h3>
            <div className="border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-2xl p-10 flex flex-col items-center gap-3 cursor-pointer transition-colors group">
              <div className="w-12 h-12 bg-slate-100 group-hover:bg-blue-50 rounded-2xl flex items-center justify-center transition-colors">
                <Upload size={22} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <p className="text-sm font-semibold text-slate-700">Drop bank slip or transfer proof here</p>
              <p className="text-xs text-slate-400">PDF, PNG, JPG · Max 10 MB per file</p>
              <button className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg font-medium">Browse Files</button>
            </div>
            <p className="text-xs text-slate-400 text-center">Secure upload — files are stored encrypted and access is restricted to authorized finance users.</p>
          </div>
        )}

        {/* Step G: Review */}
        {step === "review" && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-slate-900">G. Review & Submit</h3>
            <div className="bg-slate-50 rounded-2xl divide-y divide-slate-200 overflow-hidden border border-slate-200">
              {[
                { label: "Payment Type",  value: form.paymentType },
                { label: "Direction",     value: form.direction },
                { label: "Client",        value: selectedClient ? `${selectedClient.name} — ${selectedClient.company}` : "—" },
                { label: "Invoice",       value: form.invoiceNo || "—" },
                { label: "Project",       value: form.project || "—" },
                { label: "Date",          value: form.paymentDate },
                { label: "Amount",        value: form.amount ? `${form.currency} ${Number(form.amount).toLocaleString()}` : "—" },
                { label: "Method",        value: form.method.replace(/_/g, " ") },
                { label: "Bank",          value: form.bank },
                { label: "Reference",     value: form.transactionRef || "—" },
                { label: "Payer",         value: form.payerName || "—" },
                { label: "Description",   value: form.description || "—" },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between px-5 py-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{r.label}</span>
                  <span className="text-sm text-slate-800 font-medium">{r.value}</span>
                </div>
              ))}
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
              By submitting this payment, you confirm that all details are accurate. The payment will be sent for verification by an authorized Finance team member. A receipt number will be generated upon verification.
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={prevStep} className="flex items-center gap-1.5 text-sm border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl transition-colors">
          <ArrowLeft size={13} /> {stepIdx === 0 ? "Cancel" : "Back"}
        </button>
        {step !== "review" ? (
          <button onClick={nextStep} className="flex items-center gap-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-medium transition-colors">
            Continue <ArrowRight size={13} />
          </button>
        ) : (
          <button onClick={handleSubmit} className="flex items-center gap-1.5 text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl font-medium transition-colors">
            <CheckCircle2 size={13} /> Submit Payment
          </button>
        )}
      </div>
    </div>
  );
}
