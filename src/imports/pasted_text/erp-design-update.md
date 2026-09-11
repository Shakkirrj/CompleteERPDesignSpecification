===============================================================
MERNCREST ERP
MASTER UI/UX + FEATURE COMPLETENESS + WORKFLOW EXPANSION
CRITICAL SYSTEM DESIGN UPDATE
===============================================================

ROLE:

Act as a Senior Enterprise ERP Architect, Product Designer,
UX Engineer, Security Architect and Full-Stack Product Engineer.

This is NOT a cosmetic update.

The existing MernCrest ERP design is missing important modules,
sub-pages, workflows, actions, file-management capabilities,
approval workflows, infrastructure management, authentication
options, employee account workflows, reporting and document
generation.

Perform a COMPLETE audit first.

Then implement/design everything described below while preserving
the existing MernCrest design language.

===============================================================
0. CORE PRODUCT
===============================================================

Product:

MernCrest IT Services ERP

This is a complete internal operating platform for an IT Services
company.

It must manage:

Organization
Companies
Branches
Departments
Teams
Employees
HR
Recruitment
Onboarding
Offboarding
Attendance
Leave
Payroll
Salary
Commission
CRM
Customers
Leads
Sales
Services
Quotations
Sales Orders
Projects
Tasks
Sprints
Time Tracking
IT Support
Tickets
Assets
Inventory
Procurement
Vendors
Finance
Accounting
Billing
Invoices
Payments
Subscriptions
Documents
Email
Chat
Support Centre
Approvals
Access Management
API
Secrets
Integrations
GitHub
Infrastructure
Servers
Domains
SSL
DNS
Automation
AI Assistant
Reports
Analytics
Settings
Security
Audit

===============================================================
1. FULL-SCREEN EXPERIENCE
===============================================================

The application must support a premium full-screen workspace.

Desktop:

Sidebar
+
Top Navigation
+
Full available content area

Provide an optional:

Focus Mode
Full Screen
Exit Full Screen

Full-screen mode should allow:

Dashboards
Tables
Documents
File Explorer
Projects
Kanban
Gantt
Reports
Terminal
Infrastructure Monitoring

to use maximum available screen space.

Do not unnecessarily constrain large enterprise screens.

===============================================================
2. COMMAND CENTER
===============================================================

Create a global command/search system.

Shortcut:

Ctrl/Cmd + K

Search and navigate to:

Employees
Customers
Projects
Tasks
Tickets
Documents
Invoices
Payments
Quotations
Services
Assets
Vendors
Servers
Domains
Integrations
Reports
Settings

Actions:

Create Employee
Create Customer
Create Project
Create Invoice
Create Quotation
Upload Document
Record Payment
Create Ticket
Open Terminal

Search must respect RBAC.

===============================================================
3. TERMINAL / COMMAND CONSOLE
===============================================================

Create an optional internal Terminal / Command Console module.

Route:

/terminal

This is an ADMIN/AUTHORIZED technical workspace.

DO NOT expose this to ordinary employees.

Design:

Professional dark terminal workspace inside the otherwise
light-theme ERP.

Features:

Terminal tabs
Command input
Command history
Clear
Copy
Search
Resize
Fullscreen
Connection status
Environment selector

Environments:

Development
Staging
Production

Infrastructure targets:

Server
Container
Service
Application

IMPORTANT SECURITY:

Never expose passwords
API keys
private keys
database credentials
secrets

unless explicitly authorized through a secure secret-management
workflow.

Terminal must NOT execute arbitrary dangerous commands from the
browser without backend authorization and auditing.

Every terminal command must be auditable.

===============================================================
4. ASSETS — WINDOWS-STYLE FILE EXPLORER
===============================================================

Assets must have a dedicated module.

Do NOT make Assets look like a simple table.

Create:

Asset Explorer

with a Windows File Explorer-inspired experience.

Layout:

