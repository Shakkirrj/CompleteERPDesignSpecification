export interface NavItem {
  id: string;
  label: string;
  icon: string;
  badge?: number | string;
  children?: NavItem[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navSections: NavSection[] = [
  {
    title: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard" },
    ],
  },
  {
    title: "Organization",
    items: [
      { id: "organization", label: "Organization", icon: "Building2",
        children: [
          { id: "org-companies", label: "Companies", icon: "Building" },
          { id: "org-branches", label: "Branches", icon: "GitBranch" },
          { id: "org-departments", label: "Departments", icon: "Layers" },
          { id: "org-teams", label: "Teams", icon: "Users2" },
          { id: "org-locations", label: "Locations", icon: "MapPin" },
          { id: "org-designations", label: "Designations", icon: "Award" },
          { id: "org-chart", label: "Org Chart", icon: "Network" },
        ]
      },
      { id: "employees", label: "Employees", icon: "Users",
        children: [
          { id: "employees", label: "Directory", icon: "Users" },
          { id: "employee-reg-links", label: "Registration Links", icon: "Link" },
          { id: "employee-registration", label: "New Registration", icon: "UserPlus" },
        ]
      },
    ],
  },
  {
    title: "HR & People",
    items: [
      { id: "attendance", label: "Attendance", icon: "Clock" },
      { id: "leave", label: "Leave", icon: "CalendarOff", badge: 3 },
      { id: "payroll", label: "Payroll", icon: "Banknote" },
      { id: "commission", label: "Commission", icon: "TrendingUp" },
      { id: "recruitment", label: "Recruitment", icon: "UserPlus" },
    ],
  },
  {
    title: "Sales & CRM",
    items: [
      { id: "crm", label: "CRM", icon: "ContactRound" },
      { id: "services", label: "Services", icon: "Briefcase" },
      { id: "sales", label: "Sales", icon: "ShoppingCart" },
      { id: "quotations", label: "Quotations", icon: "FileText" },
      { id: "commission", label: "Commission", icon: "TrendingUp" },
    ],
  },
  {
    title: "Operations",
    items: [
      { id: "projects", label: "Projects", icon: "FolderKanban" },
      { id: "tasks", label: "Tasks", icon: "CheckSquare", badge: 12 },
      { id: "servicedesk", label: "Service Desk", icon: "Headphones", badge: 5 },
    ],
  },
  {
    title: "Finance",
    items: [
      { id: "invoices", label: "Invoices", icon: "Receipt" },
      { id: "payments", label: "Payments", icon: "CreditCard" },
      { id: "finance", label: "Finance", icon: "BarChart3" },
      { id: "billing", label: "Billing", icon: "Repeat" },
      { id: "banking", label: "Banking", icon: "Landmark" },
    ],
  },
  {
    title: "Assets & Inventory",
    items: [
      { id: "assets", label: "Assets", icon: "Package" },
      { id: "inventory", label: "Inventory", icon: "Boxes" },
      { id: "procurement", label: "Procurement", icon: "ShoppingBag" },
    ],
  },
  {
    title: "Workspace",
    items: [
      { id: "documents", label: "Documents", icon: "FolderOpen" },
      { id: "mail", label: "Mail", icon: "Mail", badge: 7 },
      { id: "chat", label: "Chat", icon: "MessageSquare", badge: 3 },
      { id: "approvals", label: "Approvals", icon: "CheckCircle", badge: 4 },
    ],
  },
  {
    title: "Infrastructure",
    items: [
      { id: "integrations", label: "Integrations", icon: "Plug" },
      { id: "infrastructure", label: "Infrastructure", icon: "Server" },
      { id: "domains", label: "Domains & SSL", icon: "Globe" },
      { id: "github", label: "GitHub", icon: "Github" },
    ],
  },
  {
    title: "Intelligence",
    items: [
      { id: "reports", label: "Reports", icon: "PieChart" },
      { id: "automation", label: "Automation", icon: "Zap" },
      { id: "ai", label: "AI Assistant", icon: "Sparkles" },
    ],
  },
  {
    title: "Administration",
    items: [
      { id: "access",   label: "Access",      icon: "Shield" },
      { id: "api",      label: "API & Secrets",icon: "Key" },
      { id: "terminal", label: "Terminal",     icon: "Terminal" },
      { id: "settings", label: "Settings",     icon: "Settings" },
    ],
  },
];
