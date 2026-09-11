import { Building2, GitBranch, Layers, Users2, Network, MapPin, Award, ChevronRight } from "lucide-react";

interface Props {
  onNavigate: (id: string) => void;
}

const modules = [
  { id: "org-companies", icon: Building2, label: "Companies", count: 1, desc: "Legal entities and business registration", color: "bg-blue-50 text-blue-600 border-blue-200" },
  { id: "org-branches", icon: GitBranch, label: "Branches", count: 3, desc: "Office locations and regional offices", color: "bg-violet-50 text-violet-600 border-violet-200" },
  { id: "org-departments", icon: Layers, label: "Departments", count: 8, desc: "Functional departments and divisions", color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  { id: "org-teams", icon: Users2, label: "Teams", count: 14, desc: "Cross-functional and project teams", color: "bg-amber-50 text-amber-600 border-amber-200" },
  { id: "org-locations", icon: MapPin, label: "Locations", count: 4, desc: "Office, remote, and client site locations", color: "bg-cyan-50 text-cyan-600 border-cyan-200" },
  { id: "org-designations", icon: Award, label: "Designations", count: 22, desc: "Job titles and employment levels", color: "bg-rose-50 text-rose-600 border-rose-200" },
  { id: "org-chart", icon: Network, label: "Org Chart", count: null, desc: "Visual reporting and hierarchy structure", color: "bg-slate-50 text-slate-600 border-slate-200" },
];

export default function OrganizationPage({ onNavigate }: Props) {
  return (
    <div className="p-6 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Organization</h2>
        <p className="text-sm text-slate-500 mt-0.5">MernCrest IT Services (Pvt) Ltd · Colombo, Sri Lanka</p>
      </div>

      {/* Company overview card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-2xl">M</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>MernCrest IT Services (Pvt) Ltd</h3>
            <p className="text-sm text-slate-500 mt-0.5">PV 00123456 · Founded 2019 · Colombo, Sri Lanka</p>
            <div className="flex flex-wrap gap-3 mt-3">
              {[
                { label: "61 Employees", icon: "👥" },
                { label: "3 Branches", icon: "📍" },
                { label: "8 Departments", icon: "🏢" },
                { label: "14 Teams", icon: "👥" },
                { label: "6 Active Projects", icon: "📁" },
              ].map(s => (
                <span key={s.label} className="flex items-center gap-1.5 text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                  {s.icon} {s.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {modules.map(m => (
          <button
            key={m.id}
            onClick={() => onNavigate(m.id)}
            className="bg-white rounded-xl border border-slate-200 p-5 text-left hover:shadow-md hover:border-blue-200 transition-all group"
          >
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 ${m.color}`}>
              <m.icon size={18} />
            </div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors" style={{ fontFamily: "var(--font-display)" }}>{m.label}</p>
                {m.count !== null && <p className="text-lg font-bold text-slate-700 mt-0.5">{m.count}</p>}
              </div>
              <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-400 mt-0.5 transition-colors" />
            </div>
            <p className="text-xs text-slate-400 mt-1.5">{m.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
