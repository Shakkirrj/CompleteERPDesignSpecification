import { useState } from "react";
import { Plus, Search, Phone, Mail, Filter, ArrowLeft, ArrowUpRight, Calendar, Tag, User } from "lucide-react";
import StatusBadge from "../../components/ui/StatusBadge";
import Avatar from "../../components/ui/Avatar";
import { leads } from "../../data/mockData";

const STAGES = ["All", "Discovery", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];
const SOURCES = ["All", "Referral", "Website", "Direct", "Conference", "Cold Call"];

const mockLeads = [
  ...leads,
  { id: "LD005", name: "Brandix Lanka", contact: "Madushika Seneviratne", value: 4100000, status: "new", source: "Website", stage: "Discovery", owner: "Chamara Wickramasinghe", lastActivity: "2025-03-11" },
  { id: "LD006", name: "MAS Holdings", contact: "Ruwan Bandara", value: 7800000, status: "qualified", source: "Conference", stage: "Qualified", owner: "Priya Jayawardena", lastActivity: "2025-03-10" },
  { id: "LD007", name: "Laugfs Gas", contact: "Thilini Perera", value: 2600000, status: "proposal", source: "Referral", stage: "Proposal", owner: "Chamara Wickramasinghe", lastActivity: "2025-03-09" },
  { id: "LD008", name: "Lion Brewery", contact: "Asanka Fernando", value: 5200000, status: "negotiation", source: "Direct", stage: "Negotiation", owner: "Priya Jayawardena", lastActivity: "2025-03-08" },
];

interface Props { onBack: () => void; }

export default function CRMLeadsPage({ onBack }: Props) {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const filtered = mockLeads.filter(l => {
    const matchSearch = !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.contact.toLowerCase().includes(search.toLowerCase());
    const matchStage = stageFilter === "All" || l.stage === stageFilter;
    const matchSource = sourceFilter === "All" || l.source === sourceFilter;
    return matchSearch && matchStage && matchSource;
  });

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Leads</h2>
          <p className="text-sm text-slate-500 mt-0.5">{filtered.length} leads · Track & convert prospects</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors font-medium"
        >
          <Plus size={14} /> New Lead
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Leads", value: mockLeads.length, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "In Proposal", value: mockLeads.filter(l => l.stage === "Proposal").length, color: "text-violet-600", bg: "bg-violet-50" },
          { label: "In Negotiation", value: mockLeads.filter(l => l.stage === "Negotiation").length, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Total Value", value: `LKR ${(mockLeads.reduce((a, l) => a + l.value, 0) / 1000000).toFixed(1)}M`, color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className={`text-xl font-bold ${s.color} mt-1`} style={{ fontFamily: "var(--font-display)" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search leads or contacts..."
            className="pl-7 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
        </div>
        <select value={stageFilter} onChange={e => setStageFilter(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          {STAGES.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          {SOURCES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Company</th>
              <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Contact Person</th>
              <th className="px-3 py-3 text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Value</th>
              <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Stage</th>
              <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Status</th>
              <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Source</th>
              <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Owner</th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Last Activity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(l => (
              <tr key={l.id} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-[10px] font-bold text-blue-700">{l.name.slice(0, 2).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{l.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{l.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1.5">
                    <User size={11} className="text-slate-400" />
                    <span className="text-xs text-slate-600">{l.contact}</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-right">
                  <span className="text-sm font-semibold text-slate-800">LKR {(l.value/1000000).toFixed(1)}M</span>
                </td>
                <td className="px-3 py-3">
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{l.stage}</span>
                </td>
                <td className="px-3 py-3"><StatusBadge status={l.status} /></td>
                <td className="px-3 py-3">
                  <span className="text-xs flex items-center gap-1 text-slate-500">
                    <Tag size={10} />{l.source}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1.5">
                    <Avatar name={l.owner} size="xs" />
                    <span className="text-xs text-slate-600">{l.owner.split(" ")[0]}</span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2 justify-between">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar size={10} />{l.lastActivity}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 hover:bg-blue-50 rounded text-blue-500"><Phone size={11} /></button>
                      <button className="p-1 hover:bg-blue-50 rounded text-blue-500"><Mail size={11} /></button>
                      <button className="p-1 hover:bg-blue-50 rounded text-blue-500"><ArrowUpRight size={11} /></button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <p className="text-sm">No leads found</p>
          </div>
        )}
      </div>

      {/* New Lead modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-display)" }}>Add New Lead</h3>
            <div className="space-y-3">
              {[
                { label: "Company Name", placeholder: "e.g. Sampath Bank" },
                { label: "Contact Person", placeholder: "Full name" },
                { label: "Email", placeholder: "contact@company.com" },
                { label: "Phone", placeholder: "+94 XX XXX XXXX" },
                { label: "Estimated Value (LKR)", placeholder: "0" },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{f.label}</label>
                  <input placeholder={f.placeholder} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Stage</label>
                  <select className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none bg-white">
                    {STAGES.slice(1).map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Source</label>
                  <select className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none bg-white">
                    {SOURCES.slice(1).map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">Save Lead</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