---------------------------------------------------------------
FOLDER TREE | MAIN CONTENT | PREVIEW / DETAILS PANEL
---------------------------------------------------------------

Support:

List View
Grid View
Details View

Toolbar:

New Asset
New Folder
Upload
Search
Sort
Filter
View
Refresh
Bulk Actions

===============================================================
ASSET FOLDERS
===============================================================

Examples:

All Assets

Hardware
    Laptops
    Desktops
    Monitors
    Printers
    Networking

Software

Licenses

Mobile Devices

Servers

Accessories

Assigned

Available

Maintenance

Warranty

Archived

Trash

Folders must be database-driven.

===============================================================
ASSET FILE ACTIONS
===============================================================

Support:

Open
Preview
Details
Edit
Rename
Copy
Move
Duplicate
Download
Upload
Share
Archive
Restore
Delete
Properties
History

===============================================================
ASSET DRAG & DROP
===============================================================

Support:

Drag asset into folder

Drag files into asset

Drag multiple assets

Drag attachments

Drag reorder where appropriate

Show:

Drag start
Valid drop
Invalid drop
Drop zone
Success
Failure

===============================================================
5. INVENTORY — FILE EXPLORER EXPERIENCE
===============================================================

Inventory must have its own module.

Do NOT merge Inventory with Assets.

Pages:

Inventory Dashboard
Inventory Explorer
Products
Categories
Warehouses
Locations
Stock
Stock Movement
Stock Transfer
Stock Adjustment
Stock Count
Low Stock
Reserved Stock
Damaged Stock
Expired Stock
Inventory Documents
Inventory Reports
Inventory Settings

===============================================================
INVENTORY EXPLORER
===============================================================

Use Windows-style:

Folder tree
Breadcrumbs
Search
Grid/List
Preview
Properties
Bulk selection
Drag & drop

Support:

Move stock/category records where logically permitted.

===============================================================
6. PROCUREMENT — FILE EXPLORER + WORKFLOW
===============================================================

Procurement must have its own dedicated experience.

Pages:

Procurement Dashboard
Purchase Requests
Purchase Request Details
Purchase Orders
Purchase Order Details
RFQ
RFQ Details
Supplier Quotes
Vendor Comparison
Vendors
Goods Received
Bills
Procurement Documents
Procurement Approvals
Procurement History
Procurement Reports
Procurement Settings

Documents should be manageable through a Windows-style
document/file interface.

===============================================================
7. DOCUMENT MANAGEMENT — COMPLETE FILE EXPLORER
===============================================================

Documents must be a full enterprise file manager.

Pages:

Documents Dashboard
File Explorer
Folders
Folder Details
Document Details
Preview
Shared
Recent
Starred
Templates
Archive
Trash
Storage
Versions
Sharing
Permissions
Activity
Document Search
Document Settings

===============================================================
FILE EXPLORER FEATURES
===============================================================

Support:

New Folder
Upload
Drag & Drop
Copy
Paste
Move
Rename
Duplicate
Delete
Restore
Download
Preview
Share
Properties
Favorites
Recent
Bulk Actions

Keyboard shortcuts where appropriate:

Ctrl+C
Ctrl+V
Ctrl+X
Delete
F2 Rename
Ctrl+A
Ctrl+F

===============================================================
8. UNIVERSAL FILE UPLOAD
===============================================================

Create ONE reusable enterprise upload system.

Use it throughout:

Documents
Employees
Employee Registration
Assets
Inventory
Procurement
Projects
Tasks
Tickets
Customers
Vendors
Services
Quotations
Invoices
Payroll
Chat
Email
Support

Support:

Drag & Drop
Browse
Paste
Multiple files
Progress
Cancel
Retry
Preview
Remove

===============================================================
9. APPROVAL CENTER
===============================================================

Create a COMPLETE Approval Center.

Route:

/approvals

This must be a major module.

===============================================================
APPROVAL DASHBOARD
===============================================================

Show:

Pending My Approval
Pending Team Approval
Pending Department Approval
Pending Manager Approval
Pending Director Approval
Approved
Rejected
Escalated
Overdue

===============================================================
APPROVAL TYPES
===============================================================

Support approval workflows for:

Employee Registration
Employee Changes
Leave
Attendance Correction
Overtime
Payroll
Salary Changes
Commission
Purchase Request
Purchase Order
Vendor
Quotation
Discount
Invoice
Payment
Refund
Expense
Asset Transfer
Asset Purchase
Project
Project Budget
Project Change Request
Access Request
Permission Change
API Access
Secret Access
Integration
Domain
Infrastructure
Deployment
Document Sharing

===============================================================
APPROVAL DETAIL
===============================================================

Show:

Request ID
Type
Requester
Department
Branch
Created
Priority
Current Stage
Approvers
History
Attachments
Comments
Audit

Actions:

Approve
Reject
Request Changes
Delegate
Escalate

===============================================================
APPROVAL WORKFLOW VISUALIZATION
===============================================================

Show:

REQUEST
↓
REVIEW
↓
MANAGER
↓
DIRECTOR
↓
ACTION
↓
VERIFICATION
↓
AUDIT

Actual workflow depends on configuration.

Do NOT hardcode one approval chain.

===============================================================
10. INTEGRATIONS MODULE
===============================================================

Create a complete Integration Hub.

Route:

/integrations

Pages:

Integration Dashboard
Available Integrations
Connected Integrations
Integration Details
Connect
Authentication
Configuration
Test Connection
Sync
Logs
Errors
Webhooks
Reconnect
Disable
Integration Settings

===============================================================
SUPPORTED INTEGRATIONS
===============================================================

Design support for:

Google Workspace
Gmail
Google Drive
Google Calendar
Microsoft 365
Outlook
Slack
WhatsApp / Meta
SMS
Email
GitHub
AWS
Cloudflare
Vercel
Stripe
PayHere
Zoom
OpenAI
Webhooks
OAuth applications
Custom APIs

Never show a provider as connected unless the connection is real.

===============================================================
11. GOOGLE / SOCIAL AUTHENTICATION
===============================================================

Google or another identity provider authentication is OPTIONAL.

It must NEVER be mandatory.

Primary authentication remains:

Username/Email
+
Password

Optional:

Continue with Google

Other configured identity providers may be added later.

If OAuth is unavailable:

Do not show fake connected state.

Design:

Continue with Google

Connecting

Authorization

Connected

Failed

Cancelled

===============================================================
12. INFRASTRUCTURE MODULE
===============================================================

Create a complete Infrastructure Management module.

Route:

/infrastructure

Pages:

Infrastructure Dashboard
Servers
Server Details
Environments
Applications
Services
Containers
Deployments
Monitoring
CPU
RAM
Storage
Network
Logs
Backups
Security
Alerts
Incidents
Health Checks
Maintenance
Infrastructure Reports
Infrastructure Settings

===============================================================
INFRASTRUCTURE DASHBOARD
===============================================================

Show:

Server Health
CPU
Memory
Storage
Network
Uptime
Deployments
Active Incidents
Backups
SSL Expiry
Domain Expiry
Integration Health

Use:

Green
Healthy

Amber
Warning

Red
Critical

Gray
Offline

Never fake live metrics.

===============================================================
13. DOMAINS & SSL
===============================================================

Dedicated module:

/domains

Pages:

Domains Dashboard
All Domains
Domain Details
DNS
DNS Records
Hosting
Hosting Details
SSL Certificates
Certificate Details
Renewals
Expiry Alerts
History
Domain Reports
SSL Reports
Settings

Statuses:

Active
Pending
Expiring Soon
Expired
Error

===============================================================
14. GITHUB MODULE
===============================================================

Dedicated module:

/github

Pages:

GitHub Dashboard
Organizations
Repositories
Repository Details
Members
Issues
Pull Requests
Commits
Branches
Releases
Deployments
Webhooks
GitHub Activity
GitHub Settings

Connect GitHub entities to:

Projects
Tasks
Issues
PRs
Developments
Deployments

Relationship:

PROJECT
→ REPOSITORY
→ ISSUE
→ TASK
→ PR
→ REVIEW
→ TEST
→ DEPLOYMENT

===============================================================
15. AUTOMATION MODULE
===============================================================

Dedicated:

/automation

Pages:

Automation Dashboard
Workflows
Create Workflow
Workflow Builder
Triggers
Conditions
Actions
Schedules
Executions
Failed Executions
Logs
Templates
Automation Settings

Workflow builder must support:

Trigger
Condition
Action
Delay
Approval
Notification
Email
SMS
Webhook
Update Record
Create Record
Assign
Escalate

Examples:

Invoice overdue
→ Email
→ Notification
→ Escalation

Employee offboarding
→ Disable account
→ Revoke sessions
→ Revoke integrations
→ Asset return

Domain expiry
→ Warning notification

SSL expiry
→ Critical alert

===============================================================
16. AI ASSISTANT MODULE
===============================================================

Create:

/ai

Pages:

AI Assistant
AI Dashboard
Insights
Recommendations
Report Analysis
Project Risk
Financial Insights
Support Summary
Usage
AI Settings
AI Logs

AI is OPTIONAL.

The ERP must remain fully usable without AI.

Do not make the application visually look like an AI chatbot.

AI should be a supporting capability.

===============================================================
17. API & SECRETS MODULE
===============================================================

Create:

/api

Pages:

API Dashboard
API Keys
Create API Key
API Key Details
Webhooks
Webhook Logs
OAuth Apps
API Permissions
API Usage
API Errors

Secrets:

/secrets

Pages:

Secrets Vault
Secret Details
Create Secret
Edit Secret
Rotation
Access Requests
Access Logs

Never display secrets in plain text unnecessarily.

Use:

••••••••••

with controlled reveal where explicitly authorized.

===============================================================
18. SETTINGS
===============================================================

Create a complete enterprise Settings center.

Pages:

General
Company
Branches
Branding
Users
Roles
Permissions
Security
Authentication
Sessions
Notifications
Email
Chat
Support
Documents
Storage
Payroll
Finance
Billing
CRM
Sales
Services
Projects
Tasks
Service Desk
Assets
Inventory
Procurement
Integrations
API
Secrets
Automation
Reports
AI
Currency
Exchange Rates
Tax
Localization
Timezone
Date Format
Number Format
Backup
Audit
System Preferences

===============================================================
19. EMPLOYEE ACCOUNT AUTO-PROVISIONING
===============================================================

IMPORTANT:

When an authorized Employee Registration Form is successfully
approved:

Automatically create the employee's user account.

Generate:

Employee ID

Login Username

Login Email

Temporary Password OR secure password setup mechanism

The account must be linked to:

Employee
Company
Branch
Department
Team
Role
Manager

===============================================================
20. CREDENTIAL DELIVERY
===============================================================

After successful employee registration and approval:

Send credentials/setup information to the employee's:

Personal Email

Work Email, once available

The system must never expose the temporary password in logs.

Do not display passwords in employee tables.

===============================================================
21. PASSWORD CHANGE
===============================================================

Employee first login:

Force password change if temporary credentials are used.

Employee can later change password from:

Profile
→ Security
→ Change Password

===============================================================
22. PASSWORD RESET
===============================================================

Normal employees may request:

Forgot Password

The reset mechanism must send a secure reset link to the
employee's verified personal email and/or configured work email
according to company security policy.

Reset link must:

Expire

Be single-use

Be securely generated

Be revocable

Never expose the existing password.

===============================================================
23. MANAGEMENT PASSWORD RESET / ACCOUNT CONTROL
===============================================================

Only authorized:

