MERNCREST MANAGEMENT ERP
LEAVE MANAGEMENT — COMPLETE FUNCTIONAL IMPLEMENTATION
APPLICATION → APPROVAL → NOTIFICATION → DECISION → ANIMATION → AUDIT

IMPORTANT:
The current Leave Management / Apply Leave functionality is incomplete or not working.

Do NOT create a placeholder form.

Build a complete, real, production-ready Leave Management workflow connected to the employee, attendance, organization, approval, notification and audit systems.

Every action must work through real backend APIs and database records.

====================================================
1. LEAVE MANAGEMENT MAIN MODULE
====================================================

Route:

/leave

Create a complete Leave Management workspace.

Main pages:

/leave
/leave/apply
/leave/my-leaves
/leave/calendar
/leave/balance
/leave/team
/leave/pending-approvals
/leave/history
/leave/types
/leave/reports
/leave/settings

Do not combine everything into one generic page.

====================================================
2. LEAVE DASHBOARD
====================================================

Show:

- Available Leave Balance
- Used Leave
- Pending Requests
- Approved Leaves
- Rejected Leaves
- Upcoming Leave
- Current Year Leave
- Current Month Leave

Show leave balance cards by leave type.

Example:

Annual Leave
Available: 14
Used: 6
Pending: 2
Total: 20

Casual Leave
Available: 7
Used: 3
Pending: 0
Total: 10

Medical Leave
Available: 10
Used: 2
Pending: 1
Total: 14

IMPORTANT:
These values must come from the backend.

Do not hardcode leave balances.

====================================================
3. APPLY LEAVE — FULL FUNCTIONAL FORM
====================================================

Route:

/leave/apply

The Apply Leave button must actually work.

Create a dedicated full-page leave request form.

Sections:

A. Employee Information
B. Leave Information
C. Date & Duration
D. Request Message
E. Supporting Documents
F. Approval Information
G. Review
H. Submit

====================================================
4. EMPLOYEE INFORMATION
====================================================

Automatically load logged-in employee information.

Show:

- Employee ID
- Employee Name
- Profile Photo
- Designation
- Department
- Branch
- Team
- Reporting Manager

These should be read-only.

Do not ask employees to manually enter their own employee information.

====================================================
5. LEAVE TYPE
====================================================

Show a real Leave Type selector.

Leave types must be database/config driven.

Example types:

- Annual Leave
- Casual Leave
- Medical Leave
- Sick Leave
- Emergency Leave
- Maternity Leave
- Paternity Leave
- No-Pay Leave
- Half-Day Leave
- Short Leave
- Study Leave
- Compassionate Leave
- Other

Do not assume these are permanently fixed.

Managers/Directors with permission must be able to configure leave types.

When selecting a leave type:

Show:

Leave Type
Available Balance
Used
Pending
Remaining After Request

Example:

Annual Leave

Available:
14 Days

Requested:
3 Days

Remaining:
11 Days

If the employee does not have sufficient balance:

Show a clear warning.

Example:

"Insufficient Annual Leave Balance"

Do not allow invalid submission unless the configured leave policy allows it.

====================================================
6. DATE SELECTION
====================================================

Fields:

- Start Date
- End Date
- Leave Duration
- Half Day / Full Day
- Half-Day Session where applicable

Automatically calculate:

- Number of leave days
- Working days
- Weekends
- Public holidays
- Holidays excluded from leave calculation where configured

Example:

Start:
18 September 2026

End:
20 September 2026

Duration:
3 calendar days

Working Leave Days:
2 days

The calculation must happen on the backend before final submission.

Do not trust frontend calculations for payroll/attendance-related data.

====================================================
7. LEAVE REQUEST MESSAGE
====================================================

IMPORTANT:

Every leave application must include a Request Message / Reason.

Field:

"Request Message"

Use a large textarea.

Example placeholder:

"Please explain the reason for your leave request."

Employee can write:

"I need to take leave for a family matter and will be unavailable during the requested period."

Configuration should determine whether the message is required for each leave type.

Support:

- Required / Optional configuration
- Character limit
- Character counter
- Validation
- Secure text handling

The request message must be visible to authorized approvers.

====================================================
8. SUPPORTING DOCUMENTS
====================================================

Allow employees to attach supporting documents when required.

Examples:

