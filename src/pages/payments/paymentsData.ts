export type PaymentDirection = "INCOMING" | "OUTGOING";
export type PaymentStatus = "PENDING_VERIFICATION" | "VERIFIED" | "REJECTED" | "RECONCILED" | "REFUNDED" | "CANCELLED";
export type PaymentMethod = "BANK_TRANSFER" | "CHEQUE" | "CASH" | "CARD" | "ONLINE" | "NEFT" | "RTGS" | "SWIFT";
export type InvoicePayStatus = "UNPAID" | "PARTIALLY_PAID" | "PAID" | "OVERDUE" | "REFUNDED" | "CANCELLED";

export interface Payment {
  id: string; receiptNo?: string;
  paymentType: string; direction: PaymentDirection;
  clientName: string; clientCompany: string; clientId: string;
  project?: string; projectId?: string;
  invoiceNo?: string; invoiceId?: string;
  date: string; receivedDate?: string;
  amount: number; currency: string; exchangeRate: number; amountLKR: number;
  method: PaymentMethod;
  bank?: string; bankAccount?: string; bankRef?: string;
  chequeNo?: string; cardRef?: string; onlineTxId?: string;
  payerName?: string; payerBank?: string;
  description: string; notes?: string;
  status: PaymentStatus;
  reconciliationStatus: "UNRECONCILED" | "MATCHED" | "RECONCILED" | "PARTIAL";
  createdBy: string; verifiedBy?: string; approvedBy?: string;
  createdAt: string; updatedAt: string;
}

export interface Client {
  id: string; name: string; company: string;
  contact: string; email: string; phone: string; whatsapp?: string;
  address: string; salesRep: string; accountManager: string;
  status: "ACTIVE" | "INACTIVE"; createdDate: string;
  totalInvoiced: number; totalPaid: number; outstanding: number;
  overdue: number; credits: number; refunds: number;
  projects: { id: string; name: string; status: string; value: number; start: string; end?: string; manager: string }[];
  services: string[];
}

export const PAYMENT_TYPES = [
  "Client Payment", "Invoice Payment", "Project Payment",
  "Subscription Payment", "Advance Payment", "Partial Payment",
  "Full Payment", "Refund", "Vendor Payment", "Salary Payment",
  "Employee Advance", "Expense Payment", "Bank Transfer",
  "Cash Payment", "Card Payment", "Online Payment", "Other Payment",
];

export const mockClients: Client[] = [
  {
    id: "CLT-001", name: "Sampath Gunawardena", company: "Lanka Retail PLC",
    contact: "Sampath Gunawardena", email: "sampath@lankaretail.lk", phone: "+94 11 234 5678", whatsapp: "+94 77 234 5678",
    address: "No. 15, Union Place, Colombo 02", salesRep: "Chamara Wickramasinghe", accountManager: "Priya Jayawardena",
    status: "ACTIVE", createdDate: "2024-01-10",
    totalInvoiced: 8400000, totalPaid: 7200000, outstanding: 1200000, overdue: 0, credits: 0, refunds: 0,
    projects: [
      { id: "PRJ-2025-001", name: "Retail ERP Implementation", status: "In Progress", value: 5200000, start: "2024-02-01", manager: "Kavinda Perera" },
      { id: "PRJ-2024-008", name: "POS System",                status: "Completed",  value: 1800000, start: "2023-11-01", end: "2024-03-31", manager: "Dilshan Fernando" },
    ],
    services: ["ERP Development", "POS System", "Hosting", "Support"],
  },
  {
    id: "CLT-002", name: "Nimal Perera", company: "Ceylon Bank Ltd",
    contact: "Nimal Perera", email: "nimal.perera@ceylonbank.lk", phone: "+94 11 456 7890",
    address: "No. 27, Janadhipathi Mawatha, Colombo 01", salesRep: "Chamara Wickramasinghe", accountManager: "Priya Jayawardena",
    status: "ACTIVE", createdDate: "2023-08-15",
    totalInvoiced: 12600000, totalPaid: 12600000, outstanding: 0, overdue: 0, credits: 120000, refunds: 0,
    projects: [
      { id: "PRJ-2024-003", name: "Core Banking ERP",    status: "Completed",  value: 9800000, start: "2023-09-01", end: "2024-09-30", manager: "Dilshan Fernando" },
      { id: "PRJ-2025-004", name: "Mobile Banking App",  status: "In Progress",value: 2800000, start: "2025-01-15", manager: "Kavinda Perera" },
    ],
    services: ["Core Banking", "ERP", "Mobile App", "Cyber Security", "Hosting"],
  },
  {
    id: "CLT-003", name: "Ruwan Silva", company: "Sampath Bank PLC",
    contact: "Ruwan Silva", email: "rsilva@sampathbank.lk", phone: "+94 11 300 0000",
    address: "No. 110, Sir James Peiris Mawatha, Colombo 02", salesRep: "Chamara Wickramasinghe", accountManager: "Dilshan Fernando",
    status: "ACTIVE", createdDate: "2025-01-05",
    totalInvoiced: 4800000, totalPaid: 2400000, outstanding: 2400000, overdue: 400000, credits: 0, refunds: 0,
    projects: [
      { id: "PRJ-2025-007", name: "HR Management System", status: "In Progress", value: 4800000, start: "2025-01-15", manager: "Kavinda Perera" },
    ],
    services: ["HR Software", "ERP Module", "Cloud Hosting"],
  },
];

