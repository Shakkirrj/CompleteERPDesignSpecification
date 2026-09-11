import { Plus, Edit, Globe, Phone, Mail, MapPin, Building2 } from "lucide-react";
import StatusBadge from "../../components/ui/StatusBadge";

const companies = [
  {
    id: "CO001", name: "MernCrest IT Services (Pvt) Ltd", regNo: "PV 00123456", tax: "134561234-7000",
    email: "info@merncrest.lk", phone: "+94 11 234 5678", website: "merncrest.lk",
    address: "No. 42, Galle Road, Colombo 03", country: "Sri Lanka", currency: "LKR",
    branches: 3, departments: 8, employees: 61, status: "active",
  },
];

export default function CompaniesPage() {
  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Companies</h2>
          <p className="text-sm text-slate-500 mt-0.5">Registered legal entities in the organization</p>
        </div>
        <button className="flex items-center gap-2 text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors font-medium">
          <Plus size={14} /> Add Company
        </button>
      </div>

      {companies.map(co => (
        <div key={co.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="p-6 flex items-start gap-5">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>{co.name}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{co.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={co.status} />
                  <button className="flex items-center gap-1.5 text-xs border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg text-slate-600 transition-colors">
                    <Edit size={12} /> Edit
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Registration No.</p>
                  <p className="text-sm text-slate-800 mt-0.5 font-mono">{co.regNo}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Tax Number</p>
                  <p className="text-sm text-slate-800 mt-0.5 font-mono">{co.tax}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Currency</p>
                  <p className="text-sm text-slate-800 mt-0.5">{co.currency}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Country</p>
                  <p className="text-sm text-slate-800 mt-0.5">{co.country}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-500"><Mail size={12} className="text-slate-400" />{co.email}</div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500"><Phone size={12} className="text-slate-400" />{co.phone}</div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500"><Globe size={12} className="text-slate-400" />{co.website}</div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500"><MapPin size={12} className="text-slate-400" />{co.address}</div>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 border-t border-slate-100 px-6 py-3 flex gap-8">
            {[
              { label: "Branches", value: co.branches },
              { label: "Departments", value: co.departments },
              { label: "Employees", value: co.employees },
            ].map(s => (
              <div key={s.label}>
                <p className="text-[10px] text-slate-400">{s.label}</p>
                <p className="text-base font-bold text-slate-800">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