- Medical certificate
- Appointment document
- Supporting letter
- Other document

Use the existing universal file upload system.

Support:

- Drag and drop
- Browse
- Upload progress
- Uploading
- Processing
- Success
- Failed
- Retry
- Remove

Secure file validation is mandatory.

Do not expose documents to unauthorized users.

====================================================
9. LEAVE REQUEST REVIEW
====================================================

Before submission show a complete Review page/section.

Show:

Employee
Leave Type
Start Date
End Date
Duration
Working Days
Request Message
Attachments
Current Balance
Balance After Request
Reporting Manager
Approval Route

Buttons:

[Back]
[Save Draft]
[Submit Leave Request]

====================================================
10. SAVE DRAFT
====================================================

Allow:

Save Draft
Continue Later
Edit Draft
Delete Draft

Draft status:

DRAFT

Do not create a leave request until Submit is clicked.

====================================================
11. SUBMIT LEAVE REQUEST
====================================================

When employee clicks:

SUBMIT LEAVE REQUEST

perform real backend validation.

Validate:

- Employee exists
- Leave type exists
- Dates valid
- End date >= start date
- Leave balance
- Existing overlapping leave
- Holiday rules
- Employee status
- Approval configuration
- Required message
- Required documents
- Permission

Prevent duplicate submissions.

Use idempotency protection where appropriate.

====================================================
12. REQUEST SUCCESS ANIMATION
====================================================

After successful submission:

DO NOT show browser alert().

DO NOT only show a toast.

Show a professional animated JSON/Lottie-style CENTER SCREEN success animation.

Example:

[ Center of screen ]

✓

Leave Request Submitted Successfully

Request ID:
LR-2026-000123

Leave:
Annual Leave

Duration:
18 Sep 2026 – 19 Sep 2026

Status:
Pending Approval

[View Request]

[Close]

Animation should be professional and smooth.

Create reusable component:

<LeaveRequestSuccessAnimation />

But preferably use the global:

<ActionFeedback />

system.

Support:

- JSON/Lottie animation
- Center-screen overlay
- Success icon
- Reference number
- Short message
- View Request button
- Auto-dismiss
- Accessible text
- Reduced-motion support

====================================================
13. LEAVE REQUEST ID
====================================================

Generate a unique backend request number.

Example:

LR-2026-000001

Never generate the final ID only on the frontend.

Use database-safe sequential/unique generation.

====================================================
14. LEAVE REQUEST DETAIL PAGE
====================================================

After submission:

/leave/requests/[requestId]

Dedicated full-page request detail.

Show:

REQUEST SUMMARY

- Request ID
- Employee
- Leave Type
- Start Date
- End Date
- Duration
- Status
- Created Date
- Last Updated

REQUEST MESSAGE

Show the employee's exact request message.

ATTACHMENTS

Show uploaded documents.

LEAVE BALANCE

Show:

Before Request
Requested
After Request

APPROVAL FLOW

Show a visual timeline:

Employee Submitted
↓
Manager Review
↓
Director Review if required
↓
Approved / Rejected
↓
Attendance Updated

Show each stage with:

- Approver
- Role
- Status
- Date
- Time
- Comment

====================================================
15. APPROVAL WORKFLOW
====================================================

Leave approval must integrate with the central Approval Center.

Workflow:

EMPLOYEE
→ SUBMIT REQUEST
→ MANAGER REVIEW
→ DIRECTOR REVIEW where configured
→ APPROVED
→ LEAVE BALANCE UPDATED
→ ATTENDANCE UPDATED
→ NOTIFICATION SENT
→ AUDIT LOG

Do NOT hardcode every organization to require both Manager and Director.

Approval rules must be configurable.

Examples:

Normal employee:

Employee
→ Manager
→ Approved

Sensitive/long leave:

Employee
→ Manager
→ Director
→ Approved

The system should determine the correct workflow based on:

- Leave type
- Duration
- Employee department
- Branch
- Company
- Role
- Approval policy

====================================================
16. MANAGER APPROVAL PAGE
====================================================

Route:

/leave/pending-approvals

Managers must see leave requests requiring their approval.

Table:

Request ID
Employee
Leave Type
Dates
Duration
Request Message
Department
Branch
Submitted Date
Priority
Status
Actions

Actions:

View
Approve
Reject
Request Changes

