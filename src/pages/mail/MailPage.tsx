import { useState } from "react";
import {
  Inbox, Star, Send, FileText, Clock, Archive, Trash2, AlertCircle, Search,
  Pen, RefreshCw, ChevronDown, Paperclip, MoreHorizontal, Reply, Forward,
  ReplyAll, Tag, X, Bold, Italic, Underline, List, Link, AlignLeft, Minus,
  CheckCircle, AlertTriangle, Circle, ExternalLink, Mail, Filter, ChevronRight,
} from "lucide-react";
import Avatar from "../../components/ui/Avatar";

/* ─── types ─── */
interface EmailAccount { id: string; name: string; email: string; provider: "google" | "company"; unread: number; }
interface EmailFolder  { id: string; label: string; icon: React.ComponentType<{size?: number; className?: string}>; count?: number; }
interface Email {
  id: string; from: string; fromEmail: string; to: string; subject: string;
  preview: string; body: string; date: string; time: string; read: boolean;
  starred: boolean; folder: string; labels: string[];
  attachments: { name: string; size: string; type: string }[];
  thread: { from: string; fromEmail: string; body: string; time: string }[];
}

/* ─── mock data ─── */
const accounts: EmailAccount[] = [
  { id: "a1", name: "Dilshan Fernando", email: "dilshan@merncrest.lk",   provider: "company", unread: 7  },
  { id: "a2", name: "Dilshan Fernando", email: "dilshan@merncrest.com",  provider: "google",  unread: 4  },
];

const folders: EmailFolder[] = [
  { id: "inbox",     label: "Inbox",     icon: Inbox,       count: 11 },
  { id: "starred",   label: "Starred",   icon: Star                   },
  { id: "sent",      label: "Sent",      icon: Send                   },
  { id: "drafts",    label: "Drafts",    icon: FileText,    count: 3  },
  { id: "scheduled", label: "Scheduled", icon: Clock                  },
  { id: "archive",   label: "Archive",   icon: Archive                },
  { id: "spam",      label: "Spam",      icon: AlertCircle             },
  { id: "trash",     label: "Trash",     icon: Trash2                  },
];

