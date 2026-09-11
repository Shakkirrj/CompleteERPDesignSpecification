import { useState, useEffect, useRef } from "react";
import { Search, CheckCircle, XCircle, AlertCircle, Users, CalendarDays, Download, Clock, MapPin, LogIn, LogOut, X, Plus } from "lucide-react";
import Avatar from "../../components/ui/Avatar";
import StatusBadge from "../../components/ui/StatusBadge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { attendanceData } from "../../data/mockData";

interface AttendanceRecord {
  emp: string;
  id: string;
  dept: string;
  checkIn: string;
  checkOut: string;
  hours: string;
  status: string;
  manual?: boolean;
}

const initialRecords: AttendanceRecord[] = [
  { emp: "Kavinda Perera",           id: "EMP001", dept: "Engineering", checkIn: "08:47", checkOut: "—",    hours: "—",     status: "present" },
  { emp: "Dilshan Fernando",         id: "EMP002", dept: "Engineering", checkIn: "09:15", checkOut: "—",    hours: "—",     status: "late"    },
  { emp: "Chamara Wickramasinghe",   id: "EMP004", dept: "Sales",       checkIn: "08:30", checkOut: "—",    hours: "—",     status: "present" },
  { emp: "Nishani Silva",            id: "EMP005", dept: "Design",      checkIn: "08:55", checkOut: "—",    hours: "—",     status: "present" },
  { emp: "Rajith Kumara",            id: "EMP006", dept: "Finance",     checkIn: "08:28", checkOut: "—",    hours: "—",     status: "present" },
  { emp: "Amali De Silva",           id: "EMP007", dept: "HR",          checkIn: "09:02", checkOut: "—",    hours: "—",     status: "late"    },
  { emp: "Sameera Bandara",          id: "EMP008", dept: "Engineering", checkIn: "08:40", checkOut: "—",    hours: "—",     status: "present" },
  { emp: "Tharaka Ranatunga",        id: "EMP009", dept: "Support",     checkIn: "—",     checkOut: "—",    hours: "—",     status: "on-leave"},
  { emp: "Ishara Madushani",         id: "EMP010", dept: "Marketing",   checkIn: "—",     checkOut: "—",    hours: "—",     status: "absent"  },
];

const allEmployees = [
  "Kavinda Perera (EMP001)", "Dilshan Fernando (EMP002)", "Chamara Wickramasinghe (EMP004)",
  "Nishani Silva (EMP005)", "Rajith Kumara (EMP006)", "Amali De Silva (EMP007)",
  "Sameera Bandara (EMP008)", "Tharaka Ranatunga (EMP009)", "Ishara Madushani (EMP010)",
];

type CheckState = "idle" | "loading-in" | "checkedin" | "loading-out" | "checkedout";
type AnimPhase = "none" | "enter" | "hold" | "exit";

function calcHours(checkIn: string, checkOut: string): string {
  if (checkIn === "—" || checkOut === "—") return "—";
  const [ih, im] = checkIn.split(":").map(Number);
  const [oh, om] = checkOut.split(":").map(Number);
  const mins = (oh * 60 + om) - (ih * 60 + im);
  if (mins <= 0) return "—";
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

/* ── Success overlay ── */
function SuccessOverlay({ type, time, onDone }: { type: "in" | "out"; time: string; onDone: () => void }) {
  const [phase, setPhase] = useState<AnimPhase>("enter");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => setPhase("exit"), 2200);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  useEffect(() => {
    if (phase === "exit") {
      const t = setTimeout(onDone, 380);
      return () => clearTimeout(t);
    }
  }, [phase, onDone]);

  const isIn = type === "in";
  const color = isIn ? "#059669" : "#F97316";
  const bg    = isIn ? "from-emerald-600 to-emerald-500" : "from-orange-500 to-orange-400";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${phase === "exit" ? "att-overlay-exit" : "att-overlay-enter"}`}
      style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)" }}
    >
      <div className={`relative flex flex-col items-center ${phase === "exit" ? "att-card-exit" : "att-card-enter"}`}>
        {/* Pulse rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="att-ring1 absolute w-28 h-28 rounded-full border-2" style={{ borderColor: color }} />
          <div className="att-ring2 absolute w-28 h-28 rounded-full border" style={{ borderColor: color }} />
        </div>

        {/* Circle with checkmark */}
        <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${bg} flex items-center justify-center shadow-2xl`}>
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <polyline
              className="att-check"
              points="12,28 23,40 44,16"
              stroke="white"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>

        {/* Text */}
        <p className="att-title mt-5 text-white text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
          {isIn ? "Checked In!" : "Checked Out!"}
        </p>
        <p className="att-sub mt-1.5 text-white/80 text-sm font-medium tabular-nums">{time}</p>
        {isIn && (
          <p className="att-sub mt-1 text-white/60 text-xs">You are marked present for today</p>
        )}
      </div>
    </div>
  );
}

