import { useState } from "react";
import {
  Search, Plus, Building2, Phone, Mail, MapPin, Globe, ArrowLeft,
  Briefcase, Receipt, CreditCard, Users, TrendingUp, FileText,
  ChevronRight, Star, Clock, CheckCircle, AlertTriangle, DollarSign,
  Calendar, Tag, MoreHorizontal, Activity,
} from "lucide-react";
import StatusBadge from "../../components/ui/StatusBadge";
import Avatar from "../../components/ui/Avatar";

/* ─── types ─── */
interface Client {
  id: string; name: string; industry: string; tier: "Enterprise" | "Corporate" | "SME";
  status: "active" | "inactive" | "prospect";
  primaryContact: string; contactTitle: string; email: string; phone: string;
  city: string; address: string; website: string;
  vatNo: string; regNo: string;
  totalBilled: number; totalPaid: number; outstanding: number;
  projectCount: number; activeProjects: number;
  joinDate: string; accountManager: string;
  notes: string;
}

interface ClientProject { id: string; name: string; status: string; priority: string; progress: number; budget: number; spent: number; startDate: string; endDate: string; }
interface ClientInvoice  { id: string; amount: number; status: string; dueDate: string; issueDate: string; project: string; }
interface ClientPayment  { id: string; amount: number; method: string; date: string; ref: string; invoiceId: string; }
interface ClientContact  { name: string; title: string; email: string; phone: string; primary: boolean; }

