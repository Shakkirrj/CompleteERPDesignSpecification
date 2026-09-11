===============================================================
MERNCREST ERP — CRITICAL FIGMA / UI / PAGE ARCHITECTURE FIX
===============================================================

IMPORTANT:

The current Figma/UI design is incomplete.

Several important pages and workflows are missing or incorrectly
merged together.

DO NOT treat this as a minor styling update.

Perform a complete UI/UX and page-architecture correction for the
following missing requirements.

The system is a COMPLETE IT SERVICES COMPANY ERP / MANAGEMENT
PLATFORM.

Do not simplify the product.

Do not merge different business modules into one generic page.

Every major business operation must have its own dedicated page,
sub-page, detail page and workflow where required.

===============================================================
CRITICAL RULE #1 — LOGIN
===============================================================

The main application MUST have a dedicated Login page.

There is NO public application registration / Sign Up page.

Application authentication:

Login
Forgot Password
Reset Password
Change Password
Session Security

Login page requirements:

- Professional enterprise design
- Light theme
- Clean and attractive
- IT / technology-related background image
- MernCrest branding
- Username or Email
- Password
- Show / Hide Password
- Remember session where appropriate
- Forgot Password
- Login button
- Loading state
- Invalid credentials state
- Locked/rate-limited state
- Successful login transition

DO NOT show:

- AI-generated text
- Training text
- Developer notes
- Cookie explanation
- Database information
- Technical implementation information
- "Administrator setup"
- "Use your account" instructional clutter
- Registration / Sign Up

The login page should look like a real production IT company
application.

===============================================================
CRITICAL RULE #2 — EMPLOYEE REGISTRATION
===============================================================

IMPORTANT:

Employee Registration is NOT the same thing as application
registration.

The application itself has NO public Sign Up.

But the company MUST have an Employee Registration Form.

The Employee Registration Form can be initiated by:

1. HR
2. Manager
3. Founder / Director
4. Authorized internal user

The authorized user can:

- Create registration request
- Generate a secure registration link
- Copy link
- Send link by email
- Send link by WhatsApp/SMS where configured
- Set expiry
- Revoke link
- Track completion status

An office/company website may optionally expose a controlled
Employee Registration link if the company chooses to publish it.

This must NOT create an application login account automatically
without the required HR/management workflow.

===============================================================
EMPLOYEE REGISTRATION FORM
===============================================================

Create a COMPLETE dedicated Employee Registration page.

Route examples:

/employee-registration/:secureToken

Internal route:

/employees/registration

The form must contain exactly these major sections.

---------------------------------------------------------------
SECTION 1 — PERSONAL DETAILS
---------------------------------------------------------------

1. Full Legal Name
Type: Short Answer
Required: YES

2. Name with Initials
Type: Short Answer
Required: YES

3. Preferred Name
Type: Short Answer
Required: NO

4. Gender
Type: Multiple Choice
Required: YES

5. Date of Birth
Type: Date
Required: YES

6. NIC / Passport Number
Type: Short Answer
Required: YES

7. NIC / Passport Copy
Type: File Upload
Required: YES

8. Profile Photo
Type: File Upload
Required: YES

---------------------------------------------------------------
SECTION 2 — CONTACT DETAILS
---------------------------------------------------------------

9. Personal Email Address
Required

10. Mobile Number
Required

11. WhatsApp Number
Required

12. Alternative Contact Number
Optional

13. Current Residential Address
Paragraph
Required

14. Permanent Address
Paragraph
Required

15. City / Town
Required

16. District
Dropdown
Required

17. Province
Dropdown
Required

18. Postal Code
Optional

---------------------------------------------------------------
SECTION 3 — EMERGENCY CONTACT
---------------------------------------------------------------

19. Emergency Contact Full Name
Required

20. Relationship to Employee
Required

21. Emergency Contact Number
Required

22. Emergency Contact WhatsApp Number
Optional

23. Emergency Contact Address
Optional

---------------------------------------------------------------
SECTION 4 — BANK ACCOUNT DETAILS
---------------------------------------------------------------

24. Bank Account Holder Name
Required

25. Bank Name
Dropdown / Search
Required

26. Bank Branch Name
Required

27. Bank Account Number
Required

28. Bank Code
Required

29. SWIFT / BIC Code
Required

30. Bank Account Verification Document
File Upload
Configurable Required/Optional