const emails: Email[] = [
  {
    id: "e1", folder: "inbox", read: false, starred: true,
    from: "Sameera Bandara", fromEmail: "sameera@merncrest.lk", to: "dilshan@merncrest.lk",
    subject: "AWS Infrastructure Cost Review — Q1 2025",
    preview: "Hi Dilshan, I have completed the Q1 cost analysis for our AWS accounts. The total spend...",
    body: "Hi Dilshan,\n\nI have completed the Q1 cost analysis for our AWS accounts. The total spend for Q1 came to LKR 2.4M, which is 12% above our forecasted budget.\n\nThe primary drivers were:\n- EC2 instance over-provisioning in the production cluster\n- Unused Elastic IPs\n- High data transfer costs to external regions\n\nI have prepared a detailed breakdown in the attached report. Please review and let me know if you would like to schedule a call to discuss optimization strategies.\n\nBest regards,\nSameera",
    date: "Today", time: "10:42 AM", labels: ["Infrastructure", "Finance"],
    attachments: [{ name: "AWS_Q1_Cost_Report.pdf", size: "2.4 MB", type: "pdf" }],
    thread: [
      { from: "Dilshan Fernando", fromEmail: "dilshan@merncrest.lk", body: "Thanks Sameera, I will review this and get back to you by EOD.", time: "11:05 AM" },
    ],
  },
  {
    id: "e2", folder: "inbox", read: false, starred: false,
    from: "Priya Jayawardena", fromEmail: "priya@merncrest.lk", to: "dilshan@merncrest.lk",
    subject: "ERP Demo — Sampath Bank — Confirmed for March 18",
    preview: "The client has confirmed the demo slot. Please prepare the ERP walkthrough presentation...",
    body: "Hi Dilshan,\n\nSampath Bank has confirmed the ERP demo for March 18 at 2:00 PM. The contact is Mr. Nuwan Perera (Head of IT).\n\nPlease prepare the ERP walkthrough covering:\n1. HR & Payroll module\n2. Finance & Accounting\n3. CRM & Sales\n4. Service Desk\n\nI have attached the meeting brief. Please coordinate with Kavinda for the technical setup.\n\nRegards,\nPriya",
    date: "Today", time: "09:15 AM", labels: ["Sales", "CRM"],
    attachments: [{ name: "Sampath_Bank_Demo_Brief.docx", size: "340 KB", type: "docx" }],
    thread: [],
  },
  {
    id: "e3", folder: "inbox", read: true, starred: false,
    from: "Kavinda Perera", fromEmail: "kavinda@merncrest.lk", to: "dilshan@merncrest.lk",
    subject: "Production Deployment — 2:00 AM Tonight",
    preview: "Deployment window confirmed. ERP v2.4.1 will be deployed tonight at 2:00 AM. Estimated downtime...",
    body: "Hi team,\n\nDeployment window confirmed. ERP v2.4.1 will be deployed tonight at 2:00 AM. Estimated downtime is 15 minutes.\n\nChanges in this release:\n- Payroll module performance fixes\n- Leave balance calculation correction\n- Invoice PDF template update\n\nPlease ensure no critical tasks are scheduled during this window.\n\nKavinda",
    date: "Yesterday", time: "4:30 PM", labels: ["Engineering"],
    attachments: [],
    thread: [],
  },
  {
    id: "e4", folder: "inbox", read: true, starred: true,
    from: "Amali De Silva", fromEmail: "amali@merncrest.lk", to: "dilshan@merncrest.lk",
    subject: "Employee Onboarding — March Batch — Documents Required",
    preview: "3 new employees joining on March 15. Please review their documents before the onboarding session...",
    body: "Hi Dilshan,\n\n3 new employees are joining on March 15. Their registration forms have been submitted. Please review and approve before the onboarding session at 9:00 AM.\n\nCandidates:\n1. Sandun Ratnayake — Software Engineer\n2. Nimasha Perera — QA Engineer\n3. Ravindu Bandara — UI Designer\n\nAll documents are attached for your review.\n\nAmali",
    date: "Yesterday", time: "2:10 PM", labels: ["HR"],
    attachments: [
      { name: "Sandun_Ratnayake_Docs.zip", size: "5.1 MB", type: "zip" },
      { name: "Nimasha_Perera_Docs.zip",   size: "4.8 MB", type: "zip" },
    ],
    thread: [],
  },
  {
    id: "e5", folder: "inbox", read: true, starred: false,
    from: "Ishara Madushani", fromEmail: "ishara@merncrest.lk", to: "dilshan@merncrest.lk",
    subject: "March Digital Marketing Report",
    preview: "Please find attached the March digital marketing performance report. Google Ads ROAS improved...",
    body: "Hi Dilshan,\n\nPlease find attached the March digital marketing performance report.\n\nHighlights:\n- Google Ads ROAS: 4.2x (target: 3.5x)\n- LinkedIn leads: 18 (target: 12)\n- SEO: Top 3 ranking achieved for 3 target keywords\n\nFull report attached.\n\nIshara",
    date: "Mar 9", time: "11:30 AM", labels: ["Marketing"],
    attachments: [{ name: "March_Marketing_Report.xlsx", size: "1.2 MB", type: "xlsx" }],
    thread: [],
  },
];

const labelColors: Record<string, string> = {
  Infrastructure: "bg-cyan-100 text-cyan-700",
  Finance: "bg-emerald-100 text-emerald-700",
  Sales: "bg-blue-100 text-blue-700",
  CRM: "bg-violet-100 text-violet-700",
  Engineering: "bg-slate-100 text-slate-700",
  HR: "bg-pink-100 text-pink-700",
  Marketing: "bg-orange-100 text-orange-700",
};

const fileIconColor: Record<string, string> = {
  pdf: "text-red-500 bg-red-50",
  docx: "text-blue-500 bg-blue-50",
  xlsx: "text-emerald-500 bg-emerald-50",
  zip: "text-amber-500 bg-amber-50",
  pptx: "text-orange-500 bg-orange-50",
};

