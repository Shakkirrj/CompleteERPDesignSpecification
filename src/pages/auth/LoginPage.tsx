import { useState, useEffect, useRef } from "react";
import itBg from "../../assets/it-bg.jpg";
import mcLogo from "../../assets/merncrest-logo.png";
import {
  Eye, EyeOff, Lock, Mail, Cpu, Loader2, ArrowRight, ShieldCheck,
  Check, X, Wifi, Server, Shield, Activity, Users,
  Phone, MessageSquare, AlertTriangle, ChevronRight,
} from "lucide-react";

// ── Live network node animation ────────────────────────────────────────────
function NetworkCanvas({ dark }: { dark: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type Node = { x: number; y: number; vx: number; vy: number; r: number; pulse: number };
    const nodes: Node[] = Array.from({ length: 55 }, () => ({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      vx:    (Math.random() - 0.5) * 0.4,
      vy:    (Math.random() - 0.5) * 0.4,
      r:     Math.random() * 2 + 1.5,
      pulse: Math.random() * Math.PI * 2,
    }));

    let frame = 0;
    let raf: number;
    const DIST = 160;

    const tick = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const nodeColor  = dark ? "rgba(96,165,250," : "rgba(37,99,235,";
      const lineColor  = dark ? "rgba(96,165,250," : "rgba(37,99,235,";

      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy; n.pulse += 0.02;
        if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

        // connections
        nodes.forEach(m => {
          const dx = n.x - m.x, dy = n.y - m.y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < DIST) {
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.strokeStyle = lineColor + (0.15 * (1 - d / DIST)).toFixed(3) + ")";
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        });

        // node dot with pulse
        const glow = Math.sin(n.pulse) * 0.4 + 0.6;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * glow, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor + (0.7 * glow).toFixed(2) + ")";
        ctx.fill();
      });

      // travelling data packets every 80 frames
      if (frame % 80 === 0 && nodes.length > 1) {
        const a = nodes[Math.floor(Math.random() * nodes.length)];
        const b = nodes[Math.floor(Math.random() * nodes.length)];
        packets.push({ x: a.x, y: a.y, tx: b.x, ty: b.y, t: 0 });
      }

      packets.forEach((p, i) => {
        p.t += 0.03;
        p.x = p.x + (p.tx - p.x) * 0.03;
        p.y = p.y + (p.ty - p.y) * 0.03;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = dark ? "rgba(52,211,153,0.9)" : "rgba(16,185,129,0.9)";
        ctx.fill();
        if (p.t > 1) packets.splice(i, 1);
      });

      raf = requestAnimationFrame(tick);
    };

    const packets: { x: number; y: number; tx: number; ty: number; t: number }[] = [];
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [dark]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }} />;
}

// ── Live stats ticker ──────────────────────────────────────────────────────
function LiveStats({ dark }: { dark: boolean }) {
  const [uptime,  setUptime]  = useState(99.97);
  const [latency, setLatency] = useState(14);
  const [active,  setActive]  = useState(87);

  useEffect(() => {
    const iv = setInterval(() => {
      setUptime(v  => Math.min(99.99, Math.max(99.8, v + (Math.random() - 0.5) * 0.02)));
      setLatency(v => Math.min(28,    Math.max(8,    v + Math.floor((Math.random() - 0.5) * 3))));
      setActive(v  => Math.min(120,   Math.max(60,   v + Math.floor((Math.random() - 0.5) * 4))));
    }, 2000);
    return () => clearInterval(iv);
  }, []);

  const base = dark ? "text-slate-400" : "text-slate-500";
  const val  = dark ? "text-emerald-400" : "text-emerald-600";
  const dot  = "w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse";

  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-6">
      {[
        { label: "Uptime",   value: uptime.toFixed(2) + "%" },
        { label: "Latency",  value: latency + "ms"          },
        { label: "Sessions", value: active + " active"       },
      ].map(s => (
        <div key={s.label} className="flex items-center gap-1.5 text-xs">
          <div className={dot} />
          <span className={base}>{s.label}:</span>
          <span className={`${val} font-mono font-bold`}>{s.value}</span>
        </div>
      ))}
    </div>
  );
}

