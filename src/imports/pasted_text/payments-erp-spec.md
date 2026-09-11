MERNCREST MANAGEMENT ERP
PAYMENTS + BANKING + SALARY + FINANCE WORKFLOW
DEEP FUNCTIONAL IMPLEMENTATION — NOT A DEMO / NOT PLACEHOLDER

IMPORTANT:
The current Payments screen is incomplete and behaves like a placeholder module.
Replace the current Payments, Banking, Salary Calculation, and Salary Settings implementation with a fully functional enterprise-grade system.

DO NOT create empty dashboards, fake buttons, static cards, dummy success messages, or placeholder pages.

Every button, tab, row, action, status, calculation, receipt, invoice relationship, client relationship, project relationship, bank relationship, approval and notification must be backed by real application state, database records and backend APIs.

Follow the system philosophy:

REQUEST → APPROVAL → ACTION → VERIFICATION → AUDIT → REPORT

====================================================
1. PAYMENTS MODULE — COMPLETE IMPLEMENTATION
====================================================

Route:
 /payments

Create a real Payments Management workspace.

The Payments page must contain:

A. Header
- Payments
- Record, verify, reconcile and manage all incoming and outgoing payments.
- Search
- Advanced filters
- Date range
- Payment status
- Payment method
- Currency
- Client
- Company
- Project
- Invoice
- Bank
- Payment type
- Employee/Vendor
- Export
- Refresh
- Create Payment button

B. KPI CARDS
- Total Payments
- Received Today
- Received This Month
- Pending Verification
- Pending Reconciliation
- Refunds
- Outstanding Receivables
- Outstanding Payables

C. PAYMENT TYPES

Support:

1. Client Payment
2. Invoice Payment
3. Project Payment
4. Subscription Payment
5. Advance Payment
6. Partial Payment
7. Full Payment
8. Refund
9. Vendor Payment
10. Salary Payment
11. Employee Advance
12. Expense Payment
13. Bank Transfer
14. Cash Payment
15. Card Payment
16. Online Payment
17. Other Payment

Do NOT hardcode payment types.

Payment types must be database/config driven.

====================================================
2. PAYMENT RECORD STRUCTURE
====================================================

Every payment must have a unique Payment ID.

Example:

PAY-2026-000001

Every received client payment must also generate a unique Receipt Number.

Example:

REC-MC-2026-000001

Never use random frontend-generated numbers.

Generate numbers transactionally from the backend/database.

Payment record must support:

- Payment ID
- Receipt Number
- Payment Type
- Payment Direction: INCOMING / OUTGOING
- Client Name
- Client Company
- Client ID
- Contact Person
- Project
- Project ID
- Invoice
- Invoice Number
- Sales Order
- Quotation
- Subscription
- Service
- Payment Date
- Received Date
- Amount
- Original Currency
- Exchange Rate
- Base Currency Amount
- Payment Method
- Bank
- Bank Account
- Bank Transaction Reference
- Cheque Number
- Card Reference
- Online Transaction ID
- Payer Name
- Payer Bank
- Payee
- Description
- Notes
- Attachments
- Verification Status
- Reconciliation Status
- Created By
- Verified By
- Approved By
- Created At
- Updated At

Default base currency:
LKR

Also support:
USD and configurable additional currencies.

Never overwrite original currency values.

Store:
original amount
original currency
exchange rate
base LKR amount

====================================================
3. RECORD PAYMENT PAGE
====================================================

Create a dedicated page:

/payments/new

Do NOT use only a small modal for this complex workflow.

Create a professional multi-section form.

Sections:

A. Payment Information
B. Client / Company
C. Invoice / Project
D. Bank / Payment Method
E. Amount
F. Supporting Documents
G. Verification
H. Review
I. Submit

Fields:

Payment Type
Payment Direction
Client / Company
Contact
Project
Invoice
Service
Payment Date
Amount
Currency
Exchange Rate
Payment Method
Bank
Bank Account
Transaction Reference
Payer Name
Payer Bank
Description
Notes
Attachment / Bank Slip / Transfer Proof

