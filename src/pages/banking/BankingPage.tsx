import { useState } from "react";
import {
  Landmark, ArrowUpRight, ArrowDownLeft, RefreshCw, Plus, Send,
  Download, Upload, Eye, EyeOff, CreditCard, AlertTriangle, CheckCircle2,
  Clock, Filter, Search, Building2, ChevronRight, Wifi, WifiOff, X,
} from "lucide-react";

interface BankAccount {
  id: string; bank: string; branch: string; accountNo: string;
  accountType: "current" | "savings" | "payroll";
  balance: number; currency: string; connected: boolean;
  lastSync?: string; color: string; logo: string;
}

interface Transaction {
  id: string; accountId: string; date: string; description: string;
  ref: string; amount: number; type: "credit" | "debit";
  category: "salary" | "vendor" | "client" | "internal" | "tax" | "other";
  status: "completed" | "pending" | "failed";
}

const accounts: BankAccount[] = [
  { id: "a1", bank: "Sampath Bank", branch: "Colombo 03", accountNo: "1023 4567 8901", accountType: "current", balance: 4820650.00, currency: "LKR", connected: true,  lastSync: "2 min ago",  color: "from-blue-600 to-blue-800",   logo: "SB" },
  { id: "a2", bank: "Commercial Bank", branch: "Colombo 07", accountNo: "8809 1234 0032", accountType: "payroll", balance: 8060000.00, currency: "LKR", connected: true,  lastSync: "5 min ago",  color: "from-red-600 to-red-800",     logo: "CB" },
  { id: "a3", bank: "Bank of Ceylon",  branch: "Colombo 01", accountNo: "4401 9900 1122", accountType: "savings", balance: 12450000.00,currency: "LKR", connected: true,  lastSync: "1h ago",     color: "from-emerald-600 to-emerald-800",logo:"BC"},
  { id: "a4", bank: "HSBC Sri Lanka",  branch: "Fort",       accountNo: "9001 5522 7733", accountType: "current", balance: 28500.00,  currency: "USD", connected: false, lastSync: undefined,    color: "from-slate-600 to-slate-800",  logo: "HS" },
];

const transactions: Transaction[] = [
  { id: "t1",  accountId: "a2", date: "2025-03-01", description: "March Salary Credit — 59 Employees",   ref: "MC-PAY-2025-0003", amount: 7770000, type: "debit",  category: "salary",   status: "completed" },
  { id: "t2",  accountId: "a1", date: "2025-02-28", description: "Payment from Lanka Retail PLC",        ref: "INV-2025-0089",    amount: 1200000, type: "credit", category: "client",   status: "completed" },
  { id: "t3",  accountId: "a1", date: "2025-02-27", description: "AWS Infrastructure Invoice",           ref: "AWS-INV-FEB25",    amount: 218400,  type: "debit",  category: "vendor",   status: "completed" },
  { id: "t4",  accountId: "a1", date: "2025-02-26", description: "Payment from Sampath Bank ERP Project",ref: "INV-2025-0085",    amount: 2400000, type: "credit", category: "client",   status: "completed" },
  { id: "t5",  accountId: "a3", date: "2025-02-25", description: "Transfer to Payroll Account",          ref: "INT-TRF-0025",     amount: 7770000, type: "debit",  category: "internal", status: "completed" },
  { id: "t6",  accountId: "a1", date: "2025-02-24", description: "VAT Payment to Inland Revenue",        ref: "VAT-Q4-2024",      amount: 340000,  type: "debit",  category: "tax",      status: "completed" },
  { id: "t7",  accountId: "a1", date: "2025-02-20", description: "Office Rent — March 2025",             ref: "RENT-MAR25",       amount: 185000,  type: "debit",  category: "vendor",   status: "completed" },
  { id: "t8",  accountId: "a2", date: "2025-03-28", description: "April Salary Batch — In Progress",     ref: "MC-PAY-2025-0004", amount: 8060000, type: "debit",  category: "salary",   status: "pending"   },
];