/* ─── Composer ─── */
function Composer({ onClose }: { onClose: () => void }) {
  const [minimized, setMinimized] = useState(false);
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [showCc, setShowCc] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sent, setSent] = useState(false);

  function handleSend() {
    setSent(true);
    setTimeout(onClose, 1200);
  }

  if (minimized) return (
    <div className="fixed bottom-0 right-6 z-50 w-72 bg-slate-800 text-white rounded-t-xl shadow-2xl flex items-center justify-between px-4 py-2.5 cursor-pointer" onClick={() => setMinimized(false)}>
      <span className="text-sm font-medium">{subject || "New Message"}</span>
      <div className="flex items-center gap-2">
        <button className="p-1 hover:bg-slate-700 rounded" onClick={e => { e.stopPropagation(); setMinimized(false); }}><ChevronDown size={14} /></button>
        <button className="p-1 hover:bg-red-600 rounded" onClick={e => { e.stopPropagation(); onClose(); }}><X size={14} /></button>
      </div>
    </div>
  );

  return (
    <div className="fixed bottom-0 right-6 z-50 w-[560px] bg-white rounded-t-2xl shadow-2xl border border-slate-200 flex flex-col" style={{ maxHeight: "80vh" }}>
      {/* Title bar */}
      <div className="flex items-center justify-between bg-slate-800 text-white px-4 py-2.5 rounded-t-2xl flex-shrink-0">
        <span className="text-sm font-semibold">New Message</span>
        <div className="flex items-center gap-1">
          <button onClick={() => setMinimized(true)} className="p-1 hover:bg-slate-700 rounded"><Minus size={14} /></button>
          <button onClick={onClose} className="p-1 hover:bg-red-600 rounded"><X size={14} /></button>
        </div>
      </div>
      {/* Fields */}
      <div className="flex-shrink-0 border-b border-slate-100">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-100">
          <span className="text-xs text-slate-400 w-7">To</span>
          <input value={to} onChange={e => setTo(e.target.value)} placeholder="Recipients" className="flex-1 text-sm focus:outline-none text-slate-700" />
          <button onClick={() => setShowCc(true)} className="text-xs text-blue-600 hover:underline">Cc</button>
        </div>
        {showCc && (
          <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-100">
            <span className="text-xs text-slate-400 w-7">Cc</span>
            <input value={cc} onChange={e => setCc(e.target.value)} placeholder="Cc" className="flex-1 text-sm focus:outline-none text-slate-700" />
          </div>
        )}
        <div className="flex items-center gap-2 px-4 py-2">
          <span className="text-xs text-slate-400 w-7">Sub</span>
          <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject" className="flex-1 text-sm focus:outline-none text-slate-700 font-medium" />
        </div>
      </div>
      {/* Formatting toolbar */}
      <div className="flex items-center gap-0.5 px-3 py-1.5 border-b border-slate-100 flex-shrink-0">
        {[Bold, Italic, Underline, List, Link, AlignLeft].map((Icon, i) => (
          <button key={i} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
            <Icon size={13} />
          </button>
        ))}
      </div>
      {/* Body */}
      <textarea
        value={body}
        onChange={e => setBody(e.target.value)}
        placeholder="Write your message..."
        className="flex-1 px-4 py-3 text-sm text-slate-700 resize-none focus:outline-none min-h-[160px]"
      />
      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-1">
          <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500" title="Attach"><Paperclip size={15} /></button>
          <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500" title="More"><MoreHorizontal size={15} /></button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-700 px-3 py-1.5 hover:bg-slate-100 rounded-lg transition-colors">Discard</button>
          <button onClick={() => {}} className="flex items-center gap-1 text-sm text-slate-600 border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors">
            <FileText size={13} /> Save Draft
          </button>
          <button
            onClick={handleSend}
            disabled={!to || sent}
            className="flex items-center gap-1.5 text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-4 py-1.5 rounded-xl transition-colors"
          >
            {sent ? <><CheckCircle size={13} /> Sent!</> : <><Send size={13} /> Send</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Email row ─── */
function EmailRow({ email, selected, onClick, onDelete }: { email: Email; selected: boolean; onClick: () => void; onDelete: () => void }) {
  const [deleting, setDeleting] = useState(false);
  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    setDeleting(true);
    setTimeout(onDelete, 320);
  }
  return (
    <div
      onClick={onClick}
      className={`flex items-start gap-3 px-4 py-3.5 border-b border-slate-100 cursor-pointer transition-all group relative overflow-hidden ${selected ? "bg-blue-50 border-l-2 border-l-blue-600" : email.read ? "hover:bg-slate-50" : "bg-white hover:bg-slate-50"} ${deleting ? "opacity-0 -translate-x-full scale-95" : "opacity-100 translate-x-0 scale-100"}`}
      style={{ transition: "opacity 0.3s, transform 0.3s" }}
    >
      {/* Quick delete on hover */}
      <button
        onClick={handleDelete}
        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-100 rounded-lg text-red-400 hover:text-red-600 z-10"
        title="Delete"
      >
        <Trash2 size={13} />
      </button>
      <div className="flex-shrink-0 pt-0.5">
        <Avatar name={email.from} size="sm" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-sm truncate ${!email.read ? "font-bold text-slate-900" : "font-medium text-slate-700"}`}>{email.from}</span>
          <span className="text-[10px] text-slate-400 flex-shrink-0 tabular-nums">{email.time}</span>
        </div>
        <p className={`text-xs truncate mt-0.5 ${!email.read ? "font-semibold text-slate-800" : "text-slate-600"}`}>{email.subject}</p>
        <p className="text-[11px] text-slate-400 truncate mt-0.5">{email.preview}</p>
        <div className="flex items-center gap-1 mt-1.5 flex-wrap">
          {email.attachments.length > 0 && <Paperclip size={10} className="text-slate-400" />}
          {email.labels.map(l => (
            <span key={l} className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${labelColors[l] ?? "bg-slate-100 text-slate-600"}`}>{l}</span>
          ))}
        </div>
      </div>
      {!email.read && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />}
    </div>
  );
}

