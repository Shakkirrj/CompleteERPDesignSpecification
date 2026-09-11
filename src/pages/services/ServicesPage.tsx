import { useState } from "react";
import { Plus, Search, Tag, DollarSign, Clock, CheckCircle, X, MoreHorizontal } from "lucide-react";
import StatusBadge from "../../components/ui/StatusBadge";
import ActionFeedback, { type ActionFeedbackData } from "../../components/ui/ActionFeedback";

const serviceCategories = ["All", "Web Development", "Mobile Development", "Cloud Services", "Cyber Security", "IT Support", "ERP/CRM", "Consulting", "Digital Marketing"];
const billingCycles = ["Milestone", "Monthly", "One-time", "Quarterly", "Annual"];
const serviceTypes = ["Project-based", "Retainer", "Subscription", "Consulting"];
const slaOptions = ["As agreed", "4h response", "8h response", "24h response", "99.9% uptime", "99.5% uptime", "14-day report", "Monthly report"];
const managers = ["Dilshan Fernando", "Sameera Bandara", "Tharaka Ranatunga", "Priya Jayawardena", "Ishara Madushani"];

const initialServices = [
  { id: "SVC001", name: "Custom Web Application Development", category: "Web Development", type: "Project-based", basePrice: 450000, currency: "LKR", billingCycle: "Milestone", sla: "As agreed", manager: "Dilshan Fernando", commission: true, status: "active", description: "End-to-end custom web application development using React, Node.js, and cloud infrastructure." },
  { id: "SVC002", name: "Mobile App Development (iOS & Android)", category: "Mobile Development", type: "Project-based", basePrice: 620000, currency: "LKR", billingCycle: "Milestone", sla: "As agreed", manager: "Dilshan Fernando", commission: true, status: "active", description: "Native and cross-platform mobile application development." },
  { id: "SVC003", name: "Cloud Infrastructure Management", category: "Cloud Services", type: "Retainer", basePrice: 85000, currency: "LKR", billingCycle: "Monthly", sla: "99.9% uptime", manager: "Sameera Bandara", commission: false, status: "active", description: "AWS/GCP/Azure infrastructure setup, management, monitoring, and optimization." },
  { id: "SVC004", name: "Managed Web Hosting (Business)", category: "Cloud Services", type: "Subscription", basePrice: 12000, currency: "LKR", billingCycle: "Monthly", sla: "99.5% uptime", manager: "Sameera Bandara", commission: true, status: "active", description: "Fully managed Linux web hosting with SSL, CDN, and daily backups." },
  { id: "SVC005", name: "Cybersecurity Audit & Penetration Testing", category: "Cyber Security", type: "Project-based", basePrice: 280000, currency: "LKR", billingCycle: "One-time", sla: "14-day report", manager: "Sameera Bandara", commission: true, status: "active", description: "Comprehensive security audit, vulnerability assessment, and penetration testing." },
  { id: "SVC006", name: "IT Support & Helpdesk (Retainer)", category: "IT Support", type: "Retainer", basePrice: 45000, currency: "LKR", billingCycle: "Monthly", sla: "4h response", manager: "Tharaka Ranatunga", commission: false, status: "active", description: "Monthly IT helpdesk support with guaranteed SLA response times." },
  { id: "SVC007", name: "ERP Implementation", category: "ERP/CRM", type: "Project-based", basePrice: 1200000, currency: "LKR", billingCycle: "Milestone", sla: "As agreed", manager: "Priya Jayawardena", commission: true, status: "active", description: "Full ERP system design, implementation, training, and post-go-live support." },
  { id: "SVC008", name: "Digital Marketing & SEO", category: "Digital Marketing", type: "Retainer", basePrice: 35000, currency: "LKR", billingCycle: "Monthly", sla: "Monthly report", manager: "Ishara Madushani", commission: true, status: "active", description: "SEO, Google Ads, social media management, and monthly performance reporting." },
];

type Service = typeof initialServices[0];