export const mockPayments: Payment[] = [
  {
    id: "PAY-2026-000001", receiptNo: "REC-MC-2026-000001",
    paymentType: "Invoice Payment", direction: "INCOMING",
    clientName: "Sampath Gunawardena", clientCompany: "Lanka Retail PLC", clientId: "CLT-001",
    project: "Retail ERP Implementation", projectId: "PRJ-2025-001",
    invoiceNo: "INV-MC-2026-000012", invoiceId: "INV-012",
    date: "2026-09-08", receivedDate: "2026-09-08",
    amount: 1200000, currency: "LKR", exchangeRate: 1, amountLKR: 1200000,
    method: "BANK_TRANSFER", bank: "Sampath Bank", bankAccount: "••••8801",
    bankRef: "SB2026090800821", payerName: "Lanka Retail PLC", payerBank: "Commercial Bank",
    description: "Payment for Invoice INV-MC-2026-000012 — ERP Phase 2 Milestone",
    status: "VERIFIED", reconciliationStatus: "RECONCILED",
    createdBy: "Amali De Silva", verifiedBy: "Priya Jayawardena", approvedBy: "Priya Jayawardena",
    createdAt: "2026-09-08T10:30:00", updatedAt: "2026-09-08T14:15:00",
  },
  {
    id: "PAY-2026-000002", receiptNo: "REC-MC-2026-000002",
    paymentType: "Project Payment", direction: "INCOMING",
    clientName: "Nimal Perera", clientCompany: "Ceylon Bank Ltd", clientId: "CLT-002",
    project: "Mobile Banking App", projectId: "PRJ-2025-004",
    invoiceNo: "INV-MC-2026-000011", invoiceId: "INV-011",
    date: "2026-09-05", receivedDate: "2026-09-06",
    amount: 700000, currency: "LKR", exchangeRate: 1, amountLKR: 700000,
    method: "BANK_TRANSFER", bank: "Sampath Bank", bankAccount: "••••8801",
    bankRef: "CB2026090500432", payerName: "Ceylon Bank Ltd", payerBank: "Bank of Ceylon",
    description: "Milestone payment — Mobile Banking App Phase 1",
    status: "VERIFIED", reconciliationStatus: "RECONCILED",
    createdBy: "Amali De Silva", verifiedBy: "Rajith Kumara",
    createdAt: "2026-09-06T09:00:00", updatedAt: "2026-09-06T11:30:00",
  },
  {
    id: "PAY-2026-000003",
    paymentType: "Invoice Payment", direction: "INCOMING",
    clientName: "Ruwan Silva", clientCompany: "Sampath Bank PLC", clientId: "CLT-003",
    project: "HR Management System", projectId: "PRJ-2025-007",
    invoiceNo: "INV-MC-2026-000010", invoiceId: "INV-010",
    date: "2026-09-03",
    amount: 800000, currency: "LKR", exchangeRate: 1, amountLKR: 800000,
    method: "CHEQUE", bank: "Sampath Bank", bankAccount: "••••8801",
    chequeNo: "CHQ-0042891", payerName: "Sampath Bank PLC", payerBank: "Sampath Bank",
    description: "Invoice payment — HR System Q3 Milestone",
    status: "PENDING_VERIFICATION", reconciliationStatus: "UNRECONCILED",
    createdBy: "Amali De Silva",
    createdAt: "2026-09-03T15:00:00", updatedAt: "2026-09-03T15:00:00",
  },
  {
    id: "PAY-2026-000004",
    paymentType: "Vendor Payment", direction: "OUTGOING",
    clientName: "Amazon Web Services", clientCompany: "AWS", clientId: "VND-001",
    description: "AWS Infrastructure — September 2026",
    date: "2026-09-01",
    amount: 1525, currency: "USD", exchangeRate: 316.50, amountLKR: 482763,
    method: "ONLINE", bank: "HSBC Sri Lanka",
    onlineTxId: "AWS-AUTOPAY-SEP26", payerName: "MernCrest IT Services",
    status: "VERIFIED", reconciliationStatus: "RECONCILED",
    createdBy: "Rajith Kumara", verifiedBy: "Priya Jayawardena",
    createdAt: "2026-09-01T08:00:00", updatedAt: "2026-09-01T10:00:00",
  },
  {
    id: "PAY-2026-000005",
    paymentType: "Advance Payment", direction: "INCOMING",
    clientName: "Sampath Gunawardena", clientCompany: "Lanka Retail PLC", clientId: "CLT-001",
    project: "Retail ERP Implementation", projectId: "PRJ-2025-001",
    date: "2026-08-28",
    amount: 600000, currency: "LKR", exchangeRate: 1, amountLKR: 600000,
    method: "BANK_TRANSFER", bank: "Sampath Bank", bankRef: "SB2026082800119",
    payerName: "Lanka Retail PLC", payerBank: "Commercial Bank",
    description: "Advance payment for Phase 3 commencement",
    status: "VERIFIED", reconciliationStatus: "MATCHED",
    createdBy: "Amali De Silva", verifiedBy: "Priya Jayawardena",
    createdAt: "2026-08-28T11:00:00", updatedAt: "2026-08-28T16:00:00",
  },
];