---------------------------------------------------------------
SECTION 5 — OTHER DOCUMENTS
---------------------------------------------------------------

31. CV / Resume
Optional

32. Educational / Professional Certificates
Optional
Multiple file upload

33. Other Supporting Documents
Optional
Multiple file upload

IMPORTANT:

Do NOT create separate registration questions for:

Education
Skills
Professional Skills

Those can be managed later inside the employee profile/HR module.

---------------------------------------------------------------
SECTION 6 — DECLARATION & CONSENT
---------------------------------------------------------------

34. Information Confirmation

Required checkbox:

"I confirm that the information provided in this Employee
Registration Form is accurate and complete to the best of my
knowledge."

35. Consent for HR Records

Required checkbox:

"I authorize MernCrest Solutions (Pvt) Ltd. to use the information
provided for legitimate employment, HR, payroll, communication,
identification, and administrative purposes."

36. Date of Submission

DO NOT create an editable field.

Automatically capture the submission timestamp.

===============================================================
EMPLOYEE REGISTRATION UX
===============================================================

Do NOT create one giant uncontrolled form.

Use:

Section cards
Progress indicator
Step navigation
Save Draft
Continue
Back
Review
Submit

Show progress:

Personal
→ Contact
→ Emergency
→ Bank
→ Documents
→ Declaration
→ Review
→ Submit

On mobile use a vertical stepper.

===============================================================
EMPLOYEE REGISTRATION FILE UPLOAD
===============================================================

Use professional drag-and-drop upload.

Support:

Drag files here

OR

Browse files

Show:

Filename
File size
File type
Upload progress
Preview
Remove
Retry
Upload success
Upload failed

Use this same component across the ERP.

===============================================================
EMPLOYEE REGISTRATION LINK MANAGEMENT
===============================================================

Create an internal page:

Employee Registration Links

Show:

Candidate/Employee Name
Created By
Created Date
Expiry Date
Status
Completion %
Last Activity
Actions

Statuses:

Draft
Sent
Opened
In Progress
Submitted
Expired
Revoked
Approved
Rejected
Completed

Actions:

Generate Link
Copy Link
Send Email
Send WhatsApp
Send SMS
Extend Expiry
Revoke
View Submission

===============================================================
EMPLOYEE REGISTRATION APPROVAL
===============================================================

After submission:

SUBMITTED
→ HR REVIEW
→ MANAGER REVIEW where required
→ APPROVED
→ ACCOUNT CREATION
→ CREDENTIAL DELIVERY
→ ONBOARDING

Create dedicated review page.

HR can:

Review
Request Correction
Approve
Reject

Manager can:

Review
Approve
Reject

Founder/Director can approve where required.

===============================================================
EMPLOYEE ACCOUNT CREATION
===============================================================

After the employee registration is approved:

Generate:

Employee ID
Login ID / Username
Temporary password or secure password setup link

Send credentials through configured communication channel.

Employee must be required to change the temporary password on
first login.

Do not display passwords in normal employee lists.

===============================================================
CRITICAL RULE #3 — ATTENDANCE
===============================================================

The current Attendance design is missing the actual attendance
MARKING ACTION.

This must be fixed.

===============================================================
ATTENDANCE DASHBOARD
===============================================================

Create a complete Attendance Dashboard.

Top action area MUST contain:

[ CHECK IN ]

After check-in:

[ CHECKED IN — 09:02 AM ]

Then show:

[ CHECK OUT ]

The button state must come from real attendance data.

DO NOT make it decorative.

===============================================================
ATTENDANCE DASHBOARD CONTENT
===============================================================

Show:

Today's Attendance

Present
Absent
Late
On Leave
Remote
Half Day
Overtime

KPI cards:

Present Today
Absent Today
Late Today
On Leave
Working
Completed

Charts:

Attendance Trend
Department Attendance
Branch Attendance
Weekly Attendance
Monthly Attendance

===============================================================
EMPLOYEE ATTENDANCE
===============================================================

Employee attendance screen:

Employee photo
Employee ID
Name
Department
Branch
Status
Check-in
Check-out
Working hours
Overtime

Actions:

Check In
Check Out
Request Correction
View History

===============================================================
ATTENDANCE ADMIN
===============================================================

Pages:

Attendance Dashboard
Today's Attendance
Attendance Register
Attendance History
Employee Attendance
Department Attendance
Branch Attendance
Attendance Calendar
Manual Attendance
Attendance Corrections
Correction Approvals
Shift Management
Shift Details
Work Schedules
Overtime
Timesheets
Attendance Reports
Attendance Settings

