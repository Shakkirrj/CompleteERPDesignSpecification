import { useState, useEffect } from "react";
import { LogOut, Check, Shield, Wifi } from "lucide-react";
import LoginPage from "./pages/auth/LoginPage";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Dashboard from "./pages/dashboard/Dashboard";
import EmployeesPage from "./pages/employees/EmployeesPage";
import EmployeeDetail from "./pages/employees/EmployeeDetail";
import EmployeeRegistration from "./pages/employees/EmployeeRegistration";
import RegistrationLinks from "./pages/employees/RegistrationLinks";
import AttendancePage from "./pages/attendance/AttendancePage";
import LeavePage from "./pages/leave/LeavePage";
import PayrollPage from "./pages/payroll/PayrollPage";
import CRMPage from "./pages/crm/CRMPage";
import ServicesPage from "./pages/services/ServicesPage";
import SalesPage from "./pages/sales/SalesPage";
import QuotationsPage from "./pages/sales/QuotationsPage";
import ProjectsPage from "./pages/projects/ProjectsPage";
import TasksPage from "./pages/tasks/TasksPage";
import ServiceDeskPage from "./pages/servicedesk/ServiceDeskPage";
import InvoicesPage from "./pages/invoices/InvoicesPage";
import FinancePage from "./pages/finance/FinancePage";
import AccessPage from "./pages/access/AccessPage";
import ReportsPage from "./pages/reports/ReportsPage";
import SettingsPage from "./pages/settings/SettingsPage";
import OrganizationPage from "./pages/organization/OrganizationPage";
import CompaniesPage from "./pages/organization/CompaniesPage";
import { BranchesPage, DepartmentsPage, TeamsPage, LocationsPage, DesignationsPage, OrgChartPage } from "./pages/organization/OrgSubPages";
import MailPage from "./pages/mail/MailPage";
import ChatPage from "./pages/chat/ChatPage";
import BillingPage from "./pages/billing/BillingPage";
import BankingPage from "./pages/banking/BankingPage";
import PaymentsPage from "./pages/payments/PaymentsPage";
import InfrastructurePage from "./pages/infrastructure/InfrastructurePage";
import IntegrationsPage from "./pages/integrations/IntegrationsPage";
import ApprovalsPage from "./pages/approvals/ApprovalsPage";
import AutomationPage from "./pages/automation/AutomationPage";
import AIAssistantPage from "./pages/ai/AIAssistantPage";
import APISecretsPage from "./pages/api/APISecretsPage";
import DomainsPage from "./pages/domains/DomainsPage";
import GitHubPage from "./pages/github/GitHubPage";
import TerminalPage from "./pages/terminal/TerminalPage";
import DocumentsPage from "./pages/documents/DocumentsPage";
import AssetsPage from "./pages/assets/AssetsPage";
import InventoryPage from "./pages/inventory/InventoryPage";
import ProcurementPage from "./pages/procurement/ProcurementPage";
import WorkspacePage from "./pages/workspace/WorkspacePage";
import MobileAppPage from "./pages/mobile/MobileAppPage";
import CommandCenter from "./components/layout/CommandCenter";
import GenericPage from "./pages/GenericPage";

const pageTitles: Record<string, string> = {
  dashboard: "Dashboard",
  organization: "Organization",
  "org-companies": "Companies",
  "org-branches": "Branches",
  "org-departments": "Departments",
  "org-teams": "Teams",
  "org-locations": "Locations",
  "org-designations": "Designations",
  "org-chart": "Organization Chart",
  employees: "Employees",
  "employee-detail": "Employee Profile",
  "employee-registration": "Employee Registration",
  "employee-reg-links": "Registration Links",
  attendance: "Attendance",
  leave: "Leave Management",
  payroll: "Payroll",
  commission: "Commission",
  recruitment: "Recruitment",
  crm: "CRM",
  services: "Services",
  sales: "Sales",
  quotations: "Quotations",
  projects: "Projects",
  tasks: "Tasks",
  servicedesk: "Service Desk",
  invoices: "Invoices",
  payments: "Payments",
  finance: "Finance",
  billing: "Billing",
  banking: "Banking",
  assets: "Assets",
  inventory: "Inventory",
  procurement: "Procurement",
  documents: "Documents",
  mail: "Mail",
  chat: "Chat",
  approvals: "Approvals",
  integrations: "Integrations",
  infrastructure: "Infrastructure",
  domains: "Domains & SSL",
  github: "GitHub",
  reports: "Reports & Analytics",
  automation: "Automation",
  ai: "AI Assistant",
  access: "Access Management",
  api: "API & Secrets",
  settings: "Settings",
  "mobile-app": "Mobile App",
};