Do not approve directly without backend permission validation.

====================================================
17. APPROVAL DETAIL
====================================================

When manager clicks a leave request:

Open:

/leave/requests/[requestId]

Show full information.

Manager actions:

[Approve Leave]
[Reject Leave]
[Request Changes]

If rejecting:

Require rejection reason.

If requesting changes:

Require comment.

====================================================
18. APPROVED SUCCESS ANIMATION
====================================================

IMPORTANT:

When Manager or Director approves a leave request:

The person performing the approval must see a CENTER-SCREEN animated success experience.

Example:

[Professional animated JSON/Lottie]

✓

Leave Approved Successfully

Request:
LR-2026-000123

Employee:
John Doe

Leave:
Annual Leave

Duration:
18 Sep – 19 Sep

Approved By:
Manager Name

[View Leave Request]

[Done]

Create:

<LeaveApprovedAnimation />

or use:

<ActionFeedback type="leave-approved" />

Do NOT use browser alert.

====================================================
19. REJECTION ANIMATION
====================================================

When a leave request is rejected:

Show center-screen professional animation.

Example:

Leave Request Rejected

Request:
LR-2026-000123

Reason:
"Project delivery requires your presence during this period."

[View Request]

[Done]

Use a professional error/rejection Lottie animation.

====================================================
20. REQUEST CHANGES
====================================================

If manager requests changes:

Status:

CHANGES_REQUESTED

Employee receives notification.

Employee opens request and sees:

"Changes Requested"

Manager comment.

Button:

[Edit & Resubmit]

After resubmission:

Return to approval workflow.

====================================================
21. NOTIFICATION SYSTEM
====================================================

Notifications are mandatory.

When employee submits:

Notify assigned Manager.

Notification:

"New Leave Request"

Employee:
John Doe

Leave:
Annual Leave

Dates:
18 Sep – 19 Sep

Request:
LR-2026-000123

[Review Request]

====================================================
22. EMPLOYEE APPROVAL NOTIFICATION
====================================================

When Manager/Director approves:

Employee receives notification.

Example:

"Leave Request Approved"

Your Annual Leave request has been approved.

Request:
LR-2026-000123

Dates:
18 Sep – 19 Sep

Approved By:
Manager Name

When employee opens the notification:

DO NOT simply navigate to a blank page.

Open the leave request detail page.

Then show the CENTER-SCREEN:

✓ Leave Approved Successfully

professional JSON/Lottie animation.

After animation:

Show complete request details.

====================================================
23. REJECTION NOTIFICATION
====================================================

When rejected:

Employee receives:

"Leave Request Rejected"

Request:
LR-2026-000123

Leave:
Annual Leave

Reason:
Manager's rejection reason.

[View Request]

When opened:

Show rejection animation center-screen.

====================================================
24. NOTIFICATION STATES
====================================================

Notification states:

UNREAD
READ
ARCHIVED

Notification should support:

- Mark as read
- Mark all as read
- Open request
- Timestamp
- Notification type
- Priority

====================================================
25. MY LEAVES
====================================================

Route:

/leave/my-leaves

Show:

Upcoming
Pending
Approved
Rejected
Cancelled
Completed

Each row:

Request ID
Leave Type
Start
End
Duration
Request Message
Status
Submitted
Approver
Actions

Actions:

View
Edit Draft
Cancel
Withdraw where allowed

====================================================
26. LEAVE CALENDAR
====================================================

Route:

/leave/calendar

Calendar views:

Month
Week
List

Show authorized leave information.

Color + icon + text must identify:

Pending
Approved
Rejected
Cancelled

Managers can see team leave according to scope.

Employees only see authorized information.

====================================================
27. LEAVE BALANCE
====================================================

Route:

/leave/balance

Show employee leave balances.

Columns:

Leave Type
Annual Entitlement
Carried Forward
Used
Pending
Available
Expiry
Policy

Do not hardcode values.

====================================================
28. LEAVE TYPES MANAGEMENT
====================================================

Route:

/leave/types

Authorized Manager/Director users can configure leave types.

Fields:

- Leave Type Name
- Code
- Description
- Paid / Unpaid
- Annual Entitlement
- Accrual Method
- Carry Forward
- Maximum Carry Forward
- Expiry
- Requires Document
- Requires Reason
- Half Day Allowed
- Approval Required
- Active/Inactive