===============================================================
CRITICAL RULE #4 — ORGANIZATION
===============================================================

The current Organization module is incorrectly treating:

Companies
Branches
Departments
Teams

as if they are the same page.

THIS IS NOT ACCEPTABLE.

Each must be a separate dedicated module/page.

===============================================================
ORGANIZATION PAGE
===============================================================

Main:

Organization Overview

Show:

Organization profile
Companies
Branches
Departments
Teams
Employees
Organization chart
Reporting structure

===============================================================
COMPANIES
===============================================================

Dedicated page:

/organization/companies

Pages:

Companies List
Create Company
Company Details
Edit Company
Company Branches
Company Departments
Company Employees
Company Documents
Company Financial Settings
Company Branding
Company Audit

Company details:

Logo
Legal name
Registration number
Tax information
Address
Phone
Email
Website
Bank details
Currency
Timezone
Branches
Departments
Employees

===============================================================
BRANCHES
===============================================================

Dedicated page:

/organization/branches

Pages:

Branch List
Create Branch
Branch Details
Edit Branch
Branch Employees
Branch Departments
Branch Teams
Branch Manager
Branch Accountant
Branch Assets
Branch Projects
Branch Documents
Branch Financial Scope
Branch Settings
Branch Audit

===============================================================
DEPARTMENTS
===============================================================

Dedicated page:

/organization/departments

Pages:

Department List
Create Department
Department Details
Edit Department
Department Employees
Department Teams
Department Manager
Department Projects
Department Tasks
Department Documents
Department Attendance
Department Reports
Department Settings
Department Audit

===============================================================
TEAMS
===============================================================

Dedicated page:

/organization/teams

Pages:

Team List
Create Team
Team Details
Edit Team
Team Members
Team Manager
Team Projects
Team Tasks
Team Attendance
Team Documents
Team Activity
Team Reports
Team Settings

===============================================================
LOCATIONS
===============================================================

Dedicated page:

/organization/locations

Support:

Office
Remote
Client Site
Other

===============================================================
DESIGNATIONS
===============================================================

Dedicated page:

/organization/designations

Support:

Designation
Job Title
Department
Level
Status
Description

===============================================================
ORGANIZATION CHART
===============================================================

Dedicated page:

/organization/org-chart

Show:

Organization
→ Company
→ Branch
→ Department
→ Team
→ Employee

Show managers and reporting relationships.

===============================================================
CRITICAL RULE #5 — SERVICES
===============================================================

The current design incorrectly merges:

Services
Sales
Quotations

These MUST be separate modules.

===============================================================
SERVICE MANAGEMENT
===============================================================

Dedicated module:

Services

Pages:

Service Dashboard
All Services
Service Categories
Create Service
Service Details
Edit Service
Service Packages
Service Pricing
Service Components
Service Availability
Service SLA
Service Documents
Service Commission
Service Billing
Service History
Service Reports
Service Settings

===============================================================
SERVICE DETAILS
===============================================================

Every service must support:

Service ID
Service Name
Category
Description
Service Type
Pricing Model
Base Price
Currency
Billing Cycle
Tax
Discount
SLA
Delivery Team
Service Manager
Commission Eligibility
Commission Rule
Documents
Status

Examples:

Software Development
Web Development
Mobile Development
Cloud Services
Hosting
Domain Services
Cyber Security
Digital Marketing
ERP
CRM
POS
AI Solutions
IT Support
Maintenance
Consulting

These are examples only.

Services must be database-driven.

===============================================================
CRITICAL RULE #6 — SALES
===============================================================

Sales must have its OWN module.

Do NOT merge it into Services.

===============================================================
SALES MODULE
===============================================================

Pages:

Sales Dashboard
Leads
Opportunities
Customers
Contacts
Activities
Calls
Meetings
Follow-ups
Sales Representatives
Sales Targets
Sales Pipeline
Quotations
Sales Orders
Invoices
Payments
Commission
Sales Reports
Sales Settings

===============================================================
SALES WORKFLOW
===============================================================

Lead

→ Qualification

→ Opportunity

→ Proposal / Quotation

→ Negotiation

→ Sales Order

→ Invoice

→ Payment

→ Commission

The UI must visually represent this workflow.

