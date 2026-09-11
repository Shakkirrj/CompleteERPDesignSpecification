MERNCREST MANAGEMENT ERP
EMPLOYEE + MANAGER SELF-SERVICE WORKSPACE
COMPLETE FUNCTIONAL IMPLEMENTATION

IMPORTANT:
Employees and Managers currently do not have enough visibility into their own HR, Payroll, Attendance, Leave and operational information.

Build a complete Employee Self-Service and Manager Self-Service experience.

This is NOT a separate application.

Use the same MernCrest ERP login, authentication, permissions, organization, employee, HR, payroll, attendance, leave, project, task, notification and document systems.

Every displayed value must come from real backend/database data.

Do NOT use fake statistics, fake payroll, fake attendance or placeholder cards.

====================================================
1. ROLE-BASED SELF-SERVICE
====================================================

Support:

EMPLOYEE
MANAGER
DIRECTOR
ACCOUNTANT

The dashboard and available pages must dynamically depend on:

Role
Permissions
Company scope
Branch scope
Department scope
Team scope
Own-data permissions

Backend authorization is the source of truth.

====================================================
2. EMPLOYEE SELF-SERVICE
====================================================

Route:

/me

Create a complete "My Workspace" / Employee Self-Service area.

Main sections:

- My Dashboard
- My Profile
- My Attendance
- My Leave
- My Payroll
- My Payslips
- My Salary
- My Commission
- My Loans & Advances
- My Documents
- My Timesheets
- My Overtime
- My Projects
- My Tasks
- My Performance
- My Notifications
- My Approvals
- My Requests
- My Activity
- My Settings

====================================================
3. EMPLOYEE DASHBOARD
====================================================

Route:

/me

Show:

WELCOME

Good Morning, [Employee Name]

Profile photo
Designation
Department
Branch
Team
Reporting Manager
Employee ID
Employment Status

TODAY

- Current Date
- Current Time
- Work Schedule
- Shift
- Check In
- Check Out
- Working Hours
- Attendance Status

Buttons:

[CHECK IN]

After checking in:

[CHECKED IN — 09:02 AM]

Then:

[CHECK OUT]

The status must come from actual attendance records.

====================================================
4. EMPLOYEE QUICK ACTIONS
====================================================

Show:

[Apply Leave]
[View Attendance]
[View Payslip]
[View Salary]
[View Documents]
[Submit Timesheet]
[Request Permission]
[Contact Manager]

Actions must open real pages.

====================================================
5. MY ATTENDANCE
====================================================

Route:

/me/attendance

Employee can see ONLY their authorized attendance.

Show:

Today
This Week
This Month
This Year

Summary:

Present
Absent
Late
On Leave
Remote
Half Day
Overtime
Working Hours

Attendance table:

Date
Shift
Check In
Check Out
Working Hours
Late
Overtime
Status

Calendar view:

Month
Week
List

Click an attendance record:

Open:

/me/attendance/[attendanceId]

Show:

Date
Shift
Scheduled Time
Check In
Check Out
Breaks
Working Hours
Late Duration
Overtime
Location/method where permitted
Correction status
Notes
Audit history

====================================================
6. ATTENDANCE CORRECTION REQUEST
====================================================

Employee must be able to request correction when permitted.

Example:

Forgot Check Out

Button:

[Request Attendance Correction]

Form:

Date
Current Attendance
Requested Check In
Requested Check Out
Reason
Supporting Document

Submit:

Attendance Correction Request

Workflow:

Employee
→ Manager Review
→ Approved/Rejected
→ Attendance Updated
→ Notification
→ Audit

Show center-screen JSON/Lottie animation after submission.

====================================================
7. MY LEAVE
====================================================

Route:

/me/leave

Show:

Leave Balance
Pending Requests
Approved
Rejected
Upcoming Leave
Leave History

Button:

[+ Apply Leave]

Employee can:

Apply
View
Edit Draft
Withdraw
Cancel according to policy

Show:

Leave Type
Dates
Duration
Request Message
Status
Approver
Approval Date

====================================================
8. MY PAYROLL
====================================================

Route:

/me/payroll

This is very important.

Employee must be able to view their own payroll information according to permission.

Show:

Current Salary Summary

Basic Salary
Allowances
Commission
Overtime
Bonus
Gross Salary
Deductions
Loans
Advances
Net Salary

Do not expose payroll information of other employees.

====================================================
9. MY SALARY
====================================================

Route:

/me/payroll/salary

Show:

Current Salary
Effective Date
Salary Structure
Basic Salary
Allowances
Commission Eligibility
Overtime Eligibility
Other Earnings
Deductions

Show salary history where permitted.

Example:

Salary History

2025
Basic: ...

2026
Basic: ...

Each record:

Previous Salary
New Salary
Effective Date
Reason
Approved By
Status

Never overwrite historical salary records.

====================================================
10. MY PAYSLIPS
====================================================

Route:

/me/payroll/payslips

Show monthly payslips.

Columns:

Payroll Period
Gross Salary
Deductions
Net Salary
Payment Date
Status
Actions

Actions:

View
Preview PDF
Download PDF
Print

Professional MernCrest payslip.

Include:

Company Logo
Company Details
Employee Name
Employee ID
Designation
Department
Payroll Period
Basic
Allowances
Commission
Overtime
Bonus
Deductions
Loans
Advance
Gross
Net
Payment Date
Payment Reference
Bank
Masked Account Number

Employees must only be able to download their own payslips.

====================================================
11. MY COMMISSION
====================================================

Route:

/me/payroll/commission

If employee is commission eligible:

Show:

Total Commission
Pending
Approved
Payable
Paid

Commission table:

Commission ID
Client
Project
Invoice
Service
Sale Amount
Paid Amount
Commission Basis
Commission Amount
Status
Date

Commission must come from the central Commission module.

Do not calculate a fake commission in frontend.

====================================================
12. MY LOANS & ADVANCES
====================================================

Route:

/me/payroll/loans

Show:

Loans
Salary Advances

For each:

Loan ID
Original Amount
Outstanding
Monthly Deduction
Start Date
End Date
Status

Payment history.

Do not expose other employee loan information.

====================================================
13. MY DOCUMENTS
====================================================

Route:

/me/documents

Windows-style file explorer.

Show employee-authorized documents:

- Employment Documents
- Contracts
- Payslips
- Certificates
- ID Documents
- HR Documents
- Other Documents

Features:

Open
Preview
Download
Upload where permitted
Rename where permitted
Move
Copy
Paste
Share where permitted
Properties
Version History
Search
Grid/List/Details

Use the existing universal file explorer and upload system.

====================================================
14. MY PROFILE
====================================================

Route:

/me/profile

Show:

Profile Photo
Employee ID
Full Name
Preferred Name
Designation
Role
Company
Branch
Primary Department
Additional Departments
Team
Reporting Manager
Work Email
Personal Email
Phone
WhatsApp
Address
Emergency Contact

Sensitive fields must be permission controlled.

Employee can request changes instead of directly modifying protected HR information.

====================================================
15. PROFILE CHANGE REQUEST
====================================================

Employee can request changes to:

Phone
WhatsApp
Address
Emergency Contact
Personal Email
Profile Photo
Other configurable fields

Workflow:

Employee
→ HR/Manager
→ Approval
→ Profile Updated
→ Notification
→ Audit

Do not silently modify official HR records.

====================================================
16. MY TIMESHEETS
====================================================

Route:

/me/timesheets

Show:

Current Week
Current Month

Fields:

Date
Project
Task
Start Time
End Time
Hours
Billable
Non-Billable
Description
Status

Actions:

Add Entry
Edit Draft
Submit
View
Copy Previous Entry

Workflow:

DRAFT
→ SUBMITTED
→ APPROVED / REJECTED

====================================================
17. MY OVERTIME
====================================================

Route:

/me/overtime

Show:

Date
Project
Hours
Reason
Approval Status
Approved By
Payment Status

Employee can submit overtime request.

Workflow:

Employee
→ Manager
→ Approved
→ Payroll

Do not automatically add unapproved overtime to payroll.

====================================================
18. MY PROJECTS
====================================================

Route:

/me/projects

Show projects assigned to the employee.

Cards/table:

Project Number
Project Name
Client
Project Manager
Role
Status
Progress
Deadline
Tasks
Hours
Priority

Click project:

Open full project details.

Employee must only see projects they are authorized to access.

====================================================
19. MY TASKS
====================================================

Route:

/me/tasks

Show:

Assigned Tasks
My Tasks
Today
Upcoming
Overdue
Completed

Fields:

Task
Project
Priority
Status
Due Date
Assignee
Estimated Hours
Actual Hours

Actions:

Open
Start
Pause
Complete
Add Comment
Attach File
Log Time

Use real task backend.

====================================================
20. MY PERFORMANCE
====================================================

Route:

/me/performance

Show only authorized employee performance information.

Possible sections:

Goals
KPIs
Completed Work
Project Contributions
Attendance Summary
Task Completion
Manager Feedback
Performance Reviews

Do not expose confidential manager-only notes unless configured.

====================================================
21. MY REQUESTS
====================================================

Route:

/me/requests

Central employee request history.

Request types:

Leave
Attendance Correction
Overtime
Profile Change
Salary Request where allowed
Expense
Asset Request
Access Request
Permission Request
Document Request
Other

Columns:

Request ID
Type
Created
Status
Approver
Last Updated

Click → full request details.

====================================================
22. MY NOTIFICATIONS
====================================================

Route:

/me/notifications

Show:

Leave Approved
Leave Rejected
Attendance Correction
Payroll Published
Payslip Available
Salary Updated
Commission Approved
Task Assigned
Project Updated
Document Shared
Approval Required
Profile Request
System Notifications

Notification states:

UNREAD
READ
ARCHIVED

====================================================
23. EMPLOYEE APPROVAL NOTIFICATIONS
====================================================

When an employee's request is approved:

Create notification.

Example:

"Leave Request Approved"

Request:
LR-2026-000123

Annual Leave
18 Sep – 19 Sep

Approved By:
Manager Name

When employee opens the notification:

1. Navigate to request details.
2. Show center-screen animated JSON/Lottie success animation.
3. Show:

✓ Leave Approved Successfully

Then show complete request details.

Use the global ActionFeedback system.

====================================================
24. MANAGER SELF-SERVICE
====================================================

Manager must have both:

A. My Personal Workspace
B. Manager Workspace

Manager must NEVER lose their own employee functionality.

A Manager is also an Employee.

Therefore Manager can see:

My Attendance
My Leave
My Payroll
My Payslips
My Salary
My Commission
My Loans
My Documents
My Projects
My Tasks
My Notifications

PLUS management features.

====================================================
25. MANAGER DASHBOARD
====================================================

Route:

/manager

Show:

PERSONAL

- Today's Attendance
- My Leave
- My Payroll
- My Tasks
- My Projects

TEAM

- Team Members
- Present Today
- Absent
- Late
- On Leave
- Pending Leave Requests
- Pending Attendance Corrections
- Pending Overtime
- Team Tasks
- Project Progress

MANAGEMENT

- Pending Approvals
- Team Attendance
- Team Leave
- Team Workload
- Team Performance
- Team Projects

====================================================
26. MANAGER TEAM ATTENDANCE
====================================================

Route:

/manager/attendance

Show only employees within manager's authorized scope.

Filters:

Company
Branch
Department
Team
Date
Status

Show:

Employee
Employee ID
Department
Check In
Check Out
Working Hours
Late
Overtime
Status

