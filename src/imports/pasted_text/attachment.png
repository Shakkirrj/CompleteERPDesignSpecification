===============================================================
MERNCREST ERP — COMMUNICATION CENTER
EMAIL + INTERNAL CHAT + SUPPORT CENTRE
COMPLETE UI/UX + FIGMA DESIGN + FUNCTIONAL WORKFLOW
===============================================================

IMPORTANT:

The current communication section is incomplete.

Build THREE complete communication modules:

1. EMAIL CENTER
2. INTERNAL EMPLOYEE CHAT
3. SUPPORT CENTRE

These must be separate modules/pages with their own workflows,
while remaining fully integrated with the MernCrest ERP.

Do NOT create one generic "Communication" page.

Do NOT create fake email/chat/support interfaces.

The UI must be designed as a real production enterprise
communication system.

===============================================================
1. EMAIL CENTER
===============================================================

Module:

Email

Purpose:

Employees must be able to access and manage their authorized
email accounts from inside MernCrest ERP.

The system should support:

A. Google Gmail / Google Workspace email
B. MernCrest Company Email

The architecture must allow both providers.

Do NOT assume every user has both.

===============================================================
EMAIL ACCOUNT TYPES
===============================================================

Account Type:

Google Workspace / Gmail

OR

MernCrest Company Email

Example company email:

employee@merncrest.lk

Do NOT hardcode actual employee addresses.

Load account information dynamically.

===============================================================
EMAIL MAIN PAGE
===============================================================

Route:

/mail

Design a professional enterprise email interface similar to
modern business email applications.

Layout:

---------------------------------------------------------------
LEFT MAIL SIDEBAR | EMAIL LIST | EMAIL READING PANEL
---------------------------------------------------------------

Desktop:

3-column layout where space allows.

Tablet:

2-column layout.

Mobile:

Inbox → Email Detail navigation.

===============================================================
EMAIL SIDEBAR
===============================================================

Folders:

Inbox
Starred
Important
Sent
Drafts
Scheduled
Archive
Trash
Spam
Failed

Custom folders

Labels

Show unread counts.

Example:

Inbox          12
Drafts          3
Support         8

Counts must come from backend.

===============================================================
EMAIL TOOLBAR
===============================================================

Actions:

Compose

Refresh

Search

Filter

Select

Mark Read

Mark Unread

Star

Archive

Delete

Spam

Move

Label

More

===============================================================
EMAIL SEARCH
===============================================================

Search:

Sender
Recipient
Subject
Body
Attachments
Date
Labels

Search must respect authorization.

===============================================================
EMAIL COMPOSER
===============================================================

Create a full professional email composer.

Fields:

From
To
CC
BCC
Subject

Rich text editor.

Support:

Bold
Italic
Underline
Lists
Links
Alignment
Quotes
Signature

Attachments:

Drag & Drop
Browse
Upload progress
Remove
Preview

Actions:

Send
Schedule Send
Save Draft
Discard

===============================================================
EMAIL DETAIL
===============================================================

Dedicated email reading page/panel.

Show:

Sender photo/avatar

Sender name

Email address

Recipients

Date/time

Subject

Message

Attachments

Thread

Actions:

Reply

Reply All

Forward

Archive

Delete

Mark unread

Star

More

===============================================================
EMAIL THREADS
===============================================================

Group related emails into conversations.

Show:

Message count

Participants

Latest message

Expand/collapse messages.

===============================================================
EMAIL ATTACHMENTS
===============================================================

Support:

PDF
DOCX
XLSX
PPTX
Images
ZIP
Other configured safe file types

Actions:

Preview
Download
Save to Documents

Use the MernCrest document system.

===============================================================
EMAIL → DOCUMENT INTEGRATION
===============================================================

Allow:

Email attachment
→ Save to Documents

Document
→ Attach to Email

Project document
→ Email

Employee document
→ Email where authorized

Invoice PDF
→ Email

Quotation PDF
→ Email

Payslip
→ Email

===============================================================
EMAIL → ERP INTEGRATION
===============================================================

Emails can be related to:

Employee

Customer

Lead

Opportunity

Quotation

Sales Order

Invoice

Payment

Project

Task

Ticket

Vendor

Document

===============================================================
EMAIL STATUS
===============================================================

Show:

Draft

Queued

Sending

Sent

Delivered where provider supports it

Failed

Scheduled

Cancelled

Use semantic colors.

===============================================================
EMAIL PROVIDER CONNECTION
===============================================================

Settings page:

Email Accounts

Show:

Provider

Account

Status

Last Sync

Actions

Connect