/* ─── data ─── */
const clients: Client[] = [
  { id: "CLT001", name: "Lanka Retail PLC", industry: "Retail", tier: "Enterprise", status: "active",
    primaryContact: "Chaminda Wijesinghe", contactTitle: "CTO", email: "chaminda@lankaretail.lk", phone: "+94 11 230 4000", city: "Colombo", address: "No. 15, Union Place, Colombo 02",
    website: "lankaretail.lk", vatNo: "VAT/2019/LR/0042", regNo: "PV/0023781", totalBilled: 9800000, totalPaid: 8240000, outstanding: 1560000, projectCount: 3, activeProjects: 1, joinDate: "2023-01-15", accountManager: "Chamara Wickramasinghe", notes: "Long-term retainer client. Key account — priority SLA." },
  { id: "CLT002", name: "Ceylon Bank Ltd", industry: "Banking & Finance", tier: "Enterprise", status: "active",
    primaryContact: "Nishantha Perera", contactTitle: "Head of IT", email: "nishantha.p@ceylonbank.lk", phone: "+94 11 244 0100", city: "Colombo", address: "Ceylon Bank Tower, Echelon Square, Colombo 01",
    website: "ceylonbank.lk", vatNo: "VAT/2018/CB/0018", regNo: "PV/0007623", totalBilled: 6200000, totalPaid: 6200000, outstanding: 0, projectCount: 2, activeProjects: 1, joinDate: "2022-06-01", accountManager: "Priya Jayawardena", notes: "Fully paid account. BFSI compliance requirements apply." },
  { id: "CLT003", name: "People's Finance Ltd", industry: "Banking & Finance", tier: "Corporate", status: "active",
    primaryContact: "Dilrukshi Fernando", contactTitle: "IT Director", email: "dilrukshi.f@pfl.lk", phone: "+94 11 256 8800", city: "Colombo", address: "No. 75, Sir Chittampalam A. Gardiner Mw, Colombo 02",
    website: "pfl.lk", vatNo: "VAT/2020/PF/0065", regNo: "PV/0041209", totalBilled: 4800000, totalPaid: 4320000, outstanding: 480000, projectCount: 2, activeProjects: 1, joinDate: "2023-03-10", accountManager: "Chamara Wickramasinghe", notes: "Mobile banking app project ongoing. Milestone-based billing." },
  { id: "CLT004", name: "Cargills Food City", industry: "FMCG & Retail", tier: "Corporate", status: "active",
    primaryContact: "Ruwan Seneviratne", contactTitle: "Head of Technology", email: "ruwan.s@cargills.lk", phone: "+94 11 248 8888", city: "Colombo", address: "40 York Street, Colombo 01",
    website: "cargills.com", vatNo: "VAT/2017/CF/0011", regNo: "PV/0005321", totalBilled: 2160000, totalPaid: 1800000, outstanding: 360000, projectCount: 1, activeProjects: 1, joinDate: "2024-02-01", accountManager: "Chamara Wickramasinghe", notes: "POS integration. On-hold due to internal approvals." },
  { id: "CLT005", name: "Dialog Axiata PLC", industry: "Telecommunications", tier: "Enterprise", status: "active",
    primaryContact: "Kavinda Pathirana", contactTitle: "Enterprise Sales Manager", email: "kavinda.p@dialog.lk", phone: "+94 77 678 4321", city: "Colombo", address: "475 Union Place, Colombo 02",
    website: "dialog.lk", vatNo: "VAT/2015/DA/0003", regNo: "PQ/0001234", totalBilled: 1270000, totalPaid: 1270000, outstanding: 0, projectCount: 1, activeProjects: 1, joinDate: "2024-01-10", accountManager: "Priya Jayawardena", notes: "Cybersecurity audit project. High-security NDA in place." },
  { id: "CLT006", name: "Sampath Bank PLC", industry: "Banking & Finance", tier: "Enterprise", status: "prospect",
    primaryContact: "Nuwan Perera", contactTitle: "Head of IT", email: "nuwan.perera@sampathbank.lk", phone: "+94 11 230 8888", city: "Colombo", address: "110 Sir James Peiris Mawatha, Colombo 02",
    website: "sampathbank.lk", vatNo: "VAT/2010/SB/0001", regNo: "PQ/0000321", totalBilled: 0, totalPaid: 0, outstanding: 0, projectCount: 0, activeProjects: 0, joinDate: "2025-03-01", accountManager: "Priya Jayawardena", notes: "Prospect — demo scheduled for March 18. ERP opportunity." },
  { id: "CLT007", name: "Hayleys Group", industry: "Diversified Holdings", tier: "Corporate", status: "active",
    primaryContact: "Dilini Jayasinghe", contactTitle: "CTO", email: "dilini.j@hayleys.com", phone: "+94 11 267 3000", city: "Colombo", address: "400 Deans Road, Colombo 10",
    website: "hayleys.com", vatNo: "VAT/2019/HG/0033", regNo: "PV/0031562", totalBilled: 3200000, totalPaid: 3200000, outstanding: 0, projectCount: 1, activeProjects: 0, joinDate: "2023-08-15", accountManager: "Chamara Wickramasinghe", notes: "IT Consulting retainer. Contract renewal due June 2025." },
];

const clientProjects: Record<string, ClientProject[]> = {
  CLT001: [
    { id: "PRJ001", name: "E-Commerce Platform Redesign", status: "in-progress", priority: "high", progress: 48, budget: 4500000, spent: 2180000, startDate: "2025-01-15", endDate: "2025-06-30" },
    { id: "PRJ008", name: "Inventory Management System", status: "completed", priority: "medium", progress: 100, budget: 2800000, spent: 2760000, startDate: "2023-06-01", endDate: "2024-01-31" },
    { id: "PRJ009", name: "Loyalty App Phase 1", status: "completed", priority: "medium", progress: 100, budget: 2500000, spent: 2500000, startDate: "2023-01-15", endDate: "2023-08-31" },
  ],
  CLT002: [
    { id: "PRJ002", name: "HR Management System", status: "in-progress", priority: "critical", progress: 92, budget: 3200000, spent: 2950000, startDate: "2024-11-01", endDate: "2025-04-30" },
    { id: "PRJ010", name: "Core Banking API Integration", status: "completed", priority: "high", progress: 100, budget: 3000000, spent: 3000000, startDate: "2022-06-01", endDate: "2023-03-31" },
  ],
  CLT003: [
    { id: "PRJ003", name: "Mobile Banking App", status: "planning", priority: "high", progress: 8, budget: 6800000, spent: 320000, startDate: "2025-03-01", endDate: "2025-12-31" },
    { id: "PRJ011", name: "Online Loan Portal", status: "completed", priority: "medium", progress: 100, budget: 1800000, spent: 1750000, startDate: "2023-03-10", endDate: "2023-12-31" },
  ],
  CLT004: [{ id: "PRJ005", name: "POS System Integration", status: "on-hold", priority: "medium", progress: 25, budget: 1800000, spent: 450000, startDate: "2025-02-15", endDate: "2025-08-15" }],
  CLT005: [{ id: "PRJ006", name: "Cybersecurity Audit", status: "in-progress", priority: "critical", progress: 63, budget: 980000, spent: 620000, startDate: "2025-02-01", endDate: "2025-03-31" }],
  CLT007: [{ id: "PRJ012", name: "IT Consulting Retainer 2024", status: "completed", priority: "low", progress: 100, budget: 3200000, spent: 3200000, startDate: "2023-08-15", endDate: "2024-08-14" }],
};

