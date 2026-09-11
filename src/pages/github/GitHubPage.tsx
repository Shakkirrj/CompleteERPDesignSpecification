import { useState } from "react";
import { GitBranch, GitPullRequest, AlertCircle, CheckCircle2, Clock, Star, Eye, Code, RefreshCw, ExternalLink, GitCommit } from "lucide-react";

const repos = [
  { id: "r1", name: "merncrest-erp",       lang: "TypeScript", stars: 0, open_issues: 4, open_prs: 2, lastCommit: "2 hours ago",  branch: "main", status: "active",  description: "Main ERP application" },
  { id: "r2", name: "merncrest-api",        lang: "TypeScript", stars: 0, open_issues: 1, open_prs: 1, lastCommit: "1 day ago",    branch: "main", status: "active",  description: "REST API backend" },
  { id: "r3", name: "merncrest-mobile",     lang: "React Native",stars: 0,open_issues: 7, open_prs: 3, lastCommit: "3 days ago",   branch: "dev",  status: "active",  description: "Mobile app (iOS/Android)" },
  { id: "r4", name: "merncrest-infra",      lang: "Terraform",  stars: 0, open_issues: 0, open_prs: 0, lastCommit: "1 week ago",   branch: "main", status: "active",  description: "Infrastructure as code" },
  { id: "r5", name: "merncrest-docs",       lang: "MDX",        stars: 0, open_issues: 2, open_prs: 0, lastCommit: "5 days ago",   branch: "main", status: "active",  description: "Documentation site" },
];

const pullRequests = [
  { id: "pr1", repo: "merncrest-erp",   title: "feat: Add PDF preview modal for invoices",  author: "chamara-w",  status: "open",   reviews: 1, comments: 3, updated: "2 hours ago",  draft: false },
  { id: "pr2", repo: "merncrest-api",   title: "fix: Fix authentication token expiry bug",  author: "nuwan-r",    status: "open",   reviews: 2, comments: 1, updated: "4 hours ago",  draft: false },
  { id: "pr3", repo: "merncrest-mobile",title: "feat: Push notification support",           author: "priya-j",    status: "open",   reviews: 0, comments: 5, updated: "1 day ago",    draft: true },
  { id: "pr4", repo: "merncrest-erp",   title: "refactor: Migrate to React 19 patterns",   author: "chamara-w",  status: "merged", reviews: 3, comments: 8, updated: "2 days ago",   draft: false },
  { id: "pr5", repo: "merncrest-mobile",title: "fix: Attendance check-in sync issue",       author: "dilshan-f",  status: "closed", reviews: 2, comments: 2, updated: "3 days ago",   draft: false },
];

const commits = [
  { id: "c1", repo: "merncrest-erp",   sha: "a3f9d12", message: "feat: PDF system — invoices, quotations, billing",    author: "chamara-w", time: "2 hours ago" },
  { id: "c2", repo: "merncrest-api",   sha: "b8e4c71", message: "fix: JWT refresh token rotation",                      author: "nuwan-r",   time: "4 hours ago" },
  { id: "c3", repo: "merncrest-erp",   sha: "d2a7f30", message: "feat: Chat voice/video call screens",                  author: "chamara-w", time: "1 day ago" },
  { id: "c4", repo: "merncrest-mobile",sha: "e9c1b55", message: "feat: Biometric attendance check-in",                  author: "dilshan-f", time: "1 day ago" },
];

const langColors: Record<string, string> = {
  TypeScript: "bg-blue-50 text-blue-700",
  "React Native": "bg-cyan-50 text-cyan-700",
  Terraform: "bg-violet-50 text-violet-700",
  MDX: "bg-slate-100 text-slate-600",
};

const prStatusCfg: Record<string, { label: string; color: string; bg: string }> = {
  open:   { label: "Open",   color: "text-emerald-700", bg: "bg-emerald-50" },
  merged: { label: "Merged", color: "text-violet-700",  bg: "bg-violet-50" },
  closed: { label: "Closed", color: "text-slate-500",   bg: "bg-slate-100" },
};