When selecting a client:

LOAD THEIR DATA.

Show:

- Client name
- Company
- Contact information
- Active projects
- Completed projects
- Services purchased
- Active subscriptions
- Previous invoices
- Outstanding invoices
- Previous payments
- Total billed
- Total paid
- Total outstanding

====================================================
4. CLIENT CLICK-THROUGH
====================================================

This is mandatory.

When the user clicks a Client/Company anywhere in Payments:

OPEN A DEDICATED CLIENT DETAIL PAGE.

Example:

/clients/[clientId]

Do NOT simply open a tooltip or small modal.

Client page must show:

CLIENT OVERVIEW

- Client ID
- Client Name
- Company Name
- Contact Person
- Email
- Phone
- WhatsApp
- Address
- Assigned Sales Representative
- Account Manager
- Status
- Created Date

FINANCIAL SUMMARY

- Total Invoiced
- Total Paid
- Outstanding
- Overdue
- Credits
- Refunds

PROJECTS

- Active Projects
- Completed Projects
- Cancelled Projects
- Project Value
- Project Status
- Start Date
- End Date
- Project Manager

SERVICES

Show all services purchased from MernCrest.

Examples:

Software Development
Web Development
Mobile App
Hosting
Domain
Cloud
Cyber Security
Digital Marketing
ERP
POS
Maintenance
Support
Consulting

These must come from actual service/project/invoice records.

INVOICES

Show:

Invoice Number
Project
Service
Invoice Date
Due Date
Amount
Paid
Balance
Status

PAYMENTS

Show:

Receipt Number
Payment ID
Invoice
Project
Date
Amount
Currency
Payment Method
Bank
Reference
Status

DOCUMENTS

Show related documents and attachments.

ACTIVITY TIMELINE

Show all important client activity.

====================================================
5. PROJECT CLICK-THROUGH
====================================================

When clicking a Project from Payments, Client, Invoice, Quotation or other finance pages:

OPEN:

/projects/[projectId]

Dedicated project details page.

Project page must show COMPLETE information:

PROJECT OVERVIEW

- Project ID
- Project Number
- Project Name
- Client
- Company
- Project Manager
- Sales Representative
- Service
- Project Type
- Status
- Priority
- Start Date
- End Date
- Expected Completion
- Actual Completion

FINANCIAL

- Quoted Value
- Contract Value
- Invoice Total
- Paid Amount
- Outstanding Amount
- Expenses
- Project Cost
- Gross Profit
- Profit Margin
- Budget
- Budget Used
- Remaining Budget

BILLING

- Quotations
- Sales Orders
- Invoices
- Payments
- Receipts
- Refunds
- Credit Notes
- Debit Notes

TASKS

- Total Tasks
- Pending
- In Progress
- Completed
- Overdue

TEAM

- Project Manager
- Developers
- Designers
- Sales
- Support
- Other assigned employees

SERVICES

Show services purchased by the client for this project.

DOCUMENTS

Show contracts, quotations, invoices, receipts, project documents and attachments.

ACTIVITY

Full project timeline.

====================================================
6. PAYMENT RECEIPTS
====================================================

Create a dedicated Receipt system.

Route:

/payments/receipts

Pages:

- Receipt Dashboard
- All Receipts
- Receipt Details
- Create Receipt
- Receipt Preview
- Receipt History
- Receipt Search
- Receipt Reports
- Receipt Settings

Every confirmed incoming payment must be capable of generating a professional receipt.

Receipt must include:

MernCrest company logo
Legal company name
Company registration information
Address
Phone
Email
Website
Branch information
Receipt Number
Payment ID
Payment Date
Client Name
Company Name
Project Number
Project Name
Invoice Number
Service
Payment Method
Bank
Transaction Reference
Amount
Currency
Exchange Rate
Base Currency Amount
Payment Description
Received By
Verified By
Notes
Terms
Signature area
QR/barcode where configured
Page number