const clientInvoices: Record<string, ClientInvoice[]> = {
  CLT001: [
    { id: "INV-2025-0089", amount: 680000, status: "overdue", dueDate: "2025-02-28", issueDate: "2025-02-01", project: "E-Commerce Platform" },
    { id: "INV-2024-0071", amount: 1200000, status: "paid", dueDate: "2024-12-15", issueDate: "2024-11-15", project: "E-Commerce Platform" },
    { id: "INV-2024-0058", amount: 880000, status: "paid", dueDate: "2024-10-01", issueDate: "2024-09-01", project: "Inventory Management" },
  ],
  CLT002: [
    { id: "INV-2025-0088", amount: 1200000, status: "paid", dueDate: "2025-03-15", issueDate: "2025-02-15", project: "HR Management System" },
    { id: "INV-2025-0080", amount: 950000, status: "paid", dueDate: "2025-01-31", issueDate: "2025-01-01", project: "HR Management System" },
  ],
  CLT003: [
    { id: "INV-2025-0087", amount: 480000, status: "pending", dueDate: "2025-03-25", issueDate: "2025-03-01", project: "Mobile Banking App" },
    { id: "INV-2025-0075", amount: 800000, status: "paid", dueDate: "2025-02-15", issueDate: "2025-01-15", project: "Online Loan Portal" },
  ],
  CLT004: [{ id: "INV-2025-0086", amount: 360000, status: "partial", dueDate: "2025-03-20", issueDate: "2025-02-28", project: "POS Integration" }],
  CLT005: [{ id: "INV-2025-0085", amount: 290000, status: "paid", dueDate: "2025-03-10", issueDate: "2025-02-20", project: "Cybersecurity Audit" }],
  CLT007: [
    { id: "INV-2024-0062", amount: 1600000, status: "paid", dueDate: "2024-09-01", issueDate: "2024-08-01", project: "IT Consulting" },
    { id: "INV-2024-0045", amount: 1600000, status: "paid", dueDate: "2024-03-01", issueDate: "2024-02-01", project: "IT Consulting" },
  ],
};