export default function GitHubPage() {
  const [activeTab, setActiveTab] = useState<"repos" | "prs" | "commits">("repos");

  const openPRs = pullRequests.filter(p => p.status === "open").length;
  const totalIssues = repos.reduce((a, r) => a + r.open_issues, 0);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>GitHub</h2>
          <p className="text-sm text-slate-500 mt-0.5">{repos.length} repositories · merncrest-solutions</p>
        </div>
        <button className="flex items-center gap-2 text-sm border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-lg transition-colors">
          <RefreshCw size={13} /> Sync
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Repositories",  value: repos.length,  color: "text-slate-800",    bg: "bg-slate-50",    border: "border-slate-200" },
          { label: "Open PRs",       value: openPRs,       color: "text-emerald-700",  bg: "bg-emerald-50",  border: "border-emerald-200" },
          { label: "Open Issues",    value: totalIssues,   color: "text-amber-700",    bg: "bg-amber-50",    border: "border-amber-200" },
          { label: "Deployments",    value: 14,            color: "text-blue-700",     bg: "bg-blue-50",     border: "border-blue-200" },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl px-4 py-4`}>
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className={`text-2xl font-black ${s.color} mt-0.5`} style={{ fontFamily: "var(--font-display)" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {(["repos", "prs", "commits"] as const).map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === t ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700"}`}>
            {t === "repos" ? "Repositories" : t === "prs" ? "Pull Requests" : "Commits"}
          </button>
        ))}
      </div>

      {activeTab === "repos" && (
        <div className="space-y-2">
          {repos.map(repo => (
            <div key={repo.id} className="bg-white border border-slate-200 rounded-xl px-5 py-4 flex items-center justify-between hover:border-slate-300 transition-colors cursor-pointer">
              <div className="flex items-start gap-3">
                <Code size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-blue-600 font-mono">{repo.name}</p>
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${langColors[repo.lang] ?? "bg-slate-100 text-slate-500"}`}>{repo.lang}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{repo.description}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1 text-[10px] text-slate-400"><GitBranch size={9} />{repo.branch}</span>
                    <span className="flex items-center gap-1 text-[10px] text-slate-400"><AlertCircle size={9} />{repo.open_issues} issues</span>
                    <span className="flex items-center gap-1 text-[10px] text-slate-400"><GitPullRequest size={9} />{repo.open_prs} PRs</span>
                    <span className="text-[10px] text-slate-400">Last commit {repo.lastCommit}</span>
                  </div>
                </div>
              </div>
              <ExternalLink size={13} className="text-slate-300 flex-shrink-0" />
            </div>
          ))}
        </div>
      )}

      {activeTab === "prs" && (
        <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-50">
          {pullRequests.map(pr => {
            const sc = prStatusCfg[pr.status];
            return (
              <div key={pr.id} className="px-5 py-4 hover:bg-slate-50 cursor-pointer transition-colors">
                <div className="flex items-start gap-3">
                  <GitPullRequest size={14} className={`mt-0.5 flex-shrink-0 ${pr.status === "open" ? "text-emerald-500" : pr.status === "merged" ? "text-violet-500" : "text-slate-400"}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-slate-800">{pr.title}</p>
                      {pr.draft && <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-semibold">Draft</span>}
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${sc.bg} ${sc.color}`}>{sc.label}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-slate-400 font-mono">{pr.repo}</span>
                      <span className="text-[10px] text-slate-400">by {pr.author}</span>
                      <span className="text-[10px] text-slate-400">{pr.reviews} reviews · {pr.comments} comments</span>
                      <span className="text-[10px] text-slate-400">{pr.updated}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "commits" && (
        <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-50">
          {commits.map(c => (
            <div key={c.id} className="px-5 py-4 hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-3">
              <GitCommit size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-slate-800">{c.message}</p>
                <div className="flex items-center gap-3 mt-1">
                  <code className="text-[10px] font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{c.sha}</code>
                  <span className="text-[10px] text-slate-400 font-mono">{c.repo}</span>
                  <span className="text-[10px] text-slate-400">by {c.author}</span>
                  <span className="text-[10px] text-slate-400">{c.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