Reconnect

Disconnect

Test Connection

===============================================================
GOOGLE EMAIL
===============================================================

Create OAuth connection flow for Google Workspace/Gmail.

Screens:

Connect Google

Google authorization state

Permission requested

Connecting

Connected

Connection failed

Reconnect

Disconnected

Do not create fake OAuth screens.

Actual credentials/tokens must never be displayed.

===============================================================
COMPANY EMAIL
===============================================================

Support company email through configurable:

IMAP/SMTP or supported email provider/API.

Settings:

Email address

Display name

Incoming server

Outgoing server

Port

Security

Authentication

Connection test

Status

Credentials must be stored securely.

Never display passwords.

===============================================================
2. INTERNAL EMPLOYEE CHAT
===============================================================

Module:

Chat

Purpose:

Employees communicate internally without leaving MernCrest.

===============================================================
CHAT MAIN PAGE
===============================================================

Route:

/chat

Layout:

---------------------------------------------------------------
CONVERSATIONS | CHAT WINDOW | DETAILS / SHARED FILES
---------------------------------------------------------------

Desktop:

3 panels.

Tablet:

2 panels.

Mobile:

Conversation list
→
Conversation detail

===============================================================
CHAT SIDEBAR
===============================================================

Sections:

Recent

Direct Messages

Groups

Departments

Teams

Projects

Support

Pinned

Archived

Search

===============================================================
EMPLOYEE SEARCH
===============================================================

Search employees by:

Name

Employee ID

Designation

Department

Branch

Team

Profile photo

Only show users the authenticated employee is authorized to
contact.

===============================================================
CHAT TYPES
===============================================================

Direct Chat

Group Chat

Department Chat

Team Chat

Project Chat

Ticket Chat

Support Internal Chat

===============================================================
CHAT MESSAGE TYPES
===============================================================

Text

Emoji

Image

Document

PDF

File

Voice Message

Link

Mention

Reply

Reaction

System Message

===============================================================
VOICE MESSAGE
===============================================================

IMPORTANT:

Chat must support voice messages.

UI:

Microphone button

Recording state

Recording timer

Pause

Resume

Cancel

Send

After sending:

Audio waveform

Duration

Play/Pause

Progress

Playback speed

Download where permitted

Delete

===============================================================
CHAT FILE TRANSFER
===============================================================

Support:

Drag & Drop

File picker

Paste image

Attachments

Show:

File name

Type

Size

Upload progress

Cancel

Retry

Success

Failed

Preview

Download

Save to Documents

===============================================================
CHAT MESSAGE ACTIONS
===============================================================

On each message:

Reply

React

Forward

Copy

Pin

Save

Edit own message

Delete own message

Report where applicable

More

===============================================================
CHAT FEATURES
===============================================================

Support:

Typing indicator

Online indicator

Last seen where policy permits

Read receipt

Delivered

Unread

Mentions

Replies

Reactions

Pinned messages

Message search

Conversation search

Unread count

Mute conversation

Archive conversation

Block/restrict where appropriate

Notifications

===============================================================
CHAT PROFILE PANEL
===============================================================

When employee selected:

Profile photo

Name

Designation

Department

Branch

Team

Online status

Email

Phone where authorized

Actions:

Start Call where supported

Start Chat

View Profile

View Projects

View Tasks

View Shared Files

===============================================================
CHAT FILES PANEL
===============================================================

Dedicated:

Shared Files

Show:

Images

Documents

Voice messages

Links

Search

Filter

Sort

Download

Save to Documents

===============================================================
CHAT SECURITY
===============================================================

Do not expose:

Passwords

API keys

Secrets

Private employee data

Unauthorized documents

Use backend authorization for every conversation and attachment.

===============================================================
3. SUPPORT CENTRE
===============================================================

Module:

Support Centre

Purpose:

Central internal support/help desk connected to the company's
official support email centre.

This is NOT the same as employee chat.

===============================================================
SUPPORT MAIN PAGE
===============================================================

Route:

/support

Dashboard:

My Tickets

Open Tickets

Pending

In Progress

Waiting

Resolved

Closed

Urgent

SLA Breached

===============================================================
SUPPORT EMAIL INTEGRATION
===============================================================

IMPORTANT:

Integrate the Support Centre with the company's support email.

Example:

support@merncrest.lk

DO NOT hardcode the email address.

It must be configurable in:

Settings
→ Support
→ Support Email

===============================================================
SUPPORT EMAIL WORKFLOW
===============================================================

Incoming support email

→

Email ingestion

→

Create / update ticket

→

Identify sender

→

Match customer/employee

