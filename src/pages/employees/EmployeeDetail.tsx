import { ArrowLeft, Mail, Phone, MapPin, Edit, MoreHorizontal, Clock, Calendar, Banknote, FileText, Briefcase, Shield, Star, Award } from "lucide-react";
import Avatar from "../../components/ui/Avatar";
import StatusBadge from "../../components/ui/StatusBadge";
import { employees } from "../../data/mockData";

const profileTabs = ["Overview", "Attendance", "Leave", "Payroll", "Documents", "Projects", "Access", "Activity"];

interface Props {
  employeeId: string;
  onBack: () => void;
}

export default function EmployeeDetail({ employeeId, onBack }: Props) {
  const emp = employees.find(e => e.id === employeeId) ?? employees[0];
  return (
    <div className="p-6 space-y-5">
      {/* Back + actions */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
          <ArrowLeft size={16} /> Back to Employees
        </button>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 text-sm border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors">
            <Edit size={14} /> Edit Profile
          </button>
          <button className="p-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg"><MoreHorizontal size={16} className="text-slate-500" /></button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Profile card */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
            <div className="flex justify-center mb-3">
              <Avatar name={emp.name} size="xl" />
            </div>
            <h3 className="font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>{emp.name}</h3>
            <p className="text-sm text-slate-500 mt-0.5">{emp.designation}</p>
            <div className="mt-2 flex justify-center"><StatusBadge status={emp.status} /></div>
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2.5">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-500">{emp.id}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Mail size={12} className="text-slate-400 flex-shrink-0" />{emp.email}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Phone size={12} className="text-slate-400 flex-shrink-0" />{emp.phone}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <MapPin size={12} className="text-slate-400 flex-shrink-0" />{emp.branch}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
              <button className="text-xs border border-slate-200 rounded-lg py-2 text-slate-600 hover:bg-slate-50 transition-colors">Message</button>
              <button className="text-xs bg-blue-50 border border-blue-200 rounded-lg py-2 text-blue-700 hover:bg-blue-100 transition-colors">Send Email</button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Quick Stats</h4>
            {[
              { icon: Clock, label: "Avg. Check-in", value: "08:52 AM" },
              { icon: Calendar, label: "Leave Balance", value: "12 days" },
              { icon: Banknote, label: "Gross Salary", value: `LKR ${(emp.salary/1000).toFixed(0)}K` },
              { icon: Briefcase, label: "Active Projects", value: "3" },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <s.icon size={12} className="text-slate-400" />{s.label}
                </div>
                <span className="text-xs font-semibold text-slate-800">{s.value}</span>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Skills</h4>
            <div className="flex flex-wrap gap-1.5">
              {["React", "Node.js", "TypeScript", "PostgreSQL", "AWS", "Docker", "REST APIs", "Agile"].map(s => (
                <span key={s} className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full">{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="col-span-12 lg:col-span-9 space-y-4">
          {/* Tabs */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="flex items-center gap-1 px-4 pt-4 border-b border-slate-100 overflow-x-auto">
              {profileTabs.map((t, i) => (
                <button
                  key={t}
                  className={`px-3 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${i === 0 ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Personal Info */}
            <div className="p-5 grid grid-cols-2 gap-x-8 gap-y-4">
              <div className="col-span-2">
                <h4 className="text-sm font-semibold text-slate-800 mb-3" style={{ fontFamily: "var(--font-display)" }}>Personal Information</h4>
              </div>
              {[
                { label: "Full Name", value: emp.name },
                { label: "Employee ID", value: emp.id },
                { label: "Email Address", value: emp.email },
                { label: "Phone Number", value: emp.phone },
                { label: "Date of Birth", value: "1992-08-14" },
                { label: "NIC Number", value: "921263456V" },
                { label: "Gender", value: "Male" },
                { label: "Nationality", value: "Sri Lankan" },
                { label: "Marital Status", value: "Married" },
                { label: "Emergency Contact", value: "+94 77 999 0000" },
              ].map(f => (
                <div key={f.label}>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{f.label}</p>
                  <p className="text-sm text-slate-800 mt-0.5">{f.value}</p>
                </div>
              ))}
              <div className="col-span-2 border-t border-slate-100 pt-4 mt-1">
                <h4 className="text-sm font-semibold text-slate-800 mb-3" style={{ fontFamily: "var(--font-display)" }}>Employment Details</h4>
              </div>
              {[
                { label: "Department", value: emp.department },
                { label: "Designation", value: emp.designation },
                { label: "Branch", value: emp.branch },
                { label: "Reporting Manager", value: emp.manager },
                { label: "Join Date", value: emp.joinDate },
                { label: "Employment Type", value: "Permanent" },
                { label: "Work Schedule", value: "8:30 AM – 5:30 PM (Mon–Fri)" },
                { label: "Contract End", value: "—" },
              ].map(f => (
                <div key={f.label}>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{f.label}</p>
                  <p className="text-sm text-slate-800 mt-0.5">{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Attendance streak */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-slate-800" style={{ fontFamily: "var(--font-display)" }}>Attendance — March 2025</h4>
              <StatusBadge status="active" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 21 }, (_, i) => {
                const s = i < 15 ? "present" : i < 17 ? "late" : i < 19 ? "present" : "leave";
                const colors: Record<string, string> = { present: "bg-emerald-500", late: "bg-amber-400", absent: "bg-red-400", leave: "bg-violet-400" };
                return (
                  <div key={i} title={`Day ${i + 1}: ${s}`} className={`w-7 h-7 rounded-md ${colors[s]} flex items-center justify-center`}>
                    <span className="text-[9px] text-white font-bold">{i + 1}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-4 mt-3">
              {[["Present","bg-emerald-500","18"],["Late","bg-amber-400","2"],["Leave","bg-violet-400","1"]].map(([l,c,v]) => (
                <div key={l} className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-sm ${c}`} />
                  <span className="text-xs text-slate-500">{l}: <strong className="text-slate-800">{v}</strong></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
