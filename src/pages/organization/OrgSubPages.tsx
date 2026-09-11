import { Plus, Edit, MoreHorizontal, Users, MapPin, ChevronRight, Network } from "lucide-react";
import StatusBadge from "../../components/ui/StatusBadge";
import Avatar from "../../components/ui/Avatar";
import { departments } from "../../data/mockData";

const branches = [
  { id: "BR001", name: "Colombo HQ", address: "No. 42, Galle Road, Colombo 03", manager: "Priya Jayawardena", employees: 48, departments: 8, status: "active", phone: "+94 11 234 5678" },
  { id: "BR002", name: "Kandy Branch", address: "No. 12, Dalada Veediya, Kandy", manager: "Chamara Wickramasinghe", employees: 9, departments: 3, status: "active", phone: "+94 81 123 4567" },
  { id: "BR003", name: "Galle Branch", address: "No. 7, Church Street, Galle", manager: "Tharaka Ranatunga", employees: 4, departments: 2, status: "active", phone: "+94 91 234 5678" },
];

const teams = [
  { id: "TM001", name: "Frontend Team", dept: "Engineering", manager: "Kavinda Perera", members: 5, projects: 3, status: "active" },
  { id: "TM002", name: "Backend Team", dept: "Engineering", manager: "Sameera Bandara", members: 6, projects: 4, status: "active" },
  { id: "TM003", name: "DevOps Team", dept: "Engineering", manager: "Sameera Bandara", members: 2, projects: 2, status: "active" },
  { id: "TM004", name: "Design Team", dept: "Design", manager: "Nishani Silva", members: 3, projects: 5, status: "active" },
  { id: "TM005", name: "Sales Team", dept: "Sales", manager: "Chamara Wickramasinghe", members: 4, projects: 0, status: "active" },
  { id: "TM006", name: "Support Team", dept: "Support", manager: "Tharaka Ranatunga", members: 4, projects: 0, status: "active" },
];

const locations = [
  { id: "LOC001", name: "Colombo Head Office", type: "Office", address: "No. 42, Galle Road, Colombo 03", status: "active" },
  { id: "LOC002", name: "Kandy Office", type: "Office", address: "No. 12, Dalada Veediya, Kandy", status: "active" },
  { id: "LOC003", name: "Galle Office", type: "Office", address: "No. 7, Church Street, Galle", status: "active" },
  { id: "LOC004", name: "Remote (Work from Home)", type: "Remote", address: "Sri Lanka", status: "active" },
];

const designations = [
  { id: "DES001", title: "Operations Director", dept: "Operations", level: "C-Level", status: "active", count: 1 },
  { id: "DES002", title: "Engineering Manager", dept: "Engineering", level: "Manager", status: "active", count: 2 },
  { id: "DES003", title: "Senior Software Engineer", dept: "Engineering", level: "Senior", status: "active", count: 6 },
  { id: "DES004", title: "Software Engineer", dept: "Engineering", level: "Mid", status: "active", count: 10 },
  { id: "DES005", title: "Junior Software Engineer", dept: "Engineering", level: "Junior", status: "active", count: 6 },
  { id: "DES006", title: "Sales Manager", dept: "Sales", level: "Manager", status: "active", count: 2 },
  { id: "DES007", title: "UI/UX Designer", dept: "Design", level: "Mid", status: "active", count: 3 },
  { id: "DES008", title: "HR Manager", dept: "HR", level: "Manager", status: "active", count: 1 },
  { id: "DES009", title: "Senior Accountant", dept: "Finance", level: "Senior", status: "active", count: 2 },
  { id: "DES010", title: "DevOps Engineer", dept: "Engineering", level: "Mid", status: "active", count: 2 },
];

