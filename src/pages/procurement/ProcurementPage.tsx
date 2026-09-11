import { useState } from "react";
import {
  Folder, FolderOpen, ShoppingBag, ChevronRight, ChevronDown, Grid, List,
  Search, Plus, ArrowUp, Eye, Edit3, FileText, Clock, CheckCircle2,
  AlertTriangle, X, Send,
} from "lucide-react";

interface ProcItem {
  id: string; name: string; type: "category" | "doc";
  docType?: "pr" | "po" | "rfq" | "receipt";
  vendor?: string; amount?: number; status?: "draft" | "pending" | "approved" | "ordered" | "received" | "rejected";
  created?: string; lastUpdated: string; ref?: string;
  children?: ProcItem[];
}

const statusColors: Record<string, string> = {
  draft:    "bg-slate-100 text-slate-500",
  pending:  "bg-amber-50 text-amber-700",
  approved: "bg-blue-50 text-blue-700",
  ordered:  "bg-violet-50 text-violet-700",
  received: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-600",
};

const docTypeColors: Record<string, string> = {
  pr:      "bg-blue-50 text-blue-700",
  po:      "bg-violet-50 text-violet-700",
  rfq:     "bg-amber-50 text-amber-700",
  receipt: "bg-emerald-50 text-emerald-700",
};
const docTypeLabel: Record<string, string> = { pr: "PR", po: "PO", rfq: "RFQ", receipt: "GRN" };

const TREE: ProcItem[] = [
  { id: "p1", name: "Purchase Requests", type: "category", lastUpdated: "Sep 11",
    children: [
      { id: "p1-1", name: "PR-2025-0041 — MacBook Pro M3 ×2", type: "doc", docType: "pr", vendor: "Apple Reseller LK", amount: 1360000, status: "approved", created: "Sep 09", lastUpdated: "Sep 11", ref: "MC-PR-2025-0041" },
      { id: "p1-2", name: "PR-2025-0040 — Office Stationery Q2", type: "doc", docType: "pr", vendor: "OfficeHub", amount: 85000, status: "pending", created: "Sep 08", lastUpdated: "Sep 08", ref: "MC-PR-2025-0040" },
      { id: "p1-3", name: "PR-2025-0039 — AWS Reserved Instances", type: "doc", docType: "pr", vendor: "Amazon Web Services", amount: 620000, status: "draft", created: "Sep 07", lastUpdated: "Sep 07", ref: "MC-PR-2025-0039" },
    ]
  },
  { id: "p2", name: "Purchase Orders", type: "category", lastUpdated: "Sep 10",
    children: [
      { id: "p2-1", name: "PO-2025-0033 — Dell XPS Laptops ×5", type: "doc", docType: "po", vendor: "Dell Sri Lanka", amount: 2100000, status: "ordered",  created: "Sep 05", lastUpdated: "Sep 10", ref: "MC-PO-2025-0033" },
      { id: "p2-2", name: "PO-2025-0032 — FortiGate Firewall",  type: "doc", docType: "po", vendor: "Fortinet Dist.",   amount: 520000,  status: "received", created: "Aug 20", lastUpdated: "Sep 01", ref: "MC-PO-2025-0032" },
    ]
  },
  { id: "p3", name: "RFQ / Quotations", type: "category", lastUpdated: "Sep 06",
    children: [
      { id: "p3-1", name: "RFQ-2025-0012 — Server Room AC Unit", type: "doc", docType: "rfq", vendor: "Multiple Vendors", amount: 0, status: "pending", created: "Sep 06", lastUpdated: "Sep 06", ref: "MC-RFQ-2025-0012" },
    ]
  },
  { id: "p4", name: "Goods Receipts (GRN)", type: "category", lastUpdated: "Sep 01",
    children: [
      { id: "p4-1", name: "GRN-2025-0018 — FortiGate Firewall", type: "doc", docType: "receipt", vendor: "Fortinet Dist.", amount: 520000, status: "received", created: "Sep 01", lastUpdated: "Sep 01", ref: "MC-GRN-2025-0018" },
    ]
  },
  { id: "p5", name: "Vendor Contracts", type: "category", lastUpdated: "Aug 15", children: [] },
];