===============================================================
CRITICAL RULE #7 — QUOTATIONS
===============================================================

Quotations must be a dedicated module.

Do NOT make Quotations simply another tab inside Services.

===============================================================
QUOTATION MODULE
===============================================================

Pages:

Quotation Dashboard
All Quotations
Create Quotation
Quotation Details
Edit Quotation
Quotation Preview
Quotation PDF
Quotation Templates
Quotation Items
Quotation Discounts
Quotation Taxes
Quotation Approvals
Quotation History
Quotation Activities
Quotation Attachments
Quotation Email
Quotation Conversion
Quotation Reports
Quotation Settings

===============================================================
QUOTATION DETAIL
===============================================================

Show:

Quotation Number
Customer
Contact
Salesperson
Date
Valid Until
Currency
Items
Services
Quantity
Unit Price
Discount
Tax
Subtotal
Total
Notes
Terms
Attachments
Commission
Approval Status
Conversion Status

Actions:

Edit
Duplicate
Send
Download PDF
Approve
Reject
Revise
Convert to Sales Order
Convert to Invoice
Cancel

===============================================================
QUOTATION STATUS
===============================================================

Draft

→ Sent

→ Viewed

→ Negotiation

→ Approved

→ Rejected

→ Expired

→ Converted

→ Cancelled

Use semantic colors.

===============================================================
CRITICAL RULE #8 — SALES COMMISSION
===============================================================

Commission must connect:

Salesperson
Service
Quotation
Sales Order
Invoice
Payment

Commission must NOT be hardcoded.

Support:

Percentage
Fixed
Invoice amount
Paid amount
Gross profit
Net revenue
Service value

Rules can depend on:

Employee
Role
Team
Department
Service
Product
Project
Customer
Subscription

===============================================================
CRITICAL RULE #9 — PAGE SEPARATION
===============================================================

Do not use one generic page for multiple business concepts.

BAD:

Organization
    Companies / Branches / Departments / Teams all looking identical

BAD:

Services / Sales / Quotations all looking identical

GOOD:

Companies = Company management

Branches = Branch management

Departments = Department management

Teams = Team management

Services = Service catalog and delivery configuration

Sales = Sales pipeline and commercial process

Quotations = Commercial quotation lifecycle

Each must have its own:

Page title
Description
KPI
Filters
Actions
Table
Detail page
Forms
Statuses
Workflow
Reports
Settings

===============================================================
CRITICAL RULE #10 — GLOBAL UI PATTERNS
===============================================================

Every list page should support where appropriate:

Search
Filter
Sort
Pagination
Column visibility
Export
Bulk actions
Saved views
Date filters
Status filters

Every detail page should support:

Overview
Details
Related records
Activity
Documents
History
Audit

Every important transaction should support:

Create
Review
Submit
Approve
Reject
Process
Complete
Cancel
Reverse where applicable

===============================================================
CRITICAL RULE #11 — COLOR INDICATIONS
===============================================================

Use consistent semantic colors.

SUCCESS:

Approved
Completed
Paid
Present
Active

WARNING:

Pending
Waiting
Expiring
Late

ERROR:

Rejected
Failed
Overdue
Absent
Critical

INFO:

Processing
In Progress
Information

NEUTRAL:

Draft
Archived
Inactive

Never use color alone to communicate status.

Use:

Icon
Label
Color
Optional tooltip

===============================================================
CRITICAL RULE #12 — ANIMATIONS
===============================================================

Use subtle professional animations.

Attendance:

Check-in success
Check-out success
Status transition

Employee Registration:

Step transition
Upload progress
Validation success
Submission success

Organization:

Tree expansion
Drag/reorder where applicable

Services:

Pricing updates
Status transitions

Sales:

Pipeline card movement
Stage transition

Quotations:

Send success
Approval success
Conversion success
PDF generation progress

Use JSON/Lottie only where it improves UX.

Recommended:

Upload
Success
Error
Processing
No data
No search results

Do not overuse animations.

Support prefers-reduced-motion.

===============================================================
CRITICAL RULE #13 — DRAG & DROP
===============================================================

Create reusable drag-and-drop patterns.

Must be available where logically useful:

Employee documents
Registration documents
Profile photo
Project files
Task attachments
Ticket attachments
Quotation attachments
Invoice attachments
Service documents
Customer documents
Document management
Email attachments
Chat attachments

Also support:

Kanban drag/drop
Task ordering
Dashboard widget ordering
Workflow builder
Approval chain ordering

===============================================================
CRITICAL RULE #14 — DOCUMENTS
===============================================================

Documents must use a Windows-style professional file explorer
experience.

Include:

Folders
Breadcrumbs
Search
Grid
List
Preview pane
Drag & drop
Upload
New Folder
Rename
Move
Copy
Delete
Restore
Download
Properties
Sharing
Permissions
Versions
Activity

===============================================================
CRITICAL RULE #15 — PROFILE PHOTOS
===============================================================

Use employee photos in:

Employee Directory
Employee Details
Attendance
Leave
Projects
Tasks
Tickets
Chat
Approvals
Team Members

Use initials when no photo exists.

===============================================================
CRITICAL RULE #16 — RESPONSIVE
===============================================================

Every new page must have:

Desktop
Tablet
Mobile

Mobile tables should intelligently become:

Cards
Drawers
Scrollable tables

Do not simply shrink desktop UI.

===============================================================
CRITICAL RULE #17 — NO FAKE UI
===============================================================

Do NOT create:

Fake statistics
Fake transactions
Fake employee records
Fake attendance
Fake payment data
Fake commission
Fake API status
Fake integration status
Fake project data

Figma may contain realistic placeholder examples for DESIGN
PURPOSES, but clearly structure them as sample data.

The final application implementation must use backend data.

===============================================================
CRITICAL RULE #18 — NO AI / DEVELOPER TEXT
===============================================================

The production UI must NEVER expose:

AI-generated content notices
Training instructions
Developer notes
Internal implementation comments
Prompt text
Database details
Framework details
Cookie implementation details
"Generated by AI"
"Built by AI"
"Demo data" unless specifically required internally

The UI must look like a finished commercial enterprise product.

===============================================================
FINAL AUDIT
===============================================================

Before finishing, inspect the COMPLETE Figma/application
architecture and verify:

[ ] Login page exists

[ ] No public application registration

[ ] Employee Registration exists

[ ] Employee Registration has all 36 required fields/logic

[ ] Employee registration link management exists

[ ] HR/Manager/Founder can initiate registration

[ ] Secure registration link exists

[ ] Registration expiry exists

[ ] Registration approval exists

[ ] Account creation workflow exists

[ ] Attendance Check-In button exists

[ ] Attendance Check-Out button exists

[ ] Attendance Dashboard exists

[ ] Attendance history exists

[ ] Organization Overview exists

[ ] Companies has dedicated page

[ ] Branches has dedicated page

[ ] Departments has dedicated page

[ ] Teams has dedicated page

[ ] Locations exists

[ ] Designations exists

[ ] Organization Chart exists

[ ] Services has dedicated module

[ ] Sales has dedicated module

[ ] Quotations has dedicated module

[ ] Services are not merged with Sales

[ ] Sales is not merged with Quotations

[ ] Quotations are not merged with Services

[ ] Service pricing exists

[ ] Service commission exists

[ ] Sales pipeline exists

[ ] Quotation workflow exists

[ ] Quotation PDF exists

[ ] Quotation approval exists

[ ] Quotation conversion exists

[ ] Commission workflow exists

[ ] Search exists

[ ] Filters exist

[ ] Status indicators exist

[ ] Loading states exist

[ ] Empty states exist

[ ] Error states exist

[ ] Success states exist

[ ] Drag & Drop exists where appropriate

[ ] File upload exists where appropriate

[ ] Profile photos exist where appropriate

[ ] Responsive layouts exist

[ ] Animations exist where appropriate

[ ] JSON/Lottie states exist where appropriate

[ ] Accessibility states exist

[ ] No unnecessary AI/developer text exists

===============================================================
FINAL TASK
===============================================================

DO NOT simply modify the current screenshots.

First inspect the existing Figma-integrated application and
identify which of the above items already exist.

Then:

1. Preserve correct existing designs.
2. Fix incorrect merged pages.
3. Create missing pages.
4. Create missing sub-pages.
5. Create missing workflows.
6. Create missing states.
7. Create missing actions.
8. Maintain one consistent MernCrest design system.
9. Maintain the same visual language across every module.
10. Make every major feature visually and structurally usable.

The final system must feel like a COMPLETE IT SERVICES ERP,
not a collection of dashboard mockups.

Do not stop when the page looks good.

The page architecture and workflows must also be complete.

===============================================================
END
===============================================================