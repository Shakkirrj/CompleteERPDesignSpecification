import { useState } from "react";
import { ArrowLeft, Plus, Phone, Mail, Calendar, MessageSquare, CheckSquare, Clock, Filter, User } from "lucide-react";
import Avatar from "../../components/ui/Avatar";

const activityTypes = [
  { id: "call", label: "Call", icon: Phone, color: "bg-blue-100 text-blue-700" },
  { id: "email", label: "Email", icon: Mail, color: "bg-violet-100 text-violet-700" },
  { id: "meeting", label: "Meeting", icon: Calendar, color: "bg-emerald-100 text-emerald-700" },
  { id: "note", label: "Note", icon: MessageSquare, color: "bg-amber-100 text-amber-700" },
  { id: "task", label: "Task", icon: CheckSquare, color: "bg-pink-100 text-pink-700" },
];

const activities = [
  { id: "A001", type: "call", title: "Discovery call with Sampath Bank", contact: "Nuwan Perera", company: "Sampath Bank", owner: "Chamara Wickramasinghe", date: "2025-03-11", time: "10:00", duration: "45 min", status: "completed", notes: "Discussed requirements for core banking upgrade. Positive response. Follow-up scheduled." },
  { id: "A002", type: "email", title: "Sent proposal to John Keells Holdings", contact: "Prasanna Gunawardena", company: "John Keells Holdings", owner: "Priya Jayawardena", date: "2025-03-11", time: "14:30", duration: null, status: "completed", notes: "Proposal doc attached — cloud migration Phase 3 scope included." },
  { id: "A003", type: "meeting", title: "Onsite demo — MAS Holdings HQ", contact: "Ruwan Bandara", company: "MAS Holdings", owner: "Priya Jayawardena", date: "2025-03-12", time: "09:00", duration: "2 hrs", status: "upcoming", notes: "Boardroom booked. Bring demo laptop and backup USB." },
  { id: "A004", type: "task", title: "Prepare custom pricing for NDB Bank", contact: "Thilina Abeysekara", company: "NDB Bank", owner: "Chamara Wickramasinghe", date: "2025-03-12", time: "17:00", duration: null, status: "pending", notes: "Finance team to sign off before sending." },
  { id: "A005", type: "note", title: "Competitor spotted at Dialog event", contact: "Kavinda Pathirana", company: "Dialog Axiata PLC", owner: "Priya Jayawardena", date: "2025-03-10", time: "16:00", duration: null, status: "completed", notes: "Saw SysLead at Dialog Tech Forum. Dialog CTO expressed interest in our AI module." },
  { id: "A006", type: "call", title: "Follow-up call — Brandix IT team", contact: "Madushika Seneviratne", company: "Brandix Lanka", owner: "Chamara Wickramasinghe", date: "2025-03-13", time: "11:00", duration: "30 min", status: "upcoming", notes: "" },
  { id: "A007", type: "meeting", title: "Contract negotiation — Hayleys", contact: "Dilini Jayasinghe", company: "Hayleys Group", owner: "Chamara Wickramasinghe", date: "2025-03-14", time: "15:00", duration: "1.5 hrs", status: "upcoming", notes: "Legal team to join. Review pricing and SLA clauses." },
  { id: "A008", type: "email", title: "Thank-you email after Lion Brewery win", contact: "Asanka Fernando", company: "Lion Brewery", owner: "Priya Jayawardena", date: "2025-03-09", time: "09:15", duration: null, status: "completed", notes: "Deal officially signed. Onboarding kickoff next Monday." },
];

const STATUS_COLORS: Record<string, string> = {
  completed: "bg-emerald-50 text-emerald-700",
  upcoming: "bg-blue-50 text-blue-700",
  pending: "bg-amber-50 text-amber-700",
  overdue: "bg-red-50 text-red-700",
};

interface Props { onBack: () => void; }

export default function CRMActivitiesPage({ onBack }: Props) {
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [newActivity, setNewActivity] = useState({ type: "call", title: "", contact: "", company: "", date: "", time: "", notes: "" });

  const filtered = activities.filter(a => filter === "all" || a.type === filter || a.status === filter);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Activities</h2>
          <p className="text-sm text-slate-500 mt-0.5">{activities.filter(a => a.status === "upcoming").length} upcoming · {activities.filter(a => a.status === "completed").length} completed</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors font-medium">
          <Plus size={14} /> Log Activity
        </button>
      </div>

      {/* Activity type pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={() => setFilter("all")} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === "all" ? "bg-slate-800 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>All</button>
        {activityTypes.map(t => (
          <button key={t.id} onClick={() => setFilter(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === t.id ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
            <t.icon size={11} />{t.label}
          </button>
        ))}
        <div className="ml-auto flex gap-1.5">
          {["upcoming", "completed", "pending"].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${filter === s ? STATUS_COLORS[s] + " ring-1 ring-current ring-opacity-30" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        {filtered.map(a => {
          const typeConfig = activityTypes.find(t => t.id === a.type)!;
          const Icon = typeConfig.icon;
          return (
            <div key={a.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition-all group">
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${typeConfig.color}`}>
                  <Icon size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{a.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <User size={10} />{a.contact}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs text-blue-600">{a.company}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[a.status]}`}>{a.status}</span>
                    </div>
                  </div>
                  {a.notes && (
                    <p className="text-xs text-slate-500 mt-2 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">{a.notes}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Calendar size={9} />{a.date} {a.time}
                    </span>
                    {a.duration && (
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock size={9} />{a.duration}
                      </span>
                    )}
                    <div className="ml-auto">
                      <Avatar name={a.owner} size="xs" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 py-12 text-center text-slate-400">
            <p className="text-sm">No activities match this filter</p>
          </div>
        )}
      </div>

      {/* Log Activity Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-display)" }}>Log Activity</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Activity Type</label>
                <div className="flex gap-2 flex-wrap">
                  {activityTypes.map(t => (
                    <button key={t.id} onClick={() => setNewActivity(p => ({ ...p, type: t.id }))}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${newActivity.type === t.id ? "bg-blue-600 text-white border-blue-600" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                      <t.icon size={11} />{t.label}
                    </button>
                  ))}
                </div>
              </div>
              {[
                { key: "title", label: "Title", placeholder: "Activity summary" },
                { key: "contact", label: "Contact Person", placeholder: "Full name" },
                { key: "company", label: "Company", placeholder: "Company name" },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{f.label}</label>
                  <input placeholder={f.placeholder} value={(newActivity as Record<string, string>)[f.key]}
                    onChange={e => setNewActivity(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Date</label>
                  <input type="date" value={newActivity.date} onChange={e => setNewActivity(p => ({ ...p, date: e.target.value }))}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Time</label>
                  <input type="time" value={newActivity.time} onChange={e => setNewActivity(p => ({ ...p, time: e.target.value }))}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Notes</label>
                <textarea rows={3} value={newActivity.notes} onChange={e => setNewActivity(p => ({ ...p, notes: e.target.value }))}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">Save Activity</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