Professional A4 PDF.

Example filename:

Payment_Receipt_REC-MC-2026-000001.pdf

Actions:

- Preview
- Generate PDF
- Download
- Print
- Email
- Share
- Regenerate
- Version History

Never generate a screenshot as a PDF.

Generate the PDF server-side using deterministic PDF generation.

====================================================
7. PAYMENT DETAIL PAGE
====================================================

Route:

/payments/[paymentId]

Show complete payment information.

Sections:

Payment Summary
Client
Project
Invoice
Service
Bank
Transaction
Amount
Verification
Reconciliation
Documents
Activity
Audit History

Actions:

- Edit
- Verify
- Reject
- Reconcile
- Unreconcile where permission allows
- Generate Receipt
- Download Receipt
- Email Receipt
- Refund
- Add Attachment
- Add Note
- View Invoice
- View Project
- View Client

Financial records must not be silently overwritten.

Use adjustment/reversal mechanisms where required.

====================================================
8. INVOICE RELATIONSHIP
====================================================

Payments must be deeply connected to Invoices.

Clicking an Invoice Number must open:

/invoices/[invoiceId]

Invoice page must show:

Invoice details
Client
Project
Service
Quotation
Sales Order
Invoice amount
Paid amount
Outstanding
Payment history
Receipt history
Due date
Overdue days
Payment status

Payment status:

UNPAID
PARTIALLY_PAID
PAID
OVERDUE
REFUNDED
CANCELLED

When a payment is verified:

Update invoice payment state automatically.

Example:

Invoice:
LKR 150,000

Payment:
LKR 50,000

Invoice becomes:

PARTIALLY PAID
Paid = LKR 50,000
Balance = LKR 100,000

A second payment of LKR 100,000:

PAID
Paid = LKR 150,000
Balance = LKR 0

This must be server-side transactional logic.

====================================================
9. BANKING MODULE
====================================================

Route:

/banking

The current Banking page must NOT be a simple list.

Create a professional Banking Dashboard.

Show:

- Total Bank Balance
- Available Balance
- Pending Deposits
- Pending Withdrawals
- Incoming Today
- Outgoing Today
- Reconciliation Status
- Unmatched Transactions
- Bank Alerts

BANK LIST

Each bank must be displayed as an actual bank account entity.

Fields:

- Bank ID
- Bank Name
- Account Name
- Account Number
- Masked Account Number
- Branch
- Account Type
- Currency
- Opening Balance
- Current Balance
- Available Balance
- Status
- Last Sync
- Last Reconciliation

====================================================
10. BANK NAME CLICK = NEW PAGE
====================================================

When clicking a bank name:

OPEN A DEDICATED NEW PAGE.

Example:

/banking/banks/[bankId]

Do NOT open only a modal.

Bank detail page:

BANK OVERVIEW
- Bank Name
- Account Name
- Masked Account Number
- Branch
- Account Type
- Currency
- Status

BALANCE
- Opening Balance
- Current Balance
- Available Balance
- Pending
- Reconciled Balance

TRANSACTIONS

Show:

Date
Transaction ID
Bank Reference
Description
Payer/Payee
Amount
Currency
Debit/Credit
Matched Payment
Client
Invoice
Project
Reconciliation Status

Filters:

Date
Debit/Credit
Amount
Reference
Client
Invoice
Project
Status

Actions:

- View Transaction
- Match Payment
- Create Payment
- Reconcile
- Mark as Unmatched
- Export
- Download Statement

====================================================
11. BANK STATEMENT
====================================================

Create:

/banking/banks/[bankId]/statement

This must be a dedicated full page.

Features:

- Date range
- Opening balance
- Closing balance
- Credits
- Debits
- Running balance
- Reconciliation
- Search
- Filters
- Export CSV
- Export Excel
- Generate PDF
- Print
- Download Statement

