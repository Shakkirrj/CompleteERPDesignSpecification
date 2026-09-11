import { useState } from "react";
import {
  TrendingUp, DollarSign, Users, Award, Target, ChevronUp, ChevronDown,
  Search, Filter, Download, Plus, Star, CheckCircle, Clock, AlertTriangle,
  BarChart2, Percent, ArrowUpRight, ArrowDownRight, Calendar, Edit2,
} from "lucide-react";
import Avatar from "../../components/ui/Avatar";
import StatusBadge from "../../components/ui/StatusBadge";

/* ─── types ─── */
interface Rep {
  id: string; name: string; role: string; team: string; tier: "Gold" | "Silver" | "Bronze" | "Platinum";
  target: number; achieved: number;
  base: number; commissionRate: number; bonus: number;
  status: "paid" | "pending" | "processing" | "overdue";
  deals: number; closedDeals: number; period: string;
}

/* ─── data ─── */
const reps: Rep[] = [
  { id: "SR001", name: "Chamara Wickramasinghe", role: "Senior Sales Manager", team: "Enterprise", tier: "Platinum", target: 5000000, achieved: 5620000, base: 180000, commissionRate: 8, bonus: 120000, status: "paid",       deals: 14, closedDeals: 11, period: "2025-Q1" },
  { id: "SR002", name: "Priya Jayawardena",      role: "Sales Manager",        team: "Enterprise", tier: "Gold",     target: 4000000, achieved: 4210000, base: 150000, commissionRate: 7, bonus: 80000,  status: "pending",    deals: 12, closedDeals: 9,  period: "2025-Q1" },
  { id: "SR003", name: "Ashan Perera",           role: "Sales Executive",      team: "SME",        tier: "Silver",   target: 2500000, achieved: 2320000, base: 120000, commissionRate: 6, bonus: 40000,  status: "processing", deals: 10, closedDeals: 7,  period: "2025-Q1" },
  { id: "SR004", name: "Nimasha Silva",          role: "Sales Executive",      team: "SME",        tier: "Bronze",   target: 2000000, achieved: 1680000, base: 110000, commissionRate: 5, bonus: 20000,  status: "processing", deals: 9,  closedDeals: 6,  period: "2025-Q1" },
  { id: "SR005", name: "Ruwan Gunawardena",      role: "Sales Consultant",     team: "Retail",     tier: "Gold",     target: 3000000, achieved: 3180000, base: 130000, commissionRate: 6, bonus: 60000,  status: "paid",       deals: 11, closedDeals: 9,  period: "2025-Q1" },
  { id: "SR006", name: "Dilani Fernando",        role: "Sales Consultant",     team: "Retail",     tier: "Silver",   target: 2200000, achieved: 1950000, base: 115000, commissionRate: 5, bonus: 25000,  status: "pending",    deals: 8,  closedDeals: 5,  period: "2025-Q1" },
  { id: "SR007", name: "Kasun Bandara",          role: "Junior Sales Exec",    team: "SME",        tier: "Bronze",   target: 1500000, achieved: 1710000, base: 95000,  commissionRate: 5, bonus: 30000,  status: "paid",       deals: 7,  closedDeals: 6,  period: "2025-Q1" },
  { id: "SR008", name: "Hiruni Wickrama",        role: "Business Dev Exec",    team: "Enterprise", tier: "Silver",   target: 2800000, achieved: 2650000, base: 125000, commissionRate: 6, bonus: 35000,  status: "overdue",    deals: 10, closedDeals: 8,  period: "2025-Q1" },
];

const tierColors: Record<string, string> = {
  Platinum: "bg-violet-100 text-violet-700 border-violet-200",
  Gold:     "bg-amber-100 text-amber-700 border-amber-200",
  Silver:   "bg-slate-100 text-slate-600 border-slate-200",
  Bronze:   "bg-orange-100 text-orange-700 border-orange-200",
};
const tierBadge: Record<string, string> = {
  Platinum: "bg-violet-50 text-violet-700",
  Gold:     "bg-amber-50 text-amber-700",
  Silver:   "bg-slate-100 text-slate-600",
  Bronze:   "bg-orange-50 text-orange-700",
};

const fmt = (n: number) =>
  n >= 1000000 ? `LKR ${(n / 1000000).toFixed(2)}M` : `LKR ${(n / 1000).toFixed(0)}K`;