MANAGER
DIRECTOR

with the appropriate permission may initiate an administrative
password reset for an employee.

IMPORTANT:

Managers/Directors must NOT see or retrieve the employee's
existing password.

They can only:

Force password reset

Send reset link

Revoke sessions

Suspend account

Reactivate account

Reset MFA where authorized

All actions must be audited.

===============================================================
24. ROLE EDITING
===============================================================

Authorized management can edit:

Role

Company

Branch

Department

Team

Manager

Permissions

Scope

Status

Designation remains separate from system role.

Supported business roles:

DIRECTOR
MANAGER
ACCOUNTANT
EMPLOYEE

Do not create unnecessary top-level business roles.

===============================================================
25. ROLE/SCOPE SECURITY
===============================================================

Scopes:

Global
Company
Branch
Department
Team
Own

Examples:

Director:

Organization-wide according to permissions.

Branch Manager:

MANAGER
+
Branch Scope

Department Manager:

MANAGER
+
Department Scope

Accountant:

ACCOUNTANT
+
financial scope

Employee:

EMPLOYEE
+
authorized own resources

Backend authorization is the source of truth.

===============================================================
26. FINANCE DOCUMENT SYSTEM
===============================================================

ALL financial/business documents must support professional PDF
generation.

Documents include:

Quotation
Invoice
Billing Statement
Payment Receipt
Credit Note
Debit Note
Proforma Invoice
Sales Order
Purchase Order
Purchase Request
Expense Report
Payroll Payslip
Commission Statement
Financial Report
Bank Statement
Account Statement
Customer Statement
Vendor Statement
Payment Confirmation

===============================================================
27. COMPANY-BRANDED PDF
===============================================================

Every generated PDF must dynamically include:

Company Logo
Company Legal Name
Company Registration Number
Tax Information
Company Address
Branch Address
Phone
Email
Website
Bank Details where applicable

Do NOT hardcode these values.

Load them from:

Organization
→ Company
→ Branch
→ Branding / Finance Settings

===============================================================
28. PROFESSIONAL PDF TEMPLATE
===============================================================

PDF styles:

Corporate
Modern
Minimal
Professional
Technology
Classic

Use:

A4
Professional margins
Professional typography
Readable tables
Clear totals
Logo
Header
Footer
Page numbers

===============================================================
29. PDF ACTIONS
===============================================================

Every applicable financial page must provide:

Preview PDF
Generate PDF
Download PDF
Print
Email PDF
Regenerate
Version History

===============================================================
30. REPORT PDF
===============================================================

All major reports must support:

View

Filter

Export PDF

Export Excel

Export CSV

Print

Email Report

PDF report must contain:

Company logo
Company details
Report title
Date range
Filters
Generated date
Generated by
Tables
Charts where appropriate
Summary
Page numbers
Footer

===============================================================
31. TRANSACTION DOCUMENT WORKFLOW
===============================================================

Quotation:

Draft
→ Sent
→ Viewed
→ Negotiation
→ Approved
→ Converted

Invoice:

Draft
→ Issued
→ Partially Paid
→ Paid
→ Overdue
→ Cancelled / Void

Payment:

Pending
→ Verified
→ Completed
→ Failed
→ Reversed

Purchase:

Request
→ Approval
→ Purchase Order
→ Goods Received
→ Bill
→ Payment

Payroll:

Draft
→ Calculated
→ Review
→ Approved
→ Processed
→ Paid
→ Locked

===============================================================
32. DOCUMENT / FILE RELATIONSHIPS
===============================================================

Allow documents to link to:

Employee
Customer
Vendor
Project
Task
Ticket
Service
Quotation
Invoice
Payment
Payroll
Purchase
Asset
Inventory
Server
Domain
Integration

===============================================================
33. GLOBAL FILE EXPLORER COMPONENT
===============================================================

Create a reusable Windows-style File Explorer component.

Use it in:

Documents
Assets
Inventory
Procurement
Projects
Tickets
Employees
Customers
Vendors
Invoices
Quotations
Payroll

Features:

Tree
Breadcrumb
Search
Grid
List
Details
Preview
Drag & Drop
Upload
Copy
Paste
Move
Rename
Delete
Restore
Download
Share
Properties
Bulk Selection
Context Menu
Favorites
Recent

===============================================================
34. GLOBAL DRAG & DROP
===============================================================

Support drag/drop wherever logically useful.

Examples:

Files → Documents

Files → Employee

Files → Project

Files → Ticket

Files → Invoice

Files → Quotation

Files → Asset

Files → Vendor

Tasks → Kanban columns

Tasks → Sprint

Dashboard widgets → reorder

Workflow nodes → builder

Approval stages → reorder

===============================================================
35. GLOBAL TRANSACTION FEEDBACK
===============================================================

Every important action needs:

Idle

Processing

Success

Failure

Retry

Confirmation

Audit

Examples:

Upload

Save

Delete

Approve

Reject

Send

Generate PDF

Record Payment

Process Payroll

Create Employee

Reset Password

Connect Integration

Deploy

Run Automation

===============================================================
36. GLOBAL NOTIFICATIONS
===============================================================

Notifications for:

Employee Registration
Account Created
Password Reset
Attendance
Leave
Payroll
Commission
Quotation
Invoice
Payment
Project
Task
Ticket
Approval
Document
Integration
Server
Domain
SSL
Automation
Security

Use:

Toast
Notification Center
Badge
Email
SMS where configured

===============================================================
37. GLOBAL ACTIVITY / AUDIT
===============================================================

Every major module should provide Activity where appropriate.

Show:

Who

What

When

Where

Related record

Action

Status

Audit events must be immutable.

===============================================================
38. FULL REPORTING
===============================================================

Create report architecture for:

HR
Employees
Attendance
Leave
Payroll
Commission
CRM
Sales
Services
Quotations
Invoices
Payments
Customers
Projects
Tasks
Tickets
Assets
Inventory
Procurement
Vendors
Finance
Billing
Subscriptions
Documents
Email
Chat
Support
Infrastructure
Domains
SSL
GitHub
Automation
Integrations
Security
Audit

===============================================================
39. DESIGN SYSTEM
===============================================================

Maintain one MernCrest design system.

Light theme default.

Professional enterprise appearance.

Semantic colors:

Primary
Secondary
Success
Warning
Error
Info
Neutral

Status colors must remain consistent across all modules.

===============================================================
40. ANIMATION SYSTEM
===============================================================

Use subtle professional animations.

Page transitions

Card entrance

Modal

Drawer

Toast

Status changes

Upload progress

Drag/drop

Kanban movement

Approval success

Payment success

PDF generation

Email sent

Chat message

Voice recording

Integration connection

Deployment status

Use JSON/Lottie selectively.

Do not overuse animation.

Support reduced motion.

===============================================================
41. NO AI / DEVELOPER / TRAINING TEXT
===============================================================

Production UI must NOT display:

AI-generated text

Training UI

Developer instructions

Prompt text

Implementation notes

Framework information

Database information

Cookie implementation details

Fake system explanations

===============================================================
42. NO FAKE DATA
===============================================================

Do not represent mock data as live data.

Do not fake:

Server health

Payment status

Email delivery

Integration status

Bank connectivity

GitHub synchronization

Attendance

Payroll

Invoice totals

Commission

Charts

===============================================================
43. RESPONSIVE
===============================================================

Design every major module for:

1920×1080
1440×900
1366×768
1280×800
1024
768
390
375

Use full-screen workspace on desktop.

Use adaptive layouts on mobile.

===============================================================
44. FINAL PAGE ARCHITECTURE AUDIT
===============================================================

Before implementation/design is considered complete, produce a
full inventory containing:

TOTAL MODULES

TOTAL MAIN PAGES