→

Assign category

→

Assign priority

→

Assign support agent

→

SLA timer starts

→

Support response

→

Email response

→

Ticket updated

Everything must be recorded.

===============================================================
SUPPORT EMAIL INBOX
===============================================================

Dedicated page:

Support Email

Show:

Inbox

Unread

Assigned

Unassigned

Waiting

Resolved

Failed

Spam

Archived

===============================================================
SUPPORT TICKET
===============================================================

Dedicated ticket detail page.

Show:

Ticket ID

Subject

Requester

Email

Customer / Employee

Category

Priority

Status

Assigned Agent

Department

SLA

Created

Updated

Last response

Conversation

Attachments

Internal notes

Activity

===============================================================
TICKET STATUS
===============================================================

New

Open

Assigned

In Progress

Waiting for Customer

Waiting for Internal Team

Resolved

Closed

Reopened

Cancelled

===============================================================
TICKET PRIORITY
===============================================================

Low

Medium

High

Urgent

Critical

Use strong visual indicators.

===============================================================
SUPPORT CONVERSATION
===============================================================

Display email conversation in a ticket timeline.

Customer message

Support response

Internal note

Assignment

Status change

Attachment

System event

Keep internal notes visually distinct from customer-visible
messages.

===============================================================
SUPPORT RESPONSE
===============================================================

Agent can:

Reply by Email

Internal Note

Attach File

Use Template

Change Status

Assign

Change Priority

Escalate

Add Tag

Link Customer

Link Project

Link Invoice

Link Asset

===============================================================
SUPPORT EMAIL COMPOSER
===============================================================

Support response composer:

To

CC

BCC

Subject

Rich text

Attachments

Templates

Signature

Send

Save Draft

===============================================================
SUPPORT EMAIL → TICKET
===============================================================

Incoming email must be associated with:

Ticket ID

Requester

Customer/Employee

Previous thread

Attachments

Conversation history

===============================================================
SUPPORT TICKET → EMAIL
===============================================================

When support agent replies:

Ticket response

→

Email provider

→

Customer email

→

Delivery status

→

Ticket timeline

Show:

Sending

Sent

Delivered where available

Failed

===============================================================
SUPPORT SLA
===============================================================

Support tickets must support:

SLA Policy

First Response Target

Resolution Target

Remaining Time

Breached

Paused

Completed

Create visual SLA timer.

Example:

FIRST RESPONSE
00:42 remaining

Use warning/error states as time approaches.

===============================================================
SUPPORT QUEUES
===============================================================

Create:

My Tickets

Unassigned

My Department

High Priority

SLA At Risk

SLA Breached

Customer Waiting

Internal Waiting

===============================================================
SUPPORT KNOWLEDGE BASE
===============================================================

Pages:

Knowledge Base

Categories

Articles

Article Details

Create Article

Edit Article

Search

Helpful / Not Helpful

Link article to ticket.

===============================================================
SUPPORT REPORTS
===============================================================

Reports:

Ticket Volume

Resolution Time

First Response Time

SLA Performance

Agent Performance

Category Analysis

Customer Support

Email Volume

Open vs Closed

Escalations

===============================================================
4. UNIFIED COMMUNICATION SEARCH
===============================================================

Create a global communication search.

Search across:

Emails

Chat Messages

Support Tickets

Attachments

Employees

Customers

Projects

Documents

Search results must show source type.

Example:

EMAIL
CHAT
TICKET
DOCUMENT

===============================================================
5. GLOBAL NOTIFICATIONS
===============================================================

Communication notifications:

New Email

New Chat

Mention

Reply

File Received

Voice Message

Support Ticket

Ticket Assignment

Ticket Reply

SLA Warning

SLA Breach

Email Failed

Integration Error

Use:

Unread badge

Toast

Notification center

Optional sound where user enables it.

===============================================================
6. DRAG & DROP
===============================================================

Drag & Drop must work where logically applicable.

Email:

Attachment upload

Chat:

File upload

Support:

Attachment upload

Documents:

Move files

Upload files

Project:

Upload files

Ticket:

Upload files

Do not make drag/drop decorative.

===============================================================
7. FILE PREVIEW
===============================================================

Files received through:

Email
Chat
Support

can be previewed using the central MernCrest document/file system.

Actions:

Preview

Download

Save to Documents

Attach to Project

Attach to Ticket

===============================================================
8. PROFILE PHOTOS
===============================================================

Show profile photos in:

Email sender

Email recipient

Chat

Chat groups

Employee search

Support requester

Support agent

Ticket participants

Notifications

Use initials when no photo exists.

