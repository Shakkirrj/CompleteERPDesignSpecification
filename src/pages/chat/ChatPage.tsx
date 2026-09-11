import { useState, useRef, useEffect } from "react";
import { useCallAudio } from "../../hooks/useCallAudio";
import {
  Search, MoreHorizontal, Paperclip, Smile, Mic, Send, Phone, Video, Info,
  Image as ImageIcon, Reply as ReplyIcon, Copy, Pin, Download, X,
  Hash, CheckCheck, Check, Users, ChevronRight, Plus, Play, Pause,
  MicOff, VideoOff, PhoneOff, Volume2, VolumeX, Maximize2, Monitor,
  UserPlus, Camera, Minimize2, Grid3X3, MessageSquare, Settings,
  Signal, Wifi, Clock, ChevronDown, CheckCircle,
} from "lucide-react";
import Avatar from "../../components/ui/Avatar";

/* ─── types ─── */
type MsgType   = "text" | "file" | "voice" | "system";
type MsgStatus = "sending" | "sent" | "delivered" | "read";
type CallType  = "audio" | "video";
type CallState = "ringing" | "connected" | "ended";

interface Message {
  id: string; from: string; fromId: string; type: MsgType;
  text?: string;
  file?: { name: string; size: string; ext: string };
  voice?: { duration: string };
  system?: string;
  time: string; status?: MsgStatus;
  reactions?: Record<string, number>;
  self?: boolean;
}

interface Conversation {
  id: string; name: string;
  kind: "direct" | "group" | "department" | "team" | "project";
  participants: string[]; unread: number; online?: boolean;
  lastMsg: string; lastTime: string;
  designation?: string; dept?: string; muted?: boolean;
  avatar?: string;
}

/* ─── mock employees for group creation ─── */
const allEmployees = [
  { id: "EMP001", name: "Kavinda Perera",         dept: "Engineering", designation: "Lead Engineer",     online: true  },
  { id: "EMP002", name: "Dilshan Fernando",        dept: "Engineering", designation: "Senior Developer",  online: true  },
  { id: "EMP004", name: "Chamara Wickramasinghe",  dept: "Sales",       designation: "Sales Executive",   online: false },
  { id: "EMP005", name: "Nishani Silva",           dept: "Design",      designation: "UI Designer",       online: true  },
  { id: "EMP006", name: "Rajith Kumara",           dept: "Finance",     designation: "Finance Analyst",   online: false },
  { id: "EMP007", name: "Amali De Silva",          dept: "HR",          designation: "HR Officer",        online: false },
  { id: "EMP008", name: "Sameera Bandara",         dept: "Engineering", designation: "DevOps Engineer",   online: true  },
  { id: "EMP009", name: "Tharaka Ranatunga",       dept: "Support",     designation: "Support Engineer",  online: false },
  { id: "EMP010", name: "Ishara Madushani",        dept: "Marketing",   designation: "Marketing Lead",    online: false },
  { id: "EMP003", name: "Priya Jayawardena",       dept: "Sales",       designation: "Sales Manager",     online: true  },
];

/* ─── mock conversations ─── */
const initialConversations: Conversation[] = [
  { id: "c1", kind: "direct",     name: "Kavinda Perera",         participants: ["EMP001"],                    unread: 2, online: true,  lastMsg: "Deployment done ✓",     lastTime: "10:45",    designation: "Lead Engineer",    dept: "Engineering" },
  { id: "c2", kind: "direct",     name: "Priya Jayawardena",      participants: ["EMP003"],                    unread: 0, online: true,  lastMsg: "Client confirmed 2 PM", lastTime: "09:30",    designation: "Sales Manager",    dept: "Sales"       },
  { id: "c3", kind: "group",      name: "ERP Dev Team",           participants: ["EMP001","EMP008","EMP002"],  unread: 5, online: false, lastMsg: "Sameera: PR reviewed",  lastTime: "09:12"                                                    },
  { id: "c4", kind: "department", name: "Engineering Dept",       participants: ["EMP001","EMP002","EMP008"],  unread: 0, online: false, lastMsg: "Sprint review at 3 PM", lastTime: "Yesterday"                                                  },
  { id: "c5", kind: "project",    name: "Sampath Bank ERP",       participants: ["EMP002","EMP001","EMP003"],  unread: 1, online: false, lastMsg: "Priya: Demo prep done", lastTime: "Yesterday"                                                  },
  { id: "c6", kind: "direct",     name: "Amali De Silva",         participants: ["EMP007"],                    unread: 0, online: false, lastMsg: "March batch onboarded", lastTime: "Mar 9",    designation: "HR Officer",       dept: "HR"          },
  { id: "c7", kind: "team",       name: "Infrastructure Team",    participants: ["EMP008","EMP001"],           unread: 0, online: false, lastMsg: "AWS budget reviewed",   lastTime: "Mar 8"                                                      },
];

const mockMessages: Record<string, Message[]> = {
  c1: [
    { id:"m1", from:"Kavinda Perera",  fromId:"EMP001", type:"text",  text:"Hey Dilshan, the production deployment has been completed successfully.", time:"10:30 AM", status:"read" },
    { id:"m2", from:"Me",              fromId:"ME",     type:"text",  text:"Great work! Any issues during the rollout?", time:"10:31 AM", status:"read", self:true },
    { id:"m3", from:"Kavinda Perera",  fromId:"EMP001", type:"text",  text:"No major issues. One minor hiccup with the DB migration script but it resolved automatically. All services healthy now.", time:"10:33 AM", status:"read" },
    { id:"m4", from:"Kavinda Perera",  fromId:"EMP001", type:"file",  file:{name:"deployment_log_v2.4.1.txt", size:"48 KB", ext:"txt"}, time:"10:34 AM", status:"read" },
    { id:"m5", from:"Me",              fromId:"ME",     type:"text",  text:"Perfect. Please send a summary email to the team.", time:"10:38 AM", status:"read", self:true },
    { id:"m6", from:"Kavinda Perera",  fromId:"EMP001", type:"text",  text:"Deployment done ✓", time:"10:45 AM", status:"delivered" },
  ],
  c3: [
    { id:"g1", from:"System", fromId:"SYS", type:"system", system:"Sameera Bandara joined the group", time:"Mar 8" },
    { id:"g2", from:"Sameera Bandara", fromId:"EMP008", type:"text",  text:"Hi team 👋 I've pushed the infrastructure updates to dev branch.", time:"9:05 AM", status:"read" },
    { id:"g3", from:"Me",              fromId:"ME",     type:"text",  text:"Nice. I'll review after standup.", time:"9:08 AM", status:"read", self:true },
    { id:"g4", from:"Sameera Bandara", fromId:"EMP008", type:"voice", voice:{duration:"0:32"}, time:"9:10 AM", status:"read" },
    { id:"g5", from:"Sameera Bandara", fromId:"EMP008", type:"text",  text:"PR reviewed and approved ✅", time:"9:12 AM", status:"read" },
  ],
};