export function BranchesPage() {
  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Branches</h2>
          <p className="text-sm text-slate-500 mt-0.5">{branches.length} branches across Sri Lanka</p>
        </div>
        <button className="flex items-center gap-2 text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors font-medium">
          <Plus size={14} /> Add Branch
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {branches.map(b => (
          <div key={b.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center">
                <MapPin size={16} className="text-blue-600" />
              </div>
              <StatusBadge status={b.status} size="sm" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm" style={{ fontFamily: "var(--font-display)" }}>{b.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">{b.id}</p>
            <p className="text-xs text-slate-500 mt-2 flex items-start gap-1"><MapPin size={10} className="mt-0.5 flex-shrink-0" />{b.address}</p>
            <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
              <div>
                <p className="text-[10px] text-slate-400">Manager</p>
                <div className="flex items-center gap-1 mt-0.5"><Avatar name={b.manager} size="xs" /><span className="text-xs text-slate-700 truncate">{b.manager.split(" ")[0]}</span></div>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">Employees</p>
                <p className="text-sm font-bold text-slate-800">{b.employees}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DepartmentsPage() {
  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Departments</h2>
          <p className="text-sm text-slate-500 mt-0.5">{departments.length} departments</p>
        </div>
        <button className="flex items-center gap-2 text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors font-medium">
          <Plus size={14} /> Add Department
        </button>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Department</th>
              <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Head</th>
              <th className="px-3 py-3 text-center text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Employees</th>
              <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Teams</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {departments.map((d, i) => (
              <tr key={d.name} className="hover:bg-slate-50 transition-colors cursor-pointer">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">{d.name.slice(0, 2).toUpperCase()}</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-800">{d.name}</span>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1.5">
                    <Avatar name={d.head} size="xs" />
                    <span className="text-xs text-slate-600">{d.head}</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-center"><span className="text-sm font-bold text-slate-800">{d.count}</span></td>
                <td className="px-3 py-3"><span className="text-xs text-slate-500">{Math.ceil(d.count / 3)} teams</span></td>
                <td className="px-5 py-3">
                  <button className="p-1.5 hover:bg-slate-100 rounded-lg"><MoreHorizontal size={14} className="text-slate-400" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function TeamsPage() {
  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Teams</h2>
          <p className="text-sm text-slate-500 mt-0.5">{teams.length} teams across all departments</p>
        </div>
        <button className="flex items-center gap-2 text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors font-medium">
          <Plus size={14} /> Create Team
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {teams.map(t => (
          <div key={t.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 bg-violet-50 border border-violet-200 rounded-lg flex items-center justify-center">
                <Users size={15} className="text-violet-600" />
              </div>
              <StatusBadge status={t.status} size="sm" />
            </div>
            <p className="font-bold text-slate-900 text-sm" style={{ fontFamily: "var(--font-display)" }}>{t.name}</p>
            <p className="text-xs text-slate-400 mt-0.5">{t.dept}</p>
            <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
              <div><p className="text-[10px] text-slate-400">Manager</p><div className="flex justify-center mt-0.5"><Avatar name={t.manager} size="xs" /></div></div>
              <div><p className="text-[10px] text-slate-400">Members</p><p className="text-sm font-bold text-slate-800">{t.members}</p></div>
              <div><p className="text-[10px] text-slate-400">Projects</p><p className="text-sm font-bold text-slate-800">{t.projects}</p></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LocationsPage() {
  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Locations</h2>
          <p className="text-sm text-slate-500 mt-0.5">Office and remote work locations</p>
        </div>
        <button className="flex items-center gap-2 text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors font-medium">
          <Plus size={14} /> Add Location
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {locations.map(l => (
          <div key={l.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${l.type === "Remote" ? "bg-teal-50" : "bg-blue-50"}`}>
              <MapPin size={16} className={l.type === "Remote" ? "text-teal-600" : "text-blue-600"} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800">{l.name}</p>
              <p className="text-xs text-slate-400 truncate">{l.address}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{l.type}</span>
              <StatusBadge status={l.status} size="sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DesignationsPage() {
  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Designations</h2>
          <p className="text-sm text-slate-500 mt-0.5">{designations.length} active designations</p>
        </div>
        <button className="flex items-center gap-2 text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors font-medium">
          <Plus size={14} /> Add Designation
        </button>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Title</th>
              <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Department</th>
              <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Level</th>
              <th className="px-3 py-3 text-center text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Employees</th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {designations.map(d => (
              <tr key={d.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                <td className="px-5 py-3"><span className="text-sm font-semibold text-slate-800">{d.title}</span></td>
                <td className="px-3 py-3"><span className="text-xs text-slate-600">{d.dept}</span></td>
                <td className="px-3 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                    d.level === "C-Level" ? "bg-red-50 text-red-700 border-red-200" :
                    d.level === "Manager" ? "bg-orange-50 text-orange-700 border-orange-200" :
                    d.level === "Senior" ? "bg-blue-50 text-blue-700 border-blue-200" :
                    d.level === "Mid" ? "bg-violet-50 text-violet-700 border-violet-200" :
                    "bg-slate-100 text-slate-600 border-slate-200"
                  }`}>{d.level}</span>
                </td>
                <td className="px-3 py-3 text-center"><span className="text-sm font-bold text-slate-800">{d.count}</span></td>
                <td className="px-5 py-3"><StatusBadge status={d.status} size="sm" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function OrgChartPage() {
  const nodes = [
    { id: "director", name: "Priya Jayawardena", role: "Operations Director", level: 0, reports: ["eng", "sales", "finance", "hr"] },
    { id: "eng", name: "Dilshan Fernando", role: "Engineering Manager", level: 1, dept: "Engineering" },
    { id: "sales", name: "Chamara Wickramasinghe", role: "Sales Manager", level: 1, dept: "Sales" },
    { id: "finance", name: "Rajith Kumara", role: "Senior Accountant", level: 1, dept: "Finance" },
    { id: "hr", name: "Amali De Silva", role: "HR Manager", level: 1, dept: "HR" },
  ];

  return (
    <div className="p-6 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Organization Chart</h2>
        <p className="text-sm text-slate-500 mt-0.5">Reporting structure · MernCrest IT Services</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-8 overflow-auto min-h-96">
        {/* Director */}
        <div className="flex justify-center mb-8">
          <div className="bg-blue-600 text-white rounded-2xl p-4 text-center min-w-48 shadow-lg shadow-blue-200">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="font-bold text-sm">PJ</span>
            </div>
            <p className="font-bold text-sm">Priya Jayawardena</p>
            <p className="text-blue-200 text-[10px] mt-0.5">Operations Director</p>
          </div>
        </div>
        {/* Connector */}
        <div className="flex justify-center mb-4">
          <div className="w-px h-8 bg-slate-300" />
        </div>
        {/* Horizontal line */}
        <div className="relative flex justify-center mb-4">
          <div className="absolute top-0 left-[10%] right-[10%] h-px bg-slate-300" />
        </div>
        {/* Reports */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-8">
          {nodes.slice(1).map(node => (
            <div key={node.id}>
              <div className="flex justify-center mb-2">
                <div className="w-px h-6 bg-slate-300" />
              </div>
              <div className="bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md rounded-xl p-3.5 text-center cursor-pointer transition-all">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Avatar name={node.name} size="sm" />
                </div>
                <p className="font-semibold text-slate-800 text-xs">{node.name}</p>
                <p className="text-slate-400 text-[10px] mt-0.5">{node.role}</p>
                <span className="mt-1.5 inline-block text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{node.dept}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <button className="text-xs text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-300 px-4 py-2 rounded-lg transition-colors">
            View Full Chart <ChevronRight size={12} className="inline" />
          </button>
        </div>
      </div>
    </div>
  );
}
