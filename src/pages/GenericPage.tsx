import { Construction } from "lucide-react";

interface Props {
  title: string;
  description?: string;
  icon?: string;
}

const moduleInfo: Record<string, { desc: string; features: string[] }> = {
  "Organization": { desc: "Manage companies, branches, departments, teams, org chart, and policies.", features: ["Companies & Branches","Departments & Teams","Org Chart","Work Schedules","Holidays"] },
  "Services": { desc: "IT services catalog with pricing, SLAs, packages, and commission rules.", features: ["Service Catalog","Service Packages","Pricing Plans","Service SLA","Commission Rules"] },
  "Sales": { desc: "Quotations, sales orders, targets, and commission tracking.", features: ["Quotations","Sales Orders","Sales Targets","Commission","Revenue Reports"] },
  "Commission": { desc: "Configure and track commissions by employee, role, service, project, or customer.", features: ["Commission Rules","Commission Plans","Calculation Engine","Approvals","Payment History"] },
  "Recruitment": { desc: "Manage job openings, applications, interviews, and onboarding.", features: ["Job Postings","Applications","Interviews","Offers","Onboarding"] },
  "Assets": { desc: "Track company assets, assignments, maintenance, and depreciation.", features: ["Asset Register","Employee Assignments","Maintenance Schedule","Warranty","Depreciation"] },
  "Inventory": { desc: "Stock management, warehouses, stock movements, and reorder alerts.", features: ["Stock Register","Warehouses","Stock Movements","Reorder Alerts","Inventory Reports"] },
  "Procurement": { desc: "Purchase requests, orders, vendor management, and approvals.", features: ["Purchase Requests","Purchase Orders","Vendor Management","RFQ","Goods Received"] },
  "Payments": { desc: "Record and verify payments, reconciliation, and refunds.", features: ["Record Payment","Payment Verification","Reconciliation","Refunds","Payment Reports"] },
  "Billing": { desc: "Subscription billing, recurring invoices, plan management.", features: ["Subscriptions","Billing Cycles","Recurring Invoices","Failed Payments","Renewal Alerts"] },
  "Banking": { desc: "Bank account management, statement import, and reconciliation.", features: ["Bank Accounts","Transactions","Statement Import","Reconciliation","Payment Batches"] },
  "Documents": { desc: "File explorer, document management, sharing, and version control.", features: ["File Explorer","Shared Documents","Templates","Version History","Storage Analytics"] },
  "Mail": { desc: "Internal email center with templates, scheduling, and tracking.", features: ["Inbox","Compose","Templates","Scheduling","Email Tracking"] },
  "Chat": { desc: "Internal messaging: direct, group, project, and department channels.", features: ["Direct Messages","Group Channels","Project Chat","File Sharing","Message Search"] },
  "Approvals": { desc: "Multi-level approval workflows for leave, expenses, POs, payroll, and more.", features: ["Pending Approvals","Approval Rules","Delegation","Approval History","Workflow Builder"] },
  "Integrations": { desc: "Connect GitHub, Google Workspace, AWS, Stripe, Slack, and more.", features: ["Integration Hub","OAuth Apps","Webhooks","Sync Logs","Error Monitoring"] },
  "Infrastructure": { desc: "Server monitoring, deployments, environments, and alerts.", features: ["Server Dashboard","Monitoring","Deployments","Logs","Backups"] },
  "Domains & SSL": { desc: "Domain management, DNS, SSL certificates, and expiry alerts.", features: ["Domain Register","DNS Records","SSL Certificates","Expiry Alerts","Hosting Plans"] },
  "GitHub": { desc: "GitHub organizations, repositories, issues, PRs, and deployment tracking.", features: ["Repositories","Issues","Pull Requests","Deployments","Project Integration"] },
  "Automation": { desc: "Visual workflow builder for automated business processes.", features: ["Workflow Builder","Triggers","Conditions","Execution History","Scheduled Jobs"] },
  "AI Assistant": { desc: "AI-powered insights, anomaly detection, and report summaries.", features: ["Business Insights","Anomaly Detection","Report Summaries","Risk Analysis","Usage Logs"] },
  "API & Secrets": { desc: "Manage API keys, webhooks, OAuth apps, and secrets vault.", features: ["API Keys","Webhooks","OAuth Apps","Secrets Vault","Access Logs"] },
};

export default function GenericPage({ title }: Props) {
  const info = moduleInfo[title] ?? { desc: `Complete ${title} management module.`, features: ["List View", "Detail View", "Create/Edit", "Reports", "Settings"] };

  return (
    <div className="p-6 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>{title}</h2>
        <p className="text-sm text-slate-500 mt-0.5">{info.desc}</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-8 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
          <Construction size={28} className="text-blue-500" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-2" style={{ fontFamily: "var(--font-display)" }}>{title} Module</h3>
        <p className="text-sm text-slate-500 max-w-sm mb-6">{info.desc}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
          {info.features.map(f => (
            <div key={f} className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
              <p className="text-xs font-medium text-blue-700">{f}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400">This module is included in the full MernCrest ERP implementation</p>
      </div>
    </div>
  );
}