====================================================
29. LEAVE SETTINGS
====================================================

Route:

/leave/settings

Manager/Director permission-controlled.

Settings:

- Leave Types
- Approval Rules
- Leave Year
- Accrual
- Carry Forward
- Public Holidays
- Working Days
- Half-Day Rules
- Document Rules
- Cancellation Rules
- Notification Rules
- Escalation Rules

Employees must not access these settings.

====================================================
30. ATTENDANCE INTEGRATION
====================================================

When leave is approved:

Automatically integrate with Attendance.

For approved dates:

Attendance should show:

ON LEAVE

Do not create duplicate attendance records.

If employee had attendance already recorded for the date:

Apply configured conflict rules.

Do not silently overwrite attendance.

====================================================
31. PAYROLL INTEGRATION
====================================================

Leave must integrate with Payroll where applicable.

Examples:

Paid Leave:
No salary deduction.

Unpaid Leave:
May generate payroll deduction according to configured policy.

Medical / other leave:
Use configurable policy.

Do NOT hardcode payroll deduction formulas.

Payroll must use approved leave records only.

====================================================
32. OVERLAPPING LEAVE VALIDATION
====================================================

Prevent overlapping approved/pending leave where policy disallows it.

Example:

Existing:
18 Sep – 20 Sep

New request:
19 Sep – 21 Sep

Show:

"Leave dates overlap with an existing leave request."

Provide link:

[View Existing Request]

====================================================
33. LEAVE REQUEST STATUS
====================================================

Use:

DRAFT
SUBMITTED
PENDING_MANAGER_APPROVAL
PENDING_DIRECTOR_APPROVAL
CHANGES_REQUESTED
APPROVED
REJECTED
CANCELLED
WITHDRAWN
COMPLETED

Use icon + label + color.

Never rely on color alone.

====================================================
34. LEAVE CANCELLATION / WITHDRAWAL
====================================================

Employee can request cancellation/withdrawal according to policy.

Do not immediately delete the request.

Create an auditable cancellation workflow.

Statuses:

CANCELLATION_REQUESTED
CANCELLED

Restore balance appropriately only after cancellation is confirmed.

====================================================
35. AUDIT LOG
====================================================

Audit:

Leave request created
Draft saved
Submitted
Edited
Changes requested
Resubmitted
Approved
Rejected
Cancelled
Withdrawn
Balance changed
Attendance updated
Notification sent
Notification opened

Store:

Who
What
When
Request ID
Old status
New status
Comment/reason

====================================================
36. DATABASE MODELS
====================================================

Create proper relational models such as:

LeaveType
LeavePolicy
LeaveBalance
LeaveBalanceTransaction
LeaveRequest
LeaveRequestDate
LeaveApproval
LeaveApprovalStep
LeaveAttachment
LeaveCancellation
LeaveNotification
PublicHoliday
WorkSchedule
AuditLog

Relationships:

Employee
→ Leave Requests

Leave Request
→ Employee
→ Leave Type
→ Leave Balance
→ Approval Chain
→ Attachments
→ Notifications
→ Attendance
→ Payroll where applicable
→ Audit Logs

====================================================
37. SECURITY
====================================================

Backend authorization is mandatory.

Employee:

Can:
- Apply leave
- View own requests
- View own balances
- Cancel/withdraw according to policy
- View own notifications

Manager:

Can:
- View leave requests within scope
- Approve/reject/request changes
- View authorized team leave

Director:

Can:
- Approve according to configured workflow
- Configure leave settings according to permission
- View organization-wide leave data according to scope

Never expose another employee's sensitive leave information without permission.

====================================================
38. GLOBAL ACTION ANIMATION SYSTEM
====================================================

Integrate Leave Management with the existing global animated action feedback system.

Actions requiring center-screen animation:

Leave Request Submitted
Leave Request Approved
Leave Request Rejected
Changes Requested
Leave Resubmitted
Leave Cancelled
Leave Withdrawn
Leave Type Created
Leave Balance Updated
Leave Policy Updated
Notification Sent
Error
Processing

Use professional JSON/Lottie animations.

Create reusable:

<ActionFeedback />

with types:

success
error
processing
warning
info

Specific events:

leave-request-submitted
leave-approved
leave-rejected
leave-changes-requested
leave-resubmitted
leave-cancelled

