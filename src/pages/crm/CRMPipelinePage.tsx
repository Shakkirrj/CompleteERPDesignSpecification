import { useState } from "react";
import { ArrowLeft, Plus, ChevronRight, DollarSign, User, Calendar, MoreHorizontal } from "lucide-react";
import Avatar from "../../components/ui/Avatar";

const stageConfig = [
  { id: "discovery", label: "Discovery", color: "border-slate-300 bg-slate-50", header: "bg-slate-100 text-slate-700", dot: "bg-slate-400" },
  { id: "qualified", label: "Qualified", color: "border-violet-200 bg-violet-50/30", header: "bg-violet-100 text-violet-700", dot: "bg-violet-500" },
  { id: "proposal", label: "Proposal", color: "border-blue-200 bg-blue-50/30", header: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  { id: "negotiation", label: "Negotiation", color: "border-amber-200 bg-amber-50/30", header: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
  { id: "won", label: "Won", color: "border-emerald-200 bg-emerald-50/30", header: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
];

const deals = [
  { id: "D001", title: "E-Commerce ERP Suite", company: "Lanka Retail PLC", value: 4200000, owner: "Chamara Wickramasinghe", closeDate: "2025-04-15", stage: "proposal", probability: 65 },
  { id: "D002", title: "HR & Payroll System", company: "Sampath Bank", value: 5800000, owner: "Priya Jayawardena", closeDate: "2025-05-01", stage: "negotiation", probability: 80 },
  { id: "D003", title: "Digital Banking Portal", company: "NDB Bank", value: 2100000, owner: "Chamara Wickramasinghe", closeDate: "2025-04-30", stage: "discovery", probability: 20 },
  { id: "D004", title: "Cloud Infrastructure Migration", company: "John Keells Holdings", value: 9500000, owner: "Priya Jayawardena", closeDate: "2025-06-30", stage: "negotiation", probability: 70 },
  { id: "D005", title: "IT Security Assessment", company: "Dialog Axiata PLC", value: 1200000, owner: "Chamara Wickramasinghe", closeDate: "2025-03-31", stage: "won", probability: 100 },
  { id: "D006", title: "Mobile App Development", company: "Hayleys Group", value: 3200000, owner: "Chamara Wickramasinghe", closeDate: "2025-05-15", stage: "qualified", probability: 45 },
  { id: "D007", title: "ERP Phase 2 Rollout", company: "MAS Holdings", value: 7800000, owner: "Priya Jayawardena", closeDate: "2025-07-01", stage: "proposal", probability: 60 },
  { id: "D008", title: "POS Integration Suite", company: "Brandix Lanka", value: 4100000, owner: "Chamara Wickramasinghe", closeDate: "2025-05-30", stage: "qualified", probability: 40 },
  { id: "D009", title: "IoT Monitoring Platform", company: "Laugfs Gas PLC", value: 2600000, owner: "Priya Jayawardena", closeDate: "2025-04-20", stage: "discovery", probability: 15 },
  { id: "D010", title: "Loyalty App Rebuild", company: "Lion Brewery", value: 1900000, owner: "Chamara Wickramasinghe", closeDate: "2025-04-10", stage: "won", probability: 100 },
];

interface Props { onBack: () => void; }

export default function CRMPipelinePage({ onBack }: Props) {
  const [dragging, setDragging] = useState<string | null>(null);
  const [dealStages, setDealStages] = useState<Record<string, string>>(
    Object.fromEntries(deals.map(d => [d.id, d.stage]))
  );

  const totalPipeline = deals.reduce((a, d) => a + d.value, 0);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Pipeline</h2>
          <p className="text-sm text-slate-500 mt-0.5">{deals.length} deals · LKR {(totalPipeline/1000000).toFixed(1)}M total pipeline</p>
        </div>
        <button className="flex items-center gap-2 text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors font-medium">
          <Plus size={14} /> New Deal
        </button>
      </div>

      {/* Stage summary row */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1">
        {stageConfig.map((s, i) => {
          const stageDeals = deals.filter(d => (dealStages[d.id] ?? d.stage) === s.id);
          const stageValue = stageDeals.reduce((a, d) => a + d.value, 0);
          return (
            <div key={s.id} className="flex items-center gap-2 flex-shrink-0">
              <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-center min-w-32">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <div className={`w-2 h-2 rounded-full ${s.dot}`} />
                  <p className="text-xs font-semibold text-slate-600">{s.label}</p>
                </div>
                <p className="text-base font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>{stageDeals.length}</p>
                <p className="text-[10px] text-slate-400">LKR {(stageValue/1000000).toFixed(1)}M</p>
              </div>
              {i < stageConfig.length - 1 && <ChevronRight size={14} className="text-slate-300 flex-shrink-0" />}
            </div>
          );
        })}
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-5 gap-3 overflow-x-auto">
        {stageConfig.map(stage => {
          const stageDeals = deals.filter(d => (dealStages[d.id] ?? d.stage) === stage.id);
          return (
            <div key={stage.id}
              className={`rounded-xl border ${stage.color} min-h-96 p-3 transition-all`}
              onDragOver={e => e.preventDefault()}
              onDrop={() => {
                if (dragging) {
                  setDealStages(prev => ({ ...prev, [dragging]: stage.id }));
                  setDragging(null);
                }
              }}
            >
              <div className={`flex items-center justify-between px-2 py-1.5 rounded-lg mb-3 ${stage.header}`}>
                <span className="text-xs font-bold">{stage.label}</span>
                <span className="text-xs font-bold">{stageDeals.length}</span>
              </div>

              <div className="space-y-2">
                {stageDeals.map(deal => (
                  <div key={deal.id}
                    draggable
                    onDragStart={() => setDragging(deal.id)}
                    onDragEnd={() => setDragging(null)}
                    className="bg-white rounded-xl border border-slate-200 p-3 cursor-grab hover:shadow-md transition-all active:cursor-grabbing"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-xs font-semibold text-slate-800 leading-tight">{deal.title}</p>
                      <button className="text-slate-300 hover:text-slate-500"><MoreHorizontal size={12} /></button>
                    </div>
                    <p className="text-[10px] text-slate-500 mb-2">{deal.company}</p>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1 text-[10px] text-slate-500">
                        <DollarSign size={9} />
                        <span className="font-semibold text-slate-700">LKR {(deal.value/1000000).toFixed(1)}M</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500">
                        <Calendar size={9} />
                        {deal.closeDate}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <Avatar name={deal.owner} size="xs" />
                        <div className="flex items-center gap-1">
                          <div className="w-12 h-1 bg-slate-100 rounded-full">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${deal.probability}%` }} />
                          </div>
                          <span className="text-[9px] text-slate-400">{deal.probability}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-2 py-1.5 text-xs text-slate-400 hover:text-slate-600 hover:bg-white/60 rounded-lg transition-colors flex items-center justify-center gap-1">
                <Plus size={10} /> Add deal
              </button>
            </div>
          );
        })}
      </div>
      <p className="text-[10px] text-slate-400 text-center">Drag deals between stages to update their status</p>
    </div>
  );
}