export const statusCfg: Record<PaymentStatus, { label: string; bg: string; text: string; dot: string }> = {
  PENDING_VERIFICATION: { label: "Pending Verification", bg: "bg-amber-50",  text: "text-amber-700",  dot: "bg-amber-500"  },
  VERIFIED:             { label: "Verified",             bg: "bg-emerald-50",text: "text-emerald-700",dot: "bg-emerald-500"},
  REJECTED:             { label: "Rejected",             bg: "bg-red-50",    text: "text-red-700",    dot: "bg-red-500"    },
  RECONCILED:           { label: "Reconciled",           bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-500"   },
  REFUNDED:             { label: "Refunded",             bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-500" },
  CANCELLED:            { label: "Cancelled",            bg: "bg-slate-100", text: "text-slate-500",  dot: "bg-slate-400"  },
};

export const reconcileCfg: Record<string, { label: string; bg: string; text: string }> = {
  UNRECONCILED: { label: "Unreconciled", bg: "bg-amber-50",   text: "text-amber-700"  },
  MATCHED:      { label: "Matched",      bg: "bg-blue-50",    text: "text-blue-700"   },
  RECONCILED:   { label: "Reconciled",   bg: "bg-emerald-50", text: "text-emerald-700"},
  PARTIAL:      { label: "Partial",      bg: "bg-violet-50",  text: "text-violet-700" },
};

export const methodLabels: Record<PaymentMethod, string> = {
  BANK_TRANSFER: "Bank Transfer", CHEQUE: "Cheque", CASH: "Cash",
  CARD: "Card", ONLINE: "Online", NEFT: "NEFT", RTGS: "RTGS", SWIFT: "SWIFT",
};
