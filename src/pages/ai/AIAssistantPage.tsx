import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, TrendingUp, AlertTriangle, BarChart3, FileText, Bot, User } from "lucide-react";

interface Message { id: string; role: "user" | "assistant"; content: string; time: string; }

const suggestions = [
  { icon: TrendingUp,   label: "Revenue Insights",    prompt: "What are the key revenue trends this quarter?" },
  { icon: AlertTriangle,label: "Risk Analysis",        prompt: "What are the current project risks I should be aware of?" },
  { icon: BarChart3,    label: "Financial Summary",    prompt: "Summarize this month's financial performance" },
  { icon: FileText,     label: "Report Draft",         prompt: "Draft a summary report for Q3 2026 operations" },
];

const initialMessages: Message[] = [
  {
    id: "1", role: "assistant", time: "09:00",
    content: "Hello! I'm your MernCrest AI Assistant. I can help you analyze business data, generate reports, identify risks, and provide insights across your ERP. What would you like to explore today?",
  },
];

const mockReplies: Record<string, string> = {
  "What are the key revenue trends this quarter?":
    "Based on current data:\n\n**Revenue Trend Q3 2026:**\n• Total invoiced: LKR 27.4M (+12% vs Q2)\n• Outstanding: LKR 2.1M (7.7% of total)\n• Top client segment: Banking & Finance (62%)\n\n**Notable patterns:**\n• Sampath Bank engagement increased 35%\n• ERP implementation services driving 48% of revenue\n• 3 quotations totaling LKR 18.9M pending conversion\n\n*Note: These insights are based on available ERP data. Consult your Finance team for validated financials.*",
  "What are the current project risks I should be aware of?":
    "**Active Risk Summary:**\n\n🔴 **High Risk:**\n• Worker-01 server at 91% CPU — potential service disruption\n• Lanka Retail PLC invoice LKR 380,000 overdue 14+ days\n\n🟡 **Medium Risk:**\n• 3 SSL certificates expiring within 34 days\n• QT-2025-0024 quotation validity expires in 12 days\n\n🟢 **Low Risk:**\n• 2 employees with pending leave approvals\n\n*Risk scores are indicative. Always validate with relevant department heads.*",
};

function time() { return new Date().toLocaleTimeString("en-LK", { hour: "2-digit", minute: "2-digit" }); }

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  function send(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: msg, time: time() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      const reply = mockReplies[msg] ?? "I'm analyzing your query. In a live environment, I would connect to your ERP data to provide accurate insights. For now, I can help with questions about revenue trends, risks, employee data, and operational summaries.";
      setMessages(prev => [...prev, { id: Date.now().toString() + "r", role: "assistant", content: reply, time: time() }]);
      setLoading(false);
    }, 1200);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center">
          <Sparkles size={16} className="text-white" />
        </div>
        <div>
          <p className="font-semibold text-slate-800">AI Assistant</p>
          <p className="text-[10px] text-slate-400">Powered by MernCrest Intelligence · Optional module</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs text-emerald-600 font-medium">Active</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4" style={{ background: "#f8fafc" }}>
        {messages.length === 1 && (
          <div className="grid grid-cols-2 gap-3 mt-4">
            {suggestions.map(s => (
              <button
                key={s.label}
                onClick={() => send(s.prompt)}
                className="flex items-center gap-2.5 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl p-3.5 text-left transition-colors group"
              >
                <s.icon size={16} className="text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-700 group-hover:text-blue-700">{s.label}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{s.prompt}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === "assistant" ? "bg-gradient-to-br from-violet-500 to-blue-600" : "bg-slate-200"
            }`}>
              {msg.role === "assistant" ? <Bot size={12} className="text-white" /> : <User size={12} className="text-slate-600" />}
            </div>
            <div className={`max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
              <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-tr-sm"
                  : "bg-white border border-slate-200 text-slate-700 rounded-tl-sm"
              }`}>
                {msg.content.split("\n").map((line, i) => {
                  if (line.startsWith("**") && line.endsWith("**")) {
                    return <p key={i} className="font-semibold mt-1">{line.replace(/\*\*/g, "")}</p>;
                  }
                  if (line.startsWith("•")) {
                    return <p key={i} className="ml-2">{line}</p>;
                  }
                  if (line.startsWith("🔴") || line.startsWith("🟡") || line.startsWith("🟢")) {
                    return <p key={i} className="mt-1.5">{line}</p>;
                  }
                  if (line.startsWith("*Note:") || line.startsWith("*Risk")) {
                    return <p key={i} className="text-xs opacity-60 mt-2 italic">{line.replace(/\*/g, "")}</p>;
                  }
                  return <p key={i}>{line}</p>;
                })}
              </div>
              <span className="text-[10px] text-slate-400">{msg.time}</span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center flex-shrink-0">
              <Bot size={12} className="text-white" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
              {[0,1,2].map(i => (
                <div key={i} className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-slate-200 bg-white">
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Ask anything about your business data…"
            className="flex-1 text-sm bg-transparent outline-none text-slate-700 placeholder-slate-400"
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="w-8 h-8 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg flex items-center justify-center transition-colors"
          >
            <Send size={13} />
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-2 text-center">AI responses are for guidance only. Always verify critical business data with your team.</p>
      </div>
    </div>
  );
}