const clientContacts: Record<string, ClientContact[]> = {
  CLT001: [
    { name: "Chaminda Wijesinghe", title: "CTO", email: "chaminda@lankaretail.lk", phone: "+94 11 230 4001", primary: true },
    { name: "Pradeep Samaranayake", title: "IT Manager", email: "pradeep.s@lankaretail.lk", phone: "+94 11 230 4002", primary: false },
    { name: "Nimesha Dias", title: "Finance Director", email: "nimesha.d@lankaretail.lk", phone: "+94 11 230 4010", primary: false },
  ],
  CLT002: [
    { name: "Nishantha Perera", title: "Head of IT", email: "nishantha.p@ceylonbank.lk", phone: "+94 11 244 0101", primary: true },
    { name: "Suresh Kumara", title: "IT Security Manager", email: "suresh.k@ceylonbank.lk", phone: "+94 11 244 0102", primary: false },
  ],
  CLT003: [
    { name: "Dilrukshi Fernando", title: "IT Director", email: "dilrukshi.f@pfl.lk", phone: "+94 11 256 8801", primary: true },
    { name: "Asitha Bandara", title: "Project Coordinator", email: "asitha.b@pfl.lk", phone: "+94 11 256 8802", primary: false },
  ],
  CLT004: [{ name: "Ruwan Seneviratne", title: "Head of Technology", email: "ruwan.s@cargills.lk", phone: "+94 11 248 8881", primary: true }],
  CLT005: [{ name: "Kavinda Pathirana", title: "Enterprise Sales Manager", email: "kavinda.p@dialog.lk", phone: "+94 77 678 4321", primary: true }],
  CLT006: [{ name: "Nuwan Perera", title: "Head of IT", email: "nuwan.perera@sampathbank.lk", phone: "+94 11 230 8881", primary: true }],
  CLT007: [{ name: "Dilini Jayasinghe", title: "CTO", email: "dilini.j@hayleys.com", phone: "+94 11 267 3001", primary: true }],
};

const tierColors: Record<string, string> = {
  Enterprise: "bg-violet-100 text-violet-700",
  Corporate:  "bg-blue-100 text-blue-700",
  SME:        "bg-emerald-100 text-emerald-700",
};
const statusDot: Record<string, string> = { active: "bg-emerald-500", inactive: "bg-slate-400", prospect: "bg-amber-500" };

const fmt = (n: number) => n.toLocaleString("en-LK");
const fmtM = (n: number) => n >= 1000000 ? `LKR ${(n/1000000).toFixed(1)}M` : `LKR ${(n/1000).toFixed(0)}K`;

const detailTabs = ["Overview", "Projects", "Invoices", "Contacts", "Notes"];