Professional bank statement PDF.

====================================================
12. INCOMING BANK PAYMENT DETECTION
====================================================

IMPORTANT:

If a client transfers money to a MernCrest bank account, the system must be designed to receive bank transaction data.

Do NOT fake this.

Create a bank integration architecture supporting:

- Bank API where available
- Open Banking API where available
- Bank webhook where available
- Secure bank statement import
- CSV/Excel bank statement import as fallback
- Scheduled bank synchronization
- Manual transaction import

Architecture must use a provider abstraction so different banks can be connected later.

Example:

BankProvider
  ├── Bank API Adapter
  ├── Open Banking Adapter
  ├── Statement Import Adapter
  └── Webhook Adapter

When a new incoming transaction is received:

1. Create bank transaction
2. Detect CREDIT
3. Read payer name
4. Read bank reference
5. Read amount
6. Read date
7. Attempt matching
8. Search client
9. Search invoice
10. Search project
11. Search payment reference
12. Detect possible duplicate
13. Create unmatched transaction if confidence is low
14. Notify authorized finance users
15. Allow accountant/authorized manager to review
16. Create payment record after confirmation
17. Generate Receipt Number
18. Link Payment → Client → Invoice → Project
19. Update Invoice balance
20. Update Client financial summary
21. Update Project financial summary
22. Update bank reconciliation
23. Write audit log

====================================================
13. AUTOMATIC PAYMENT MATCHING
====================================================

Implement payment matching engine.

Possible matching signals:

- Invoice number in bank reference
- Receipt/payment reference
- Client name
- Client company
- Payer name
- Project number
- Exact amount
- Date proximity
- Bank reference
- Customer account information

Show:

MATCHED
HIGH CONFIDENCE
REVIEW REQUIRED
UNMATCHED
DUPLICATE SUSPECTED

Never automatically assign a low-confidence payment without review.

====================================================
14. PAYMENT NOTIFICATIONS
====================================================

When an incoming payment is detected:

Create real notifications.

Notification example:

"Incoming payment detected"

Show:

Client
Amount
Bank
Reference
Possible Invoice
Possible Project
Payment Date

Notification actions:

- Review
- Match
- Record Payment
- Ignore
- Open Bank Transaction

Notification must appear in:

- Notification Center
- Finance dashboard
- Banking page
- Payment page where relevant

Also support email notification for authorized finance users.

Do not expose sensitive banking information in notifications unnecessarily.

====================================================
15. SALARY PAYMENT
====================================================

Create a dedicated Salary Payment system.

Routes:

/payroll/salary-payments
/payroll/salary-payments/[id]

Salary Payment must be separate from normal Client Payment.

Support:

- Monthly Salary
- Salary Advance
- Allowances
- Deductions
- Commission
- Overtime
- Bonus
- Loan Deduction
- Other Adjustment
- Net Salary

Salary payment record:

- Salary Payment ID
- Employee
- Employee ID
- Payroll Period
- Basic Salary
- Allowances
- Commission
- Overtime
- Bonus
- Deductions
- Loans
- Advances
- Net Salary
- Currency
- Bank
- Bank Account
- Payment Date
- Payment Reference
- Status
- Approved By
- Paid By

Statuses:

DRAFT
CALCULATED
PENDING_APPROVAL
APPROVED
PROCESSING
PAID
FAILED
REVERSED

====================================================
16. VENDOR PAYMENT
====================================================

Create:

/finance/vendor-payments

Support:

- Vendor
- Purchase Order
- Goods Received Note
- Vendor Bill
- Amount
- Currency
- Bank
- Payment Method
- Reference
- Due Date
- Status
- Documents
- Approval
- Reconciliation

Vendor payment must be linked:

Vendor → Purchase Request → PO → GRN → Vendor Bill → Payment

====================================================
17. SALARY CALCULATION — MUST ACTUALLY WORK
====================================================

Current Salary Calculation page is not functional.