/* ─── Delete confirmation ─── */
function DeleteConfirm({ email, onConfirm, onCancel }: { email: Email; onConfirm: () => void; onCancel: () => void }) {
  const [deleting, setDeleting] = useState(false);
  function confirm() {
    setDeleting(true);
    setTimeout(onConfirm, 700);
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onCancel}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center" onClick={e => e.stopPropagation()}
        style={{ animation: "deleteConfirmIn 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}>
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 transition-all ${deleting ? "bg-red-500 scale-110" : "bg-red-50"}`}>
          <Trash2 size={22} className={deleting ? "text-white" : "text-red-500"} />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1" style={{ fontFamily: "var(--font-display)" }}>Delete Email?</h3>
        <p className="text-sm text-slate-500 mb-1 truncate px-4">{email.subject}</p>
        <p className="text-xs text-slate-400 mb-5">This email will be moved to Trash.</p>
        <div className="flex gap-2">
          <button onClick={onCancel} disabled={deleting}
            className="flex-1 py-2.5 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button onClick={confirm} disabled={deleting}
            className="flex-1 py-2.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-semibold disabled:opacity-70 flex items-center justify-center gap-1.5">
            {deleting ? (
              <><span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Deleting...</>
            ) : (
              <><Trash2 size={13} /> Delete</>
            )}
          </button>
        </div>
      </div>
      <style>{`@keyframes deleteConfirmIn{from{transform:scale(0.85);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
    </div>
  );
}

/* ─── Email detail panel ─── */
function EmailDetail({ email, onClose, onDelete }: { email: Email; onClose: () => void; onDelete: () => void }) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
        <div className="flex-1 min-w-0 pr-4">
          <h2 className="font-bold text-slate-900 text-base leading-snug" style={{ fontFamily: "var(--font-display)" }}>{email.subject}</h2>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {email.labels.map(l => (
              <span key={l} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${labelColors[l] ?? "bg-slate-100 text-slate-600"}`}>{l}</span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {[{ icon: Reply, title: "Reply", onClick: () => setReplyOpen(true) }, { icon: ReplyAll, title: "Reply All", onClick: undefined }, { icon: Forward, title: "Forward", onClick: undefined }, { icon: Archive, title: "Archive", onClick: undefined }].map(({ icon: Icon, title, onClick }) => (
            <button key={title} title={title} onClick={onClick} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
              <Icon size={15} />
            </button>
          ))}
          <button title="Delete" onClick={() => setConfirmDelete(true)} className="p-2 hover:bg-red-50 rounded-lg text-slate-500 hover:text-red-500 transition-colors">
            <Trash2 size={15} />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><MoreHorizontal size={15} /></button>
        </div>
        {confirmDelete && (
          <DeleteConfirm
            email={email}
            onConfirm={() => { setConfirmDelete(false); onDelete(); }}
            onCancel={() => setConfirmDelete(false)}
          />
        )}
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        {/* Sender info */}
        <div className="flex items-start gap-3 px-6 py-4 border-b border-slate-100">
          <Avatar name={email.from} size="md" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-900 text-sm">{email.from}</span>
                <span className="text-xs text-slate-400 ml-2">&lt;{email.fromEmail}&gt;</span>
              </div>
              <span className="text-xs text-slate-400 tabular-nums">{email.date} · {email.time}</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">To: {email.to}</p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{email.body}</p>
        </div>

        {/* Attachments */}
        {email.attachments.length > 0 && (
          <div className="px-6 pb-5">
            <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Attachments ({email.attachments.length})</p>
            <div className="flex flex-wrap gap-2">
              {email.attachments.map(a => (
                <div key={a.name} className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 bg-white hover:bg-slate-50 cursor-pointer group transition-colors">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold ${fileIconColor[a.type] ?? "bg-slate-100 text-slate-500"}`}>{a.type.toUpperCase()}</div>
                  <div>
                    <p className="text-xs font-medium text-slate-700">{a.name}</p>
                    <p className="text-[10px] text-slate-400">{a.size}</p>
                  </div>
                  <ExternalLink size={12} className="text-slate-300 group-hover:text-blue-500 ml-1 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Thread */}
        {email.thread.length > 0 && (
          <div className="px-6 pb-5 space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide border-t border-slate-100 pt-4">Thread ({email.thread.length + 1} messages)</p>
            {email.thread.map((t, i) => (
              <div key={i} className="flex items-start gap-3 bg-slate-50 rounded-xl p-3">
                <Avatar name={t.from} size="sm" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-800">{t.from}</span>
                    <span className="text-[10px] text-slate-400">{t.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{t.body}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reply composer */}
        {replyOpen && (
          <div className="mx-6 mb-6 border border-slate-200 rounded-2xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-2.5 flex items-center justify-between border-b border-slate-200">
              <div className="flex gap-2">
                {["Reply", "Reply All", "Forward"].map(m => (
                  <button key={m} className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors ${m === "Reply" ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-200"}`}>{m}</button>
                ))}
              </div>
              <button onClick={() => setReplyOpen(false)} className="p-1 hover:bg-slate-200 rounded-lg"><X size={13} className="text-slate-500" /></button>
            </div>
            <div className="px-4 py-2 border-b border-slate-100">
              <span className="text-xs text-slate-400">To: </span>
              <span className="text-xs text-slate-700">{email.fromEmail}</span>
            </div>
            <div className="flex items-center gap-0.5 px-3 py-1.5 border-b border-slate-100">
              {[Bold, Italic, Underline, List, Link].map((Icon, i) => (
                <button key={i} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500">
                  <Icon size={12} />
                </button>
              ))}
            </div>
            <textarea
              value={replyBody}
              onChange={e => setReplyBody(e.target.value)}
              placeholder="Write your reply..."
              rows={4}
              className="w-full px-4 py-3 text-sm text-slate-700 resize-none focus:outline-none"
            />
            <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-1">
                <button className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500"><Paperclip size={13} /></button>
              </div>
              <button
                disabled={!replyBody}
                className="flex items-center gap-1.5 text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-1.5 rounded-xl transition-colors"
              >
                <Send size={13} /> Send Reply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main page ─── */
export default function MailPage() {
  const [activeAccount, setActiveAccount] = useState(accounts[0]);
  const [activeFolder, setActiveFolder]   = useState("inbox");
  const [allEmails, setAllEmails]         = useState<Email[]>(emails);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(emails[0]);
  const [showComposer, setShowComposer]   = useState(false);
  const [search, setSearch]              = useState("");

  function deleteEmail(id: string) {
    setAllEmails(prev => prev.map(e => e.id === id ? { ...e, folder: "trash" } : e));
    if (selectedEmail?.id === id) setSelectedEmail(null);
  }

  const visibleEmails = allEmails.filter(e =>
    e.folder === activeFolder &&
    (!search || e.subject.toLowerCase().includes(search.toLowerCase()) || e.from.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex h-full overflow-hidden bg-white" style={{ height: "calc(100vh - 57px)" }}>
      {/* ── Left sidebar ── */}
      <div className="w-52 flex-shrink-0 border-r border-slate-200 flex flex-col bg-slate-50 overflow-hidden">
        {/* Account switcher */}
        <div className="px-3 pt-4 pb-3 border-b border-slate-200">
          <button className="w-full flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-3 py-2.5 hover:border-blue-300 transition-colors">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${activeAccount.provider === "google" ? "bg-red-500" : "bg-blue-500"}`} />
            <div className="flex-1 min-w-0 text-left">
              <p className="text-[11px] font-semibold text-slate-800 truncate">{activeAccount.email}</p>
              <p className="text-[9px] text-slate-400">{activeAccount.provider === "google" ? "Google Workspace" : "Company Email"}</p>
            </div>
            <ChevronDown size={12} className="text-slate-400 flex-shrink-0" />
          </button>
          {/* Account list */}
          <div className="mt-2 space-y-1">
            {accounts.map(a => (
              <button key={a.id} onClick={() => setActiveAccount(a)} className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors ${activeAccount.id === a.id ? "bg-blue-50" : "hover:bg-slate-100"}`}>
                <Mail size={12} className={activeAccount.id === a.id ? "text-blue-600" : "text-slate-400"} />
                <span className="text-[11px] text-slate-600 truncate flex-1">{a.email}</span>
                {a.unread > 0 && <span className="text-[9px] font-bold bg-blue-600 text-white rounded-full w-4 h-4 flex items-center justify-center">{a.unread}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Compose */}
        <div className="px-3 py-3">
          <button
            onClick={() => setShowComposer(true)}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors shadow-sm shadow-blue-200"
          >
            <Pen size={14} /> Compose
          </button>
        </div>

        {/* Folders */}
        <nav className="flex-1 overflow-y-auto px-2 pb-3 space-y-0.5">
          {folders.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFolder(f.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors ${activeFolder === f.id ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-200"}`}
            >
              <f.icon size={14} />
              <span className="text-xs font-medium flex-1">{f.label}</span>
              {f.count && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeFolder === f.id ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"}`}>{f.count}</span>}
            </button>
          ))}
          {/* Labels section */}
          <div className="pt-3">
            <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400 px-3 mb-1">Labels</p>
            {Object.keys(labelColors).map(l => (
              <button key={l} className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-slate-600 hover:bg-slate-200 transition-colors">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${labelColors[l].split(" ")[0]}`} />
                <span className="text-xs">{l}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* ── Email list ── */}
      <div className="w-72 flex-shrink-0 border-r border-slate-200 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-slate-100">
          <div className="flex-1 relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search mail..."
              className="w-full pl-7 pr-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"><RefreshCw size={13} /></button>
          <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"><Filter size={13} /></button>
        </div>

        {/* Folder header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
          <span className="text-sm font-bold text-slate-800 capitalize">{activeFolder}</span>
          <span className="text-[10px] text-slate-400">{visibleEmails.length} emails</span>
        </div>

        {/* Email list */}
        <div className="flex-1 overflow-y-auto">
          {visibleEmails.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Inbox size={28} className="text-slate-200 mb-2" />
              <p className="text-xs text-slate-400">No emails in {activeFolder}</p>
            </div>
          ) : (
            visibleEmails.map(e => (
              <EmailRow key={e.id} email={e} selected={selectedEmail?.id === e.id} onClick={() => setSelectedEmail(e)} onDelete={() => deleteEmail(e.id)} />
            ))
          )}
        </div>
      </div>

      {/* ── Reading pane ── */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {selectedEmail ? (
          <EmailDetail email={selectedEmail} onClose={() => setSelectedEmail(null)} onDelete={() => deleteEmail(selectedEmail.id)} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Mail size={40} className="text-slate-200 mb-3" />
            <p className="text-sm font-medium text-slate-400">Select an email to read</p>
          </div>
        )}
      </div>

      {/* Composer */}
      {showComposer && <Composer onClose={() => setShowComposer(false)} />}
    </div>
  );
}
