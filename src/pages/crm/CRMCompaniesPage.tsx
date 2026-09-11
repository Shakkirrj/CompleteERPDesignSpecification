import { useState } from "react";
import { Plus, Search, ArrowLeft, Globe, Phone, MapPin, Users, Briefcase, TrendingUp } from "lucide-react";

const companies = [
  { id: "CMP001", name: "Sampath Bank PLC", industry: "Banking & Finance", size: "1000+", employees: 4200, city: "Colombo", website: "sampathbank.lk", deals: 3, totalValue: 12400000, status: "active", tier: "Enterprise" },
  { id: "CMP002", name: "Hayleys Group", industry: "Diversified Holdings", size: "500-1000", employees: 890, city: "Colombo", website: "hayleys.com", deals: 2, totalValue: 5800000, status: "active", tier: "Corporate" },
  { id: "CMP003", name: "John Keells Holdings", industry: "Conglomerate", size: "1000+", employees: 5600, city: "Colombo", website: "jkh.lk", deals: 4, totalValue: 18200000, status: "active", tier: "Enterprise" },
  { id: "CMP004", name: "NDB Bank", industry: "Banking & Finance", size: "500-1000", employees: 720, city: "Colombo", website: "ndb.lk", deals: 1, totalValue: 2100000, status: "prospect", tier: "Corporate" },
  { id: "CMP005", name: "Brandix Lanka", industry: "Apparel & Manufacturing", size: "1000+", employees: 8000, city: "Colombo", website: "brandix.com", deals: 2, totalValue: 7300000, status: "active", tier: "Enterprise" },
  { id: "CMP006", name: "MAS Holdings", industry: "Apparel & Manufacturing", size: "1000+", employees: 9500, city: "Colombo", website: "masholdings.com", deals: 3, totalValue: 9800000, status: "active", tier: "Enterprise" },
  { id: "CMP007", name: "Dialog Axiata PLC", industry: "Telecommunications", size: "1000+", employees: 3200, city: "Colombo", website: "dialog.lk", deals: 5, totalValue: 22400000, status: "active", tier: "Enterprise" },
  { id: "CMP008", name: "Ceylon Bank Ltd", industry: "Banking & Finance", size: "500-1000", employees: 680, city: "Colombo", website: "ceylonbank.lk", deals: 2, totalValue: 4100000, status: "active", tier: "Corporate" },
  { id: "CMP009", name: "Laugfs Gas PLC", industry: "Energy & Utilities", size: "200-500", employees: 420, city: "Colombo", website: "laugfs.lk", deals: 1, totalValue: 2600000, status: "active", tier: "SME" },
  { id: "CMP010", name: "Lion Brewery Ceylon", industry: "FMCG & Beverages", size: "200-500", employees: 390, city: "Biyagama", website: "lionbrewery.lk", deals: 2, totalValue: 6800000, status: "active", tier: "Corporate" },
];

const TIERS = ["All", "Enterprise", "Corporate", "SME"];
const INDUSTRIES = ["All", "Banking & Finance", "Telecommunications", "Apparel & Manufacturing", "Conglomerate", "Diversified Holdings", "Energy & Utilities", "FMCG & Beverages"];

interface Props { onBack: () => void; }

export default function CRMCompaniesPage({ onBack }: Props) {
  const [search, setSearch] = useState("");
  const [tier, setTier] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const filtered = companies.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.industry.toLowerCase().includes(search.toLowerCase());
    const matchTier = tier === "All" || c.tier === tier;
    return matchSearch && matchTier;
  });

  const tierColor: Record<string, string> = {
    Enterprise: "bg-violet-50 text-violet-700",
    Corporate: "bg-blue-50 text-blue-700",
    SME: "bg-emerald-50 text-emerald-700",
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Companies</h2>
          <p className="text-sm text-slate-500 mt-0.5">{companies.length} companies · {companies.filter(c => c.tier === "Enterprise").length} Enterprise accounts</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors font-medium">
          <Plus size={14} /> Add Company
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Companies", value: companies.length, color: "text-blue-600" },
          { label: "Enterprise Accounts", value: companies.filter(c => c.tier === "Enterprise").length, color: "text-violet-600" },
          { label: "Total Pipeline", value: `LKR ${(companies.reduce((a, c) => a + c.totalValue, 0)/1000000).toFixed(1)}M`, color: "text-emerald-600" },
          { label: "Active Deals", value: companies.reduce((a, c) => a + c.deals, 0), color: "text-amber-600" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className={`text-xl font-bold ${s.color} mt-1`} style={{ fontFamily: "var(--font-display)" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search companies..."
            className="w-full pl-7 pr-3 py-2 text-sm border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={tier} onChange={e => setTier(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none">
          {TIERS.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(c => (
          <div key={c.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                <span className="text-base font-black text-slate-600">{c.name.slice(0, 2).toUpperCase()}</span>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${tierColor[c.tier] ?? "bg-slate-100 text-slate-600"}`}>{c.tier}</span>
            </div>
            <h3 className="font-semibold text-slate-800 text-sm" style={{ fontFamily: "var(--font-display)" }}>{c.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{c.industry}</p>

            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Users size={11} className="text-slate-400" />{c.employees.toLocaleString()} employees
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin size={11} className="text-slate-400" />{c.city}, Sri Lanka
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Globe size={11} className="text-slate-400" />{c.website}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
              <div>
                <p className="text-[10px] text-slate-400">Active Deals</p>
                <p className="text-sm font-bold text-slate-700 mt-0.5">{c.deals}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">Pipeline Value</p>
                <p className="text-sm font-bold text-blue-600 mt-0.5">LKR {(c.totalValue/1000000).toFixed(1)}M</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-display)" }}>Add New Company</h3>
            <div className="space-y-3">
              {["Company Name", "Industry", "Website", "Phone", "City", "Country"].map(f => (
                <div key={f}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{f}</label>
                  <input className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Account Tier</label>
                <select className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none">
                  {TIERS.slice(1).map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">Save Company</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
