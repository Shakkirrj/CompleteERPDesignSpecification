import { useState } from "react";
import { Plus, TrendingUp, Users, Target, DollarSign, Phone, Mail, Calendar, MoreHorizontal, ArrowRight, X } from "lucide-react";
import StatusBadge from "../../components/ui/StatusBadge";
import Avatar from "../../components/ui/Avatar";
import { leads } from "../../data/mockData";
import ActionFeedback, { type ActionFeedbackData } from "../../components/ui/ActionFeedback";

const salesTabs = ["Pipeline", "Leads", "Opportunities", "Activities", "Targets"];

type Deal = { name: string; value: number; owner: string; id?: string };
type PipelineCol = { stage: string; color: string; count: number; value: number; deals: Deal[] };

const initialPipeline: PipelineCol[] = [
  { stage: "Lead", color: "border-slate-300 bg-slate-50 text-slate-700", count: 4, value: 8200000, deals: [
    { id: "OPP-001", name: "Sampath Bank", value: 5800000, owner: "Chamara W." },
    { id: "OPP-002", name: "Hayleys Group", value: 2400000, owner: "Chamara W." },
  ]},
  { stage: "Qualified", color: "border-violet-200 bg-violet-50 text-violet-700", count: 3, value: 15600000, deals: [
    { id: "OPP-003", name: "John Keells", value: 9500000, owner: "Priya J." },
    { id: "OPP-004", name: "NDB Bank", value: 6100000, owner: "Chamara W." },
  ]},
  { stage: "Proposal", color: "border-blue-200 bg-blue-50 text-blue-700", count: 5, value: 22400000, deals: [
    { id: "OPP-005", name: "Dialog Axiata", value: 9800000, owner: "Priya J." },
    { id: "OPP-006", name: "MAS Holdings", value: 7200000, owner: "Chamara W." },
    { id: "OPP-007", name: "Softlogic", value: 5400000, owner: "Chamara W." },
  ]},
  { stage: "Negotiation", color: "border-amber-200 bg-amber-50 text-amber-700", count: 2, value: 12700000, deals: [
    { id: "OPP-008", name: "People's Bank", value: 8400000, owner: "Priya J." },
    { id: "OPP-009", name: "Aitken Spence", value: 4300000, owner: "Chamara W." },
  ]},
  { stage: "Won", color: "border-emerald-200 bg-emerald-50 text-emerald-700", count: 3, value: 14200000, deals: [
    { id: "OPP-010", name: "Ceylon Bank", value: 6200000, owner: "Priya J." },
    { id: "OPP-011", name: "Lanka Retail", value: 4900000, owner: "Chamara W." },
    { id: "OPP-012", name: "Cargills", value: 3100000, owner: "Chamara W." },
  ]},
];

const recentActivities = [
  { type: "call",    desc: "Called Nuwan Perera (Sampath Bank)",          time: "10 min ago", owner: "Chamara W." },
  { type: "email",   desc: "Sent proposal to John Keells Holdings",       time: "1h ago",     owner: "Priya J."   },
  { type: "meeting", desc: "Meeting with People's Bank — 2:00 PM",        time: "Today",      owner: "Priya J."   },
  { type: "note",    desc: "Updated NDB Bank opportunity notes",          time: "2h ago",     owner: "Chamara W." },
];

const pipelineStages = ["Lead", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];
const salesOwners = ["Chamara Wickramasinghe", "Priya Jayawardena", "Dilshan Fernando", "Ishara Madushani"];