const fmtN = (n: number) => n.toLocaleString("en-LK");

const PERIODS = ["2025-Q1", "2024-Q4", "2024-Q3", "2024-Q2"];
const TEAMS   = ["All", "Enterprise", "SME", "Retail"];
const TIERS   = ["All", "Platinum", "Gold", "Silver", "Bronze"];
const STATUSES = ["All", "paid", "pending", "processing", "overdue"];

/* ─── commission earned ─── */
function commEarned(r: Rep) {
  return Math.round((r.achieved * r.commissionRate) / 100);
}
function totalPay(r: Rep) {
  return r.base + commEarned(r) + r.bonus;
}

export default function CommissionPage() {
  const [period, setPeriod]     = useState("2025-Q1");
  const [team, setTeam]         = useState("All");
  const [tier, setTier]         = useState("All");
  const [statusF, setStatusF]   = useState("All");
  const [search, setSearch]     = useState("");
  const [sortBy, setSortBy]     = useState<"name" | "target" | "achieved" | "commission" | "attainment">("attainment");
  const [sortDir, setSortDir]   = useState<"asc" | "desc">("desc");
  const [selected, setSelected] = useState<Rep | null>(null);
  const [showModal, setShowModal] = useState(false);

  const filtered = reps
    .filter(r =>
      (team === "All" || r.team === team) &&
      (tier === "All" || r.tier === tier) &&
      (statusF === "All" || r.status === statusF) &&
      (!search || r.name.toLowerCase().includes(search.toLowerCase()) || r.role.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      let va = 0, vb = 0;
      if (sortBy === "name")        { va = a.name.localeCompare(b.name); vb = 0; return sortDir === "asc" ? va : -va; }
      if (sortBy === "target")      { va = a.target; vb = b.target; }
      if (sortBy === "achieved")    { va = a.achieved; vb = b.achieved; }
      if (sortBy === "commission")  { va = commEarned(a); vb = commEarned(b); }
      if (sortBy === "attainment")  { va = a.achieved / a.target; vb = b.achieved / b.target; }
      return sortDir === "asc" ? va - vb : vb - va;
    });

  function toggleSort(col: typeof sortBy) {
    if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("desc"); }
  }

  const totalTarget   = filtered.reduce((s, r) => s + r.target, 0);
  const totalAchieved = filtered.reduce((s, r) => s + r.achieved, 0);
  const totalComm     = filtered.reduce((s, r) => s + commEarned(r), 0);
  const totalBonus    = filtered.reduce((s, r) => s + r.bonus, 0);
  const avgAttainment = filtered.length ? Math.round((totalAchieved / totalTarget) * 100) : 0;
  const topEarner     = [...reps].sort((a, b) => commEarned(b) - commEarned(a))[0];

  const SortIcon = ({ col }: { col: typeof sortBy }) =>
    sortBy === col
      ? sortDir === "asc" ? <ChevronUp size={12} className="text-blue-500" /> : <ChevronDown size={12} className="text-blue-500" />
      : <ChevronDown size={12} className="text-slate-300" />;

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Commission</h2>
          <p className="text-sm text-slate-500 mt-0.5">Sales performance & commission management · {period}</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={period} onChange={e => setPeriod(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none">
            {PERIODS.map(p => <option key={p}>{p}</option>)}
          </select>
          <button className="flex items-center gap-1.5 text-sm border border-slate-200 bg-white hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors">
            <Download size={13} /> Export
          </button>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors font-medium">
            <Plus size={14} /> Add Record
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: "Total Target",      value: fmt(totalTarget),            sub: "Combined quota",           icon: Target,      color: "text-blue-700",    bg: "bg-blue-50" },
          { label: "Revenue Achieved",  value: fmt(totalAchieved),          sub: `${avgAttainment}% attainment`, icon: TrendingUp,  color: "text-emerald-700", bg: "bg-emerald-50" },
          { label: "Commission Earned", value: fmt(totalComm),              sub: `${filtered.length} reps`,  icon: DollarSign,  color: "text-violet-700",  bg: "bg-violet-50" },
          { label: "Bonuses Paid",      value: fmt(totalBonus),             sub: "Performance bonuses",      icon: Award,       color: "text-amber-700",   bg: "bg-amber-50" },
          { label: "Top Earner",        value: topEarner.name.split(" ")[0], sub: fmt(commEarned(topEarner)), icon: Star,        color: "text-pink-700",    bg: "bg-pink-50" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-start justify-between mb-2">
              <div className={`${s.bg} p-2 rounded-lg`}><s.icon size={14} className={s.color} /></div>
            </div>
            <p className={`text-lg font-bold ${s.color}`} style={{ fontFamily: "var(--font-display)" }}>{s.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
            <p className="text-[10px] text-slate-400 mt-0.5 font-medium uppercase tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tier summary */}
      <div className="grid grid-cols-4 gap-3">
        {(["Platinum", "Gold", "Silver", "Bronze"] as const).map(t => {
          const tReps    = reps.filter(r => r.tier === t);
          const tAchieved = tReps.reduce((s, r) => s + r.achieved, 0);
          const tTarget   = tReps.reduce((s, r) => s + r.target, 0);
          const tAtt      = tTarget > 0 ? Math.round((tAchieved / tTarget) * 100) : 0;
          return (
            <div key={t} className={`bg-white rounded-xl border p-4 ${tierColors[t]}`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${tierBadge[t]}`}>{t}</span>
                <span className="text-xs text-slate-500">{tReps.length} reps</span>
              </div>
              <p className="text-base font-bold text-slate-800" style={{ fontFamily: "var(--font-display)" }}>{fmt(tAchieved)}</p>
              <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${tAtt >= 100 ? "bg-emerald-500" : tAtt >= 80 ? "bg-blue-500" : "bg-amber-500"}`}
                  style={{ width: `${Math.min(tAtt, 100)}%` }} />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">{tAtt}% of target</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-52">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or role..."
            className="w-full pl-7 pr-3 py-2 text-sm border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={team} onChange={e => setTeam(e.target.value)} className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none">
          {TEAMS.map(t => <option key={t}>{t === "All" ? "All Teams" : t}</option>)}
        </select>
        <select value={tier} onChange={e => setTier(e.target.value)} className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none">
          {TIERS.map(t => <option key={t}>{t === "All" ? "All Tiers" : t}</option>)}
        </select>
        <select value={statusF} onChange={e => setStatusF(e.target.value)} className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none">
          {STATUSES.map(s => <option key={s}>{s === "All" ? "All Status" : s}</option>)}
        </select>
        <span className="text-xs text-slate-400 ml-auto">{filtered.length} records</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-4 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Rep</th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Tier</th>
              {([
                { label: "Target",      col: "target" as const },
                { label: "Achieved",    col: "achieved" as const },
                { label: "Attainment",  col: "attainment" as const },
                { label: "Commission",  col: "commission" as const },
              ] as const).map(h => (
                <th key={h.col} onClick={() => toggleSort(h.col)} className="px-4 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide cursor-pointer hover:text-slate-600 transition-colors select-none">
                  <div className="flex items-center gap-1">{h.label}<SortIcon col={h.col} /></div>
                </th>
              ))}
              <th className="px-4 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Bonus</th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Total Pay</th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(r => {
              const attainment  = Math.round((r.achieved / r.target) * 100);
              const commission  = commEarned(r);
              const pay         = totalPay(r);
              const overTarget  = attainment >= 100;

              return (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelected(r === selected ? null : r)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={r.name} size="sm" />
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{r.name}</p>
                        <p className="text-xs text-slate-400">{r.role} · {r.team}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${tierBadge[r.tier]}`}>{r.tier}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">LKR {fmtN(r.target)}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-800">LKR {fmtN(r.achieved)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${overTarget ? "bg-emerald-500" : attainment >= 80 ? "bg-blue-500" : "bg-amber-500"}`}
                          style={{ width: `${Math.min(attainment, 100)}%` }} />
                      </div>
                      <span className={`text-xs font-bold flex items-center gap-0.5 ${overTarget ? "text-emerald-600" : attainment >= 80 ? "text-blue-600" : "text-amber-600"}`}>
                        {overTarget ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                        {attainment}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-violet-700">LKR {fmtN(commission)}</span>
                      <span className="text-[10px] text-slate-400">{r.commissionRate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-amber-700 font-medium">LKR {fmtN(r.bonus)}</td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-800">LKR {fmtN(pay)}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3">
                    <button className="p-1.5 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors">
                      <Edit2 size={12} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          {/* Footer totals */}
          <tfoot>
            <tr className="bg-slate-50 border-t border-slate-200">
              <td className="px-4 py-3 text-xs font-bold text-slate-600" colSpan={2}>Totals ({filtered.length} reps)</td>
              <td className="px-4 py-3 text-xs font-bold text-slate-700">LKR {fmtN(totalTarget)}</td>
              <td className="px-4 py-3 text-xs font-bold text-slate-700">LKR {fmtN(totalAchieved)}</td>
              <td className="px-4 py-3 text-xs font-bold text-blue-700">{avgAttainment}% avg</td>
              <td className="px-4 py-3 text-xs font-bold text-violet-700">LKR {fmtN(totalComm)}</td>
              <td className="px-4 py-3 text-xs font-bold text-amber-700">LKR {fmtN(totalBonus)}</td>
              <td className="px-4 py-3 text-xs font-bold text-slate-800">LKR {fmtN(filtered.reduce((s, r) => s + totalPay(r), 0))}</td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Expanded row detail */}
      {selected && (
        <div className="bg-white rounded-xl border border-blue-200 p-5 shadow-sm" style={{ animation: "fadeIn 0.2s ease" }}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar name={selected.name} size="lg" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>{selected.name}</h3>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${tierBadge[selected.tier]}`}>{selected.tier}</span>
                </div>
                <p className="text-sm text-slate-500">{selected.role} · {selected.team} Team · {selected.id}</p>
              </div>
            </div>
            <button onClick={() => setSelected(null)} className="text-xs text-slate-400 hover:text-slate-600">Close</button>
          </div>

          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { label: "Base Salary",      value: `LKR ${fmtN(selected.base)}`,            color: "text-slate-700" },
              { label: "Commission Earned", value: `LKR ${fmtN(commEarned(selected))}`,   color: "text-violet-700" },
              { label: "Performance Bonus", value: `LKR ${fmtN(selected.bonus)}`,          color: "text-amber-700" },
              { label: "Total Compensation", value: `LKR ${fmtN(totalPay(selected))}`,    color: "text-emerald-700" },
            ].map(s => (
              <div key={s.label} className="bg-slate-50 rounded-xl p-3">
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{s.label}</p>
                <p className={`text-base font-bold mt-1 ${s.color}`} style={{ fontFamily: "var(--font-display)" }}>{s.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-2">Revenue Attainment</p>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-500">LKR {fmtN(selected.achieved)} / LKR {fmtN(selected.target)}</span>
                <span className="text-xs font-bold text-blue-600">{Math.round((selected.achieved / selected.target) * 100)}%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${selected.achieved >= selected.target ? "bg-emerald-500" : "bg-blue-500"}`}
                  style={{ width: `${Math.min(Math.round((selected.achieved / selected.target) * 100), 100)}%` }} />
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-2">Deal Performance</p>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-xl font-black text-slate-800" style={{ fontFamily: "var(--font-display)" }}>{selected.closedDeals}</p>
                  <p className="text-[10px] text-slate-400">Closed</p>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div className="text-center">
                  <p className="text-xl font-black text-slate-800" style={{ fontFamily: "var(--font-display)" }}>{selected.deals - selected.closedDeals}</p>
                  <p className="text-[10px] text-slate-400">Pipeline</p>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div className="text-center">
                  <p className="text-xl font-black text-emerald-700" style={{ fontFamily: "var(--font-display)" }}>{Math.round((selected.closedDeals / selected.deals) * 100)}%</p>
                  <p className="text-[10px] text-slate-400">Win Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add record modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-display)" }}>Add Commission Record</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Sales Rep", col: 2, type: "select", opts: reps.map(r => r.name) },
                { label: "Period", col: 1, type: "select", opts: PERIODS },
                { label: "Team", col: 1, type: "select", opts: TEAMS.slice(1) },
                { label: "Revenue Target (LKR)", col: 1 },
                { label: "Revenue Achieved (LKR)", col: 1 },
                { label: "Commission Rate (%)", col: 1 },
                { label: "Bonus (LKR)", col: 1 },
              ].map(f => (
                <div key={f.label} className={f.col === 2 ? "col-span-2" : ""}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{f.label}</label>
                  {(f as {type?: string}).type === "select"
                    ? <select className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {((f as {opts?: string[]}).opts ?? []).map(o => <option key={o}>{o}</option>)}
                      </select>
                    : <input type="number" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  }
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">Save Record</button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