Fix it completely.

Route:

/payroll/calculation

Show payroll period selector.

Example:

September 2026

Employee list:

Employee ID
Employee Name
Designation
Department
Basic Salary
Allowances
Commission
Overtime
Bonus
Gross Salary
Deductions
Loan
Advance
Other Deductions
Net Salary
Status

CALCULATION DETAILS

For every employee show:

Basic Salary
+ Allowances
+ Commission
+ Overtime
+ Bonus
+ Other Earnings
= Gross Salary

Then:

- EPF/ETF or configured statutory deductions
- Loans
- Salary Advance
- Unpaid Leave
- Other deductions
= Total Deductions

Then:

Gross Salary - Total Deductions = Net Salary

Do NOT hardcode Sri Lankan statutory percentages.

Create configurable payroll rules.

====================================================
18. COMMISSION IN SALARY
====================================================

Commission must be automatically pulled from the Commission module.

Commission flow:

Salesperson
→ Lead
→ Opportunity
→ Quotation
→ Sales Order
→ Invoice
→ Payment
→ Commission

Only eligible/approved commissions should enter payroll.

Show:

Commission ID
Source Invoice
Client
Project
Service
Sale Amount
Paid Amount
Commission Basis
Commission Rate
Commission Amount
Status

Commission statuses:

ACCRUED
PENDING
APPROVED
PAYABLE
PAID
CANCELLED
REVERSED

Commission must NOT be hardcoded to 6% or any other fixed rate.

====================================================
19. SALARY ALLOWANCES
====================================================

Support configurable allowances:

- Transport
- Meal
- Mobile
- Internet
- Housing
- Attendance
- Performance
- Project
- Travel
- Medical
- Other

Allowances must be configurable.

Each allowance:

- Allowance ID
- Name
- Description
- Type
- Fixed Amount / Percentage
- Taxable
- Recurring
- Effective From
- Effective To
- Employee-specific
- Department-specific
- Role-specific
- Status

====================================================
20. SALARY SETTINGS
====================================================

Route:

/payroll/settings

Create dedicated Salary Settings.

IMPORTANT ACCESS CONTROL:

Only:

DIRECTOR
MANAGER

can access salary configuration depending on permission scope.

ACCOUNTANT can calculate/process payroll according to assigned permissions but cannot modify salary configuration unless explicitly granted.

EMPLOYEE cannot access salary settings.

Salary Settings include:

- Salary components
- Allowances
- Deductions
- Commission rules
- Overtime rules
- Bonus rules
- Loan settings
- Advance settings
- Payroll periods
- Payroll numbering
- Payslip settings
- Approval rules
- Bank payment settings
- Currency
- Rounding
- Statutory configuration
- Payroll notification settings

====================================================
21. EMPLOYEE-WISE SALARY EDIT
====================================================

Employee salary must be editable from:

/employees/[employeeId]/salary

Show:

Current Salary
Salary History
Basic Salary
Allowances
Commission eligibility
Overtime eligibility
Bonus eligibility
Deductions
Loans
Advances
Effective Date

Actions:

Edit Salary
Add Allowance
Remove Allowance
Change Commission Rule
Change Deduction
Change Salary Structure

IMPORTANT:

Salary changes must NOT become active immediately without approval.

Workflow:

MANAGER creates salary change
→ DIRECTOR reviews
→ APPROVED
→ Effective date reached
→ Salary becomes active
→ Audit record created

For Director-created salary changes, configure whether a second approval is required according to organization policy.

====================================================
22. SALARY HISTORY
====================================================

Every salary change must preserve history.

Show:

Previous Salary
New Salary
Difference
Reason
Effective Date
Requested By
Approved By
Approval Date
Status

Never overwrite historical salary records.

====================================================
23. PAYSLIP
====================================================

Every paid salary must generate a professional payslip.

Include:

MernCrest logo
Company details
Employee details
Employee ID
Designation
Department
Payroll period
Basic Salary
Allowances
Commission
Overtime
Bonus
Deductions
Loans
Advance
Gross Salary
Net Salary
Payment Date
Payment Reference
Bank
Masked Account Number
Authorized signatures

Actions:

Preview
Download PDF
Print
Email
Regenerate
Version History

====================================================
24. FINANCE ACTION PAGES MUST OPEN AS REAL PAGES
====================================================

The following must open dedicated pages where appropriate:

Payment
Receipt
Invoice
Client
Project
Bank
Bank Statement
Salary Payment
Vendor Payment
Payroll Calculation
Employee Salary
Salary Settings
Payment Reconciliation
Refund
Financial Report

Do not use tiny modals for complex records.

====================================================
25. PAYMENT RECONCILIATION
====================================================

Create:

/payments/reconciliation

Features:

- Bank transactions
- Recorded payments
- Suggested matches
- Matched
- Unmatched
- Duplicate suspected
- Manual matching
- Split matching
- Partial matching
- Reconciliation notes
- Reconciliation history

When reconciled:

Bank Transaction
↔ Payment
↔ Invoice
↔ Client
↔ Project

must maintain the relationship.

====================================================
26. REFUNDS
====================================================

Create:

/payments/refunds

Support:

- Refund request
- Reason
- Original payment
- Client
- Invoice
- Project
- Amount
- Currency
- Refund method
- Approval
- Processing
- Completed
- Reversed

Refund must update financial records correctly.

====================================================
27. SEARCH
====================================================

Global Payments search must support:

Payment ID
Receipt Number
Invoice Number
Project Number
Client name
Company name
Bank reference
Transaction ID
Employee
Vendor

Example:

Search:
REC-MC-2026-000021

should immediately locate the payment.

Search:
PRJ-2026-0012

should show related project payments.

Search:
INV-MC-2026-000089

should show invoice and payment history.

====================================================
28. PAYMENT REPORTS
====================================================

Create:

/payments/reports

Reports:

- Payment Register
- Client Payment Report
- Project Payment Report
- Invoice Payment Report
- Bank Payment Report
- Payment Method Report
- Outstanding Receivables
- Refund Report
- Reconciliation Report
- Salary Payment Report
- Vendor Payment Report
- Daily Collection
- Monthly Collection
- Currency Report

Every report must support:

Filter
Search
Date range
Export CSV
Export Excel
Generate PDF
Print
Email Report

PDF must contain company logo and company information.

====================================================
29. AUDIT LOGGING
====================================================

Audit every financial action.

Examples:

Payment Created
Payment Edited
Payment Verified
Payment Rejected
Payment Reconciled
Receipt Generated
Receipt Emailed
Payment Refunded
Bank Transaction Imported
Payment Matched
Payment Unmatched
Salary Calculated
Salary Changed
Allowance Added
Commission Added
Salary Approved
Salary Paid

Audit:

Who
What
When
Old Value
New Value
IP/device metadata where policy allows
Reason
Reference

====================================================
30. ROLE SECURITY
====================================================

Backend authorization is the source of truth.

DIRECTOR:
Full organizational financial authority according to permissions.

MANAGER:
Can perform financial actions according to assigned scope and permissions.

ACCOUNTANT:
Financial operations, payment recording, reconciliation, payroll processing according to assigned permissions.

EMPLOYEE:
Only own authorized salary/payslip information and other explicitly permitted records.

Do not create fake additional top-level roles.

Use:

Role + Permission + Scope

Scopes:

Global
Company
Branch
Department
Team
Own

====================================================
31. SECURITY
====================================================

Implement:

- Secure cookie sessions
- HttpOnly
- Secure
- SameSite
- CSRF protection where applicable
- Backend authorization
- Rate limiting
- Input validation
- Secure file uploads
- Encrypted sensitive bank information
- Mask bank account numbers
- Never log passwords
- Never log secrets
- Never expose API keys
- Secure PDF download authorization
- Audit logs
- Duplicate transaction protection
- Idempotency keys for payment creation
- Financial transaction locking where required
- Decimal/Numeric database types
- No floating point financial calculations
- Transactional database operations
- Permission checks on every sensitive endpoint