function findItem(tree: ProcItem[], id: string): ProcItem | null {
  for (const i of tree) {
    if (i.id === id) return i;
    if (i.children) { const r = findItem(i.children, id); if (r) return r; }
  }
  return null;
}

function getChildren(tree: ProcItem[], id: string | null): ProcItem[] {
  if (!id) return tree;
  const item = findItem(tree, id);
  return item?.type === "category" ? (item.children ?? []) : [];
}

function getBreadcrumb(tree: ProcItem[], id: string | null): { id: string | null; name: string }[] {
  const crumbs: { id: string | null; name: string }[] = [{ id: null, name: "Procurement" }];
  if (!id) return crumbs;
  function find(items: ProcItem[]): boolean {
    for (const i of items) {
      if (i.id === id) { crumbs.push({ id: i.id, name: i.name }); return true; }
      if (i.children && find(i.children)) { crumbs.splice(crumbs.length - 1, 0, { id: i.id, name: i.name }); return true; }
    }
    return false;
  }
  find(tree);
  return crumbs;
}

function TreeNode({ item, depth, selected, onSelect }: { item: ProcItem; depth: number; selected: string | null; onSelect: (id: string) => void }) {
  const [expanded, setExpanded] = useState(depth < 1);
  if (item.type === "doc") return null;
  return (
    <div>
      <div
        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg cursor-pointer text-sm transition-colors select-none ${selected === item.id ? "bg-blue-50 text-blue-700" : "hover:bg-slate-100 text-slate-700"}`}
        style={{ paddingLeft: `${8 + depth * 14}px` }}
        onClick={() => { setExpanded(!expanded); onSelect(item.id); }}
      >
        {item.children && item.children.length > 0
          ? (expanded ? <ChevronDown size={11} className="flex-shrink-0 text-slate-400" /> : <ChevronRight size={11} className="flex-shrink-0 text-slate-400" />)
          : <span className="w-3 inline-block" />}
        {expanded ? <FolderOpen size={13} className="flex-shrink-0 text-amber-500" /> : <Folder size={13} className="flex-shrink-0 text-amber-400" />}
        <span className="truncate text-[12px]">{item.name}</span>
        {item.children && item.children.filter(c => c.status === "pending").length > 0 && (
          <span className="ml-auto text-[9px] bg-amber-100 text-amber-700 rounded-full px-1.5 font-bold">
            {item.children.filter(c => c.status === "pending").length}
          </span>
        )}
      </div>
      {expanded && item.children?.filter(c => c.type === "category").map(child => (
        <TreeNode key={child.id} item={child} depth={depth + 1} selected={selected} onSelect={onSelect} />
      ))}
    </div>
  );
}

export default function ProcurementPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("list");
  const [search, setSearch] = useState("");
  const [detailDoc, setDetailDoc] = useState<ProcItem | null>(null);

  const children = getChildren(TREE, selected).filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase())
  );
  const breadcrumb = getBreadcrumb(TREE, selected);
  const docs = children.filter(c => c.type === "doc");
  const cats = children.filter(c => c.type === "category");

  const pendingCount = TREE.reduce((n, cat) => n + (cat.children?.filter(c => c.status === "pending").length ?? 0), 0);

  return (
    <div className="flex h-[calc(100vh-56px)]">
      {/* Sidebar */}
      <div className="w-52 border-r border-slate-200 bg-white flex flex-col flex-shrink-0">
        <div className="px-3 py-2.5 border-b border-slate-100">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Procurement</p>
        </div>
        <div className="flex-1 overflow-y-auto px-1.5 py-1.5">
          <button onClick={() => setSelected(null)}
            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[12px] transition-colors mb-1 ${!selected ? "bg-blue-50 text-blue-700 font-medium" : "text-slate-600 hover:bg-slate-100"}`}>
            <ShoppingBag size={12} /> All Documents
            {pendingCount > 0 && <span className="ml-auto text-[9px] bg-amber-100 text-amber-700 rounded-full px-1.5 font-bold">{pendingCount}</span>}
          </button>
          {TREE.map(item => (
            <TreeNode key={item.id} item={item} depth={0} selected={selected} onSelect={setSelected} />
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-200 bg-white flex-wrap">
          <button onClick={() => { const bc = getBreadcrumb(TREE, selected); setSelected(bc.length > 1 ? bc[bc.length - 2].id : null); }}
            disabled={!selected} className="p-1.5 hover:bg-slate-100 rounded-lg disabled:opacity-30 transition-colors">
            <ArrowUp size={14} className="text-slate-500" />
          </button>
          <div className="flex items-center gap-0.5 flex-1 min-w-0">
            {breadcrumb.map((crumb, i) => (
              <span key={i} className="flex items-center gap-0.5">
                {i > 0 && <ChevronRight size={11} className="text-slate-300" />}
                <button onClick={() => setSelected(crumb.id)}
                  className={`px-1 py-0.5 rounded hover:bg-slate-100 text-[13px] ${i === breadcrumb.length - 1 ? "font-semibold text-slate-800" : "text-slate-500"}`}>
                  {crumb.name}
                </button>
              </span>
            ))}
          </div>
          <div className="relative">
            <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
              className="pl-6 pr-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-32" />
          </div>
          <div className="flex items-center gap-0.5 bg-slate-100 rounded-lg p-0.5">
            <button onClick={() => setView("list")} className={`p-1.5 rounded ${view === "list" ? "bg-white shadow-sm" : ""}`}><List size={12} /></button>
            <button onClick={() => setView("grid")} className={`p-1.5 rounded ${view === "grid" ? "bg-white shadow-sm" : ""}`}><Grid size={12} /></button>
          </div>
          <button className="flex items-center gap-1 text-xs bg-blue-600 text-white hover:bg-blue-700 px-2.5 py-1.5 rounded-lg font-medium transition-colors">
            <Plus size={12} /> New Request
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4">
          {cats.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Folders</p>
              <div className="grid grid-cols-5 gap-2">
                {cats.map(cat => (
                  <button key={cat.id} onClick={() => setSelected(cat.id)}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                    <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center">
                      <Folder size={18} className="text-amber-500" />
                    </div>
                    <p className="text-[11px] font-medium text-slate-700 text-center leading-tight">{cat.name}</p>
                    <p className="text-[10px] text-slate-400">{(cat.children ?? []).length} docs</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {docs.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Documents ({docs.length})</p>
              {view === "list" ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="pb-2 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Document</th>
                      <th className="pb-2 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Reference</th>
                      <th className="pb-2 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Vendor</th>
                      <th className="pb-2 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Status</th>
                      <th className="pb-2 text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Amount</th>
                      <th className="pb-2 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Date</th>
                      <th className="pb-2 w-16" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {docs.map(doc => (
                      <tr key={doc.id} className="hover:bg-slate-50 group cursor-pointer" onClick={() => setDetailDoc(doc)}>
                        <td className="py-2.5 pr-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${docTypeColors[doc.docType ?? "pr"]}`}>
                              <span className="text-[8px] font-bold">{docTypeLabel[doc.docType ?? "pr"]}</span>
                            </div>
                            <span className="text-sm font-medium text-slate-800 truncate max-w-64">{doc.name}</span>
                          </div>
                        </td>
                        <td className="py-2.5 pr-3 text-xs font-mono text-slate-500">{doc.ref}</td>
                        <td className="py-2.5 pr-3 text-xs text-slate-600">{doc.vendor}</td>
                        <td className="py-2.5 pr-3">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${statusColors[doc.status ?? "draft"]}`}>{doc.status}</span>
                        </td>
                        <td className="py-2.5 text-right text-xs font-mono text-slate-700">
                          {doc.amount ? `LKR ${doc.amount.toLocaleString()}` : "—"}
                        </td>
                        <td className="py-2.5 px-3 text-xs text-slate-400">{doc.created}</td>
                        <td className="py-2.5">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 justify-end">
                            <button className="p-1 hover:bg-slate-200 rounded"><Eye size={10} className="text-slate-400" /></button>
                            <button className="p-1 hover:bg-slate-200 rounded"><Edit3 size={10} className="text-slate-400" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {docs.map(doc => (
                    <div key={doc.id} onClick={() => setDetailDoc(doc)}
                      className="p-4 rounded-xl border border-slate-200 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer space-y-2">
                      <div className="flex items-start justify-between">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${docTypeColors[doc.docType ?? "pr"]}`}>
                          <span className="text-[10px] font-bold">{docTypeLabel[doc.docType ?? "pr"]}</span>
                        </div>
                        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full capitalize ${statusColors[doc.status ?? "draft"]}`}>{doc.status}</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-800 leading-tight">{doc.name}</p>
                      <p className="text-[10px] font-mono text-slate-400">{doc.ref}</p>
                      <p className="text-xs text-slate-500">{doc.vendor}</p>
                      {doc.amount ? <p className="text-sm font-bold text-slate-800">LKR {doc.amount.toLocaleString()}</p> : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {children.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400 gap-3">
              <ShoppingBag size={32} className="text-slate-200" />
              <p className="text-sm">No documents in this folder</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 px-4 py-1.5 border-t border-slate-100 bg-slate-50 text-[10px] text-slate-400">
          <span>{children.length} item{children.length !== 1 ? "s" : ""}</span>
          {pendingCount > 0 && <span className="text-amber-600 font-medium">{pendingCount} pending approval</span>}
        </div>
      </div>

      {/* Detail panel */}
      {detailDoc && (
        <div className="w-72 border-l border-slate-200 bg-white flex flex-col flex-shrink-0">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <p className="text-sm font-semibold text-slate-800">Document Details</p>
            <button onClick={() => setDetailDoc(null)} className="p-1 hover:bg-slate-100 rounded"><X size={14} className="text-slate-400" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${docTypeColors[detailDoc.docType ?? "pr"]}`}>
                <span className="text-xs font-bold">{docTypeLabel[detailDoc.docType ?? "pr"]}</span>
              </div>
              <div>
                <p className="text-xs font-mono text-slate-500">{detailDoc.ref}</p>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full capitalize ${statusColors[detailDoc.status ?? "draft"]}`}>{detailDoc.status}</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-slate-900">{detailDoc.name}</p>
            {[
              { label: "Vendor",   value: detailDoc.vendor },
              { label: "Amount",   value: detailDoc.amount ? `LKR ${detailDoc.amount.toLocaleString()}` : undefined },
              { label: "Created",  value: detailDoc.created },
              { label: "Updated",  value: detailDoc.lastUpdated },
            ].filter(r => r.value).map(r => (
              <div key={r.label}>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{r.label}</p>
                <p className="text-sm text-slate-700 mt-0.5">{r.value}</p>
              </div>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
              {detailDoc.status === "pending" && (
                <button className="w-full text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 justify-center font-medium">
                  <CheckCircle2 size={13} />Approve
                </button>
              )}
              <button className="w-full text-sm border border-slate-200 hover:bg-slate-50 px-3 py-2 rounded-lg text-slate-700 flex items-center gap-2">
                <Eye size={13} />View Full Document
              </button>
              {["draft","pending"].includes(detailDoc.status ?? "") && (
                <button className="w-full text-sm border border-slate-200 hover:bg-slate-50 px-3 py-2 rounded-lg text-slate-700 flex items-center gap-2">
                  <Send size={13} />Submit for Approval
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