const kindBg = (kind: Conversation["kind"]) => {
  if (kind === "group")      return "bg-violet-500";
  if (kind === "department") return "bg-blue-500";
  if (kind === "team")       return "bg-teal-500";
  if (kind === "project")    return "bg-orange-500";
  return "";
};
const kindIcon = (kind: Conversation["kind"]) => {
  if (kind === "group" || kind === "department" || kind === "team") return <Users size={13} className="text-white" />;
  if (kind === "project") return <Hash size={13} className="text-white" />;
  return null;
};
const fileExt: Record<string, string> = {
  txt:"bg-slate-100 text-slate-600", pdf:"bg-red-100 text-red-600",
  docx:"bg-blue-100 text-blue-600",  xlsx:"bg-emerald-100 text-emerald-600",
  zip:"bg-amber-100 text-amber-600",
};

/* ══════════════════════════════════════════════
   CREATE GROUP MODAL
══════════════════════════════════════════════ */
interface CreateGroupModalProps {
  onClose: () => void;
  onCreate: (conv: Conversation) => void;
}
function CreateGroupModal({ onClose, onCreate }: CreateGroupModalProps) {
  const [step, setStep]         = useState<1 | 2>(1);
  const [groupName, setGroupName] = useState("");
  const [groupType, setGroupType] = useState<"group" | "department" | "team" | "project">("group");
  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);
  const [done, setDone]         = useState(false);

  const filtered = allEmployees.filter(e =>
    e.id !== "EMP002" && // exclude self
    (!search || e.name.toLowerCase().includes(search.toLowerCase()) || e.dept.toLowerCase().includes(search.toLowerCase()))
  );

  function toggle(id: string) {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  }

  function handleCreate() {
    if (!groupName.trim() || selected.length === 0) return;
    setCreating(true);
    setTimeout(() => {
      setDone(true);
      setTimeout(() => {
        const newConv: Conversation = {
          id: `cg${Date.now()}`, kind: groupType, name: groupName.trim(),
          participants: [...selected, "EMP002"],
          unread: 0, online: false,
          lastMsg: "Group created",
          lastTime: new Date().toLocaleTimeString("en-LK", { hour: "2-digit", minute: "2-digit", hour12: true }),
        };
        onCreate(newConv);
        onClose();
      }, 800);
    }, 1000);
  }

  const typeOptions: { value: "group" | "department" | "team" | "project"; label: string; color: string; desc: string }[] = [
    { value: "group",      label: "Group Chat",      color: "border-violet-300 bg-violet-50 text-violet-700",  desc: "General group for any topic" },
    { value: "team",       label: "Team",            color: "border-teal-300 bg-teal-50 text-teal-700",        desc: "Team-specific communication" },
    { value: "department", label: "Department",      color: "border-blue-300 bg-blue-50 text-blue-700",        desc: "Department-wide broadcast" },
    { value: "project",    label: "Project Channel", color: "border-orange-300 bg-orange-50 text-orange-700",  desc: "Linked to a project workspace" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col" style={{ maxHeight: "88vh" }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            {step === 2 && (
              <button onClick={() => setStep(1)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500">
                <ChevronDown className="rotate-90" size={15} />
              </button>
            )}
            <div>
              <h3 className="font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
                {step === 1 ? "New Group" : "Add Members"}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {step === 1 ? "Set group details" : `${selected.length} selected`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Step indicator */}
            <div className="flex items-center gap-1">
              {[1,2].map(n => (
                <div key={n} className={`w-6 h-1.5 rounded-full transition-colors ${step >= n ? "bg-blue-600" : "bg-slate-200"}`} />
              ))}
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl ml-2"><X size={15} className="text-slate-500" /></button>
          </div>
        </div>

        {/* Step 1 — Details */}
        {step === 1 && (
          <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1">
            {/* Avatar placeholder */}
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center cursor-pointer group relative ${kindBg(groupType)}`}>
                {kindIcon(groupType) ? <div className="scale-150">{kindIcon(groupType)}</div> : <Users size={22} className="text-white" />}
                <div className="absolute inset-0 bg-black/30 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Camera size={16} className="text-white" />
                </div>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Group Name <span className="text-red-500">*</span></label>
                <input
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}
                  placeholder="e.g. Project Alpha Team"
                  autoFocus
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Group type */}
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">Group Type</label>
              <div className="grid grid-cols-2 gap-2">
                {typeOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setGroupType(opt.value)}
                    className={`flex flex-col items-start p-3 rounded-xl border-2 text-left transition-all ${groupType === opt.value ? opt.color : "border-slate-200 bg-white hover:border-slate-300"}`}
                  >
                    <span className="text-xs font-bold">{opt.label}</span>
                    <span className="text-[10px] mt-0.5 opacity-70">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Description <span className="text-slate-400 font-normal">(optional)</span></label>
              <textarea rows={2} placeholder="What is this group for?" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
          </div>
        )}

        {/* Step 2 — Add Members */}
        {step === 2 && (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Selected chips */}
            {selected.length > 0 && (
              <div className="flex gap-2 flex-wrap px-5 py-3 border-b border-slate-100 flex-shrink-0">
                {selected.map(id => {
                  const emp = allEmployees.find(e => e.id === id)!;
                  return (
                    <div key={id} className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                      <Avatar name={emp.name} size="xs" />
                      <span>{emp.name.split(" ")[0]}</span>
                      <button onClick={() => toggle(id)} className="hover:text-red-500 ml-0.5"><X size={11} /></button>
                    </div>
                  );
                })}
              </div>
            )}
            {/* Search */}
            <div className="px-5 py-3 border-b border-slate-100 flex-shrink-0">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search employees..."
                  autoFocus
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {/* Employee list */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
              {filtered.map(emp => {
                const isSelected = selected.includes(emp.id);
                return (
                  <div
                    key={emp.id}
                    onClick={() => toggle(emp.id)}
                    className={`flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors ${isSelected ? "bg-blue-50" : "hover:bg-slate-50"}`}
                  >
                    <div className="relative flex-shrink-0">
                      <Avatar name={emp.name} size="sm" />
                      {emp.online && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800">{emp.name}</p>
                      <p className="text-[11px] text-slate-400">{emp.designation} · {emp.dept}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${isSelected ? "border-blue-600 bg-blue-600" : "border-slate-300"}`}>
                      {isSelected && <Check size={11} className="text-white" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between flex-shrink-0 bg-slate-50/50">
          <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-700 px-4 py-2 hover:bg-slate-100 rounded-xl transition-colors">
            Cancel
          </button>
          {step === 1 ? (
            <button
              onClick={() => setStep(2)}
              disabled={!groupName.trim()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              Next — Add Members <ChevronRight size={14} />
            </button>
          ) : (
            <button
              onClick={handleCreate}
              disabled={selected.length === 0 || creating}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors min-w-[140px] justify-center"
            >
              {done ? <><CheckCircle size={14} /> Created!</>
                : creating ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating…</>
                : <><Users size={14} /> Create Group</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   VOICE CALL SCREEN
══════════════════════════════════════════════ */
interface CallScreenProps {
  conv: Conversation;
  type: CallType;
  onEnd: () => void;
}
function CallScreen({ conv, type, onEnd }: CallScreenProps) {
  const [callState, setCallState]       = useState<CallState>("ringing");
  const [elapsed, setElapsed]           = useState(0);
  const [micMuted, setMicMuted]         = useState(false);
  const [speakerMuted, setSpeakerMuted] = useState(false);
  const [camOff, setCamOff]             = useState(false);
  const [screenShare, setScreenShare]   = useState(false);
  const [minimized, setMinimized]       = useState(false);
  const [fullscreen, setFullscreen]     = useState(false);
  const [gridView, setGridView]         = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Ringtones via Web Audio API ──
  // Outgoing dial tone plays while ringing, stops when connected or ended
  useCallAudio("outgoing", callState === "ringing");

  const isGroup = conv.kind !== "direct";
  const participants = isGroup
    ? conv.participants.slice(0, 4).map(id => allEmployees.find(e => e.id === id)?.name ?? id)
    : [conv.name];

  useEffect(() => {
    const t = setTimeout(() => setCallState("connected"), 2500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (callState === "connected") {
      timerRef.current = setInterval(() => setElapsed(s => s + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [callState]);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  function endCall() {
    setCallState("ended");
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeout(onEnd, 1200);
  }

  if (type === "audio") {
    /* ── Audio call ── */
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" }}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="absolute rounded-full border border-white/30"
              style={{ width: `${(i + 1) * 18}%`, height: `${(i + 1) * 18}%`, top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                animation: callState === "ringing" ? `att-ring1 ${1.5 + i * 0.3}s ease-out ${i * 0.2}s infinite` : "none" }} />
          ))}
        </div>

        <div className="relative flex flex-col items-center text-center z-10">
          {/* Avatar */}
          <div className="relative mb-6">
            {callState === "ringing" && (
              <>
                <div className="absolute inset-0 -m-6 rounded-full border-2 border-white/20 animate-ping" />
                <div className="absolute inset-0 -m-12 rounded-full border border-white/10 animate-ping" style={{ animationDelay: "0.3s" }} />
              </>
            )}
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-4xl font-bold shadow-2xl shadow-blue-500/30" style={{ fontFamily: "var(--font-display)" }}>
              {conv.name[0]}
            </div>
          </div>

          <h2 className="text-white text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-display)" }}>{conv.name}</h2>
          <p className="text-slate-300 text-sm mb-1">
            {callState === "ringing"   ? "Calling…"
              : callState === "connected" ? fmt(elapsed)
              : "Call ended"}
          </p>

          {callState === "ringing" && (
            <div className="flex items-center gap-1.5 mt-1">
              <Signal size={12} className="text-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-xs font-medium">MernCrest Encrypted</span>
            </div>
          )}
          {callState === "connected" && (
            <div className="flex items-center gap-1.5 mt-1">
              <Wifi size={12} className="text-emerald-400" />
              <span className="text-emerald-400 text-xs">HD · Encrypted</span>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-4 mt-10">
            <div className="flex flex-col items-center gap-2">
              <button onClick={() => setSpeakerMuted(m => !m)} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${speakerMuted ? "bg-red-500/30 border-2 border-red-500" : "bg-white/10 hover:bg-white/20"}`}>
                {speakerMuted ? <VolumeX size={22} className="text-red-400" /> : <Volume2 size={22} className="text-white" />}
              </button>
              <span className="text-[10px] text-white/60">{speakerMuted ? "Unmute" : "Speaker"}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <button onClick={() => setMicMuted(m => !m)} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${micMuted ? "bg-red-500/30 border-2 border-red-500" : "bg-white/10 hover:bg-white/20"}`}>
                {micMuted ? <MicOff size={22} className="text-red-400" /> : <Mic size={22} className="text-white" />}
              </button>
              <span className="text-[10px] text-white/60">{micMuted ? "Unmute" : "Mute"}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <button onClick={endCall} className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-all shadow-lg shadow-red-600/40 active:scale-95">
                <PhoneOff size={26} className="text-white" />
              </button>
              <span className="text-[10px] text-white/60">End</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <button className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
                <MessageSquare size={22} className="text-white" />
              </button>
              <span className="text-[10px] text-white/60">Chat</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <button className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
                <UserPlus size={22} className="text-white" />
              </button>
              <span className="text-[10px] text-white/60">Add</span>
            </div>
          </div>

          {callState === "ended" && (
            <p className="mt-6 text-slate-400 text-sm">Call ended · {fmt(elapsed)}</p>
          )}
        </div>
      </div>
    );
  }

  /* ── Video call ── */
  const tileColors = ["from-violet-600 to-blue-500", "from-teal-600 to-emerald-500", "from-orange-500 to-red-500", "from-pink-600 to-violet-500"];

  return (
    <div className={`fixed inset-0 z-50 bg-slate-900 flex flex-col overflow-hidden ${fullscreen ? "" : ""}`}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-slate-900/90 backdrop-blur border-b border-white/5 flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${callState === "connected" ? "bg-emerald-500 animate-pulse" : "bg-amber-500 animate-pulse"}`} />
          <div>
            <p className="text-white text-sm font-semibold">{conv.name}</p>
            <p className="text-slate-400 text-xs">
              {callState === "ringing" ? "Ringing…" : callState === "connected" ? fmt(elapsed) : "Call ended"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {callState === "connected" && (
            <>
              <div className="flex items-center gap-1 bg-white/10 rounded-lg px-2.5 py-1">
                <Signal size={11} className="text-emerald-400" />
                <span className="text-[10px] text-emerald-400">HD</span>
              </div>
              <div className="flex items-center gap-1 bg-white/10 rounded-lg px-2.5 py-1">
                <Wifi size={11} className="text-white/70" />
                <span className="text-[10px] text-white/70">Encrypted</span>
              </div>
            </>
          )}
          <button onClick={() => setGridView(g => !g)} className={`p-2 rounded-lg transition-colors ${gridView ? "bg-blue-600 text-white" : "bg-white/10 hover:bg-white/20 text-white"}`}>
            <Grid3X3 size={15} />
          </button>
          <button onClick={() => setFullscreen(f => !f)} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">
            {fullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
          <button onClick={endCall} className="p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors">
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Video grid */}
      <div className="flex-1 overflow-hidden relative">
        {callState === "ringing" ? (
          /* Ringing state */
          <div className="h-full flex flex-col items-center justify-center">
            <div className="relative mb-6">
              {[0,1,2].map(i => (
                <div key={i} className="absolute rounded-full border-2 border-white/20 animate-ping"
                  style={{ inset: `-${(i+1)*24}px`, animationDelay: `${i*0.25}s`, animationDuration: "1.5s" }} />
              ))}
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-4xl font-bold shadow-2xl">
                {conv.name[0]}
              </div>
            </div>
            <p className="text-white text-xl font-bold mb-1" style={{ fontFamily: "var(--font-display)" }}>{conv.name}</p>
            <p className="text-slate-400 text-sm">Connecting video call…</p>
          </div>
        ) : gridView || isGroup ? (
          /* Grid view */
          <div className={`h-full p-3 grid gap-3 ${participants.length <= 2 ? "grid-cols-2" : participants.length <= 4 ? "grid-cols-2" : "grid-cols-3"}`}>
            {/* Remote participants */}
            {participants.map((name, i) => (
              <div key={name} className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${tileColors[i % tileColors.length]} flex items-center justify-center`}>
                {/* Fake "video" gradient with noise */}
                <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(ellipse at 30% 40%, rgba(255,255,255,0.15) 0%, transparent 60%)" }} />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold mb-2">{name[0]}</div>
                  <p className="text-white text-xs font-semibold">{name}</p>
                </div>
                {/* Name bar */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                  <span className="text-white text-xs font-medium bg-black/40 backdrop-blur px-2 py-0.5 rounded-full">{name.split(" ")[0]}</span>
                  <div className="w-5 h-5 bg-black/40 backdrop-blur rounded-full flex items-center justify-center">
                    <Mic size={10} className="text-white" />
                  </div>
                </div>
              </div>
            ))}
            {/* Self tile */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-700 flex items-center justify-center">
              {camOff ? (
                <div className="flex flex-col items-center gap-2">
                  <VideoOff size={22} className="text-slate-400" />
                  <p className="text-slate-400 text-xs">Camera off</p>
                </div>
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-600 to-slate-800" />
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold mb-2">D</div>
                  </div>
                </>
              )}
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                <span className="text-white text-xs font-medium bg-black/40 backdrop-blur px-2 py-0.5 rounded-full">You</span>
                {micMuted && <div className="w-5 h-5 bg-red-500/80 rounded-full flex items-center justify-center"><MicOff size={9} className="text-white" /></div>}
              </div>
            </div>
          </div>
        ) : (
          /* 1:1 spotlight view */
          <div className="h-full relative">
            {/* Main remote video */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-800 to-blue-900 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(ellipse at 25% 35%, rgba(139,92,246,0.6) 0%, transparent 50%), radial-gradient(ellipse at 75% 70%, rgba(59,130,246,0.4) 0%, transparent 50%)" }} />
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white text-5xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>{conv.name[0]}</div>
                <p className="text-white text-lg font-bold">{conv.name}</p>
                <p className="text-white/60 text-sm mt-1">{conv.designation ?? ""}</p>
              </div>
              {/* Name badge */}
              <div className="absolute bottom-5 left-5 flex items-center gap-2 bg-black/50 backdrop-blur rounded-xl px-3 py-1.5">
                <span className="text-white text-sm font-medium">{conv.name.split(" ")[0]}</span>
                <Mic size={12} className="text-white/70" />
              </div>
            </div>
            {/* Self PiP */}
            <div className="absolute top-4 right-4 w-36 h-24 rounded-xl overflow-hidden border-2 border-white/20 shadow-xl bg-slate-700">
              {camOff ? (
                <div className="h-full flex flex-col items-center justify-center gap-1">
                  <VideoOff size={16} className="text-slate-400" />
                  <p className="text-[10px] text-slate-400">Off</p>
                </div>
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-600 to-slate-800" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">D</div>
                  </div>
                </>
              )}
              <div className="absolute bottom-1.5 left-2 flex items-center gap-1">
                <span className="text-white text-[9px] bg-black/50 px-1.5 py-0.5 rounded-full">You</span>
                {micMuted && <MicOff size={8} className="text-red-400" />}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div className="flex-shrink-0 bg-slate-900/95 backdrop-blur border-t border-white/5 py-4 px-6">
        <div className="flex items-center justify-between max-w-xl mx-auto">
          {/* Left controls */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-1">
              <button onClick={() => setMicMuted(m => !m)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${micMuted ? "bg-red-600 hover:bg-red-700" : "bg-white/10 hover:bg-white/20"}`}>
                {micMuted ? <MicOff size={18} className="text-white" /> : <Mic size={18} className="text-white" />}
              </button>
              <span className="text-[9px] text-white/50">{micMuted ? "Unmute" : "Mute"}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <button onClick={() => setCamOff(c => !c)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${camOff ? "bg-red-600 hover:bg-red-700" : "bg-white/10 hover:bg-white/20"}`}>
                {camOff ? <VideoOff size={18} className="text-white" /> : <Video size={18} className="text-white" />}
              </button>
              <span className="text-[9px] text-white/50">{camOff ? "Start cam" : "Stop cam"}</span>
            </div>
          </div>

          {/* Centre — end call */}
          <div className="flex flex-col items-center gap-1">
            <button onClick={endCall} className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-all shadow-lg shadow-red-600/40 active:scale-95">
              <PhoneOff size={22} className="text-white" />
            </button>
            {callState === "connected" && <span className="text-[10px] text-white/60 tabular-nums">{fmt(elapsed)}</span>}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-1">
              <button onClick={() => setScreenShare(s => !s)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${screenShare ? "bg-blue-600 hover:bg-blue-700" : "bg-white/10 hover:bg-white/20"}`}>
                <Monitor size={18} className="text-white" />
              </button>
              <span className="text-[9px] text-white/50">{screenShare ? "Sharing" : "Share"}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
                <UserPlus size={18} className="text-white" />
              </button>
              <span className="text-[9px] text-white/50">Add</span>
            </div>
          </div>
        </div>

        {/* Participants strip (group call) */}
        {isGroup && callState === "connected" && (
          <div className="flex items-center justify-center gap-2 mt-3">
            {participants.map((name, i) => (
              <div key={name} className="flex flex-col items-center gap-0.5">
                <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${tileColors[i % tileColors.length]} flex items-center justify-center text-white text-[10px] font-bold`}>{name[0]}</div>
                <span className="text-[8px] text-white/50">{name.split(" ")[0]}</span>
              </div>
            ))}
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">D</div>
              <span className="text-[8px] text-white/50">You</span>
            </div>
          </div>
        )}
      </div>

      {callState === "ended" && (
        <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center z-20">
          <PhoneOff size={40} className="text-red-500 mb-4" />
          <p className="text-white text-lg font-bold">Call Ended</p>
          <p className="text-slate-400 text-sm mt-1">Duration: {fmt(elapsed)}</p>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   VOICE RECORDER + MESSAGE COMPONENTS
══════════════════════════════════════════════ */
/* ══════════════════════════════════════════════
   INCOMING CALL SCREEN
══════════════════════════════════════════════ */
interface IncomingCallProps {
  caller: Conversation;
  type: CallType;
  onAccept: () => void;
  onDecline: () => void;
}
function IncomingCallScreen({ caller, type, onAccept, onDecline }: IncomingCallProps) {
  const [declining, setDeclining] = useState(false);

  // Incoming ringtone — plays until accepted or declined
  useCallAudio("incoming", !declining);

  function handleDecline() {
    setDeclining(true);
    setTimeout(onDecline, 400);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center pb-12 sm:items-center sm:pb-0"
      style={{ background: "rgba(15,23,42,0.75)", backdropFilter: "blur(12px)" }}>
      {/* Card */}
      <div className="w-full max-w-sm mx-4 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
        style={{ background: "linear-gradient(160deg, #1e3a5f 0%, #0f172a 100%)" }}>
        {/* Top section */}
        <div className="px-8 pt-10 pb-6 flex flex-col items-center text-center">
          {/* Pulse rings */}
          <div className="relative mb-6">
            {[1,2,3].map(i => (
              <div key={i}
                className="absolute rounded-full border border-blue-400/30 animate-ping"
                style={{ inset: `-${i * 16}px`, animationDelay: `${i * 0.25}s`, animationDuration: "2s" }}
              />
            ))}
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-blue-500/40 text-white text-4xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
              {caller.name[0]}
            </div>
            {/* Call type badge */}
            <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center border-2 border-slate-900 ${type === "video" ? "bg-violet-500" : "bg-emerald-500"}`}>
              {type === "video" ? <Video size={14} className="text-white" /> : <Phone size={14} className="text-white" />}
            </div>
          </div>

          <p className="text-slate-300 text-sm font-medium mb-1">
            Incoming {type === "video" ? "Video" : "Voice"} Call
          </p>
          <h2 className="text-white text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            {caller.name}
          </h2>
          {caller.designation && (
            <p className="text-slate-400 text-sm mt-1">{caller.designation}</p>
          )}
          {caller.dept && (
            <p className="text-slate-500 text-xs mt-0.5">{caller.dept}</p>
          )}

          {/* Animated sound wave indicator */}
          <div className="flex items-end gap-1 mt-5 h-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i}
                className="w-1 rounded-full bg-blue-400/70"
                style={{
                  height: `${30 + Math.sin(i * 0.9) * 55}%`,
                  animation: `att-ring1 ${0.6 + (i % 3) * 0.15}s ease-in-out ${i * 0.08}s infinite alternate`,
                }}
              />
            ))}
          </div>
          <p className="text-slate-500 text-[11px] mt-2">MernCrest · Encrypted</p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-12 px-8 pb-10 pt-4 border-t border-white/5">
          {/* Decline */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={handleDecline}
              className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-all shadow-lg shadow-red-600/40 active:scale-95"
            >
              <PhoneOff size={24} className="text-white" />
            </button>
            <span className="text-slate-400 text-xs">Decline</span>
          </div>

          {/* Accept */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={onAccept}
              className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center transition-all shadow-lg shadow-emerald-500/40 active:scale-95 animate-bounce"
              style={{ animationDuration: "1.2s" }}
            >
              {type === "video" ? <Video size={24} className="text-white" /> : <Phone size={24} className="text-white" />}
            </button>
            <span className="text-slate-400 text-xs">Accept</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   VOICE RECORDER
══════════════════════════════════════════════ */
function VoiceRecorder({ onSend, onCancel }: { onSend: (dur: string) => void; onCancel: () => void }) {
  const [secs, setSecs]   = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    ref.current = setInterval(() => { if (!paused) setSecs(s => s + 1); }, 1000);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [paused]);
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  return (
    <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
      <span className="text-sm font-mono font-bold text-red-600 w-10">{fmt(secs)}</span>
      <div className="flex-1 flex items-center gap-0.5 h-6">
        {Array.from({ length: 28 }).map((_, i) => (
          <div key={i} className={`flex-1 rounded-full ${paused ? "bg-red-200" : "bg-red-400"}`}
            style={{ height: `${22 + Math.sin(i * 0.8 + secs * 0.6) * 14}%` }} />
        ))}
      </div>
      <button onClick={() => setPaused(p => !p)} className="p-2 hover:bg-red-100 rounded-xl text-red-600">
        {paused ? <Play size={14} /> : <Pause size={14} />}
      </button>
      <button onClick={onCancel} className="p-2 hover:bg-red-100 rounded-xl text-red-400"><X size={14} /></button>
      <button onClick={() => onSend(fmt(secs))} className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors">
        <Send size={13} /> Send
      </button>
    </div>
  );
}

function VoiceBubble({ dur, self }: { dur: string; self?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);
  function toggle() {
    if (playing) { setPlaying(false); if (ref.current) clearInterval(ref.current); }
    else {
      setPlaying(true);
      ref.current = setInterval(() => {
        setProgress(p => { if (p >= 100) { setPlaying(false); clearInterval(ref.current!); return 0; } return p + 2; });
      }, 80);
    }
  }
  return (
    <div className={`flex items-center gap-3 rounded-2xl px-4 py-3 min-w-[200px] ${self ? "bg-blue-600 text-white" : "bg-white border border-slate-200"}`}>
      <button onClick={toggle} className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${self ? "bg-white/20 hover:bg-white/30" : "bg-blue-600 hover:bg-blue-700 text-white"}`}>
        {playing ? <Pause size={13} /> : <Play size={13} />}
      </button>
      <div className="flex-1">
        <div className={`h-1 rounded-full overflow-hidden ${self ? "bg-white/30" : "bg-slate-200"}`}>
          <div className="h-full bg-blue-400 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className={`text-[10px] mt-1 font-mono ${self ? "text-white/70" : "text-slate-400"}`}>{dur}</p>
      </div>
      <Download size={12} className={self ? "text-white/60" : "text-slate-400"} />
    </div>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const [hover, setHover] = useState(false);
  const isSelf   = !!msg.self;
  const isSystem = msg.type === "system";
  if (isSystem) return (
    <div className="flex justify-center my-2">
      <span className="text-[10px] text-slate-400 bg-slate-100 rounded-full px-3 py-1">{msg.system}</span>
    </div>
  );
  return (
    <div className={`flex items-end gap-2 group mb-1 ${isSelf ? "flex-row-reverse" : ""}`}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {!isSelf && <Avatar name={msg.from} size="sm" />}
      <div className={`max-w-[68%] flex flex-col ${isSelf ? "items-end" : "items-start"}`}>
        {!isSelf && <span className="text-[10px] font-semibold text-slate-500 mb-1 ml-1">{msg.from}</span>}
        {msg.type === "text" && (
          <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isSelf ? "bg-blue-600 text-white rounded-br-sm" : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm"}`}>
            {msg.text}
          </div>
        )}
        {msg.type === "voice" && msg.voice && <VoiceBubble dur={msg.voice.duration} self={isSelf} />}
        {msg.type === "file" && msg.file && (
          <div className={`flex items-center gap-3 rounded-2xl px-4 py-3 border ${isSelf ? "bg-blue-600 text-white border-blue-500" : "bg-white border-slate-200"}`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-bold ${isSelf ? "bg-white/20" : fileExt[msg.file.ext] ?? "bg-slate-100 text-slate-600"}`}>{msg.file.ext.toUpperCase()}</div>
            <div>
              <p className={`text-xs font-semibold ${isSelf ? "text-white" : "text-slate-800"}`}>{msg.file.name}</p>
              <p className={`text-[10px] ${isSelf ? "text-white/70" : "text-slate-400"}`}>{msg.file.size}</p>
            </div>
            <Download size={13} className={isSelf ? "text-white/70" : "text-slate-400"} />
          </div>
        )}
        <div className={`flex items-center gap-1 mt-1 ${isSelf ? "justify-end" : ""}`}>
          <span className="text-[9px] text-slate-400 tabular-nums">{msg.time}</span>
          {isSelf && msg.status === "read"      && <CheckCheck size={10} className="text-blue-500" />}
          {isSelf && msg.status === "delivered" && <CheckCheck size={10} className="text-slate-400" />}
          {isSelf && msg.status === "sent"      && <Check      size={10} className="text-slate-400" />}
        </div>
      </div>
      {hover && (
        <div className={`flex items-center gap-0.5 mb-2 ${isSelf ? "mr-2" : "ml-2"}`}>
          {[ReplyIcon, Smile, Copy, Pin, MoreHorizontal].map((Icon, i) => (
            <button key={i} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"><Icon size={12} /></button>
          ))}
        </div>
      )}
    </div>
  );
}

function ConvRow({ conv, selected, onClick }: { conv: Conversation; selected: boolean; onClick: () => void }) {
  const isGroup = conv.kind !== "direct";
  return (
    <div onClick={onClick} className={`flex items-center gap-2.5 px-3 py-2.5 cursor-pointer transition-colors rounded-xl mx-2 ${selected ? "bg-blue-600" : "hover:bg-slate-100"}`}>
      <div className="relative flex-shrink-0">
        {isGroup ? (
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${kindBg(conv.kind)}`}>{kindIcon(conv.kind)}</div>
        ) : <Avatar name={conv.name} size="sm" />}
        {conv.online && !isGroup && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold truncate ${selected ? "text-white" : "text-slate-800"}`}>{conv.name}</span>
          <span className={`text-[9px] flex-shrink-0 tabular-nums ${selected ? "text-white/70" : "text-slate-400"}`}>{conv.lastTime}</span>
        </div>
        <p className={`text-[11px] truncate mt-0.5 ${selected ? "text-white/80" : "text-slate-500"}`}>{conv.lastMsg}</p>
      </div>
      {conv.unread > 0 && <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 ${selected ? "bg-white text-blue-600" : "bg-blue-600 text-white"}`}>{conv.unread}</span>}
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════ */
function playChatTone(type: "send" | "receive") {
  try {
    const ctx = new AudioContext();
    const g = ctx.createGain();
    g.connect(ctx.destination);
    g.gain.setValueAtTime(0.12, ctx.currentTime);
    const o = ctx.createOscillator();
    o.type = "sine";
    if (type === "send") {
      o.frequency.setValueAtTime(880, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(1047, ctx.currentTime + 0.08);
    } else {
      o.frequency.setValueAtTime(659, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(784, ctx.currentTime + 0.08);
    }
    o.connect(g);
    o.start(ctx.currentTime);
    o.stop(ctx.currentTime + 0.12);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
    setTimeout(() => ctx.close(), 300);
  } catch { /* blocked */ }
}

export default function ChatPage() {
  const [convs, setConvs]               = useState<Conversation[]>(initialConversations);
  const [activeConv, setActiveConv]     = useState<Conversation>(initialConversations[0]);
  const [messages, setMessages]         = useState<Message[]>(mockMessages["c1"] ?? []);
  const [text, setText]                 = useState("");
  const [recording, setRecording]       = useState(false);
  const [showInfo, setShowInfo]         = useState(false);
  const [search, setSearch]             = useState("");
  const [showCreateGroup, setShowCreateGroup]   = useState(false);
  const [activeCall, setActiveCall]             = useState<{ type: CallType; conv: Conversation } | null>(null);
  const [incomingCall, setIncomingCall]         = useState<{ type: CallType; conv: Conversation } | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Simulate an incoming call from Kavinda after 8 seconds (demo)
  useEffect(() => {
    const t = setTimeout(() => {
      // Only trigger if no active call in progress
      setIncomingCall({ type: "audio", conv: initialConversations[0] });
    }, 8000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  function selectConv(conv: Conversation) {
    setActiveConv(conv);
    setMessages(mockMessages[conv.id] ?? []);
    if (conv.unread > 0) playChatTone("receive");
    setRecording(false);
  }

  function sendText() {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString("en-LK", { hour: "2-digit", minute: "2-digit", hour12: true });
    const msg: Message = { id: `m${Date.now()}`, from: "Me", fromId: "ME", type: "text", text: text.trim(), time: now, status: "sending", self: true };
    playChatTone("send");
    setMessages(prev => [...prev, msg]);
    setText("");
    setTimeout(() => setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, status: "delivered" } : m)), 800);
    /* Simulate incoming reply */
    setTimeout(() => {
      const reply: Message = { id: `mr${Date.now()}`, from: activeConv.name, fromId: "OTHER", type: "text", text: "Got it, thanks! 👍", time: new Date().toLocaleTimeString("en-LK", { hour: "2-digit", minute: "2-digit", hour12: true }), status: "delivered" };
      playChatTone("receive");
      setMessages(prev => [...prev, reply]);
    }, 2200);
  }

  function sendVoice(dur: string) {
    const now = new Date().toLocaleTimeString("en-LK", { hour: "2-digit", minute: "2-digit", hour12: true });
    const msg: Message = { id: `m${Date.now()}`, from: "Me", fromId: "ME", type: "voice", voice: { duration: dur }, time: now, status: "sending", self: true };
    setMessages(prev => [...prev, msg]);
    setRecording(false);
    setTimeout(() => setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, status: "delivered" } : m)), 900);
  }

  function handleGroupCreated(conv: Conversation) {
    setConvs(prev => [conv, ...prev]);
    selectConv(conv);
  }

  const filteredConvs = convs.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()));
  const sections = [
    { label: "Direct Messages",       convs: filteredConvs.filter(c => c.kind === "direct")                      },
    { label: "Groups",                convs: filteredConvs.filter(c => c.kind === "group")                       },
    { label: "Departments & Teams",   convs: filteredConvs.filter(c => c.kind === "department" || c.kind === "team") },
    { label: "Projects",              convs: filteredConvs.filter(c => c.kind === "project")                     },
  ].filter(s => s.convs.length > 0);

  return (
    <>
      {/* ── Create Group Modal ── */}
      {showCreateGroup && (
        <CreateGroupModal onClose={() => setShowCreateGroup(false)} onCreate={handleGroupCreated} />
      )}

      {/* ── Active Call Screen ── */}
      {activeCall && !incomingCall && (
        <CallScreen conv={activeCall.conv} type={activeCall.type} onEnd={() => setActiveCall(null)} />
      )}

      {/* ── Incoming Call Screen ── */}
      {incomingCall && !activeCall && (
        <IncomingCallScreen
          caller={incomingCall.conv}
          type={incomingCall.type}
          onAccept={() => {
            setActiveCall({ type: incomingCall.type, conv: incomingCall.conv });
            setIncomingCall(null);
          }}
          onDecline={() => setIncomingCall(null)}
        />
      )}

      <div className="flex h-full overflow-hidden bg-white" style={{ height: "calc(100vh - 57px)" }}>
        {/* ── Sidebar ── */}
        <div className="w-64 flex-shrink-0 border-r border-slate-200 flex flex-col overflow-hidden bg-slate-50">
          <div className="px-4 pt-4 pb-3 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm" style={{ fontFamily: "var(--font-display)" }}>Messages</h3>
            <div className="flex items-center gap-1">
              {/* Simulate incoming call — for demo/testing */}
              <button
                onClick={() => setIncomingCall({ type: "audio", conv: initialConversations[1] })}
                title="Simulate incoming call"
                className="p-1.5 hover:bg-emerald-100 hover:text-emerald-600 rounded-lg text-slate-400 transition-colors"
              >
                <Phone size={13} />
              </button>
              <button
                onClick={() => setIncomingCall({ type: "video", conv: initialConversations[0] })}
                title="Simulate incoming video call"
                className="p-1.5 hover:bg-violet-100 hover:text-violet-600 rounded-lg text-slate-400 transition-colors"
              >
                <Video size={13} />
              </button>
              <button
                onClick={() => setShowCreateGroup(true)}
                title="New Group"
                className="p-1.5 hover:bg-blue-100 hover:text-blue-600 rounded-lg text-slate-500 transition-colors"
              >
                <Plus size={15} />
              </button>
            </div>
          </div>
          <div className="px-3 py-2">
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search conversations…" className="w-full pl-7 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto py-1 space-y-3">
            {sections.map(sec => (
              <div key={sec.label}>
                <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400 px-5 mb-1">{sec.label}</p>
                {sec.convs.map(c => <ConvRow key={c.id} conv={c} selected={activeConv.id === c.id} onClick={() => selectConv(c)} />)}
              </div>
            ))}
          </div>
        </div>

        {/* ── Chat window ── */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
          {/* Chat header */}
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-200 bg-white flex-shrink-0">
            <div className="relative">
              {activeConv.kind !== "direct" ? (
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${kindBg(activeConv.kind)}`}>{kindIcon(activeConv.kind)}</div>
              ) : <Avatar name={activeConv.name} size="sm" />}
              {activeConv.online && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900">{activeConv.name}</p>
              <p className="text-[11px] text-slate-400">
                {activeConv.online ? <span className="text-emerald-600 font-medium">● Online</span>
                  : activeConv.designation ?? `${activeConv.participants.length} members`}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveCall({ type: "audio", conv: activeConv })}
                title="Voice Call"
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors"
              >
                <Phone size={15} />
              </button>
              <button
                onClick={() => setActiveCall({ type: "video", conv: activeConv })}
                title="Video Call"
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors"
              >
                <Video size={15} />
              </button>
              <button onClick={() => setShowInfo(i => !i)} className={`p-2 rounded-xl text-slate-500 transition-colors ${showInfo ? "bg-blue-50 text-blue-600" : "hover:bg-slate-100"}`}>
                <Info size={15} />
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-500"><MoreHorizontal size={15} /></button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1 bg-slate-50/40">
            {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-5 py-3.5 border-t border-slate-200 bg-white flex-shrink-0">
            {recording ? (
              <VoiceRecorder onSend={sendVoice} onCancel={() => setRecording(false)} />
            ) : (
              <div className="flex items-end gap-2">
                <div className="flex-1 bg-slate-100 rounded-2xl px-4 py-2.5 flex items-end gap-2">
                  <textarea
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendText(); }}}
                    placeholder="Write a message…"
                    rows={1}
                    className="flex-1 bg-transparent text-sm text-slate-700 resize-none focus:outline-none max-h-32"
                  />
                  <div className="flex items-center gap-0.5 flex-shrink-0 pb-0.5">
                    <button className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500"><Smile size={15} /></button>
                    <button className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500"><Paperclip size={15} /></button>
                    <button className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500"><ImageIcon size={15} /></button>
                  </div>
                </div>
                <button
                  onClick={() => { if (text.trim()) sendText(); else setRecording(true); }}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all flex-shrink-0 ${text.trim() ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200" : "bg-slate-100 hover:bg-slate-200 text-slate-500"}`}
                >
                  {text.trim() ? <Send size={16} /> : <Mic size={16} />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Info panel ── */}
        {showInfo && (
          <div className="w-64 flex-shrink-0 border-l border-slate-200 overflow-y-auto bg-white">
            <div className="p-5 text-center border-b border-slate-100">
              {activeConv.kind !== "direct" ? (
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 ${kindBg(activeConv.kind)}`}>
                  <div className="scale-150">{kindIcon(activeConv.kind)}</div>
                </div>
              ) : (
                <div className="mx-auto mb-3 w-fit relative">
                  <Avatar name={activeConv.name} size="lg" />
                  {activeConv.online && <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />}
                </div>
              )}
              <p className="font-bold text-slate-900 text-sm" style={{ fontFamily: "var(--font-display)" }}>{activeConv.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">{activeConv.designation ?? `${activeConv.participants.length} members`}</p>
              {activeConv.dept && <p className="text-[10px] text-slate-400">{activeConv.dept}</p>}
              {activeConv.online && <p className="text-xs text-emerald-600 font-medium mt-1">● Online now</p>}
              <div className="flex items-center justify-center gap-2 mt-3">
                <button onClick={() => setActiveCall({ type: "audio", conv: activeConv })} className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-slate-50 rounded-xl transition-colors">
                  <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center"><Phone size={15} className="text-emerald-600" /></div>
                  <span className="text-[10px] text-slate-500">Call</span>
                </button>
                <button onClick={() => setActiveCall({ type: "video", conv: activeConv })} className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-slate-50 rounded-xl transition-colors">
                  <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center"><Video size={15} className="text-blue-600" /></div>
                  <span className="text-[10px] text-slate-500">Video</span>
                </button>
                <button className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-slate-50 rounded-xl transition-colors">
                  <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center"><UserPlus size={15} className="text-violet-600" /></div>
                  <span className="text-[10px] text-slate-500">Add</span>
                </button>
              </div>
            </div>
            <div className="p-4 space-y-1">
              {["View Profile", "View Projects", "View Tasks", "Shared Files", "Mute Notifications"].map(action => (
                <button key={action} className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-slate-50 rounded-xl text-sm text-slate-700 transition-colors">
                  {action}<ChevronRight size={13} className="text-slate-400" />
                </button>
              ))}
            </div>
            <div className="border-t border-slate-100 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-2">Shared Files</p>
              <div className="space-y-2">
                {[{ name: "deployment_log.txt", ext: "txt", size: "48 KB" }, { name: "Q1_Report.pdf", ext: "pdf", size: "2.4 MB" }].map(f => (
                  <div key={f.name} className="flex items-center gap-2 bg-slate-50 rounded-xl p-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-bold ${fileExt[f.ext] ?? "bg-slate-100 text-slate-600"}`}>{f.ext.toUpperCase()}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-700 truncate">{f.name}</p>
                      <p className="text-[9px] text-slate-400">{f.size}</p>
                    </div>
                    <Download size={11} className="text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