const genericTitles: Record<string, string> = {
  commission: "Commission",
  recruitment: "Recruitment",
  documents: "Documents",
  mail: "Mail",
  chat: "Chat",
  approvals: "Approvals",
  integrations: "Integrations",
  infrastructure: "Infrastructure",
  domains: "Domains & SSL",
  github: "GitHub",
  automation: "Automation",
  ai: "AI Assistant",
  api: "API & Secrets",
};

// ── Logout success overlay ────────────────────────────────────────────────
function LogoutOverlay({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 800);
    const t3 = setTimeout(() => setPhase(3), 1400);
    const t4 = setTimeout(() => onDone(), 2800);
    return () => { [t1, t2, t3, t4].forEach(clearTimeout); };
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden"
      style={{ background: "rgba(5,10,25,0.96)", backdropFilter: "blur(20px)" }}>
      {/* Rings */}
      {[1, 2, 3].map(i => (
        <div key={i} className="absolute rounded-full"
          style={{
            width: i * 180, height: i * 180,
            border: "1px solid rgba(99,102,241,0.2)",
            animation: phase >= 1 ? `logoutRing ${1.2 + i * 0.35}s ease-out ${i * 0.18}s infinite` : "none",
            opacity: phase >= 1 ? 1 : 0, transition: "opacity 0.5s",
          }} />
      ))}
      <div className="relative text-center flex flex-col items-center z-10">
        {/* Icon */}
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-5"
          style={{
            background: phase >= 1 ? "radial-gradient(circle,#4f46e5,#3730a3)" : "rgba(255,255,255,0.05)",
            transition: "background 0.6s",
            boxShadow: phase >= 1 ? "0 0 70px rgba(99,102,241,0.55)" : "none",
          }}>
          <LogOut size={40} className="text-white"
            style={{ opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? "scale(1)" : "scale(0.3)", transition: "all 0.5s cubic-bezier(0.34,1.56,0.64,1)" }} />
        </div>

        {/* Text */}
        <div style={{ opacity: phase >= 2 ? 1 : 0, transform: phase >= 2 ? "translateY(0)" : "translateY(14px)", transition: "all 0.5s ease" }}>
          <p className="text-3xl font-black text-white mb-1" style={{ fontFamily: "var(--font-display)" }}>Signed Out</p>
          <p className="text-indigo-400 text-sm font-medium">You have been securely signed out</p>
        </div>

        {/* Status rows */}
        <div className="mt-6 space-y-2"
          style={{ opacity: phase >= 3 ? 1 : 0, transition: "opacity 0.5s 0.2s" }}>
          {[
            { icon: Check,  label: "Session terminated" },
            { icon: Shield, label: "Credentials cleared" },
            { icon: Wifi,   label: "Returning to login..." },
          ].map((r, i) => (
            <div key={r.label} className="flex items-center gap-2.5 text-sm justify-center"
              style={{ opacity: phase >= 3 ? 1 : 0, transition: `opacity 0.4s ${i * 0.12}s` }}>
              <div className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
                <r.icon size={10} className="text-indigo-400" />
              </div>
              <span className="text-white/50">{r.label}</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes logoutRing{0%{transform:scale(0.7);opacity:.5}100%{transform:scale(2.6);opacity:0}}`}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLogoutAnim, setShowLogoutAnim] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  function handleLogout() {
    setShowLogoutAnim(true);
  }

  function finishLogout() {
    setShowLogoutAnim(false);
    setLoggedIn(false);
    setPage("dashboard");
  }

  if (!loggedIn) {
    return <LoginPage onLogin={() => setLoggedIn(true)} />;
  }

  // Full-page override: employee registration form
  if (showRegistrationForm || page === "employee-registration") {
    return (
      <EmployeeRegistration
        onBack={() => {
          setShowRegistrationForm(false);
          setPage("employees");
        }}
      />
    );
  }

  const currentPage = selectedEmployee ? "employee-detail" : page;
  const title = pageTitles[currentPage] ?? currentPage;

  function navigate(id: string) {
    setSelectedEmployee(null);
    setShowRegistrationForm(false);
    setPage(id);
  }

  function renderPage() {
    if (selectedEmployee) {
      return <EmployeeDetail employeeId={selectedEmployee} onBack={() => setSelectedEmployee(null)} />;
    }
    switch (page) {
      case "dashboard": return <Dashboard />;
      case "organization": return <OrganizationPage onNavigate={navigate} />;
      case "org-companies": return <CompaniesPage />;
      case "org-branches": return <BranchesPage />;
      case "org-departments": return <DepartmentsPage />;
      case "org-teams": return <TeamsPage />;
      case "org-locations": return <LocationsPage />;
      case "org-designations": return <DesignationsPage />;
      case "org-chart": return <OrgChartPage />;
      case "employees": return (
        <EmployeesPage
          onViewEmployee={id => setSelectedEmployee(id)}
          onAddEmployee={() => setShowRegistrationForm(true)}
        />
      );
      case "employee-reg-links": return (
        <RegistrationLinks onNewRegistration={() => setShowRegistrationForm(true)} />
      );
      case "attendance": return <AttendancePage />;
      case "me": return <WorkspacePage />;
      case "manager": return <WorkspacePage />;
      case "leave": return <LeavePage />;
      case "payroll": return <PayrollPage />;
      case "crm": return <CRMPage />;
      case "services": return <ServicesPage />;
      case "sales": return <SalesPage />;
      case "quotations": return <QuotationsPage />;
      case "projects": return <ProjectsPage />;
      case "tasks": return <TasksPage />;
      case "servicedesk": return <ServiceDeskPage />;
      case "invoices": return <InvoicesPage />;
      case "payments": return <PaymentsPage />;
      case "billing": return <BillingPage />;
      case "banking": return <BankingPage />;
      case "finance": return <FinancePage />;
      case "access": return <AccessPage />;
      case "mail": return <MailPage />;
      case "chat": return <ChatPage />;
      case "reports": return <ReportsPage />;
      case "settings": return <SettingsPage />;
      case "infrastructure": return <InfrastructurePage />;
      case "integrations": return <IntegrationsPage />;
      case "approvals": return <ApprovalsPage />;
      case "automation": return <AutomationPage />;
      case "ai": return <AIAssistantPage />;
      case "api": return <APISecretsPage />;
      case "domains": return <DomainsPage />;
      case "github": return <GitHubPage />;
      case "terminal": return <TerminalPage />;
      case "documents": return <DocumentsPage />;
      case "assets": return <AssetsPage />;
      case "inventory": return <InventoryPage />;
      case "procurement": return <ProcurementPage />;
      case "mobile-app": return <MobileAppPage />;
      default:
        return <GenericPage title={genericTitles[page] ?? pageTitles[page] ?? page} />;
    }
  }

  return (
    <div className="flex h-full overflow-hidden bg-slate-100">
      <Sidebar
        activePage={currentPage === "employee-detail" ? "employees" : page}
        onNavigate={navigate}
        collapsed={sidebarCollapsed}
        onLogout={handleLogout}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          title={title}
          onToggleSidebar={() => setSidebarCollapsed(c => !c)}
          sidebarCollapsed={sidebarCollapsed}
        />
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
      <CommandCenter onNavigate={navigate} />
      {showLogoutAnim && <LogoutOverlay onDone={finishLogout} />}
    </div>
  );
}