TOTAL SUB-PAGES

TOTAL DETAIL PAGES

TOTAL CREATE/EDIT PAGES

TOTAL SETTINGS PAGES

TOTAL REPORT PAGES

TOTAL MODALS

TOTAL DRAWERS

TOTAL WIZARDS

TOTAL FILE EXPLORER SCREENS

TOTAL TRANSACTION SCREENS

TOTAL APPROVAL SCREENS

TOTAL RESPONSIVE SCREENS

TOTAL EMPTY STATES

TOTAL LOADING STATES

TOTAL ERROR STATES

TOTAL SUCCESS STATES

TOTAL ANIMATION STATES

===============================================================
45. FEATURE → UI MAPPING
===============================================================

For EVERY feature identify:

Feature
Module
Page
Sub-page
Component
Action
Role
Permission
Workflow
Data source
State
Animation if applicable

No major feature may exist without a UI representation.

===============================================================
46. FINAL ACCEPTANCE
===============================================================

Verify:

[ ] Login exists
[ ] Optional Google authentication exists
[ ] No public Sign Up
[ ] Employee registration exists
[ ] Employee auto-provisioning exists
[ ] Credential delivery exists
[ ] Password reset exists
[ ] Manager/Director reset workflow exists
[ ] Attendance Check-In exists
[ ] Attendance Check-Out exists
[ ] Organization modules are separated
[ ] Companies are separate
[ ] Branches are separate
[ ] Departments are separate
[ ] Teams are separate
[ ] Services are separate
[ ] Sales are separate
[ ] Quotations are separate
[ ] Assets have explorer
[ ] Inventory has explorer
[ ] Procurement has explorer
[ ] Documents have explorer
[ ] Drag/drop exists
[ ] Copy/paste exists where appropriate
[ ] Preview exists
[ ] Approval Center exists
[ ] Integrations exists
[ ] Infrastructure exists
[ ] Domains/SSL exists
[ ] GitHub exists
[ ] Automation exists
[ ] AI Assistant exists
[ ] API exists
[ ] Secrets Vault exists
[ ] Settings is complete
[ ] Terminal exists with restricted access
[ ] Full-screen workspace exists
[ ] Reports are complete
[ ] PDFs are professional
[ ] PDFs contain company logo
[ ] PDFs contain company details
[ ] Financial documents support PDF
[ ] Reports support PDF
[ ] Email integration exists
[ ] Chat supports file transfer
[ ] Chat supports voice messages
[ ] Support Centre integrates with support email
[ ] Notifications exist
[ ] Audit logs exist
[ ] RBAC exists
[ ] Scope-based access exists
[ ] Responsive design exists
[ ] Loading states exist
[ ] Empty states exist
[ ] Error states exist
[ ] Success states exist
[ ] Animations exist where appropriate
[ ] JSON/Lottie exists where useful
[ ] Reduced motion exists
[ ] No fake live data
[ ] No developer/training text
[ ] No hardcoded business data

===============================================================
FINAL INSTRUCTION
===============================================================

DO NOT merely polish the existing pages.

FIRST:

Audit the existing application/Figma design against this complete
specification.

SECOND:

Identify every missing or incorrectly merged page.

THIRD:

Create the complete page/sub-page architecture.

FOURTH:

Implement the design using the existing MernCrest design system.

FIFTH:

Ensure every workflow has the required UI states.

SIXTH:

Ensure all financial and business documents support professional
company-branded PDF generation.

SEVENTH:

Ensure all file-related modules support a consistent
Windows-style File Explorer experience.

EIGHTH:

Ensure all integrations are designed as REAL integration
workflows, not decorative cards.

NINTH:

Ensure all permissions, approvals, transactions and security
states are represented.

The final result must feel like a complete enterprise-grade
IT Services company operating system.

It must NOT feel like a collection of disconnected dashboard
screens.

===============================================================
END OF MASTER UPDATE
===============================================================