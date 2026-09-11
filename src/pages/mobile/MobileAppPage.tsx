import { useState, useEffect, useRef } from "react";
import {
  Download, Smartphone, Shield, Bell, MessageSquare, CheckSquare,
  Clock, CalendarDays, FileText, Mail, Ticket, Settings,
  Users, ChevronRight, Star, Zap, Wifi, Lock, Eye,
  Play, ArrowRight, Check, X, RefreshCw,
} from "lucide-react";

// ─── QR code SVG (placeholder geometric pattern) ──────────────────────────
function QRCodeBlock() {
  const cells = Array.from({ length: 21 }, (_, r) =>
    Array.from({ length: 21 }, (_, c) => {
      const corner = (r < 7 && c < 7) || (r < 7 && c > 13) || (r > 13 && c < 7);
      const innerCorner = (r >= 2 && r <= 4 && c >= 2 && c <= 4) ||
                          (r >= 2 && r <= 4 && c >= 16 && c <= 18) ||
                          (r >= 16 && r <= 18 && c >= 2 && c <= 4);
      const border = (r === 0 || r === 6) && c < 7 ||
                     (r === 0 || r === 6) && c > 13 ||
                     (r > 13 && (r === 14 || r === 20)) && c < 7 ||
                     (c === 0 || c === 6) && r < 7 ||
                     (c === 14 || c === 20) && r < 7 ||
                     (c === 0 || c === 6) && r > 13;
      const data = Math.sin(r * 7 + c * 3) > 0.1;
      return corner || innerCorner || border || (r > 7 && data);
    })
  );
  return (
    <div className="bg-white p-4 rounded-2xl shadow-lg inline-block border border-slate-200">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(21,10px)", gap: "1px" }}>
        {cells.flat().map((filled, i) => (
          <div key={i} style={{ width: 10, height: 10, backgroundColor: filled ? "#0f172a" : "#fff", borderRadius: 1 }} />
        ))}
      </div>
    </div>
  );
}