function CreateServiceModal({ onClose, onSave }: { onClose: () => void; onSave: (s: Service) => void }) {
  const [form, setForm] = useState({ name: "", category: "Web Development", type: "Project-based", basePrice: "", billingCycle: "Milestone", sla: "As agreed", manager: managers[0], commission: false, description: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Service name is required";
    if (!form.basePrice || Number(form.basePrice) <= 0) e.basePrice = "Enter a valid price";
    if (!form.description.trim()) e.description = "Description is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    const nextId = `SVC${String(initialServices.length + Math.floor(Math.random() * 90) + 10).padStart(3, "0")}`;
    onSave({ id: nextId, name: form.name.trim(), category: form.category, type: form.type, basePrice: Number(form.basePrice), currency: "LKR", billingCycle: form.billingCycle, sla: form.sla, manager: form.manager, commission: form.commission, status: "active", description: form.description.trim() });
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Create Service</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"><X size={16} /></button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Name */}
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Service Name *</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Mobile App Development"
              className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? "border-red-400" : "border-slate-200"}`} />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Category */}
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Category *</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                {serviceCategories.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            {/* Type */}
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Service Type *</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                {serviceTypes.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Base Price */}
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Base Price (LKR) *</label>
              <input type="number" min="0" value={form.basePrice} onChange={e => setForm(f => ({ ...f, basePrice: e.target.value }))}
                placeholder="0"
                className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.basePrice ? "border-red-400" : "border-slate-200"}`} />
              {errors.basePrice && <p className="text-xs text-red-500 mt-1">{errors.basePrice}</p>}
            </div>
            {/* Billing Cycle */}
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Billing Cycle *</label>
              <select value={form.billingCycle} onChange={e => setForm(f => ({ ...f, billingCycle: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                {billingCycles.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* SLA */}
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">SLA</label>
              <select value={form.sla} onChange={e => setForm(f => ({ ...f, sla: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                {slaOptions.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            {/* Manager */}
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Service Manager</label>
              <select value={form.manager} onChange={e => setForm(f => ({ ...f, manager: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                {managers.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Description *</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3} placeholder="Describe the service offering..."
              className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${errors.description ? "border-red-400" : "border-slate-200"}`} />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>

          {/* Commission toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div className={`w-10 h-5 rounded-full transition-colors relative ${form.commission ? "bg-blue-600" : "bg-slate-200"}`}
              onClick={() => setForm(f => ({ ...f, commission: !f.commission }))}>
              <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all shadow ${form.commission ? "left-5" : "left-0.5"}`} />
            </div>
            <span className="text-sm text-slate-700">Commission eligible</span>
          </label>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-5 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors">Create Service</button>
        </div>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [services, setServices] = useState(initialServices);
  const [showCreate, setShowCreate] = useState(false);
  const [feedback, setFeedback] = useState<ActionFeedbackData | null>(null);

  const filtered = services.filter(s => {
    const matchCat = category === "All" || s.category === category;
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  function handleCreate(svc: Service) {
    setServices(prev => [...prev, svc]);
    setShowCreate(false);
    setFeedback({ type: "success", title: "Service Created", message: `${svc.name} has been added to the service catalog.`, ref: svc.id, refLabel: "Service ID" });
  }

  return (
    <>
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Services</h2>
            <p className="text-sm text-slate-500 mt-0.5">IT service catalog · {services.length} active services</p>
          </div>
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors font-medium">
            <Plus size={14} /> Create Service
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Total Services", value: services.length, icon: Tag, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Subscription", value: services.filter(s => s.billingCycle === "Monthly").length, icon: Clock, color: "text-violet-600", bg: "bg-violet-50" },
            { label: "Commission-eligible", value: services.filter(s => s.commission).length, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Active", value: services.filter(s => s.status === "active").length, icon: CheckCircle, color: "text-teal-600", bg: "bg-teal-50" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
              <div className={`${s.bg} p-2 rounded-lg`}><s.icon size={16} className={s.color} /></div>
              <div>
                <p className="text-xs text-slate-500">{s.label}</p>
                <p className={`text-xl font-bold ${s.color}`} style={{ fontFamily: "var(--font-display)" }}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex flex-wrap gap-1.5">
            {serviceCategories.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${category === c ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300"}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="relative ml-auto">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search services..." className="pl-7 pr-3 py-2 text-sm border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-48" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(s => (
            <div key={s.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">{s.category}</span>
                  <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{s.type}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <StatusBadge status={s.status} size="sm" />
                  <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 rounded-lg transition-all"><MoreHorizontal size={14} className="text-slate-400" /></button>
                </div>
              </div>
              <h3 className="font-bold text-slate-900 text-sm leading-snug" style={{ fontFamily: "var(--font-display)" }}>{s.name}</h3>
              <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{s.description}</p>
              <div className="mt-4 grid grid-cols-3 gap-3 pt-3 border-t border-slate-100">
                <div>
                  <p className="text-[10px] text-slate-400">Base Price</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">LKR {(s.basePrice/1000).toFixed(0)}K</p>
                  <p className="text-[10px] text-slate-400">{s.billingCycle}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">SLA</p>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">{s.sla}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">Commission</p>
                  <p className={`text-xs font-semibold mt-0.5 ${s.commission ? "text-emerald-600" : "text-slate-400"}`}>{s.commission ? "Eligible" : "N/A"}</p>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">{s.id}</span>
                <span className="text-[10px] text-slate-500">Manager: {s.manager.split(" ")[0]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCreate && <CreateServiceModal onClose={() => setShowCreate(false)} onSave={handleCreate} />}
      <ActionFeedback data={feedback} onDismiss={() => setFeedback(null)} />
    </>
  );
}