====================================================
32. CENTRE-SCREEN ANIMATED ACTION FEEDBACK
====================================================

IMPORTANT DESIGN REQUIREMENT:

ALL MAJOR ACTIONS must display a professional animated JSON/Lottie-style animation in the CENTER of the screen.

Do NOT use browser alert().

Do NOT use simple text "Success".

Use a reusable global ActionFeedback component.

Examples:

Payment Recorded
Payment Verified
Payment Rejected
Payment Reconciled
Receipt Generated
Receipt Sent
Invoice Paid
Refund Completed
Bank Sync Completed
Bank Transaction Imported
Payment Matched
Payment Unmatched
Salary Calculated
Salary Approved
Salary Paid
Allowance Added
Salary Updated
Vendor Payment Completed
Report Generated
PDF Generated
Email Sent
File Uploaded
Approval Completed
Error
Processing
No Results

Animation behavior:

1. User performs action
2. Screen shows centered overlay
3. Lottie/JSON animation plays
4. Short success/error/processing message
5. Show reference number where useful
6. Automatically dismiss after completion
7. Preserve accessible status text for screen readers

Example:

[Centered animation]

✓ Payment Recorded Successfully

Receipt:
REC-MC-2026-000021

Amount:
LKR 50,000

[View Receipt]

For processing:

[Animated processing Lottie]

Recording Payment...

For error:

[Animated error Lottie]

Payment Could Not Be Recorded

Reason:
...

[Try Again]

Create reusable components:

<ActionFeedback />
<SuccessAnimation />
<ErrorAnimation />
<ProcessingAnimation />
<UploadAnimation />
<PaymentSuccessAnimation />
<ReceiptGeneratedAnimation />
<ApprovalAnimation />
<EmailSentAnimation />

Animations must be professional enterprise style.

Do not make them childish.

Use JSON/Lottie assets where available.

Support reduced-motion accessibility.

====================================================
33. UI DESIGN
====================================================

Maintain the existing MernCrest ERP visual language from the screenshot:

- Professional enterprise interface
- Light theme
- Dark navy sidebar
- Blue primary actions
- Clean white content areas
- Strong typography
- Colorful but professional status indicators
- Responsive
- Desktop/tablet/mobile
- Full-screen workspace

Improve the current Payments page significantly.

Do NOT retain the current placeholder:

"Payments Module
Record and verify payments..."

Replace it with a real operational finance workspace.

====================================================
34. PAYMENT TABLE
====================================================

Create a professional table:

Receipt #
Payment ID
Date
Client / Company
Project
Invoice
Payment Type
Amount
Currency
Method
Bank
Reference
Status
Verification
Actions

Row actions:

View
Verify
Reconcile
Receipt
Invoice
Project
Client
Refund
More

Use icons + labels + colors.

Never rely on color alone.

====================================================
35. DATABASE / RELATIONSHIPS
====================================================

Create proper relational models for:

Payment
PaymentReceipt
PaymentAllocation
PaymentMethod
Bank
BankAccount
BankTransaction
BankStatement
PaymentReconciliation
Refund
Client
Project
Invoice
InvoicePayment
Service
Employee
EmployeeSalary
SalaryComponent
Allowance
Deduction
Commission
PayrollRun
SalaryPayment
Vendor
VendorBill
AuditLog
Notification

Relationships must be properly indexed.

Examples:

Client
 ├── Projects
 ├── Services
 ├── Quotations
 ├── Sales Orders
 ├── Invoices
 ├── Payments
 └── Receipts

Project
 ├── Client
 ├── Services
 ├── Quotations
 ├── Invoices
 ├── Payments
 ├── Receipts
 ├── Tasks
 └── Documents