// ─── Phone mockup ──────────────────────────────────────────────────────────
function PhoneMockup({ screenBg = "from-blue-600 to-indigo-700", content }: { screenBg?: string; content?: React.ReactNode }) {
  return (
    <div className="relative" style={{ width: 220, height: 440 }}>
      {/* Phone body */}
      <div className="absolute inset-0 bg-slate-900 rounded-[2.5rem] shadow-2xl" />
      <div className="absolute inset-1 bg-slate-800 rounded-[2.25rem]" />
      {/* Screen */}
      <div className={`absolute inset-2 rounded-[2rem] bg-gradient-to-b ${screenBg} overflow-hidden`}>
        {content ?? <DefaultPhoneContent />}
      </div>
      {/* Notch */}
      <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-20 h-5 bg-slate-900 rounded-full z-10" />
      {/* Home indicator */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-20 h-1 bg-white/30 rounded-full z-10" />
    </div>
  );
}

function DefaultPhoneContent() {
  return (
    <div className="p-4 pt-8 text-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] opacity-60">Good Morning</p>
          <p className="font-bold text-sm">Kavinda Perera</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">KP</div>
      </div>
      <div className="bg-white/15 rounded-xl p-3 mb-3">
        <p className="text-[9px] opacity-70 mb-1">TODAY'S ATTENDANCE</p>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-emerald-400 flex items-center justify-center"><Check size={12} /></div>
          <div>
            <p className="text-xs font-bold">Checked In</p>
            <p className="text-[9px] opacity-70">09:02 AM · 4h 32m</p>
          </div>
        </div>
        <button className="w-full mt-2 bg-white/20 rounded-lg py-1.5 text-[10px] font-bold">CHECK OUT</button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Leave Balance", val: "14 days", icon: CalendarDays },
          { label: "My Tasks",      val: "5 pending", icon: CheckSquare },
          { label: "Notifications", val: "3 unread",  icon: Bell        },
          { label: "Team Chat",     val: "2 new",     icon: MessageSquare},
        ].map(c => (
          <div key={c.label} className="bg-white/15 rounded-xl p-2">
            <c.icon size={12} className="mb-1 opacity-70" />
            <p className="text-[9px] opacity-60">{c.label}</p>
            <p className="text-[10px] font-bold">{c.val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Download progress overlay ────────────────────────────────────────────
function DownloadOverlay({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<"preparing" | "downloading" | "done">("preparing");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("downloading"), 1200);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (phase !== "downloading") return;
    const iv = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(iv); setTimeout(() => setPhase("done"), 400); return 100; }
        return p + Math.floor(Math.random() * 8) + 3;
      });
    }, 120);
    return () => clearInterval(iv);
  }, [phase]);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={phase === "done" ? onClose : undefined}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center" onClick={e => e.stopPropagation()}>
        {phase === "preparing" && (
          <>
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-5 animate-pulse">
              <Download size={36} className="text-blue-600" />
            </div>
            <p className="text-lg font-bold text-slate-900 mb-1">Preparing Your Download...</p>
            <p className="text-sm text-slate-500">Fetching the latest version</p>
          </>
        )}
        {phase === "downloading" && (
          <>
            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-5">
              <Download size={36} className="text-white" />
            </div>
            <p className="text-lg font-bold text-slate-900 mb-1">Downloading...</p>
            <p className="text-sm text-slate-500 mb-4">MernCrest-Employee-v1.0.0.apk</p>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-blue-600 rounded-full transition-all duration-100" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>{progress}%</span>
              <span>~42 MB</span>
            </div>
          </>
        )}
        {phase === "done" && (
          <>
            <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-5">
              <Check size={36} className="text-white" />
            </div>
            <p className="text-lg font-bold text-slate-900 mb-1">Download Ready</p>
            <p className="text-sm text-slate-500 mb-6">MernCrest Employee App v1.0.0</p>
            <button onClick={onClose}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-2xl transition-colors mb-2">
              Open Download
            </button>
            <button onClick={onClose} className="w-full text-sm text-slate-400 hover:text-slate-600 py-2">Done</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Feature cards ────────────────────────────────────────────────────────
const FEATURES = [
  { icon: Clock,        title: "Attendance",    desc: "Check in, check out and track your attendance from your phone.", color: "bg-blue-50 text-blue-600"     },
  { icon: CalendarDays, title: "Leave",         desc: "Apply for leave, check your balance and track approval status.", color: "bg-violet-50 text-violet-600"  },
  { icon: MessageSquare,title: "Chat",          desc: "Connect directly with colleagues and teams.",                    color: "bg-emerald-50 text-emerald-600" },
  { icon: Users,        title: "Team Chat",     desc: "Stay connected with your department and project teams.",         color: "bg-teal-50 text-teal-600"      },
  { icon: CheckSquare,  title: "Tasks",         desc: "See your assigned tasks and keep your work moving.",             color: "bg-amber-50 text-amber-600"    },
  { icon: Bell,         title: "Notifications", desc: "Never miss important company updates.",                          color: "bg-orange-50 text-orange-600"  },
  { icon: Play,         title: "Calls",         desc: "Make voice and video calls with authorized colleagues.",         color: "bg-pink-50 text-pink-600"      },
  { icon: FileText,     title: "Documents",     desc: "Upload and access authorized work documents.",                  color: "bg-indigo-50 text-indigo-600"  },
  { icon: Mail,         title: "Email",         desc: "Access your company email from your mobile.",                   color: "bg-cyan-50 text-cyan-600"      },
  { icon: Ticket,       title: "Tickets",       desc: "Create and track IT and support requests.",                      color: "bg-red-50 text-red-600"        },
  { icon: Settings,     title: "Settings",      desc: "Manage your account and app preferences.",                       color: "bg-slate-100 text-slate-600"   },
];

const SCREEN_PREVIEWS = [
  { title: "Login",       bg: "from-slate-800 to-slate-900" },
  { title: "Home",        bg: "from-blue-600 to-indigo-700" },
  { title: "Attendance",  bg: "from-teal-600 to-emerald-700"},
  { title: "Leave",       bg: "from-violet-600 to-purple-700"},
  { title: "Chat",        bg: "from-blue-500 to-blue-700"   },
  { title: "Tasks",       bg: "from-amber-500 to-orange-600"},
  { title: "Notifications",bg: "from-rose-500 to-pink-600" },
];

const HOW_STEPS = [
  { n: "01", title: "Download",     desc: "Download the APK from this page",  icon: Download    },
  { n: "02", title: "Install",      desc: "Open the APK and install the app", icon: Smartphone  },
  { n: "03", title: "Login",        desc: "Sign in with your company account",icon: Lock        },
  { n: "04", title: "Start Working",desc: "Manage your work from anywhere",   icon: Zap         },
];

// ─── Main page ────────────────────────────────────────────────────────────
export default function MobileAppPage() {
  const [showDownload, setShowDownload] = useState(false);
  const [visibleFeatures, setVisibleFeatures] = useState<number[]>([]);
  const featRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = Number((entry.target as HTMLElement).dataset.idx);
          setVisibleFeatures(prev => prev.includes(idx) ? prev : [...prev, idx]);
        }
      });
    }, { threshold: 0.1 });
    const items = featRef.current?.querySelectorAll("[data-idx]");
    items?.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-full bg-white">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-100 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
            <Smartphone size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-black text-slate-900" style={{ fontFamily: "var(--font-display)" }}>MernCrest Employee</p>
            <p className="text-[9px] text-slate-400 leading-none">Mobile Application</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-slate-500">
          {["Features", "Preview", "Download", "Security"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-blue-600 transition-colors">{l}</a>
          ))}
        </div>
        <button onClick={() => setShowDownload(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
          <Download size={14} /> Download
        </button>
      </nav>

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white px-6 py-20 md:py-28 overflow-hidden relative">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-2xl translate-y-1/4 -translate-x-1/4" />

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
          {/* Left copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-3 py-1.5 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-blue-200">Now Available — v1.0.0</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-4" style={{ fontFamily: "var(--font-display)" }}>
              MernCrest<br /><span className="text-blue-400">Employee</span>
            </h1>
            <p className="text-xl text-blue-200 font-medium mb-3">Your Work, Right in Your Pocket.</p>
            <p className="text-slate-400 text-base leading-relaxed mb-8 max-w-md">
              Manage attendance, leave, tasks, team communication, notifications and support — all from one simple mobile app.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowDownload(true)}
                className="flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-4 rounded-2xl text-sm transition-all hover:scale-105 shadow-lg shadow-blue-600/30">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 0H6.477A2.477 2.477 0 0 0 4 2.477v19.046A2.477 2.477 0 0 0 6.477 24h11.046A2.477 2.477 0 0 0 20 21.523V2.477A2.477 2.477 0 0 0 17.523 0zM12 21.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5-4H7V3h10v14.5z"/></svg>
                Download for Android
              </button>
              <a href="#preview"
                className="flex items-center gap-2 border border-white/20 hover:bg-white/10 text-white font-semibold px-6 py-4 rounded-2xl text-sm transition-all">
                <Eye size={15} /> Preview App
              </a>
            </div>
            <div className="flex items-center gap-4 mt-6 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><Check size={12} className="text-emerald-400" /> Version 1.0.0</span>
              <span className="flex items-center gap-1.5"><Check size={12} className="text-emerald-400" /> ~42 MB</span>
              <span className="flex items-center gap-1.5"><Check size={12} className="text-emerald-400" /> Android 8.0+</span>
            </div>
          </div>

          {/* Right phone + floating badges */}
          <div className="flex justify-center relative">
            <PhoneMockup />
            {/* Floating badges */}
            {[
              { label: "Checked In ✓",   color: "bg-emerald-500", pos: "-top-4 -right-8 rotate-6"    },
              { label: "Leave Approved", color: "bg-blue-500",    pos: "top-1/3 -left-12 -rotate-6"  },
              { label: "3 new tasks",    color: "bg-amber-500",   pos: "bottom-24 -right-12 rotate-3" },
              { label: "2 messages",     color: "bg-violet-500",  pos: "bottom-8 -left-8 -rotate-3"  },
            ].map(b => (
              <div key={b.label} className={`absolute ${b.pos} ${b.color} text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse`} style={{ animationDuration: `${2 + Math.random() * 2}s` }}>
                {b.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QR / Download section ── */}
      <section id="download" className="bg-slate-50 px-6 py-16">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-3" style={{ fontFamily: "var(--font-display)" }}>Download the App</h2>
            <p className="text-slate-500 mb-6 leading-relaxed">
              Scan the QR code with your Android phone to download the official MernCrest Employee app, or click the button below.
            </p>
            <div className="flex flex-col gap-3 mb-6">
              <button onClick={() => setShowDownload(true)}
                className="flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-4 rounded-2xl transition-colors w-fit">
                <Download size={18} />
                <div className="text-left">
                  <p className="text-xs opacity-60">Download for</p>
                  <p className="font-bold">Android · APK</p>
                </div>
              </button>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-500">
              {["Scan","Download","Install","Login"].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <span className={`font-semibold ${i === 0 ? "text-blue-600" : ""}`}>{s}</span>
                  {i < 3 && <ArrowRight size={12} className="text-slate-300" />}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <QRCodeBlock />
            <p className="text-xs text-slate-400 text-center max-w-xs">
              Scan this QR code using your phone camera to download the MernCrest Employee app
            </p>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-black text-slate-900 mb-3" style={{ fontFamily: "var(--font-display)" }}>How It Works</h2>
          <p className="text-slate-500">Get started in 4 simple steps</p>
        </div>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-4">
          {HOW_STEPS.map((s, i) => (
            <div key={s.n} className="flex md:flex-col items-center gap-4 md:gap-3 flex-1 text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-600/30">
                <s.icon size={22} className="text-white" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-blue-500 mb-0.5">{s.n}</p>
                <p className="font-bold text-slate-900">{s.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{s.desc}</p>
              </div>
              {i < HOW_STEPS.length - 1 && (
                <ArrowRight size={16} className="text-slate-200 flex-shrink-0 md:hidden" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── App Preview ── */}
      <section id="preview" className="bg-slate-950 px-6 py-20 overflow-hidden">
        <div className="max-w-6xl mx-auto mb-12 text-center">
          <h2 className="text-3xl font-black text-white mb-3" style={{ fontFamily: "var(--font-display)" }}>App Preview</h2>
          <p className="text-slate-400">13 screens. One seamless experience.</p>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4 justify-start md:justify-center">
          {SCREEN_PREVIEWS.map((s, i) => (
            <div key={s.title} className="flex-shrink-0 flex flex-col items-center gap-3"
              style={{ animation: `fadeInUp 0.5s ease both ${i * 0.07}s` }}>
              <PhoneMockup screenBg={s.bg} />
              <p className="text-xs text-slate-400 font-medium">{s.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="bg-white px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 mb-3" style={{ fontFamily: "var(--font-display)" }}>Everything You Need</h2>
            <p className="text-slate-500">11 powerful features in one app</p>
          </div>
          <div ref={featRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <div key={f.title} data-idx={i}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-lg transition-all"
                style={{ opacity: visibleFeatures.includes(i) ? 1 : 0, transform: visibleFeatures.includes(i) ? "none" : "translateY(20px)", transition: "opacity 0.4s ease, transform 0.4s ease" }}>
                <div className={`w-10 h-10 rounded-xl ${f.color} flex items-center justify-center mb-3`}>
                  <f.icon size={18} />
                </div>
                <p className="font-bold text-slate-900 mb-1">{f.title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Installation guide ── */}
      <section className="bg-slate-50 px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-900 mb-3" style={{ fontFamily: "var(--font-display)" }}>Installation Guide</h2>
            <p className="text-slate-500">Follow these simple steps to get started</p>
          </div>
          <div className="grid md:grid-cols-5 gap-4 items-start">
            {[
              { step: "01", title: "Download",          desc: "Tap the Download button and save the APK file",              icon: Download    },
              { step: "02", title: "Open APK",          desc: "Find the file in your Downloads folder and tap to open",     icon: FileText    },
              { step: "03", title: "Install App",       desc: "Allow installation from unknown sources if prompted",         icon: Smartphone  },
              { step: "04", title: "Open App",          desc: "Find MernCrest Employee on your home screen and tap to open", icon: Play        },
              { step: "05", title: "Login",             desc: "Enter your company email and password to get started",        icon: Lock        },
            ].map((s, i) => (
              <div key={s.step} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-white border-2 border-blue-200 flex items-center justify-center mb-3 shadow-sm">
                  <s.icon size={20} className="text-blue-600" />
                </div>
                <span className="text-[10px] font-bold text-blue-500 mb-1">STEP {s.step}</span>
                <p className="font-bold text-slate-900 text-sm mb-1">{s.title}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                {i < 4 && <ChevronRight size={16} className="text-slate-200 mt-3 hidden md:block self-center" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Security ── */}
      <section id="security" className="px-6 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">
                <Shield size={24} className="text-blue-600" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-4" style={{ fontFamily: "var(--font-display)" }}>Built for Secure Employee Access</h2>
              <p className="text-slate-500 leading-relaxed">
                Every feature is designed with your privacy and company security in mind. Your data is protected at every layer.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Lock,          label: "Secure Login",             desc: "Company-controlled authentication"        },
                { icon: Wifi,          label: "Encrypted Communication",  desc: "All data encrypted in transit"            },
                { icon: Shield,        label: "Secure Sessions",          desc: "Session timeout and device management"    },
                { icon: Eye,           label: "Permission-Based Access",  desc: "Role and scope-based visibility"          },
                { icon: FileText,      label: "Protected Documents",      desc: "Secure file access with authorization"    },
                { icon: Bell,          label: "Secure Notifications",     desc: "Company-controlled push notifications"    },
                { icon: RefreshCw,     label: "Auto Sync",                desc: "Real-time data sync with ERP backend"     },
                { icon: CheckSquare,   label: "Audit Trail",              desc: "Every action is logged and auditable"     },
              ].map(s => (
                <div key={s.label} className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                  <div className="flex items-center gap-2 mb-1">
                    <s.icon size={13} className="text-blue-600 flex-shrink-0" />
                    <p className="text-xs font-bold text-slate-800">{s.label}</p>
                  </div>
                  <p className="text-[10px] text-slate-400">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-16 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-black mb-4" style={{ fontFamily: "var(--font-display)" }}>Work. Connect. Stay Updated.</h2>
          <p className="text-blue-200 mb-8 text-lg">Download the MernCrest Employee app and take your work anywhere.</p>
          <button onClick={() => setShowDownload(true)}
            className="inline-flex items-center gap-3 bg-white hover:bg-slate-50 text-blue-700 font-black px-8 py-4 rounded-2xl transition-all hover:scale-105 shadow-xl text-sm">
            <Download size={18} />
            Download for Android — Free
          </button>
          <div className="flex items-center justify-center gap-6 mt-6 text-xs text-blue-300">
            <span className="flex items-center gap-1.5"><Check size={11} /> Official MernCrest App</span>
            <span className="flex items-center gap-1.5"><Check size={11} /> Version 1.0.0</span>
            <span className="flex items-center gap-1.5"><Check size={11} /> Android 8.0+</span>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-950 text-slate-400 px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
              <Smartphone size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">MernCrest Employee</p>
              <p className="text-[10px] text-slate-500">Your Technology Partner</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm">
            {["Support","Privacy","Terms","Contact"].map(l => (
              <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
            ))}
          </div>
          <div className="text-xs text-slate-600 text-center md:text-right">
            <p>App Version 1.0.0</p>
            <p className="mt-0.5">© {new Date().getFullYear()} MernCrest Solutions (Pvt) Ltd</p>
          </div>
        </div>
      </footer>

      {/* Download overlay */}
      {showDownload && <DownloadOverlay onClose={() => setShowDownload(false)} />}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
