import { useState } from "react";
import { Plus, Search, Phone, Mail, ArrowLeft, MapPin, Building, Star } from "lucide-react";
import Avatar from "../../components/ui/Avatar";

const contacts = [
  { id: "CON001", name: "Nuwan Perera", company: "Sampath Bank", title: "IT Director", email: "nuwan.perera@sampathbank.lk", phone: "+94 11 230 8888", city: "Colombo", status: "active", vip: true, lastContact: "2025-03-09" },
  { id: "CON002", name: "Dilini Jayasinghe", company: "Hayleys Group", title: "CTO", email: "dilini.j@hayleys.com", phone: "+94 11 267 3000", city: "Colombo", status: "active", vip: false, lastContact: "2025-03-10" },
  { id: "CON003", name: "Prasanna Gunawardena", company: "John Keells Holdings", title: "GM IT", email: "prasanna.g@jkh.lk", phone: "+94 11 230 6000", city: "Colombo", status: "active", vip: true, lastContact: "2025-03-08" },
  { id: "CON004", name: "Thilina Abeysekara", company: "NDB Bank", title: "Digital Manager", email: "thilina.a@ndb.lk", phone: "+94 11 244 8888", city: "Colombo", status: "cold", vip: false, lastContact: "2025-03-07" },
  { id: "CON005", name: "Madushika Seneviratne", company: "Brandix Lanka", title: "Head of IT", email: "madushika@brandix.com", phone: "+94 11 230 5000", city: "Colombo", status: "active", vip: false, lastContact: "2025-03-11" },
  { id: "CON006", name: "Ruwan Bandara", company: "MAS Holdings", title: "VP Technology", email: "ruwan.b@masholdings.com", phone: "+94 11 231 2000", city: "Colombo", status: "active", vip: true, lastContact: "2025-03-10" },
  { id: "CON007", name: "Thilini Perera", company: "Laugfs Gas", title: "IT Manager", email: "thilini.p@laugfs.lk", phone: "+94 11 230 4500", city: "Kandy", status: "active", vip: false, lastContact: "2025-03-09" },
  { id: "CON008", name: "Asanka Fernando", company: "Lion Brewery", title: "Systems Manager", email: "asanka.f@lionbrewery.lk", phone: "+94 11 267 1000", city: "Biyagama", status: "active", vip: false, lastContact: "2025-03-08" },
  { id: "CON009", name: "Kavinda Pathirana", company: "Dialog Axiata PLC", title: "Enterprise Sales", email: "kavinda.p@dialog.lk", phone: "+94 77 678 4321", city: "Colombo", status: "active", vip: true, lastContact: "2025-03-11" },
  { id: "CON010", name: "Chamila Wijesinghe", company: "Ceylon Bank Ltd", title: "Head of Digital", email: "chamila.w@ceylonbank.lk", phone: "+94 11 244 0100", city: "Colombo", status: "active", vip: false, lastContact: "2025-03-06" },
];

interface Props { onBack: () => void; }

export default function CRMContactsPage({ onBack }: Props) {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const filtered = contacts.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Contacts</h2>
          <p className="text-sm text-slate-500 mt-0.5">{contacts.length} contacts · {contacts.filter(c => c.vip).length} VIP</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-white border border-slate-200 rounded-lg overflow-hidden">
            <button onClick={() => setViewMode("list")} className={`px-2.5 py-1.5 text-xs ${viewMode === "list" ? "bg-blue-50 text-blue-600" : "text-slate-400 hover:bg-slate-50"}`}>List</button>
            <button onClick={() => setViewMode("grid")} className={`px-2.5 py-1.5 text-xs ${viewMode === "grid" ? "bg-blue-50 text-blue-600" : "text-slate-400 hover:bg-slate-50"}`}>Cards</button>
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors font-medium">
            <Plus size={14} /> Add Contact
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, company, or email..."
          className="w-full pl-8 pr-4 py-2.5 text-sm border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      {viewMode === "list" ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Contact</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Company</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Title</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Email</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Phone</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">City</th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Last Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={c.name} size="sm" />
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-semibold text-slate-800">{c.name}</span>
                          {c.vip && <Star size={10} className="text-amber-500 fill-amber-500" />}
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${c.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{c.status}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Building size={11} className="text-slate-400" />{c.company}
                    </div>
                  </td>
                  <td className="px-3 py-3"><span className="text-xs text-slate-500">{c.title}</span></td>
                  <td className="px-3 py-3">
                    <a href={`mailto:${c.email}`} className="text-xs text-blue-600 hover:underline">{c.email}</a>
                  </td>
                  <td className="px-3 py-3"><span className="text-xs text-slate-600">{c.phone}</span></td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <MapPin size={10} />{c.city}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 justify-between">
                      <span className="text-xs text-slate-400">{c.lastContact}</span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                        <button className="p-1 hover:bg-blue-50 rounded text-blue-500"><Phone size={11} /></button>
                        <button className="p-1 hover:bg-blue-50 rounded text-blue-500"><Mail size={11} /></button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(c => (
            <div key={c.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all cursor-pointer text-center group">
              <div className="flex justify-center mb-3 relative">
                <Avatar name={c.name} size="lg" />
                {c.vip && (
                  <div className="absolute -top-1 -right-1 bg-amber-400 rounded-full p-0.5">
                    <Star size={8} className="text-white fill-white" />
                  </div>
                )}
              </div>
              <p className="text-sm font-semibold text-slate-800">{c.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{c.title}</p>
              <p className="text-xs text-blue-600 mt-0.5 font-medium">{c.company}</p>
              <div className="mt-3 flex items-center justify-center gap-2">
                <button className="p-1.5 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"><Phone size={13} /></button>
                <button className="p-1.5 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"><Mail size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-display)" }}>Add New Contact</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "First Name", col: 1 }, { label: "Last Name", col: 1 },
                { label: "Email", col: 2 }, { label: "Phone", col: 2 },
                { label: "Company", col: 2 }, { label: "Job Title", col: 2 },
                { label: "City", col: 1 }, { label: "Country", col: 1 },
              ].map(f => (
                <div key={f.label} className={f.col === 2 ? "col-span-2" : ""}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{f.label}</label>
                  <input className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">Save Contact</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