Statuses:

Present
Absent
Late
On Leave
Remote
Half Day

Click employee:

Open authorized employee attendance detail.

====================================================
27. MANAGER TEAM LEAVE
====================================================

Route:

/manager/leave

Show:

Pending Leave
Approved
Rejected
Upcoming Team Leave
Team Calendar

Manager can:

View
Approve
Reject
Request Changes

Cannot approve outside authorized scope.

====================================================
28. MANAGER PAYROLL VIEW
====================================================

IMPORTANT SECURITY:

Managers must NOT automatically see every employee's salary.

Payroll visibility must be permission-controlled.

Manager may see:

Team payroll summary
Authorized salary information
Payroll status
Commission
Overtime
Payroll-related approvals

Only if permission allows.

Sensitive salary values must be masked when required.

Example:

Basic Salary:
LKR 85,000

or:

Basic Salary:
••••••

based on permission.

====================================================
29. MANAGER PAYROLL APPROVAL
====================================================

Route:

/manager/payroll

Show authorized payroll actions:

- Salary Change Requests
- Allowance Requests
- Commission Approval
- Overtime Approval
- Payroll Approval
- Salary Payment Status

Actions:

View
Approve
Reject
Request Changes

All actions audited.

====================================================
30. MANAGER TEAM EMPLOYEES
====================================================

Route:

/manager/employees

Show employees within scope.

Columns:

Employee ID
Photo
Name
Designation
Department
Team
Attendance
Leave
Tasks
Projects
Status

Click employee:

Open employee profile.

Manager sees only authorized information.

====================================================
31. MANAGER EMPLOYEE PROFILE
====================================================

Employee detail page:

/employees/[employeeId]

Manager can see authorized:

Profile
Attendance
Leave
Projects
Tasks
Documents
Performance
Salary where permitted
Commission where permitted
Requests
Activity

Sensitive information must respect permissions.

====================================================
32. MANAGER TEAM PROJECTS
====================================================

Route:

/manager/projects

Show:

Projects
Progress
Assigned Employees
Tasks
Deadlines
Budget
Hours
Status
Risks

Manager can open full project details.

====================================================
33. MANAGER TEAM TASKS
====================================================

Route:

/manager/tasks

Show:

My Tasks
Team Tasks
Overdue
Today
Upcoming
Completed

Actions:

Assign
Reassign
Change Priority
Change Deadline
Comment
Approve Time
View Details

All actions must use backend permissions.

====================================================
34. MANAGER TEAM TIMESHEETS
====================================================

Route:

/manager/timesheets

Show team timesheets.

Actions:

View
Approve
Reject
Request Changes

Only authorized team members.

====================================================
35. MANAGER TEAM OVERTIME
====================================================

Route:

/manager/overtime

Show overtime requests.

Columns:

Employee
Date
Project
Hours
Reason
Requested
Status

Actions:

Approve
Reject
Request Changes

Approved overtime can flow to payroll.

====================================================
36. MANAGER REPORTS
====================================================

Route:

/manager/reports

Reports:

Team Attendance
Team Leave
Team Overtime
Team Timesheets
Team Tasks
Project Progress
Workload
Performance
Payroll Summary where permitted
Commission Summary where permitted

Export:

PDF
Excel
CSV
Print

====================================================
37. DIRECTOR SELF-SERVICE
====================================================

Director is also an employee.

Director must have:

My Attendance
My Leave
My Payroll
My Payslips
My Salary
My Documents
My Projects
My Tasks
My Notifications

PLUS:

Organization Dashboard
Approvals
Finance
Payroll Management
HR Management
Reports
Audit
Settings according to permissions.

====================================================
38. ACCOUNTANT SELF-SERVICE
====================================================

Accountant is also an employee.

Accountant can access own:

Attendance
Leave
Payroll
Payslips
Documents
Tasks
Projects
Notifications

