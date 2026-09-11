export const employees = [
  { id: "EMP001", name: "Kavinda Perera", email: "kavinda@merncrest.lk", phone: "+94 77 123 4567", department: "Engineering", designation: "Senior Software Engineer", branch: "Colombo HQ", status: "active", joinDate: "2022-03-15", avatar: "", manager: "Dilshan Fernando", salary: 185000 },
  { id: "EMP002", name: "Dilshan Fernando", email: "dilshan@merncrest.lk", phone: "+94 76 234 5678", department: "Engineering", designation: "Engineering Manager", branch: "Colombo HQ", status: "active", joinDate: "2020-06-01", avatar: "", manager: "Priya Jayawardena", salary: 265000 },
  { id: "EMP003", name: "Priya Jayawardena", email: "priya@merncrest.lk", phone: "+94 71 345 6789", department: "Operations", designation: "Operations Director", branch: "Colombo HQ", status: "active", joinDate: "2019-01-10", avatar: "", manager: "—", salary: 380000 },
  { id: "EMP004", name: "Chamara Wickramasinghe", email: "chamara@merncrest.lk", phone: "+94 77 456 7890", department: "Sales", designation: "Sales Manager", branch: "Kandy", status: "active", joinDate: "2021-08-20", avatar: "", manager: "Priya Jayawardena", salary: 195000 },
  { id: "EMP005", name: "Nishani Silva", email: "nishani@merncrest.lk", phone: "+94 72 567 8901", department: "Design", designation: "UI/UX Designer", branch: "Colombo HQ", status: "active", joinDate: "2023-02-14", avatar: "", manager: "Dilshan Fernando", salary: 145000 },
  { id: "EMP006", name: "Rajith Kumara", email: "rajith@merncrest.lk", phone: "+94 75 678 9012", department: "Finance", designation: "Senior Accountant", branch: "Colombo HQ", status: "active", joinDate: "2021-04-05", avatar: "", manager: "Priya Jayawardena", salary: 175000 },
  { id: "EMP007", name: "Amali De Silva", email: "amali@merncrest.lk", phone: "+94 76 789 0123", department: "HR", designation: "HR Manager", branch: "Colombo HQ", status: "active", joinDate: "2020-11-15", avatar: "", manager: "Priya Jayawardena", salary: 195000 },
  { id: "EMP008", name: "Sameera Bandara", email: "sameera@merncrest.lk", phone: "+94 77 890 1234", department: "Engineering", designation: "DevOps Engineer", branch: "Colombo HQ", status: "active", joinDate: "2022-07-01", avatar: "", manager: "Dilshan Fernando", salary: 165000 },
  { id: "EMP009", name: "Tharaka Ranatunga", email: "tharaka@merncrest.lk", phone: "+94 71 901 2345", department: "Support", designation: "Support Lead", branch: "Kandy", status: "on-leave", joinDate: "2021-12-10", avatar: "", manager: "Dilshan Fernando", salary: 130000 },
  { id: "EMP010", name: "Ishara Madushani", email: "ishara@merncrest.lk", phone: "+94 72 012 3456", department: "Marketing", designation: "Digital Marketing Specialist", branch: "Colombo HQ", status: "active", joinDate: "2023-05-22", avatar: "", manager: "Chamara Wickramasinghe", salary: 120000 },
];