Animation must appear in the CENTER of the viewport.

Use overlay.

Do not use browser alerts.

Do not use childish animations.

Support reduced motion.

====================================================
39. UX REQUIREMENTS
====================================================

Apply Leave should be highly visible.

Example:

[ + Apply Leave ]

When clicked:

Open:

/leave/apply

Do not make the user search through menus.

Form must have:

Clear labels
Required indicators
Helpful descriptions
Inline validation
Date picker
Leave balance preview
Request message
Attachment upload
Review step
Submit confirmation

====================================================
40. REAL-TIME / REFRESH BEHAVIOR
====================================================

When a manager approves a leave:

Employee's notification should update.

Employee's leave status should become:

APPROVED

Leave balance should update according to policy.

Attendance should update.

All connected pages should refresh/revalidate.

Do not require manual database editing.

====================================================
41. TESTING
====================================================

Test complete workflow:

EMPLOYEE

Login
→ Leave
→ Apply Leave
→ Select Leave Type
→ Select Dates
→ Enter Request Message
→ Upload document
→ Review
→ Submit
→ Center Success Animation
→ Request Created
→ Manager Notification

MANAGER

Open Notification
→ Open Leave Request
→ View Employee
→ View Leave Balance
→ View Request Message
→ Approve
→ Center Approved Animation

EMPLOYEE

Receive Notification
→ Open Notification
→ Open Request
→ Center Approved Animation
→ See Approved Status
→ See Updated Balance
→ Attendance shows ON LEAVE

Also test:

Reject
Request Changes
Resubmit
Cancel
Withdraw
Insufficient Balance
Overlapping Dates
Missing Reason
Required Document
Half Day
Unpaid Leave
Paid Leave
Manager scope
Director approval
Unauthorized employee access

====================================================
42. FINAL ACCEPTANCE CRITERIA
====================================================

The Leave Management implementation is NOT COMPLETE if:

- Apply Leave does not work
- Leave Type selection is missing
- Leave balance is missing
- Start/End dates do not calculate correctly
- Request Message is missing
- Supporting documents do not work
- Submit does not create a real database request
- Request ID is missing
- Manager notification is missing
- Director approval workflow is missing where configured
- Approval is not stored in database
- Employee notification is missing
- Opening approval notification does not open the request
- Opening approval notification does not show approved animation
- Leave balance is not updated
- Attendance is not updated
- Payroll integration is missing
- Leave history is missing
- Leave calendar is missing
- Leave types cannot be configured
- Audit logs are missing
- Buttons are fake
- UI uses dummy data
- Browser alert() is used
- Success is only a small toast
- There is no center-screen JSON/Lottie success animation

====================================================
43. IMPLEMENTATION PROCESS
====================================================

First inspect the existing codebase.

Find:

- Existing Leave routes
- Existing Attendance
- Employee model
- Organization structure
- Manager relationships
- Approval Center
- Notification system
- User permissions
- Audit logging
- Payroll
- Public holiday configuration
- Existing animation/action feedback components

Then create a gap analysis.

Implement without unnecessarily breaking unrelated modules.

Order:

1. Database schema
2. Leave types
3. Leave policies
4. Leave balances
5. Leave requests
6. Approval workflow
7. API endpoints
8. Backend validation
9. Notifications
10. Attendance integration
11. Payroll integration
12. Audit logs
13. Apply Leave UI
14. Request Details UI
15. Manager Approval UI
16. Leave Calendar
17. Leave Balance
18. Leave Types Settings
19. Center-screen Lottie/JSON animations
20. Loading/error/empty states
21. Responsive UI
22. Tests
23. Typecheck
24. Lint
25. Security review
26. End-to-end workflow testing

IMPORTANT:

Build this as a REAL Leave Management system.

Do not create a visual demo.

Do not leave placeholder buttons.

Do not use fake approval.

Do not use fake notifications.

Do not hardcode leave balances.

Do not hardcode approval rules.

Do not hardcode payroll calculations.

Every request must have a real lifecycle:

DRAFT
→ SUBMITTED
→ APPROVAL
→ APPROVED/REJECTED
→ NOTIFICATION
→ ATTENDANCE/PAYROLL UPDATE
→ AUDIT

The final result must feel like a complete enterprise HR/ERP Leave Management module.