===============================================================
9. ANIMATIONS
===============================================================

Use subtle enterprise animations.

Email:

New email badge

Send success

Email loading

Attachment upload

Search results

Chat:

Message entrance

Typing indicator

Online indicator

Voice recording

Voice playback

File upload

Upload success

Support:

Ticket creation

Assignment

Status transition

SLA warning

Resolution success

Use JSON/Lottie only where useful:

Email sent

Message sent

File upload

Success

Error

No messages

No tickets

No search results

Do NOT over-animate.

===============================================================
10. RESPONSIVE DESIGN
===============================================================

Desktop:

Full multi-panel layout.

Tablet:

Collapsible panels.

Mobile:

Email:
Inbox → Detail → Compose

Chat:
Conversation → Chat

Support:
Ticket list → Ticket detail

All actions must remain accessible.

===============================================================
11. COLOR SYSTEM
===============================================================

Use the MernCrest enterprise semantic color system.

Success:

Sent
Delivered
Resolved
Completed
Online

Info:

New
Unread
In Progress

Warning:

Pending
SLA At Risk
Waiting

Error:

Failed
SLA Breached
Critical

Neutral:

Archived
Draft
Closed

Do not rely on color alone.

===============================================================
12. SETTINGS
===============================================================

Create:

Communication Settings

Email Accounts

Google Workspace

Company Email

Signatures

Email Templates

Notification Settings

Chat Settings

Voice Message Settings

Support Email

Support SLA

Support Templates

Support Categories

Support Routing

Support Notifications

File Upload Settings

===============================================================
13. SECURITY
===============================================================

Never expose:

Passwords

OAuth tokens

SMTP passwords

API keys

Secrets

Private messages

Unauthorized attachments

Use secure storage for credentials.

Use backend authorization.

Audit:

Email access

Email send

Attachment download

Chat access

File transfer

Support ticket access

Ticket response

Permission changes

===============================================================
14. DESIGN REQUIREMENT
===============================================================

These three modules must NOT look like the same generic page.

EMAIL:

Should feel like a professional enterprise mail client.

CHAT:

Should feel like a modern internal company communication system.

SUPPORT:

Should feel like a professional IT service/help desk platform.

However, all three must share:

MernCrest branding

Same typography

Same spacing

Same buttons

Same semantic colors

Same navigation

Same component system

===============================================================
15. FIGMA PAGES
===============================================================

Create these Figma sections:

COMMUNICATION

01 Email Dashboard
02 Inbox
03 Email Detail
04 Compose
05 Drafts
06 Sent
07 Scheduled
08 Failed
09 Archive
10 Spam
11 Trash
12 Search
13 Email Settings
14 Google Connection
15 Company Email Connection

CHAT

16 Chat Dashboard
17 Direct Chat
18 Group Chat
19 Department Chat
20 Team Chat
21 Project Chat
22 Ticket Chat
23 Voice Message
24 File Transfer
25 Shared Files
26 Chat Search
27 Chat Profile
28 Chat Settings

SUPPORT

29 Support Dashboard
30 Ticket List
31 Ticket Detail
32 Create Ticket
33 Ticket Assignment
34 Ticket Conversation
35 Support Email
36 Support Email Detail
37 Support Response
38 Internal Notes
39 SLA
40 Queues
41 Knowledge Base
42 Knowledge Article
43 Support Reports
44 Support Settings

===============================================================
16. REQUIRED STATES
===============================================================

Design states for:

Loading

Empty

Error

Success

Offline

Sending

Sent

Failed

Uploading

Uploaded

Downloading

Recording

Playing

Paused

Typing

Online

Offline

Unread

Read

Pending

Resolved

Closed

SLA Warning

SLA Breached

Unauthorized

===============================================================
17. FINAL REQUIREMENT
===============================================================

DO NOT create simple visual mockups.

Create the complete UI architecture for:

EMAIL
+
INTERNAL EMPLOYEE CHAT
+
SUPPORT CENTRE

All three must connect to the rest of the MernCrest ERP.

Email connects to:

Customers
Employees
Projects
Invoices
Quotations
Documents
Tickets

Chat connects to:

Employees
Departments
Teams
Projects
Tickets
Documents

Support connects to:

Customers
Employees
Projects
Assets
Invoices
Documents
Email

The final result must feel like a real enterprise IT Services
company operating platform.

No fake integrations.

No fake email delivery.

No fake chat messages.

No fake support tickets.

No unnecessary AI/developer text.

Create the pages, sub-pages, components, workflows and states
required to make these modules production-ready.
===============================================================
END
===============================================================