export const projects = [
  { id: "PRJ001", name: "E-Commerce Platform Redesign", client: "Lanka Retail PLC", status: "in-progress", priority: "high", manager: "Dilshan Fernando", team: 6, startDate: "2025-01-15", endDate: "2025-06-30", budget: 4500000, spent: 2180000, progress: 48, type: "Web Development" },
  { id: "PRJ002", name: "HR Management System", client: "Ceylon Bank Ltd", status: "in-progress", priority: "critical", manager: "Kavinda Perera", team: 4, startDate: "2024-11-01", endDate: "2025-04-30", budget: 3200000, spent: 2950000, progress: 92, type: "ERP" },
  { id: "PRJ003", name: "Mobile Banking App", client: "People's Finance", status: "planning", priority: "high", manager: "Dilshan Fernando", team: 5, startDate: "2025-03-01", endDate: "2025-12-31", budget: 6800000, spent: 320000, progress: 8, type: "Mobile Development" },
  { id: "PRJ004", name: "Cloud Migration — Phase 2", client: "MernCrest Internal", status: "completed", priority: "medium", manager: "Sameera Bandara", team: 3, startDate: "2024-09-01", endDate: "2025-01-31", budget: 2100000, spent: 1985000, progress: 100, type: "Cloud Services" },
  { id: "PRJ005", name: "POS System Integration", client: "Cargills Food City", status: "on-hold", priority: "medium", manager: "Chamara Wickramasinghe", team: 4, startDate: "2025-02-15", endDate: "2025-08-15", budget: 1800000, spent: 450000, progress: 25, type: "Integration" },
  { id: "PRJ006", name: "Cybersecurity Audit", client: "Dialog Axiata PLC", status: "in-progress", priority: "critical", manager: "Sameera Bandara", team: 2, startDate: "2025-02-01", endDate: "2025-03-31", budget: 980000, spent: 620000, progress: 63, type: "Cyber Security" },
];

export const tickets = [
  { id: "TKT-1024", title: "Production API returning 500 errors intermittently", client: "Ceylon Bank Ltd", priority: "critical", status: "in-progress", assignee: "Sameera Bandara", created: "2025-03-10", sla: "2h", project: "HR Management System" },
  { id: "TKT-1023", title: "Login page not loading on Safari iOS", client: "People's Finance", priority: "high", status: "open", assignee: "Kavinda Perera", created: "2025-03-10", sla: "4h", project: "Mobile Banking App" },
  { id: "TKT-1022", title: "Report export PDF formatting broken", client: "Lanka Retail PLC", priority: "medium", status: "waiting", assignee: "Nishani Silva", created: "2025-03-09", sla: "8h", project: "E-Commerce Platform" },
  { id: "TKT-1021", title: "Inventory sync delay > 30 minutes", client: "Cargills Food City", priority: "high", status: "resolved", assignee: "Kavinda Perera", created: "2025-03-09", sla: "4h", project: "POS System Integration" },
  { id: "TKT-1020", title: "Dashboard widgets not loading data", client: "Dialog Axiata PLC", priority: "medium", status: "open", assignee: "Nishani Silva", created: "2025-03-08", sla: "8h", project: "Cybersecurity Audit" },
];

export const invoices = [
  { id: "INV-2025-0089", client: "Lanka Retail PLC", amount: 680000, currency: "LKR", status: "overdue", dueDate: "2025-02-28", project: "E-Commerce Platform Redesign", issueDate: "2025-02-01" },
  { id: "INV-2025-0088", client: "Ceylon Bank Ltd", amount: 1200000, currency: "LKR", status: "paid", dueDate: "2025-03-15", project: "HR Management System", issueDate: "2025-02-15" },
  { id: "INV-2025-0087", client: "People's Finance", amount: 480000, currency: "LKR", status: "pending", dueDate: "2025-03-25", project: "Mobile Banking App", issueDate: "2025-03-01" },
  { id: "INV-2025-0086", client: "Cargills Food City", amount: 360000, currency: "LKR", status: "partial", dueDate: "2025-03-20", project: "POS System Integration", issueDate: "2025-02-28" },
  { id: "INV-2025-0085", client: "Dialog Axiata PLC", amount: 290000, currency: "LKR", status: "paid", dueDate: "2025-03-10", project: "Cybersecurity Audit", issueDate: "2025-02-20" },
];

export const revenueData = [
  { month: "Sep", revenue: 3200000, expenses: 2100000, profit: 1100000 },
  { month: "Oct", revenue: 4100000, expenses: 2400000, profit: 1700000 },
  { month: "Nov", revenue: 3800000, expenses: 2200000, profit: 1600000 },
  { month: "Dec", revenue: 5200000, expenses: 2900000, profit: 2300000 },
  { month: "Jan", revenue: 4600000, expenses: 2600000, profit: 2000000 },
  { month: "Feb", revenue: 4900000, expenses: 2800000, profit: 2100000 },
  { month: "Mar", revenue: 5400000, expenses: 3000000, profit: 2400000 },
];