function NewOpportunityModal({ onClose, onSave }: { onClose: () => void; onSave: (d: Deal & { stage: string }) => void }) {
  const [form, setForm] = useState({ clientName: "", value: "", stage: "Lead", owner: salesOwners[0], expectedClose: "", service: "", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.clientName.trim()) e.clientName = "Client name is required";
    if (!form.value || Number(form.value) <= 0) e.value = "Enter a valid value";
    if (!form.expectedClose) e.expectedClose = "Expected close date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    const id = `OPP-${String(Math.floor(Math.random() * 900) + 100)}`;
    const ownerShort = form.owner.split(" ").map((n, i) => i === 0 ? n : n[0] + ".").join(" ");
    onSave({ id, name: form.clientName.trim(), value: Number(form.value), owner: ownerShort, stage: form.stage });
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>New Opportunity</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"><X size={16} /></button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Client / Company *</label>
            <input value={form.clientName} onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))}
              placeholder="e.g. Sampath Bank PLC"
              className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.clientName ? "border-red-400" : "border-slate-200"}`} />
            {errors.clientName && <p className="text-xs text-red-500 mt-1">{errors.clientName}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Deal Value (LKR) *</label>
              <input type="number" min="0" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))}
                placeholder="0"
                className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.value ? "border-red-400" : "border-slate-200"}`} />
              {errors.value && <p className="text-xs text-red-500 mt-1">{errors.value}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Pipeline Stage</label>
              <select value={form.stage} onChange={e => setForm(f => ({ ...f, stage: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                {pipelineStages.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Sales Owner</label>
              <select value={form.owner} onChange={e => setForm(f => ({ ...f, owner: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                {salesOwners.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Expected Close *</label>
              <input type="date" value={form.expectedClose} onChange={e => setForm(f => ({ ...f, expectedClose: e.target.value }))}
                className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.expectedClose ? "border-red-400" : "border-slate-200"}`} />
              {errors.expectedClose && <p className="text-xs text-red-500 mt-1">{errors.expectedClose}</p>}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Service / Product</label>
            <input value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
              placeholder="e.g. ERP Implementation, IT Support Retainer"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={2} placeholder="Initial notes about this opportunity..."
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-5 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors">Create Opportunity</button>
        </div>
      </div>
    </div>
  );
}

export default function SalesPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [pipeline, setPipeline] = useState(initialPipeline);
  const [showNew, setShowNew] = useState(false);
  const [feedback, setFeedback] = useState<ActionFeedbackData | null>(null);

  function handleNewOpportunity(deal: Deal & { stage: string }) {
    setPipeline(prev => prev.map(col => {
      if (col.stage === deal.stage) {
        return { ...col, count: col.count + 1, value: col.value + deal.value, deals: [...col.deals, { id: deal.id, name: deal.name, value: deal.value, owner: deal.owner }] };
      }
      return col;
    }));
    setShowNew(false);
    setFeedback({ type: "success", title: "Opportunity Created", message: `${deal.name} has been added to the ${deal.stage} stage.`, ref: deal.id });
  }

  return (
    <>
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Sales</h2>
            <p className="text-sm text-slate-500 mt-0.5">Pipeline & commercial operations · September 2026</p>
          </div>
          <button onClick={() => setShowNew(true)} className="flex items-center gap-2 text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors font-medium">
            <Plus size={14} /> New Opportunity
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: TrendingUp, label: "Pipeline Value", value: "LKR 73.1M", sub: "Weighted", color: "text-blue-600", bg: "bg-blue-50" },
            { icon: Target, label: "Won This Month", value: "LKR 14.2M", sub: "3 deals closed", color: "text-emerald-600", bg: "bg-emerald-50" },
            { icon: DollarSign, label: "Target (Q3)", value: "LKR 45M", sub: "LKR 31.4M achieved", color: "text-amber-600", bg: "bg-amber-50" },
            { icon: Users, label: "Active Leads", value: "14", sub: "4 hot opportunities", color: "text-violet-600", bg: "bg-violet-50" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-500">{s.label}</p>
                  <p className={`text-xl font-bold ${s.color} mt-1`} style={{ fontFamily: "var(--font-display)" }}>{s.value}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{s.sub}</p>
                </div>
                <div className={`${s.bg} p-2 rounded-lg`}><s.icon size={16} className={s.color} /></div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Sales Workflow</p>
          <div className="flex items-center gap-1 overflow-x-auto">
            {["Lead","Qualification","Opportunity","Proposal / Quotation","Negotiation","Sales Order","Invoice","Payment","Commission"].map((step, i) => (
              <div key={step} className="flex items-center gap-1 flex-shrink-0">
                <span className={`text-[10px] font-semibold px-2.5 py-1.5 rounded-lg ${i < 4 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}>{step}</span>
                {i < 8 && <ArrowRight size={10} className="text-slate-300" />}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-1 border-b border-slate-200">
          {salesTabs.map((t, i) => (
            <button key={t} onClick={() => setActiveTab(i)} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === i ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>{t}</button>
          ))}
        </div>

        {activeTab === 0 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {pipeline.map(col => (
              <div key={col.stage} className="flex-shrink-0 w-64">
                <div className={`border rounded-xl p-3 mb-3 ${col.color}`}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-bold">{col.stage}</span>
                    <span className="text-xs font-bold">{col.deals.length}</span>
                  </div>
                  <p className="text-[10px] opacity-70">LKR {(col.value/1000000).toFixed(1)}M</p>
                </div>
                <div className="space-y-2">
                  {col.deals.map(deal => (
                    <div key={deal.id ?? deal.name} className="bg-white border border-slate-200 rounded-xl p-3 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer">
                      <div className="flex items-start justify-between">
                        <p className="text-xs font-semibold text-slate-800 leading-snug">{deal.name}</p>
                        <button className="p-0.5 hover:bg-slate-100 rounded"><MoreHorizontal size={12} className="text-slate-400" /></button>
                      </div>
                      <p className="text-sm font-bold text-slate-900 mt-1.5">LKR {(deal.value/1000000).toFixed(1)}M</p>
                      <div className="flex items-center gap-1 mt-2">
                        <Avatar name={deal.owner} size="xs" />
                        <span className="text-[10px] text-slate-500">{deal.owner}</span>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setShowNew(true)}
                    className="w-full py-2 text-xs text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl border border-dashed border-slate-200 hover:border-blue-300 transition-all flex items-center justify-center gap-1">
                    <Plus size={11} /> Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 1 && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Company</th>
                  <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Contact</th>
                  <th className="px-3 py-3 text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Value</th>
                  <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Stage</th>
                  <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Status</th>
                  <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Owner</th>
                  <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Last Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {leads.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50 cursor-pointer">
                    <td className="px-5 py-3"><p className="text-sm font-semibold text-slate-800">{l.name}</p></td>
                    <td className="px-3 py-3"><p className="text-xs text-slate-600">{l.contact}</p></td>
                    <td className="px-3 py-3 text-right"><p className="text-sm font-bold text-slate-800">LKR {(l.value/1000000).toFixed(1)}M</p></td>
                    <td className="px-3 py-3"><span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{l.stage}</span></td>
                    <td className="px-3 py-3"><StatusBadge status={l.status} /></td>
                    <td className="px-3 py-3"><div className="flex items-center gap-1.5"><Avatar name={l.owner} size="xs" /><span className="text-xs text-slate-600">{l.owner.split(" ")[0]}</span></div></td>
                    <td className="px-5 py-3"><span className="text-xs text-slate-500">{l.lastActivity}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 2 && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
              <p className="text-sm font-bold text-slate-700">All Opportunities</p>
              <button onClick={() => setShowNew(true)} className="flex items-center gap-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors">
                <Plus size={11} /> New
              </button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["ID","Client","Deal Value","Stage","Owner"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {pipeline.flatMap(col => col.deals.map(d => ({ ...d, stage: col.stage }))).map(d => (
                  <tr key={d.id ?? d.name} className="hover:bg-slate-50 cursor-pointer">
                    <td className="px-4 py-3 text-xs font-mono text-blue-700">{d.id ?? "—"}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-800">{d.name}</td>
                    <td className="px-4 py-3 text-sm font-bold text-emerald-700">LKR {(d.value/1000000).toFixed(2)}M</td>
                    <td className="px-4 py-3"><span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">{d.stage}</span></td>
                    <td className="px-4 py-3 text-xs text-slate-600">{d.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 3 && (
          <div className="space-y-2">
            {recentActivities.map((a, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${a.type === "call" ? "bg-green-50" : a.type === "email" ? "bg-blue-50" : "bg-violet-50"}`}>
                  {a.type === "call" ? <Phone size={13} className="text-green-600" /> : a.type === "email" ? <Mail size={13} className="text-blue-600" /> : <Calendar size={13} className="text-violet-600" />}
                </div>
                <div className="flex-1"><p className="text-sm text-slate-800">{a.desc}</p></div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-slate-400">{a.time}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{a.owner}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 4 && (
          <div className="bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center py-16">
            <TrendingUp size={28} className="text-slate-300 mb-3" />
            <p className="text-sm font-medium text-slate-500">Targets — Full module in production build</p>
          </div>
        )}
      </div>

      {showNew && <NewOpportunityModal onClose={() => setShowNew(false)} onSave={handleNewOpportunity} />}
      <ActionFeedback data={feedback} onDismiss={() => setFeedback(null)} />
    </>
  );
}