PLUS authorized finance:

Payments
Invoices
Banking
Reconciliation
Payroll Processing
Salary Payments
Vendor Payments
Finance Reports

Do not automatically grant HR management permissions.

====================================================
39. UNIFIED "MY WORKSPACE"
====================================================

Create a consistent self-service navigation.

Example:

MY WORKSPACE

Dashboard
Profile
Attendance
Leave
Payroll
Payslips
Commission
Loans & Advances
Timesheets
Overtime
Projects
Tasks
Documents
Requests
Notifications
Settings

For Managers:

MY WORKSPACE
MANAGEMENT

For Directors:

MY WORKSPACE
MANAGEMENT
FINANCE
ORGANIZATION

For Accountants:

MY WORKSPACE
FINANCE

Navigation must dynamically depend on permissions.

====================================================
40. PERSONAL DASHBOARD WIDGETS
====================================================

Widgets should include:

Today's Attendance
Leave Balance
Next Leave
Current Payroll
Latest Payslip
Pending Requests
Unread Notifications
My Tasks
Upcoming Tasks
My Projects
Timesheet Status
Overtime
Commission

Widgets should link to actual pages.

====================================================
41. REAL-TIME NOTIFICATIONS
====================================================

When any relevant action occurs:

Leave Approved
Leave Rejected
Attendance Correction Approved
Payroll Published
Payslip Generated
Salary Changed
Commission Approved
Task Assigned
Project Assigned
Document Shared
Overtime Approved
Request Rejected

send notification to the relevant employee.

Notification should update without requiring a full browser reload where the existing architecture supports realtime updates.

====================================================
42. CENTER-SCREEN ACTION ANIMATIONS
====================================================

Use the existing global JSON/Lottie animation system.

Employee actions:

Leave Submitted
Attendance Checked In
Attendance Checked Out
Correction Submitted
Overtime Submitted
Timesheet Submitted
Request Submitted
Document Uploaded
Profile Change Requested

Manager actions:

Leave Approved
Leave Rejected
Attendance Correction Approved
Overtime Approved
Timesheet Approved
Request Approved
Task Assigned

Payroll:

Payroll Published
Payslip Generated
Salary Updated
Commission Approved
Salary Payment Completed

Every major action:

CENTER SCREEN ANIMATION
+
SUCCESS/ERROR MESSAGE
+
REFERENCE NUMBER where applicable
+
ACTION BUTTON

Never use browser alert().

====================================================
43. EMPLOYEE PRIVACY
====================================================

Employees can see:

OWN information only unless explicitly authorized.

They cannot access:

Other employee salary
Other employee bank information
Other employee personal documents
Other employee private requests
Manager confidential notes
Finance confidential information

====================================================
44. MANAGER PRIVACY
====================================================

Manager sees team information only within:

Company
Branch
Department
Team

according to scope.

Manager cannot access unrelated branches/departments unless explicitly permitted.

====================================================
45. MOBILE RESPONSIVE
====================================================

Employee self-service must work extremely well on mobile.

Mobile navigation:

Dashboard
Attendance
Leave
Payroll
Tasks
Notifications
More

Make:

Check In
Check Out
Apply Leave

easy to access.

====================================================
46. GLOBAL SEARCH
====================================================

Employee:

Search own:

Leave Request ID
Payslip
Attendance Date
Task
Project
Document
Request

Manager:

Search authorized:

Employee
Leave Request
Task
Project
Timesheet
Attendance

====================================================
47. SECURITY
====================================================

Backend authorization is mandatory.

Never rely on frontend hiding.

Every API endpoint must validate:

User
Role
Permission
Company Scope
Branch Scope
Department Scope
Team Scope
Record Ownership

Sensitive payroll APIs must have additional authorization.

Use secure sessions.

Never expose:

Passwords
Secrets
Full bank account numbers
Unauthorized payroll data
Unauthorized documents