/* ══════════════════ CLIENT DETAIL ══════════════════ */
function ClientDetail({ client, onBack }: { client: Client; onBack: () => void }) {
  const [tab, setTab] = useState(0);
  const projects = clientProjects[client.id] ?? [];
  const invoices  = clientInvoices[client.id] ?? [];
  const contacts  = clientContacts[client.id] ?? [];

  const collectionRate = client.totalBilled > 0 ? Math.round((client.totalPaid / client.totalBilled) * 100) : 0;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center gap-4 px-6 py-4 bg-white border-b border-slate-200 flex-shrink-0">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
          <ArrowLeft size={16} />
        </button>
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-white text-base font-black">{client.name.slice(0, 2).toUpperCase()}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>{client.name}</h2>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tierColors[client.tier]}`}>{client.tier}</span>
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <span className={`w-2 h-2 rounded-full ${statusDot[client.status]}`} /> {client.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{client.industry} · {client.city} · {client.id}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button className="flex items-center gap-1.5 text-xs border border-slate-200 bg-white px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors">
            <Mail size={12} /> Email
          </button>
          <button className="flex items-center gap-1.5 text-xs bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <Plus size={12} /> New Project
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-6 py-2 bg-white border-b border-slate-100 flex-shrink-0">
        {detailTabs.map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === i ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Overview */}
        {tab === 0 && (
          <>
            {/* KPI row */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Total Billed",      value: fmtM(client.totalBilled),       icon: Receipt,       color: "text-blue-700",    bg: "bg-blue-50"    },
                { label: "Total Paid",         value: fmtM(client.totalPaid),         icon: CheckCircle,   color: "text-emerald-700", bg: "bg-emerald-50" },
                { label: "Outstanding",        value: fmtM(client.outstanding),       icon: AlertTriangle, color: client.outstanding > 0 ? "text-red-700" : "text-slate-400", bg: client.outstanding > 0 ? "bg-red-50" : "bg-slate-50" },
                { label: "Collection Rate",    value: `${collectionRate}%`,           icon: TrendingUp,    color: collectionRate >= 90 ? "text-emerald-700" : "text-amber-700", bg: "bg-amber-50" },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-slate-500">{s.label}</p>
                      <p className={`text-lg font-bold mt-1 ${s.color}`} style={{ fontFamily: "var(--font-display)" }}>{s.value}</p>
                    </div>
                    <div className={`${s.bg} p-2 rounded-lg`}><s.icon size={14} className={s.color} /></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-12 gap-4">
              {/* Company info */}
              <div className="col-span-7 bg-white rounded-xl border border-slate-200 p-5 space-y-3">
                <h3 className="text-sm font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Company Information</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    { label: "Primary Contact", value: `${client.primaryContact} (${client.contactTitle})`, icon: Users },
                    { label: "Email",           value: client.email,   icon: Mail },
                    { label: "Phone",           value: client.phone,   icon: Phone },
                    { label: "Address",         value: client.address, icon: MapPin },
                    { label: "Website",         value: client.website, icon: Globe },
                    { label: "VAT Number",      value: client.vatNo,   icon: FileText },
                    { label: "Registration",    value: client.regNo,   icon: Building2 },
                    { label: "Account Manager", value: client.accountManager, icon: Star },
                    { label: "Client Since",    value: client.joinDate, icon: Calendar },
                    { label: "Industry",        value: client.industry, icon: Tag },
                  ].map(f => (
                    <div key={f.label} className="flex items-start gap-2">
                      <f.icon size={13} className="text-slate-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{f.label}</p>
                        <p className="text-xs text-slate-700 mt-0.5">{f.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick stats */}
              <div className="col-span-5 space-y-3">
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <h3 className="text-sm font-bold text-slate-900 mb-3" style={{ fontFamily: "var(--font-display)" }}>Activity Summary</h3>
                  <div className="space-y-2.5">
                    {[
                      { label: "Total Projects",    value: client.projectCount,    color: "text-blue-600" },
                      { label: "Active Projects",   value: client.activeProjects,  color: "text-emerald-600" },
                      { label: "Open Invoices",     value: invoices.filter(i => i.status !== "paid").length, color: "text-amber-600" },
                      { label: "Total Contacts",    value: contacts.length,        color: "text-violet-600" },
                    ].map(s => (
                      <div key={s.label} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0">
                        <span className="text-xs text-slate-600">{s.label}</span>
                        <span className={`text-sm font-bold ${s.color}`}>{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <h3 className="text-xs font-bold text-slate-700 mb-2" style={{ fontFamily: "var(--font-display)" }}>Collection Progress</h3>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${collectionRate >= 90 ? "bg-emerald-500" : collectionRate >= 70 ? "bg-amber-500" : "bg-red-500"}`}
                      style={{ width: `${collectionRate}%` }} />
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] text-slate-400">Paid</span>
                    <span className="text-[10px] font-bold text-slate-600">{collectionRate}% collected</span>
                    <span className="text-[10px] text-slate-400">Target 100%</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Projects */}
        {tab === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{projects.length} projects · {projects.filter(p => p.status === "in-progress").length} active</p>
              <button className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"><Plus size={13} /> New Project</button>
            </div>
            {projects.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 py-16 text-center text-slate-400">
                <Briefcase size={28} className="mx-auto mb-2 text-slate-200" />
                <p className="text-sm">No projects yet</p>
              </div>
            ) : projects.map(p => (
              <div key={p.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-800" style={{ fontFamily: "var(--font-display)" }}>{p.name}</h3>
                      <StatusBadge status={p.status} />
                      <StatusBadge status={p.priority} size="sm" />
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{p.id}</p>
                  </div>
                  <button className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"><MoreHorizontal size={14} /></button>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-[10px] text-slate-400">Budget</p>
                    <p className="text-xs font-semibold text-slate-700 mt-0.5">LKR {fmt(p.budget)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Spent</p>
                    <p className="text-xs font-semibold text-slate-700 mt-0.5">LKR {fmt(p.spent)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Timeline</p>
                    <p className="text-xs font-semibold text-slate-700 mt-0.5">{p.startDate} → {p.endDate}</p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-slate-400">Progress</span>
                    <span className="text-[10px] font-bold text-slate-600">{p.progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${p.progress === 100 ? "bg-emerald-500" : p.progress > 70 ? "bg-blue-500" : "bg-violet-500"}`} style={{ width: `${p.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Invoices */}
        {tab === 2 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{invoices.length} invoices · LKR {fmt(invoices.reduce((a, i) => a + i.amount, 0))} total</p>
              <button className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"><Plus size={13} /> New Invoice</button>
            </div>
            {invoices.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 py-16 text-center text-slate-400">
                <Receipt size={28} className="mx-auto mb-2 text-slate-200" />
                <p className="text-sm">No invoices yet</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      {["Invoice #", "Project", "Amount", "Status", "Issued", "Due"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {invoices.map(inv => (
                      <tr key={inv.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                        <td className="px-4 py-3 text-xs font-mono font-semibold text-blue-700">{inv.id}</td>
                        <td className="px-4 py-3 text-xs text-slate-600">{inv.project}</td>
                        <td className="px-4 py-3 text-sm font-bold text-slate-800">LKR {fmt(inv.amount)}</td>
                        <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                        <td className="px-4 py-3 text-xs text-slate-500">{inv.issueDate}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">{inv.dueDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Contacts */}
        {tab === 3 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{contacts.length} contacts</p>
              <button className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"><Plus size={13} /> Add Contact</button>
            </div>
            {contacts.map(c => (
              <div key={c.name} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
                <Avatar name={c.name} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-800">{c.name}</p>
                    {c.primary && <span className="text-[9px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">PRIMARY</span>}
                  </div>
                  <p className="text-xs text-slate-500">{c.title}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1"><Mail size={11} />{c.email}</div>
                  <div className="flex items-center gap-1"><Phone size={11} />{c.phone}</div>
                </div>
                <div className="flex gap-1">
                  <button className="p-2 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"><Phone size={13} /></button>
                  <button className="p-2 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"><Mail size={13} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Notes */}
        {tab === 4 && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Account Notes</h3>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-slate-700 leading-relaxed">{client.notes}</p>
              <p className="text-[10px] text-slate-400 mt-2">Last updated by {client.accountManager} · Auto-saved</p>
            </div>
            <textarea defaultValue={client.notes} rows={5}
              className="w-full text-sm text-slate-700 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            <button className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">Save Notes</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════ CLIENTS LIST ══════════════════ */
const TIERS = ["All", "Enterprise", "Corporate", "SME"];
const STATUSES = ["All", "active", "inactive", "prospect"];

export default function ClientsPage() {
  const [search, setSearch]   = useState("");
  const [tier, setTier]       = useState("All");
  const [status, setStatus]   = useState("All");
  const [selected, setSelected] = useState<Client | null>(null);
  const [showForm, setShowForm] = useState(false);

  if (selected) return <ClientDetail client={selected} onBack={() => setSelected(null)} />;

  const filtered = clients.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.industry.toLowerCase().includes(search.toLowerCase()) || c.primaryContact.toLowerCase().includes(search.toLowerCase());
    const matchTier   = tier === "All" || c.tier === tier;
    const matchStatus = status === "All" || c.status === status;
    return matchSearch && matchTier && matchStatus;
  });

  const totalBilled     = clients.reduce((a, c) => a + c.totalBilled, 0);
  const totalOutstanding = clients.reduce((a, c) => a + c.outstanding, 0);
  const activeClients   = clients.filter(c => c.status === "active").length;

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Clients</h2>
          <p className="text-sm text-slate-500 mt-0.5">{clients.length} clients · {activeClients} active</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 text-sm bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors font-medium">
          <Plus size={14} /> Add Client
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Active Clients",     value: activeClients,              color: "text-blue-700",    bg: "bg-blue-50",    icon: Building2  },
          { label: "Total Billed",       value: fmtM(totalBilled),          color: "text-emerald-700", bg: "bg-emerald-50", icon: Receipt    },
          { label: "Outstanding",        value: fmtM(totalOutstanding),     color: "text-red-700",     bg: "bg-red-50",     icon: AlertTriangle },
          { label: "Prospects",          value: clients.filter(c => c.status === "prospect").length, color: "text-amber-700", bg: "bg-amber-50", icon: Star },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-500">{s.label}</p>
                <p className={`text-xl font-bold mt-1 ${s.color}`} style={{ fontFamily: "var(--font-display)" }}>{s.value}</p>
              </div>
              <div className={`${s.bg} p-2 rounded-lg`}><s.icon size={15} className={s.color} /></div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-56">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients, contacts, industry..."
            className="w-full pl-7 pr-3 py-2 text-sm border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={tier} onChange={e => setTier(e.target.value)} className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none">
          {TIERS.map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)} className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none">
          {STATUSES.map(s => <option key={s}>{s === "All" ? "All Status" : s}</option>)}
        </select>
        <span className="text-xs text-slate-400 ml-auto">{filtered.length} of {clients.length}</span>
      </div>

      {/* Client cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(c => (
          <div key={c.id} onClick={() => setSelected(c)}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-black">{c.name.slice(0, 2).toUpperCase()}</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors" style={{ fontFamily: "var(--font-display)" }}>{c.name}</h3>
                  <p className="text-xs text-slate-500">{c.industry}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tierColors[c.tier]}`}>{c.tier}</span>
                <span className="flex items-center gap-1 text-[10px] text-slate-400">
                  <span className={`w-1.5 h-1.5 rounded-full ${statusDot[c.status]}`} />{c.status}
                </span>
              </div>
            </div>

            {/* Info row */}
            <div className="space-y-1.5 mb-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Users size={11} className="text-slate-400 flex-shrink-0" />{c.primaryContact} · {c.contactTitle}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin size={11} className="text-slate-400 flex-shrink-0" />{c.address}
              </div>
            </div>

            {/* Financials */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100">
              <div>
                <p className="text-[10px] text-slate-400">Billed</p>
                <p className="text-xs font-bold text-slate-700 mt-0.5">{fmtM(c.totalBilled)}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">Projects</p>
                <p className="text-xs font-bold text-slate-700 mt-0.5">{c.projectCount} total</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">Outstanding</p>
                <p className={`text-xs font-bold mt-0.5 ${c.outstanding > 0 ? "text-red-600" : "text-emerald-600"}`}>
                  {c.outstanding > 0 ? fmtM(c.outstanding) : "Nil"}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-50">
              <div className="flex items-center gap-1.5">
                <Avatar name={c.accountManager} size="xs" />
                <span className="text-[10px] text-slate-400">{c.accountManager.split(" ")[0]}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={e => { e.stopPropagation(); }} className="p-1.5 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"><Phone size={12} /></button>
                <button onClick={e => { e.stopPropagation(); }} className="p-1.5 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"><Mail size={12} /></button>
                <span className="text-[10px] text-blue-500 group-hover:underline flex items-center gap-0.5">View <ChevronRight size={10} /></span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 py-20 text-center">
          <Building2 size={32} className="mx-auto mb-3 text-slate-200" />
          <p className="text-sm text-slate-400">No clients found</p>
        </div>
      )}

      {/* Add Client modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-display)" }}>Add New Client</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Company Name", col: 2 }, { label: "Industry", col: 1 },
                { label: "Account Tier", col: 1, type: "select", opts: ["Enterprise", "Corporate", "SME"] },
                { label: "Primary Contact", col: 1 }, { label: "Contact Title", col: 1 },
                { label: "Email", col: 1 }, { label: "Phone", col: 1 },
                { label: "Address", col: 2 }, { label: "Website", col: 1 }, { label: "VAT Number", col: 1 },
              ].map(f => (
                <div key={f.label} className={f.col === 2 ? "col-span-2" : ""}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{f.label}</label>
                  {(f as {type?: string}).type === "select"
                    ? <select className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {(f as {opts?: string[]}).opts?.map(o => <option key={o}>{o}</option>)}
                      </select>
                    : <input className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  }
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">Save Client</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