const catColors: Record<string, string> = {
  salary:   "bg-violet-50 text-violet-700",
  vendor:   "bg-amber-50 text-amber-700",
  client:   "bg-emerald-50 text-emerald-700",
  internal: "bg-blue-50 text-blue-700",
  tax:      "bg-red-50 text-red-700",
  other:    "bg-slate-100 text-slate-600",
};

const statusColors: Record<string, string> = {
  completed: "text-emerald-600",
  pending:   "text-amber-600",
  failed:    "text-red-600",
};

type TransferType = "neft" | "rtgs" | "swift" | "salary";

const transferTypes: { id: TransferType; label: string; desc: string; limit: string }[] = [
  { id: "neft",   label: "NEFT",        desc: "National Electronic Funds Transfer", limit: "No limit"     },
  { id: "rtgs",   label: "RTGS",        desc: "Real Time Gross Settlement",          limit: "Min LKR 2M"   },
  { id: "swift",  label: "SWIFT",       desc: "International Wire Transfer",         limit: "USD / multi"  },
  { id: "salary", label: "Salary Batch",desc: "Bulk employee salary credit",         limit: "Payroll only" },
];

function fmt(n: number, currency = "LKR") {
  if (currency === "USD") return `$ ${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  return `LKR ${n.toLocaleString("en-LK", { minimumFractionDigits: 2 })}`;
}

export default function BankingPage() {
  const [showBalances, setShowBalances] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [tab, setTab] = useState<"transactions" | "transfer" | "payroll">("transactions");
  const [txFilter, setTxFilter] = useState<"all" | Transaction["category"]>("all");
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferType, setTransferType] = useState<TransferType>("neft");
  const [syncing, setSyncing] = useState<string | null>(null);

  const visibleTx = transactions.filter(t =>
    (!selectedAccount || t.accountId === selectedAccount) &&
    (txFilter === "all" || t.category === txFilter)
  );

  const totalLKR = accounts.filter(a => a.currency === "LKR" && a.connected).reduce((s, a) => s + a.balance, 0);
  const totalUSD = accounts.filter(a => a.currency === "USD" && a.connected).reduce((s, a) => s + a.balance, 0);

  function syncAccount(id: string) {
    setSyncing(id);
    setTimeout(() => setSyncing(null), 2000);
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Banking</h2>
          <p className="text-sm text-slate-500 mt-0.5">{accounts.filter(a => a.connected).length} connected accounts</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowBalances(s => !s)}
            className="flex items-center gap-1.5 text-sm border border-slate-200 hover:bg-slate-50 px-3 py-2 rounded-lg text-slate-600 transition-colors">
            {showBalances ? <EyeOff size={13} /> : <Eye size={13} />}
            {showBalances ? "Hide" : "Show"} Balances
          </button>
          <button onClick={() => setShowTransferModal(true)}
            className="flex items-center gap-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-colors">
            <Send size={13} /> New Transfer
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Total Balance (LKR)</p>
          <p className="text-3xl font-black mt-1 tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            {showBalances ? fmt(totalLKR) : "LKR •••,•••,•••"}
          </p>
          {totalUSD > 0 && (
            <p className="text-sm text-slate-400 mt-1">+ {fmt(totalUSD, "USD")} in foreign currency accounts</p>
          )}
          <div className="flex items-center gap-4 mt-4">
            <div>
              <p className="text-xs text-slate-500">Credits (Mar)</p>
              <p className="text-sm font-semibold text-emerald-400">+LKR 3,600,000</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Debits (Mar)</p>
              <p className="text-sm font-semibold text-red-400">-LKR 8,513,400</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-3">Quick Actions</p>
          <div className="space-y-2">
            {[
              { label: "Salary Payment",    icon: Send,           color: "text-violet-600 bg-violet-50", onClick: () => { setTab("payroll"); setShowTransferModal(false); } },
              { label: "Vendor Payment",    icon: ArrowUpRight,   color: "text-amber-600 bg-amber-50",   onClick: () => setShowTransferModal(true) },
              { label: "Download Statement",icon: Download,       color: "text-blue-600 bg-blue-50",     onClick: () => {} },
            ].map(a => (
              <button key={a.label} onClick={a.onClick}
                className="w-full flex items-center gap-2.5 p-2.5 hover:bg-slate-50 rounded-xl transition-colors text-left">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${a.color}`}>
                  <a.icon size={13} />
                </div>
                <span className="text-sm text-slate-700 font-medium">{a.label}</span>
                <ChevronRight size={12} className="text-slate-300 ml-auto" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Account cards */}
      <div className="grid grid-cols-4 gap-3">
        {accounts.map(acc => (
          <div
            key={acc.id}
            onClick={() => setSelectedAccount(selectedAccount === acc.id ? null : acc.id)}
            className={`relative rounded-xl overflow-hidden cursor-pointer transition-all ${selectedAccount === acc.id ? "ring-2 ring-blue-500 ring-offset-1" : "hover:shadow-md"}`}
          >
            <div className={`bg-gradient-to-br ${acc.color} p-4 text-white`}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white">{acc.logo}</span>
                </div>
                <div className="flex items-center gap-1">
                  {acc.connected
                    ? <span className="flex items-center gap-1 text-[10px] bg-white/20 text-white rounded-full px-2 py-0.5"><Wifi size={8} /> Live</span>
                    : <span className="flex items-center gap-1 text-[10px] bg-white/20 text-white/60 rounded-full px-2 py-0.5"><WifiOff size={8} /> Offline</span>
                  }
                </div>
              </div>
              <p className="text-xs text-white/70">{acc.bank} · {acc.accountType}</p>
              <p className="text-xs text-white/50 font-mono mt-0.5">•••• {acc.accountNo.slice(-4)}</p>
              <p className="text-lg font-bold mt-2 font-mono">
                {showBalances ? (acc.currency === "USD" ? `$${acc.balance.toLocaleString("en-US")}` : `${(acc.balance/1000000).toFixed(2)}M`) : "•••••"}
              </p>
              <p className="text-[10px] text-white/50 mt-0.5">{acc.currency}</p>
            </div>
            {acc.connected && (
              <div className="bg-white/10 px-3 py-1.5 flex items-center justify-between">
                <span className="text-[10px] text-white/60">Synced {acc.lastSync}</span>
                <button
                  onClick={e => { e.stopPropagation(); syncAccount(acc.id); }}
                  className="text-white/60 hover:text-white"
                >
                  <RefreshCw size={10} className={syncing === acc.id ? "animate-spin" : ""} />
                </button>
              </div>
            )}
            {!acc.connected && (
              <div className="bg-white px-3 py-1.5">
                <button className="text-xs text-blue-600 hover:text-blue-700 font-medium w-full text-center">Connect Account</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {(["transactions", "transfer", "payroll"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${tab === t ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700"}`}>
            {t === "transfer" ? "Transfer" : t === "payroll" ? "Payroll Disbursement" : "Transactions"}
          </button>
        ))}
      </div>

      {tab === "transactions" && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-100 flex-wrap">
            <div className="flex items-center gap-1">
              {(["all","salary","client","vendor","internal","tax"] as const).map(cat => (
                <button key={cat} onClick={() => setTxFilter(cat)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors capitalize ${txFilter === cat ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                  {cat}
                </button>
              ))}
            </div>
            {selectedAccount && (
              <button onClick={() => setSelectedAccount(null)} className="ml-auto text-xs text-blue-600 flex items-center gap-1">
                <X size={11} /> Clear filter
              </button>
            )}
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Date</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Description</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Reference</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Category</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Amount</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {visibleTx.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 text-xs text-slate-500 font-mono whitespace-nowrap">{tx.date}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${tx.type === "credit" ? "bg-emerald-50" : "bg-red-50"}`}>
                        {tx.type === "credit" ? <ArrowDownLeft size={12} className="text-emerald-600" /> : <ArrowUpRight size={12} className="text-red-500" />}
                      </div>
                      <span className="text-sm text-slate-700">{tx.description}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-xs font-mono text-slate-400">{tx.ref}</td>
                  <td className="px-3 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${catColors[tx.category]}`}>{tx.category}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className={`text-sm font-mono font-semibold ${tx.type === "credit" ? "text-emerald-600" : "text-slate-800"}`}>
                      {tx.type === "credit" ? "+" : "-"}LKR {tx.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className={`text-xs font-medium capitalize ${statusColors[tx.status]}`}>{tx.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "transfer" && (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4">New Bank Transfer</h3>
          <div className="grid grid-cols-4 gap-3 mb-5">
            {transferTypes.map(t => (
              <button key={t.id} onClick={() => setTransferType(t.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${transferType === t.id ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300"}`}>
                <p className={`text-sm font-bold ${transferType === t.id ? "text-blue-700" : "text-slate-800"}`}>{t.label}</p>
                <p className="text-[10px] text-slate-500 mt-1">{t.desc}</p>
                <p className={`text-[10px] mt-1.5 font-medium ${transferType === t.id ? "text-blue-600" : "text-slate-400"}`}>{t.limit}</p>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">From Account</label>
              <select className="mt-1.5 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                {accounts.filter(a => a.connected).map(a => (
                  <option key={a.id}>{a.bank} — •••• {a.accountNo.slice(-4)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">To Account / Bank</label>
              <input placeholder={transferType === "swift" ? "IBAN or SWIFT code" : "Account number"} type="text"
                className="mt-1.5 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Beneficiary Name</label>
              <input placeholder="Full legal name" type="text"
                className="mt-1.5 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Amount (LKR)</label>
              <input placeholder="0.00" type="number" min="0"
                className="mt-1.5 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Payment Reference / Narration</label>
              <input placeholder="e.g. INV-2025-0089 Payment" type="text"
                className="mt-1.5 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
            <AlertTriangle size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-800">All bank transfers require Manager/Director approval before processing. Transfers are executed through the bank's secure API and require 2FA confirmation.</p>
          </div>
          <div className="flex items-center gap-2 mt-4 justify-end">
            <button className="text-sm border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-lg text-slate-600">Discard</button>
            <button className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">Submit for Approval</button>
          </div>
        </div>
      )}

      {tab === "payroll" && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Payroll Disbursement</h3>
            <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full font-medium">April 2025 · Pending</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total Employees",   value: "61",              sub: "Eligible for payout" },
              { label: "Total Gross",       value: "LKR 10,240,000",  sub: "Before deductions" },
              { label: "Total Net Pay",     value: "LKR 8,060,000",   sub: "To be credited" },
            ].map(s => (
              <div key={s.label} className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500">{s.label}</p>
                <p className="text-base font-bold text-slate-900 mt-0.5" style={{ fontFamily: "var(--font-display)" }}>{s.value}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-600">Disbursement Steps</p>
              <CheckCircle2 size={14} className="text-slate-300" />
            </div>
            <div className="divide-y divide-slate-50">
              {[
                { step: "1", label: "Run Payroll Calculation",      status: "done",    note: "Completed March 30" },
                { step: "2", label: "Manager Approval",             status: "done",    note: "Approved by Dilshan F." },
                { step: "3", label: "Director Final Approval",      status: "pending", note: "Awaiting Priya J." },
                { step: "4", label: "Bank API Authorization (2FA)", status: "locked",  note: "Requires approval first" },
                { step: "5", label: "Bulk Salary Credit Transfer",  status: "locked",  note: "Sampath Payroll API" },
                { step: "6", label: "Payslip Distribution",        status: "locked",  note: "Email to employees" },
              ].map(s => (
                <div key={s.step} className="flex items-center gap-3 px-4 py-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${
                    s.status === "done" ? "bg-emerald-100 text-emerald-700" :
                    s.status === "pending" ? "bg-amber-100 text-amber-700" :
                    "bg-slate-100 text-slate-400"
                  }`}>{s.step}</div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${s.status === "locked" ? "text-slate-400" : "text-slate-800"}`}>{s.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{s.note}</p>
                  </div>
                  {s.status === "done" && <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />}
                  {s.status === "pending" && <Clock size={14} className="text-amber-500 flex-shrink-0" />}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <button className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors">
              Approve & Proceed to Bank Transfer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