====================================================
48. DATABASE RELATIONSHIPS
====================================================

Ensure proper relationships:

Employee
→ User
→ Company
→ Branch
→ Departments
→ Team
→ Manager
→ Attendance
→ Leave
→ Payroll
→ Salary
→ Payslips
→ Commission
→ Loans
→ Timesheets
→ Overtime
→ Projects
→ Tasks
→ Documents
→ Requests
→ Notifications

Manager:

Employee
+
Management Scope
+
Approvals
+
Team Relationships

Do not create duplicate employee records for managers.

====================================================
49. AUDIT
====================================================

Audit important self-service actions:

Login
Profile viewed
Profile change requested
Leave submitted
Attendance check-in
Attendance check-out
Correction requested
Overtime submitted
Timesheet submitted
Payslip downloaded
Salary viewed
Document downloaded
Request submitted

Manager:

Approval
Rejection
Assignment
Team record access
Salary information access where permitted

====================================================
50. TESTING
====================================================

Test as EMPLOYEE:

Login
→ My Dashboard
→ Check In
→ Check Out
→ Attendance
→ Apply Leave
→ Submit Request Message
→ Success Animation
→ Receive Approval Notification
→ Open Notification
→ Approved Animation
→ View Payroll
→ View Payslip
→ Download Payslip
→ View Commission
→ View Documents
→ Submit Timesheet
→ Submit Overtime
→ View Projects
→ View Tasks

Test as MANAGER:

Login
→ Personal Dashboard
→ Own Attendance
→ Own Payroll
→ Own Leave
→ Team Dashboard
→ Team Attendance
→ Team Leave
→ Approve Leave
→ Approval Animation
→ Team Tasks
→ Team Projects
→ Timesheets
→ Overtime
→ Authorized Payroll
→ Reports

Test as DIRECTOR:

Personal Employee features
+
Organization management
+
Approvals
+
Payroll authorization
+
Finance
+
Reports

Test as ACCOUNTANT:

Personal Employee features
+
Finance
+
Payments
+
Banking
+
Payroll processing
+
Authorized reports

====================================================
51. FINAL ACCEPTANCE CRITERIA
====================================================

The implementation is NOT COMPLETE if:

- Employee cannot see own attendance
- Employee cannot see own payroll
- Employee cannot see payslips
- Employee cannot see salary where authorized
- Employee cannot see commission where eligible
- Employee cannot see leave balance
- Employee cannot apply leave
- Employee cannot submit request message
- Employee cannot view request history
- Employee cannot see notifications
- Employee cannot see own projects/tasks
- Employee cannot submit timesheet
- Employee cannot submit overtime
- Manager cannot see own employee information
- Manager cannot see own payroll/attendance/leave
- Manager cannot see authorized team attendance
- Manager cannot see team leave
- Manager cannot approve leave
- Manager cannot manage authorized team tasks/projects
- Payroll information is exposed to unauthorized users
- Employees can access another employee's private information
- Buttons are fake
- Data is hardcoded
- Actions do not update the backend
- Notifications are fake
- Animations are missing
- Complex actions use browser alerts

FINAL GOAL:

Build a complete Employee + Manager Self-Service ecosystem where every user can see the information appropriate to their role and permissions.

The key principle is:

EMPLOYEE = MY INFORMATION + MY WORK

MANAGER = MY INFORMATION + MY TEAM + MY APPROVALS

DIRECTOR = MY INFORMATION + ORGANIZATION AUTHORITY

ACCOUNTANT = MY INFORMATION + AUTHORIZED FINANCE OPERATIONS

Everything must be connected to the central MernCrest ERP database and workflow engine.

No dummy UI.
No fake data.
No dead buttons.
No permission bypass.
No duplicated employee systems.
No placeholder payroll.
No placeholder attendance.
No placeholder leave.

REAL DATA → REAL API → REAL WORKFLOW → REAL NOTIFICATION → REAL AUDIT.