/* ── Manual Entry Modal ── */
function ManualEntryModal({ onClose, onSave }: { onClose: () => void; onSave: (r: AttendanceRecord) => void }) {
  const today = new Date().toISOString().slice(0, 10);
  const [employee, setEmployee] = useState("");
  const [date, setDate] = useState(today);
  const [checkIn, setCheckIn] = useState("08:30");
  const [checkOut, setCheckOut] = useState("17:30");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("present");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    if (!employee) return;
    const name = employee.split(" (")[0];
    const id   = (employee.match(/\(([^)]+)\)/) || [])[1] ?? "EMP???";
    const depts: Record<string, string> = {
      EMP001:"Engineering", EMP002:"Engineering", EMP004:"Sales",
      EMP005:"Design", EMP006:"Finance", EMP007:"HR",
      EMP008:"Engineering", EMP009:"Support", EMP010:"Marketing",
    };
    const hours = calcHours(checkIn, checkOut);
    onSave({ emp: name, id, dept: depts[id] ?? "—", checkIn, checkOut, hours, status, manual: true });
    setSaved(true);
    setTimeout(onClose, 900);
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Manual Attendance Entry</h3>
            <p className="text-xs text-slate-500 mt-0.5">Add or correct an attendance record</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <X size={16} className="text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Employee */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Employee <span className="text-red-500">*</span></label>
            <select
              value={employee}
              onChange={e => setEmployee(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">— Select employee —</option>
              {allEmployees.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Date <span className="text-red-500">*</span></label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              max={today}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Times */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                <LogIn size={13} className="inline mr-1 text-emerald-600" />Check-in Time
              </label>
              <input
                type="time"
                value={checkIn}
                onChange={e => setCheckIn(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                <LogOut size={13} className="inline mr-1 text-orange-500" />Check-out Time
              </label>
              <input
                type="time"
                value={checkOut}
                onChange={e => setCheckOut(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          {/* Calculated hours preview */}
          {checkIn && checkOut && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 flex items-center justify-between">
              <span className="text-xs text-slate-500">Calculated working hours</span>
              <span className="text-sm font-bold text-slate-800 font-mono">{calcHours(checkIn, checkOut)}</span>
            </div>
          )}

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Attendance Status</label>
            <div className="flex gap-2 flex-wrap">
              {[
                { v: "present", label: "Present", color: "border-emerald-300 bg-emerald-50 text-emerald-700" },
                { v: "late",    label: "Late",    color: "border-amber-300 bg-amber-50 text-amber-700" },
                { v: "absent",  label: "Absent",  color: "border-red-300 bg-red-50 text-red-700" },
                { v: "on-leave",label: "Leave",   color: "border-violet-300 bg-violet-50 text-violet-700" },
              ].map(opt => (
                <button
                  key={opt.v}
                  type="button"
                  onClick={() => setStatus(opt.v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all ${status === opt.v ? opt.color : "border-slate-200 bg-white text-slate-500"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Reason / Note</label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="e.g. Forgot to check in, system error, field visit..."
              rows={2}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex gap-2">
          <button onClick={onClose} className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium py-2.5 rounded-xl transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!employee || saved}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {saved ? <><CheckCircle size={14} /> Saved!</> : <><Plus size={14} /> Save Entry</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState<"today" | "history" | "calendar">("today");
  const [checkState, setCheckState] = useState<CheckState>("idle");
  const [checkInTime,  setCheckInTime]  = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [animType,  setAnimType]  = useState<"in" | "out">("in");
  const [showAnim,  setShowAnim]  = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [records, setRecords] = useState<AttendanceRecord[]>(initialRecords);
  const [liveTime, setLiveTime] = useState(() =>
    new Date().toLocaleTimeString("en-LK", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })
  );

  // Live clock tick
  useEffect(() => {
    const t = setInterval(() => {
      setLiveTime(new Date().toLocaleTimeString("en-LK", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const dateStr = new Date().toLocaleDateString("en-LK", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  function doCheckIn() {
    setCheckState("loading-in");
    setTimeout(() => {
      const t = new Date().toLocaleTimeString("en-LK", { hour: "2-digit", minute: "2-digit", hour12: true });
      setCheckInTime(t);
      setCheckState("checkedin");
      setAnimType("in");
      setShowAnim(true);
    }, 700);
  }

  function doCheckOut() {
    setCheckState("loading-out");
    setTimeout(() => {
      const t = new Date().toLocaleTimeString("en-LK", { hour: "2-digit", minute: "2-digit", hour12: true });
      setCheckOutTime(t);
      setCheckState("checkedout");
      setAnimType("out");
      setShowAnim(true);
    }, 700);
  }

  function handleManualSave(r: AttendanceRecord) {
    setRecords(prev => {
      const idx = prev.findIndex(p => p.id === r.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = r;
        return updated;
      }
      return [r, ...prev];
    });
  }

  const isLoadingIn  = checkState === "loading-in";
  const isLoadingOut = checkState === "loading-out";

  return (
    <>
      {/* Success animation overlay */}
      {showAnim && (
        <SuccessOverlay
          type={animType}
          time={animType === "in" ? checkInTime : checkOutTime}
          onDone={() => setShowAnim(false)}
        />
      )}

      {/* Manual entry modal */}
      {showManual && (
        <ManualEntryModal
          onClose={() => setShowManual(false)}
          onSave={(r) => { handleManualSave(r); setShowManual(false); }}
        />
      )}

      <div className="p-6 space-y-5">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Attendance</h2>
            <p className="text-sm text-slate-500 mt-0.5">{dateStr}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 text-sm border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors">
              <Download size={14} /> Export
            </button>
            <button
              onClick={() => setShowManual(true)}
              className="flex items-center gap-2 text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors font-medium"
            >
              <Plus size={14} /> Manual Entry
            </button>
          </div>
        </div>

        {/* ── CHECK IN / OUT PANEL ── */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
            {/* Live clock */}
            <div className="flex-shrink-0">
              <p className="text-3xl font-bold text-slate-900 tabular-nums" style={{ fontFamily: "var(--font-display)" }}>{liveTime}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin size={12} className="text-slate-400" />
                <span className="text-xs text-slate-500">Colombo HQ · Sri Lanka</span>
              </div>
            </div>

            <div className="hidden md:block h-12 w-px bg-slate-100" />

            {/* Status text */}
            <div className="flex-1">
              {checkState === "idle" && (
                <div>
                  <p className="text-sm font-semibold text-slate-700">You haven't checked in today</p>
                  <p className="text-xs text-slate-400 mt-0.5">Standard start time: 08:30 AM</p>
                </div>
              )}
              {(checkState === "loading-in" || checkState === "checkedin") && (
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                    <p className="text-sm font-semibold text-emerald-700">
                      {checkState === "loading-in" ? "Checking in..." : `Checked in at ${checkInTime}`}
                    </p>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">You are marked as present for today</p>
                </div>
              )}
              {(checkState === "loading-out" || checkState === "checkedout") && (
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    {checkState === "loading-out" ? "Checking out..." : `Checked out at ${checkOutTime}`}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Check-in: {checkInTime} · Check-out: {checkState === "checkedout" ? checkOutTime : "…"}
                  </p>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {checkState === "idle" && (
                <button
                  onClick={doCheckIn}
                  disabled={isLoadingIn}
                  className="flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white font-bold px-7 py-3 rounded-xl text-sm transition-all shadow-sm shadow-emerald-200 hover:shadow-md hover:shadow-emerald-200 active:scale-95"
                >
                  <LogIn size={18} />
                  {isLoadingIn ? "Checking In…" : "Check In"}
                </button>
              )}
              {(checkState === "loading-in" || checkState === "checkedin") && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold px-4 py-2.5 rounded-xl text-sm">
                    <CheckCircle size={15} className="text-emerald-600" />
                    {checkState === "loading-in" ? "…" : `Checked In — ${checkInTime}`}
                  </div>
                  {checkState === "checkedin" && (
                    <button
                      onClick={doCheckOut}
                      disabled={isLoadingOut}
                      className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-70 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm active:scale-95"
                    >
                      <LogOut size={15} />
                      Check Out
                    </button>
                  )}
                </div>
              )}
              {(checkState === "loading-out" || checkState === "checkedout") && (
                <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 text-slate-600 font-medium px-4 py-2.5 rounded-xl text-sm">
                  <CheckCircle size={15} className="text-slate-500" />
                  {checkState === "loading-out" ? "Checking out…" : "Completed for today"}
                </div>
              )}
            </div>
          </div>

          {/* Mini timeline */}
          {checkState !== "idle" && checkState !== "loading-in" && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center">
                  <LogIn size={13} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">Check-in</p>
                  <p className="text-xs font-semibold text-slate-700 font-mono">{checkInTime}</p>
                </div>
              </div>
              <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all duration-700"
                  style={{ width: checkState === "checkedout" ? "100%" : "50%" }}
                />
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${checkState === "checkedout" ? "bg-orange-100" : "bg-slate-100"}`}>
                  <LogOut size={13} className={checkState === "checkedout" ? "text-orange-500" : "text-slate-300"} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">Check-out</p>
                  <p className={`text-xs font-semibold font-mono ${checkState === "checkedout" ? "text-slate-700" : "text-slate-300"}`}>
                    {checkState === "checkedout" ? checkOutTime : "—"}
                  </p>
                </div>
              </div>
              {checkState === "checkedout" && checkInTime && checkOutTime && (
                <div className="ml-auto bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2">
                  <p className="text-[10px] text-slate-400">Working Hours</p>
                  <p className="text-sm font-bold text-emerald-700 font-mono">{calcHours(
                    checkInTime.replace(/ AM| PM/, ""),
                    checkOutTime.replace(/ AM| PM/, "")
                  )}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { icon: Users,       label: "Total Staff", value: "61", color: "text-slate-800", bg: "bg-slate-50",   iconColor: "text-slate-500"  },
            { icon: CheckCircle, label: "Present",     value: "46", color: "text-emerald-700", bg: "bg-emerald-50", iconColor: "text-emerald-500" },
            { icon: XCircle,     label: "Absent",      value: "5",  color: "text-red-700",    bg: "bg-red-50",    iconColor: "text-red-500"    },
            { icon: AlertCircle, label: "Late",        value: "3",  color: "text-amber-700",  bg: "bg-amber-50",  iconColor: "text-amber-500"  },
            { icon: CalendarDays,label: "On Leave",    value: "7",  color: "text-violet-700", bg: "bg-violet-50", iconColor: "text-violet-500" },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-xl border border-slate-200 px-4 py-3`}>
              <div className="flex items-center gap-2 mb-1">
                <s.icon size={14} className={s.iconColor} />
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
              <p className={`text-2xl font-bold ${s.color}`} style={{ fontFamily: "var(--font-display)" }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Attendance table */}
          <div className="col-span-12 lg:col-span-8 bg-white rounded-xl border border-slate-200">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
              <div className="flex gap-1">
                {(["today","history","calendar"] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${activeTab === t ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50"}`}
                  >
                    {t === "today" ? "Today" : t === "history" ? "History" : "Calendar"}
                  </button>
                ))}
              </div>
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input placeholder="Search…" className="pl-7 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-40" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-50 bg-slate-50/50">
                    <th className="px-5 py-2.5 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Employee</th>
                    <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Dept</th>
                    <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Check In</th>
                    <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Check Out</th>
                    <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Hours</th>
                    <th className="px-5 py-2.5 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {records.map(r => (
                    <tr key={r.id} className={`hover:bg-slate-50 transition-colors ${r.manual ? "bg-blue-50/30" : ""}`}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar name={r.emp} size="sm" />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="text-sm font-medium text-slate-800">{r.emp}</p>
                              {r.manual && <span className="text-[9px] font-semibold bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">Manual</span>}
                            </div>
                            <p className="text-[10px] text-slate-400 font-mono">{r.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3"><span className="text-xs text-slate-600">{r.dept}</span></td>
                      <td className="px-3 py-3">
                        <span className={`font-mono text-xs font-medium ${r.checkIn !== "—" ? (r.status === "late" ? "text-amber-600" : "text-emerald-600") : "text-slate-300"}`}>
                          {r.checkIn}
                        </span>
                      </td>
                      <td className="px-3 py-3"><span className="font-mono text-xs text-slate-500">{r.checkOut}</span></td>
                      <td className="px-3 py-3"><span className="font-mono text-xs text-slate-500">{r.hours}</span></td>
                      <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Charts */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-3" style={{ fontFamily: "var(--font-display)" }}>This Week</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={attendanceData} barSize={10}>
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "#94A3B8" }} axisLine={false} tickLine={false} width={20} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E2E8F0" }} />
                  <Bar dataKey="present" name="Present" fill="#059669" radius={[2,2,0,0]} stackId="a" />
                  <Bar dataKey="late"    name="Late"    fill="#F59E0B" stackId="a" />
                  <Bar dataKey="absent"  name="Absent"  fill="#DC2626" stackId="a" />
                  <Bar dataKey="leave"   name="Leave"   fill="#8B5CF6" radius={[2,2,0,0]} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-3" style={{ fontFamily: "var(--font-display)" }}>Shift Overview</h3>
              <div className="space-y-2">
                {[
                  { shift: "Morning (8:30–5:30)", count: 48, color: "bg-blue-500" },
                  { shift: "Evening (2:00–10:00)", count: 8, color: "bg-violet-500" },
                  { shift: "Remote", count: 5, color: "bg-teal-500" },
                ].map(s => (
                  <div key={s.shift}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-600">{s.shift}</span>
                      <span className="text-xs font-semibold text-slate-800">{s.count}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full">
                      <div className={`h-full ${s.color} rounded-full`} style={{ width: `${(s.count / 61) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