Bank
 ├── Bank Accounts
 ├── Transactions
 ├── Statements
 ├── Payments
 └── Reconciliation

Employee
 ├── Salary
 ├── Allowances
 ├── Commission
 ├── Payroll
 └── Salary Payments

====================================================
36. NO FAKE INTEGRATIONS
====================================================

Do NOT display:

"Connected"
"Synced"
"Payment Received"

unless the backend actually confirms it.

If a bank API is not yet configured:

Show:

"Bank integration not configured"

and provide:

Configure Bank
Import Statement
Connect Provider

Do not fabricate bank transactions.

Use adapters/interfaces so real bank integrations can be added later.

====================================================
37. TESTING REQUIREMENTS
====================================================

Before marking this implementation complete:

Test:

Create client
Create project
Create service
Create invoice
Record payment
Generate receipt
Verify payment
Allocate payment to invoice
Update invoice balance
Open client
Open project
Open invoice
Open bank
Import bank transaction
Match bank transaction
Reconcile payment
Generate statement
Calculate salary
Add allowance
Add commission
Approve salary change
Generate payslip
Record salary payment
Record vendor payment
Generate reports
Download PDFs
Send email
Audit all actions

Test:

LKR
USD
Partial payment
Full payment
Multiple payments
Refund
Duplicate payment
Unmatched bank transaction
Incorrect invoice number
Incorrect client
Permission denied
Unauthorized PDF
Unauthorized salary access

====================================================
38. FINAL ACCEPTANCE CRITERIA
====================================================

The implementation is NOT COMPLETE if:

- Payments page is still a placeholder
- Record Payment button does nothing
- Receipt cannot be generated
- Receipt number is missing
- Invoice relationship is missing
- Project relationship is missing
- Client relationship is missing
- Clicking client does not open full client page
- Clicking project does not open full project page
- Clicking bank does not open full bank page
- Bank statement is missing
- Incoming bank transaction workflow is missing
- Payment reconciliation is missing
- Salary calculation is static
- Commission is not included
- Allowances are not included
- Salary settings are accessible to everyone
- Salary changes bypass Director approval
- Payslip is missing
- Vendor Payment is missing
- Reports are missing
- Audit logs are missing
- Financial calculations happen only on frontend
- Buttons use fake/demo data
- Success messages are simple alerts instead of the centralized animated feedback system

====================================================
39. IMPLEMENTATION APPROACH
====================================================

First inspect the existing codebase.

Do NOT immediately rewrite unrelated modules.

Identify:

- Current Payments routes
- Finance routes
- Banking routes
- Invoice models
- Client models
- Project models
- Employee models
- Payroll models
- Commission models
- Notification system
- PDF generation system
- Email system
- Permission system
- Audit system

Then produce a gap analysis.

After that:

1. Update database schema
2. Create migrations
3. Create backend services
4. Create API endpoints
5. Implement authorization
6. Implement payment engine
7. Implement invoice allocation
8. Implement receipt engine
9. Implement banking engine
10. Implement reconciliation
11. Implement salary calculation
12. Implement allowances
13. Implement commission integration
14. Implement salary approval
15. Implement salary payment
16. Implement vendor payment
17. Implement PDFs
18. Implement notifications
19. Implement animated action feedback
20. Implement reports
21. Implement audit logging
22. Build all required pages
23. Connect every UI action to real APIs
24. Add loading/empty/error/success states
25. Add responsive behavior
26. Run typecheck
27. Run lint
28. Run tests
29. Run security review
30. Fix all errors
31. Verify all workflows end-to-end

IMPORTANT:
Do not stop after creating the UI.

The goal is a REAL FUNCTIONAL MernCrest Finance + Payments + Banking + Payroll subsystem.

No placeholders.
No fake data.
No dead buttons.
No incomplete detail pages.
No hardcoded financial logic.
No missing relationships.
No fake bank synchronization.

Every action must work end-to-end.