export const attendanceData = [
  { day: "Mon", present: 38, absent: 4, late: 3, leave: 5 },
  { day: "Tue", present: 42, absent: 2, late: 2, leave: 4 },
  { day: "Wed", present: 40, absent: 3, late: 4, leave: 3 },
  { day: "Thu", present: 41, absent: 2, late: 3, leave: 4 },
  { day: "Fri", present: 36, absent: 5, late: 2, leave: 7 },
];

export const departments = [
  { name: "Engineering", count: 24, head: "Dilshan Fernando" },
  { name: "Sales", count: 8, head: "Chamara Wickramasinghe" },
  { name: "Finance", count: 5, head: "Rajith Kumara" },
  { name: "HR", count: 4, head: "Amali De Silva" },
  { name: "Design", count: 6, head: "Nishani Silva" },
  { name: "Support", count: 7, head: "Tharaka Ranatunga" },
  { name: "Marketing", count: 4, head: "Ishara Madushani" },
  { name: "Operations", count: 3, head: "Priya Jayawardena" },
];

export const leads = [
  { id: "LD001", name: "Sampath Bank", contact: "Nuwan Perera", value: 5800000, status: "qualified", source: "Referral", stage: "Proposal", owner: "Chamara Wickramasinghe", lastActivity: "2025-03-09" },
  { id: "LD002", name: "Hayleys Group", contact: "Dilini Jayasinghe", value: 3200000, status: "new", source: "Website", stage: "Discovery", owner: "Chamara Wickramasinghe", lastActivity: "2025-03-10" },
  { id: "LD003", name: "John Keells Holdings", contact: "Prasanna Gunawardena", value: 9500000, status: "negotiation", source: "Direct", stage: "Negotiation", owner: "Priya Jayawardena", lastActivity: "2025-03-08" },
  { id: "LD004", name: "NDB Bank", contact: "Thilina Abeysekara", value: 2100000, status: "proposal", source: "Conference", stage: "Proposal", owner: "Chamara Wickramasinghe", lastActivity: "2025-03-07" },
];

export const tasks = [
  { id: "TSK-401", title: "Implement payment gateway integration", project: "E-Commerce Platform", assignee: "Kavinda Perera", priority: "high", status: "in-progress", due: "2025-03-15", estimate: 16 },
  { id: "TSK-402", title: "Design onboarding flow mockups", project: "Mobile Banking App", assignee: "Nishani Silva", priority: "medium", status: "todo", due: "2025-03-18", estimate: 8 },
  { id: "TSK-403", title: "Fix database connection pooling issue", project: "HR Management System", assignee: "Sameera Bandara", priority: "critical", status: "in-progress", due: "2025-03-11", estimate: 4 },
  { id: "TSK-404", title: "Write API documentation", project: "HR Management System", assignee: "Kavinda Perera", priority: "low", status: "todo", due: "2025-03-20", estimate: 6 },
  { id: "TSK-405", title: "Security penetration testing", project: "Cybersecurity Audit", assignee: "Sameera Bandara", priority: "critical", status: "in-progress", due: "2025-03-12", estimate: 24 },
  { id: "TSK-406", title: "Update staging environment configs", project: "Cloud Migration", assignee: "Sameera Bandara", priority: "medium", status: "done", due: "2025-03-10", estimate: 3 },
];

export const leaveRequests = [
  { id: "LV001", employee: "Kavinda Perera", type: "Annual Leave", from: "2025-03-20", to: "2025-03-22", days: 3, status: "pending", reason: "Family holiday", appliedOn: "2025-03-10" },
  { id: "LV002", employee: "Nishani Silva", type: "Medical Leave", from: "2025-03-13", to: "2025-03-13", days: 1, status: "approved", reason: "Doctor appointment", appliedOn: "2025-03-09" },
  { id: "LV003", employee: "Tharaka Ranatunga", type: "Annual Leave", from: "2025-03-17", to: "2025-03-21", days: 5, status: "approved", reason: "Vacation", appliedOn: "2025-03-05" },
  { id: "LV004", employee: "Ishara Madushani", type: "Casual Leave", from: "2025-03-14", to: "2025-03-14", days: 1, status: "pending", reason: "Personal work", appliedOn: "2025-03-11" },
];