// ── Success overlay ────────────────────────────────────────────────────────
function SuccessOverlay({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 900);
    const t3 = setTimeout(() => setPhase(3), 1500);
    const t4 = setTimeout(() => onDone(), 2900);
    return () => { [t1,t2,t3,t4].forEach(clearTimeout); };
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(5,10,25,0.94)", backdropFilter: "blur(16px)" }}>
      {[1,2,3].map(i => (
        <div key={i} className="absolute rounded-full border border-emerald-400/20"
          style={{ width: i*170, height: i*170, animation: `loginPing ${1+i*0.3}s ease-out ${i*0.15}s infinite`, opacity: phase>=1?1:0, transition:"opacity 0.4s" }} />
      ))}
      <div className="relative text-center flex flex-col items-center">
        <div className="w-28 h-28 rounded-full flex items-center justify-center mb-6"
          style={{ background: phase>=1 ? "radial-gradient(circle,#059669,#047857)" : "rgba(255,255,255,0.05)", transition:"background 0.6s", boxShadow: phase>=1 ? "0 0 70px rgba(16,185,129,0.5)" : "none" }}>
          <Check size={52} className="text-white" strokeWidth={3}
            style={{ opacity:phase>=1?1:0, transform:phase>=1?"scale(1)":"scale(0.3)", transition:"all 0.55s cubic-bezier(0.34,1.56,0.64,1)" }} />
        </div>
        <div style={{ opacity:phase>=2?1:0, transform:phase>=2?"translateY(0)":"translateY(14px)", transition:"all 0.5s ease" }}>
          <p className="text-3xl font-black text-white mb-1" style={{ fontFamily:"var(--font-display)" }}>Access Granted</p>
          <p className="text-emerald-400 text-sm">Authentication successful</p>
        </div>
        <div className="mt-7 w-64" style={{ opacity:phase>=3?1:0, transition:"opacity 0.4s" }}>
          <div className="flex justify-between text-xs text-white/40 mb-1.5"><span>Loading workspace...</span></div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full" style={{ width:phase>=3?"100%":"0%", transition:"width 1.4s ease" }} />
          </div>
        </div>
        <div className="mt-5 space-y-2" style={{ opacity:phase>=2?1:0, transition:"opacity 0.5s 0.3s" }}>
          {[{icon:Shield,label:"Identity verified"},{icon:Wifi,label:"Secure session established"},{icon:Server,label:"Connecting to ERP..."}].map((r,i)=>(
            <div key={r.label} className="flex items-center gap-2.5 text-sm"
              style={{ opacity:phase>=2?1:0, transition:`opacity 0.4s ${i*0.1}s` }}>
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
                <r.icon size={10} className="text-emerald-400" />
              </div>
              <span className="text-white/60">{r.label}</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes loginPing{0%{transform:scale(0.8);opacity:.6}100%{transform:scale(2.4);opacity:0}}`}</style>
    </div>
  );
}

// ── Error overlay ──────────────────────────────────────────────────────────
function ErrorOverlay({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background:"rgba(20,5,5,0.90)", backdropFilter:"blur(16px)" }} onClick={onClose}>
      <div className="absolute w-72 h-72 rounded-full border border-red-500/20"
        style={{ animation:phase>=1?"errorPulse 1.6s ease-out infinite":"none" }} />
      <div className="relative text-center flex flex-col items-center" onClick={e=>e.stopPropagation()}>
        <div className="w-28 h-28 rounded-full flex items-center justify-center mb-6"
          style={{ background:phase>=1?"radial-gradient(circle,#dc2626,#991b1b)":"rgba(255,255,255,0.05)", transition:"background 0.5s", boxShadow:phase>=1?"0 0 70px rgba(220,38,38,0.5)":"none", animation:phase>=1?"loginShake 0.5s ease":"none" }}>
          <X size={52} className="text-white" strokeWidth={3}
            style={{ opacity:phase>=1?1:0, transform:phase>=1?"scale(1)":"scale(0.3)", transition:"all 0.5s cubic-bezier(0.34,1.56,0.64,1)" }} />
        </div>
        <div style={{ opacity:phase>=2?1:0, transform:phase>=2?"translateY(0)":"translateY(10px)", transition:"all 0.4s ease" }}>
          <p className="text-3xl font-black text-white mb-1" style={{ fontFamily:"var(--font-display)" }}>Access Denied</p>
          <p className="text-red-400 text-sm mb-1">Invalid email or password</p>
          <p className="text-white/40 text-xs max-w-xs">Your credentials could not be verified. Please check and try again.</p>
        </div>
        <button onClick={onClose}
          className="mt-7 px-6 py-2.5 rounded-xl text-sm font-semibold text-red-300 hover:text-white transition-all"
          style={{ background:"rgba(220,38,38,0.15)", border:"1px solid rgba(220,38,38,0.3)", opacity:phase>=2?1:0, transition:"opacity 0.4s 0.3s, background 0.2s" }}>
          Try Again
        </button>
      </div>
      <style>{`
        @keyframes loginShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-10px)}40%{transform:translateX(10px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}
        @keyframes errorPulse{0%,100%{transform:scale(1);opacity:.35}50%{transform:scale(1.35);opacity:.08}}
      `}</style>
    </div>
  );
}

// ── Forgot password — contact manager overlay ──────────────────────────────
function ForgotOverlay({ dark, onBack }: { dark: boolean; onBack: () => void }) {
  const [phase, setPhase] = useState(0);
  const card = dark ? "rgba(15,23,42,0.85)" : "rgba(255,255,255,0.88)";
  const titleC = dark ? "text-white" : "text-slate-900";
  const bodyC  = dark ? "text-slate-400" : "text-slate-500";
  const iconBg = dark ? "rgba(59,130,246,0.15)" : "rgba(219,234,254,1)";
  const iconBorder = dark ? "rgba(59,130,246,0.3)" : "rgba(147,197,253,1)";

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 100);
    const t2 = setTimeout(() => setPhase(2), 500);
    const t3 = setTimeout(() => setPhase(3), 900);
    return () => { [t1,t2,t3].forEach(clearTimeout); };
  }, []);

  const contacts = [
    { role: "Team Lead",    name: "Kavinda Perera",   avatar: "KP", color: "#3b82f6", ext: "Ext. 201" },
    { role: "HR Manager",   name: "Nishani Fernando", avatar: "NF", color: "#8b5cf6", ext: "Ext. 102" },
    { role: "IT Helpdesk",  name: "support@merncrest.lk", avatar: "IT", color: "#06b6d4", ext: "Ext. 300" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: dark ? "rgba(5,10,25,0.92)" : "rgba(15,23,60,0.80)", backdropFilter:"blur(18px)" }}>

      {/* Animated concentric rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[1,2,3,4].map(i => (
          <div key={i} className="absolute rounded-full border border-blue-400/10"
            style={{ width:i*180, height:i*180, animation:`forgotRing ${2+i*0.4}s ease-out ${i*0.2}s infinite`, opacity:phase>=1?1:0, transition:"opacity 0.6s" }} />
        ))}
      </div>

      {/* Floating icon */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ opacity:phase>=1?0.12:0, transition:"opacity 0.8s" }}>
        <AlertTriangle size={220} className="text-amber-400" />
      </div>

      <div className="relative z-10 w-full max-w-md"
        style={{ opacity:phase>=1?1:0, transform:phase>=1?"translateY(0)":"translateY(24px)", transition:"all 0.6s cubic-bezier(0.34,1.3,0.64,1)" }}>
        <div className="rounded-3xl p-7 shadow-2xl" style={{ background:card, border:`1px solid ${dark?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.08)"}`, backdropFilter:"blur(20px)" }}>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background:"rgba(245,158,11,0.15)", border:"1px solid rgba(245,158,11,0.3)" }}>
              <Lock size={28} className="text-amber-400" />
            </div>
            <h2 className={`text-2xl font-black ${titleC}`} style={{ fontFamily:"var(--font-display)" }}>
              Password Reset
            </h2>
            <p className={`text-sm mt-1 ${bodyC}`}>
              To reset your password, please contact one of the following:
            </p>
          </div>

          {/* Contact cards */}
          <div className="space-y-3 mb-6">
            {contacts.map((c, i) => (
              <div key={c.role}
                style={{ opacity:phase>=(i+2)?1:0, transform:phase>=(i+2)?"translateX(0)":"translateX(-20px)", transition:`all 0.5s ease ${i*0.12}s`, background: dark?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.03)", border:`1px solid ${dark?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.06)"}` }}
                className="flex items-center gap-4 p-3.5 rounded-2xl">
                {/* Avatar */}
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                  style={{ background:c.color }}>
                  {c.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold ${dark?"text-slate-500":"text-slate-400"} uppercase tracking-wide`}>{c.role}</p>
                  <p className={`text-sm font-bold ${dark?"text-white":"text-slate-900"} truncate`}>{c.name}</p>
                  <p className={`text-xs ${dark?"text-slate-500":"text-slate-400"}`}>{c.ext}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer hover:scale-110"
                    style={{ background:iconBg, border:`1px solid ${iconBorder}` }}>
                    <Phone size={13} className="text-blue-400" />
                  </div>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer hover:scale-110"
                    style={{ background:iconBg, border:`1px solid ${iconBorder}` }}>
                    <MessageSquare size={13} className="text-blue-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Info note */}
          <div className="flex items-start gap-3 p-3 rounded-xl mb-5"
            style={{ background:dark?"rgba(245,158,11,0.08)":"rgba(254,243,199,1)", border:`1px solid ${dark?"rgba(245,158,11,0.2)":"rgba(253,230,138,1)"}`, opacity:phase>=3?1:0, transition:"opacity 0.5s 0.4s" }}>
            <AlertTriangle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <p className={`text-xs leading-relaxed ${dark?"text-amber-300/80":"text-amber-700"}`}>
              Your team lead or HR manager will verify your identity and reset your password securely. Do not share your credentials with anyone.
            </p>
          </div>

          {/* Alternative: IT chat */}
          <div className="flex items-center gap-2 p-3 rounded-xl mb-5"
            style={{ background:dark?"rgba(6,182,212,0.08)":"rgba(207,250,254,1)", border:`1px solid ${dark?"rgba(6,182,212,0.2)":"rgba(165,243,252,1)"}`, opacity:phase>=3?1:0, transition:"opacity 0.5s 0.5s" }}>
            <MessageSquare size={14} className="text-cyan-400 flex-shrink-0" />
            <p className={`text-xs ${dark?"text-cyan-300/80":"text-cyan-700"}`}>
              You can also raise a ticket via the <strong>IT Service Desk</strong> from any connected device.
            </p>
            <ChevronRight size={12} className="text-cyan-400 ml-auto flex-shrink-0" />
          </div>

          <button onClick={onBack}
            className="w-full py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
            style={{ background:dark?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.05)", color:dark?"#94a3b8":"#64748b" }}>
            ← Back to Sign In
          </button>
        </div>
      </div>

      <style>{`
        @keyframes forgotRing{
          0%  { transform:scale(0.6); opacity:.5 }
          100%{ transform:scale(2.8); opacity:0  }
        }
      `}</style>
    </div>
  );
}

// ── Main — light theme ────────────────────────────────────────────────────
export default function LoginPage({ onLogin }: { onLogin: () => void }) {
  const dark = false; // light theme
  const [showPwd,      setShowPwd]      = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [showSuccess,  setShowSuccess]  = useState(false);
  const [showError,    setShowError]    = useState(false);
  const [showForgot,   setShowForgot]   = useState(false);
  const [tick,         setTick]         = useState(0);

  const DEMO_EMAIL    = "admin@merncrest.com";
  const DEMO_PASSWORD = "Admin@1234";

  // real-time clock tick
  useEffect(() => {
    const iv = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(iv);
  }, []);

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour:"2-digit", minute:"2-digit", second:"2-digit" });
  const dateStr = now.toLocaleDateString([], { weekday:"short", month:"short", day:"numeric" });

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (email === DEMO_EMAIL && password === DEMO_PASSWORD) setShowSuccess(true);
      else setShowError(true);
    }, 1300);
  }

  // theme tokens
  const bg       = dark ? "rgba(10,14,30,0.82)"  : "rgba(255,255,255,0.82)";
  const border   = dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const titleC   = dark ? "text-white"            : "text-slate-900";
  const labelC   = dark ? "text-slate-300"        : "text-slate-700";
  const subC     = dark ? "text-slate-400"        : "text-slate-500";
  const inputBg  = dark ? "rgba(255,255,255,0.07)": "rgba(0,0,0,0.04)";
  const inputBdr = dark ? "rgba(255,255,255,0.13)": "rgba(0,0,0,0.13)";
  const placeholderC = dark ? "text-slate-600"   : "text-slate-400";

  return (
    <div className={`min-h-screen relative flex items-center justify-center overflow-hidden ${dark ? "bg-slate-950" : "bg-slate-100"}`}>

      {/* IT workspace background — full brightness in light mode */}
      <img
        src={itBg}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{ opacity: 1 }}
      />

      {/* Light overlay — lets the photo show through clearly */}
      <div className="absolute inset-0" style={{ background: "rgba(255,255,255,0.45)" }} />

      {/* Network animation canvas */}
      <NetworkCanvas dark={false} />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-8 py-4"
        style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="flex items-center gap-2.5">
          <img src={mcLogo} alt="MernCrest" className="w-9 h-9 object-contain" />
          <div>
            <p className="font-black text-sm leading-none text-slate-900" style={{ fontFamily:"var(--font-display)" }}>MernCrest Solutions</p>
            <p className="text-[10px] text-slate-500">IT Services ERP</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-600">System Online</span>
          </div>
          <div className="font-mono font-bold text-blue-600">{timeStr}</div>
          <span className="text-slate-500">{dateStr}</span>
        </div>
      </div>

      {/* Live activity feed — left edge */}
      <div className="hidden xl:flex absolute left-8 top-1/2 -translate-y-1/2 z-10 flex-col gap-2 w-52">
        {[
          { icon: Activity, text: "DB backup completed",    time: "12s ago",  color: "text-emerald-600" },
          { icon: Shield,   text: "Firewall rule updated",  time: "2m ago",   color: "text-blue-600"    },
          { icon: Users,    text: "3 new sessions started", time: "5m ago",   color: "text-violet-600"  },
          { icon: Server,   text: "Server-02 health: OK",   time: "8m ago",   color: "text-emerald-600" },
          { icon: Wifi,     text: "VPN gateway active",     time: "11m ago",  color: "text-cyan-600"    },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs"
            style={{ background:"rgba(255,255,255,0.75)", border:"1px solid rgba(0,0,0,0.08)", backdropFilter:"blur(8px)", opacity: 1 - i * 0.12 }}>
            <item.icon size={12} className={item.color} />
            <div className="flex-1 min-w-0">
              <p className="text-slate-700 truncate">{item.text}</p>
              <p className="text-slate-400 text-[10px]">{item.time}</p>
            </div>
          </div>
        ))}
        <p className="text-[10px] text-slate-500 text-center mt-1">Live system activity</p>
      </div>

      {/* Right — server status */}
      <div className="hidden xl:flex absolute right-8 top-1/2 -translate-y-1/2 z-10 flex-col gap-2 w-48">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Infrastructure</p>
        {[
          { name:"Web Server",  status:"Online",  pct:72 },
          { name:"DB Primary",  status:"Online",  pct:58 },
          { name:"Mail Server", status:"Online",  pct:34 },
          { name:"VPN Gateway", status:"Online",  pct:89 },
          { name:"Backup Job",  status:"Running", pct:61 },
        ].map(s => (
          <div key={s.name} className="px-3 py-2 rounded-xl text-xs"
            style={{ background:"rgba(255,255,255,0.75)", border:"1px solid rgba(0,0,0,0.08)", backdropFilter:"blur(8px)" }}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-slate-700">{s.name}</span>
              <span className="text-emerald-600 text-[10px] font-semibold">{s.status}</span>
            </div>
            <div className="h-1 rounded-full overflow-hidden bg-slate-200">
              <div className="h-full rounded-full bg-blue-500" style={{ width:`${s.pct}%`, transition:"width 2s ease" }} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Login card ── */}
      <div className="relative z-10 w-full max-w-[400px] mx-4 my-20">
        <div className="rounded-3xl p-8 shadow-2xl" style={{ background:"rgba(255,255,255,0.92)", border:"1px solid rgba(0,0,0,0.08)", backdropFilter:"blur(24px)" }}>

          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img src={mcLogo} alt="MernCrest" className="w-20 h-20 object-contain" />
          </div>

          <div className="text-center mb-6">
            <h2 className={`text-2xl font-black ${titleC}`} style={{ fontFamily:"var(--font-display)" }}>Welcome back</h2>
            <p className={`text-sm mt-1 ${subC}`}>Sign in to your company account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className={`block text-sm font-semibold ${labelC} mb-1.5`}>Email address</label>
              <div className="relative">
                <Mail size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${placeholderC}`} />
                <input type="email" required value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@merncrest.lk"
                  className={`w-full pl-9 pr-4 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${dark?"text-white":"text-slate-900"} ${placeholderC}`}
                  style={{ background:inputBg, border:`1px solid ${inputBdr}` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={`text-sm font-semibold ${labelC}`}>Password</label>
                <button type="button" onClick={() => setShowForgot(true)}
                  className="text-xs text-blue-500 hover:text-blue-400 font-medium transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${placeholderC}`} />
                <input type={showPwd ? "text" : "password"} required value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`w-full pl-9 pr-10 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${dark?"text-white":"text-slate-900"}`}
                  style={{ background:inputBg, border:`1px solid ${inputBdr}` }} />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${placeholderC} hover:text-blue-500 transition-colors`}>
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" defaultChecked className="rounded" />
              <label htmlFor="remember" className={`text-sm ${subC} select-none`}>Keep me signed in for 8 hours</label>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/30">
              {loading
                ? <><Loader2 size={16} className="animate-spin" /> Signing in...</>
                : <>Sign in <ArrowRight size={16} /></>}
            </button>
          </form>

          {/* Demo creds */}
          <div className="mt-4 p-3 rounded-xl" style={{ background:dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.03)", border:`1px solid ${dark?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.06)"}` }}>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${dark?"text-slate-600":"text-slate-400"} mb-2`}>Demo Credentials</p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className={`text-xs ${subC}`}>Email</span>
                <button type="button" onClick={() => setEmail(DEMO_EMAIL)} className="text-xs font-mono text-blue-400 hover:text-blue-300 transition-colors">admin@merncrest.com</button>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-xs ${subC}`}>Password</span>
                <button type="button" onClick={() => setPassword(DEMO_PASSWORD)} className="text-xs font-mono text-blue-400 hover:text-blue-300 transition-colors">Admin@1234</button>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 flex items-center justify-center gap-1.5" style={{ borderTop:`1px solid ${dark?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.07)"}` }}>
            <ShieldCheck size={11} className={subC} />
            <p className={`text-[11px] ${dark?"text-slate-600":"text-slate-400"}`}>Private system · Unauthorized access is prohibited</p>
          </div>
        </div>
      </div>

      {/* Live stats bar */}
      <LiveStats dark={dark} />

      {/* Overlays */}
      {showSuccess && <SuccessOverlay onDone={onLogin} />}
      {showError   && <ErrorOverlay  onClose={() => setShowError(false)} />}
      {showForgot  && <ForgotOverlay dark={dark} onBack={() => setShowForgot(false)} />}
    </div>
  );
}
