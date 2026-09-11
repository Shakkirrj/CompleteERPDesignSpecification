===============================================================
MERNCREST ERP — PROFESSIONAL PDF DOCUMENT SYSTEM
BILLING + INVOICES + QUOTATIONS
===============================================================

IMPORTANT:

Upgrade the Billing, Invoice and Quotation modules with a
professional enterprise-grade PDF document generation system.

PDF generation is a CORE BUSINESS FUNCTION.

Do NOT create a basic browser print layout.

Do NOT use screenshots of HTML as PDFs.

Do NOT hardcode company information.

Every generated PDF must be based on real transaction data and
the selected company/branch configuration.

===============================================================
1. DOCUMENT TYPES
===============================================================

The PDF engine must support:

1. Quotation PDF
2. Invoice PDF
3. Billing Statement PDF
4. Payment Receipt PDF
5. Credit Note PDF
6. Debit Note PDF
7. Proforma Invoice PDF
8. Sales Order PDF
9. Payment Confirmation PDF

Architecture must allow additional document types later.

===============================================================
2. COMPANY BRANDING
===============================================================

Every PDF must dynamically load the correct company branding.

Include:

Company Logo
Company Legal Name
Company Registration Number
Tax/VAT Number where applicable
Company Address
Branch Address where applicable
Phone
Email
Website
Company Registration Details
Bank Details
Payment Information

DO NOT hardcode:

MernCrest address
Phone number
Email
Bank details
Registration number

All must come from Organization / Company / Branch Settings.

===============================================================
3. LOGO
===============================================================

Logo must:

- Use uploaded company logo
- Support PNG
- Support JPG/JPEG
- Support SVG where safe
- Maintain aspect ratio
- Support light/dark logo variants where required
- Support document-specific logo placement

Allow:

Company Logo
Branch Logo
Custom Document Logo

Fallback:

Use company logo if branch logo is unavailable.

===============================================================
4. QUOTATION PDF
===============================================================

Create professional quotation PDFs.

Header:

Company Logo
Company Information

Document title:

QUOTATION

Show:

Quotation Number
Quotation Date
Valid Until
Customer ID
Salesperson
Currency

Customer section:

Customer Name
Company Name
Billing Address
Shipping Address where applicable
Email
Phone
Tax information where applicable

===============================================================
QUOTATION ITEMS TABLE
===============================================================

Columns:

#
Service / Product
Description
Quantity
Unit
Unit Price
Discount
Tax
Line Total

Support:

Multiple services
Multiple products
Multiple quantities
Different tax rates
Different discounts

===============================================================
QUOTATION TOTALS
===============================================================

Show:

Subtotal

Discount

Tax

Additional Charges

Grand Total

Amount in Words where configured

Currency

===============================================================
QUOTATION TERMS
===============================================================

Support:

Validity

Payment Terms

Delivery Terms

Service Terms

Warranty

Notes

Additional Conditions

Bank / Payment Instructions

These must be configurable.

===============================================================
QUOTATION SIGNATURE
===============================================================

Optional sections:

Prepared By
Salesperson
Approved By
Customer Acceptance

Signature areas where enabled.

===============================================================
QUOTATION ACTIONS
===============================================================

Inside quotation:

Preview PDF

Generate PDF

Download PDF

Email PDF

Send to Customer

Print

Regenerate

View PDF History

Create New Version

===============================================================
5. INVOICE PDF
===============================================================

Create professional invoice PDFs.

Header:

Company Logo
Company Information

Document title:

INVOICE

Show:

Invoice Number
Invoice Date
Due Date
Customer ID
Salesperson
Reference / Quotation Number
Sales Order Number
Currency

===============================================================
CUSTOMER INFORMATION
===============================================================

Show:

Customer Name
Company
Billing Address
Shipping Address
Email
Phone
Tax/VAT information where applicable

===============================================================
INVOICE ITEMS
===============================================================

Columns:

#
Description
Service/Product
Quantity
Unit
Unit Price
Discount
Tax
Total

Support:

Services
Products
Packages
Subscriptions
Projects
Recurring billing

===============================================================
INVOICE TOTAL
===============================================================

Show:

Subtotal

Discount

Tax

Additional Charges

Rounding Adjustment if applicable

TOTAL

Amount Paid

Balance Due

Currency

Payment Status

===============================================================
PAYMENT STATUS
===============================================================

Show visually:

UNPAID

PARTIALLY PAID

PAID

OVERDUE

VOID

REFUNDED

Use professional status badges.

Do not rely on color alone.

===============================================================
6. PAYMENT INFORMATION
===============================================================

Invoice PDF may contain:

Bank Name
Account Name
Account Number
Branch
Bank Code
SWIFT/BIC
Payment Reference
Payment Instructions

Only show information configured for the selected company/branch.

Sensitive internal information must never be exposed accidentally.

===============================================================
7. BILLING PDF
===============================================================

Create a dedicated professional Billing Statement PDF.

Support:

Customer billing period

Billing date

Due date

Previous balance

Current charges

Payments

Credits

Adjustments

Outstanding balance

Total amount due

===============================================================
8. PAYMENT RECEIPT PDF
===============================================================

When payment is recorded:

Allow:

Generate Receipt

Preview

Download PDF

Email

Print

Receipt must show:

Receipt Number

Payment Date

Customer

Invoice Number

Payment Reference

Payment Method

Original Payment Amount

Currency

Exchange Rate where applicable

LKR Base Equivalent where applicable

Amount Received

Outstanding Balance

Recorded By

Verified By

===============================================================
9. CURRENCY
===============================================================

Support multiple currencies.

At minimum:

LKR
USD

For foreign currency transactions show:

Original Currency
Original Amount
Exchange Rate
Base Currency
Base Currency Equivalent

Example structure:

USD 1,000.00

Exchange Rate:
1 USD = [configured rate] LKR

LKR Equivalent:
[calculated amount]

Never hardcode exchange rates.

Never overwrite the original transaction currency.

===============================================================
10. PDF TEMPLATE SYSTEM
===============================================================

Create:

Document Templates

Template List

Create Template

Edit Template

Duplicate Template

Preview Template

Set Default

Archive Template

===============================================================
TEMPLATE STYLES
===============================================================

Provide professional configurable styles:

Corporate

Modern

Minimal

Professional

Classic

Technology

Premium

Allow future styles.

===============================================================
11. TEMPLATE CUSTOMIZATION
===============================================================

Allow authorized users to configure:

Logo position

Logo size

Header layout

Footer layout

Primary color

Secondary color

Typography

Table style

Border style

Spacing

Page margins

Terms position

Signature position

Bank details position

Footer text

Watermark

Page numbering

===============================================================
12. PDF PAGE DESIGN
===============================================================

Default PDF should look like a professionally designed corporate
business document.

Use:

A4 portrait by default.

Support:

A4 Landscape where applicable.

Margins:

Professional document margins.

Typography:

Clear hierarchy.

Document title:

Large and prominent.

Section headings:

Clear but compact.

Tables:

Readable and aligned.

Avoid:

Huge empty spaces

Overly decorative elements

Unnecessary gradients

Excessive colors

Poor typography

===============================================================
13. PDF HEADER
===============================================================

Professional header structure:

-------------------------------------------------------
LOGO          COMPANY NAME
              Address
              Contact information

                         QUOTATION / INVOICE
                         Document Number
                         Date
-------------------------------------------------------

Adapt automatically to the selected template.

===============================================================
14. PDF FOOTER
===============================================================

Footer may contain:

Company website

Email

Phone

Payment instructions

Terms reference

Page X of Y

Document generation date where configured

Confidentiality notice where configured

===============================================================
15. WATERMARK
===============================================================

Support optional watermarks:

DRAFT

PAID

CANCELLED

VOID

PROFORMA

OVERDUE

Watermarks must be configurable.

===============================================================
16. PDF PREVIEW
===============================================================

Before download, provide:

PDF Preview

Zoom

Page navigation

Download

Print

Email

Close

Do not generate a fake preview.

Preview must represent the actual generated PDF.

===============================================================
17. DOWNLOAD ACTION
===============================================================

Every relevant transaction page must have:

[ Preview PDF ]

[ Download PDF ]

[ Email PDF ]

[ Print ]

For example:

Quotation Details

Actions:
Edit
Send
Preview PDF
Download PDF
Email PDF
Convert

Invoice Details

Actions:
Edit
Send
Preview PDF
Download PDF
Email PDF
Record Payment
Print

Payment Details

Actions:
Receipt PDF
Download
Email
Print

===============================================================
18. FILE NAMING
===============================================================

Generated PDF filenames should be professional.

Examples:

Quotation_MC-QUO-2026-000001.pdf

Invoice_MC-INV-2026-000001.pdf

Receipt_MC-REC-2026-000001.pdf

Do not use:

download.pdf

document.pdf

file.pdf

random UUID as visible filename.

===============================================================
19. DOCUMENT NUMBERING
===============================================================

Document numbers must be generated securely on the backend.

Examples:

MC-QUO-2026-000001

MC-INV-2026-000001

MC-REC-2026-000001

MC-CN-2026-000001

Allow company-specific numbering configuration.

Never generate document numbers only on the frontend.

Prevent duplicate document numbers.

===============================================================
20. PDF VERSION HISTORY
===============================================================

Store document generation history.

Show:

Document

Version

Generated Date

Generated By

Template

Status

Actions

View

Download

===============================================================
21. DOCUMENT IMMUTABILITY
===============================================================

Important:

Once an invoice/payment document is finalized, do not silently
overwrite historical financial documents.

If the business requires changes:

Create revision / credit note / debit note / reversal according
to document type.

Keep audit history.

===============================================================
22. EMAIL INTEGRATION
===============================================================

From:

Quotation
Invoice
Billing Statement
Receipt

allow:

Email PDF

The email composer should automatically include:

Customer email

Document number

Subject

Professional message template

PDF attachment

Example subject:

Quotation MC-QUO-2026-000001 — MernCrest Solutions

Do not hardcode company information.

===============================================================
23. DOCUMENT ATTACHMENT STORAGE
===============================================================

Generated PDFs must be associated with the original record.

Example:

Invoice
 ├── PDF
 ├── Payment
 ├── Customer
 ├── Quotation
 ├── Sales Order
 └── Email History

Quotation
 ├── PDF versions
 ├── Customer
 ├── Salesperson
 ├── Sales Order
 └── Email History

===============================================================
24. PDF SECURITY
===============================================================

Ensure:

Unauthorized users cannot download financial PDFs.

Use backend authorization.

Do not expose direct unrestricted storage URLs.

Use secure download access.

Log:

Generated

Viewed

Downloaded

Emailed

Printed where tracking is available

Deleted/Archived where applicable

===============================================================
25. PDF STATES
===============================================================

Design UI states for:

Generating

Generated

Ready

Failed

Downloading

Downloaded

Emailing

Emailed

Email Failed

Preview Loading

Preview Error

No Permission

Document Archived

===============================================================
26. PROFESSIONAL VISUAL DESIGN
===============================================================

The PDF must visually match the MernCrest ERP UI.

Use the MernCrest brand identity.

However:

Do NOT make the PDF look like a web dashboard.

It must look like a professional corporate financial document.

Use restrained branding.

Logo should be clear.

Tables should be highly readable.

Amounts should be visually prominent.

TOTAL should be easy to find.

===============================================================
27. RESPONSIVE WEB UI
===============================================================

The PDF itself is fixed document format.

The surrounding UI must be responsive.

Desktop:

PDF preview beside document information.

Tablet:

Stack preview and information.

Mobile:

Document details

↓
Preview

↓
Download / Email / Print actions

===============================================================
28. PDF GENERATION ENGINE
===============================================================

Implement a proper server-side PDF generation architecture.

Do not depend on browser screenshotting.

Do not use client-side-only PDF generation for financial records.

The PDF generator must receive:

Document data

Company data

Branch data

Customer data

Transaction data

Template configuration

Currency configuration

Tax configuration

Payment information

Terms

Then generate a deterministic professional PDF.

===============================================================
29. DATA ACCURACY
===============================================================

All financial calculations must be performed and validated
server-side.

PDF values must match the finalized transaction.

Validate:

Subtotal

Discount

Tax

Total

Paid amount

Balance

Currency

Exchange rate

Base currency equivalent

Do not calculate important financial values only in the UI.

===============================================================
30. PDF AUDIT
===============================================================

For every generated document store:

Document ID

Document Type

Version

Template

Generated By

Generated At

Transaction ID

File Reference

Checksum where appropriate

Status

===============================================================
31. REQUIRED FIGMA SCREENS
===============================================================

Create these designs:

BILLING

Billing Dashboard
Billing Details
Billing Statement
Billing PDF Preview
Billing Download State

QUOTATIONS

Quotation List
Create Quotation
Quotation Details
Quotation Preview
Quotation PDF
Quotation Templates
Quotation Template Editor
Quotation Email
Quotation History

INVOICES

Invoice List
Create Invoice
Invoice Details
Invoice Preview
Invoice PDF
Invoice Payment
Invoice Email
Invoice History

PAYMENTS

Payment List
Payment Details
Payment Receipt
Receipt PDF
Payment History

DOCUMENT TEMPLATES

Template List
Create Template
Template Editor
Template Preview
Template Settings

===============================================================
32. REQUIRED PDF ACTIONS
===============================================================

Where applicable:

Create

Edit

Save

Preview

Generate PDF

Download PDF

Print

Email

Duplicate

Regenerate

Version History

Archive

===============================================================
33. FINAL ACCEPTANCE TEST
===============================================================

Verify:

[ ] Quotation can generate PDF

[ ] Quotation PDF contains company logo

[ ] Quotation PDF contains company information

[ ] Quotation PDF contains customer information

[ ] Quotation PDF contains all line items

[ ] Quotation PDF contains subtotal

[ ] Quotation PDF contains discount

[ ] Quotation PDF contains tax

[ ] Quotation PDF contains total

[ ] Quotation PDF contains terms

[ ] Invoice can generate PDF

[ ] Invoice PDF contains company logo

[ ] Invoice PDF contains invoice number

[ ] Invoice PDF contains customer details

[ ] Invoice PDF contains line items

[ ] Invoice PDF contains totals

[ ] Invoice PDF contains payment status

[ ] Invoice PDF contains payment instructions

[ ] Billing statement can generate PDF

[ ] Payment receipt can generate PDF

[ ] PDF can be previewed

[ ] PDF can be downloaded

[ ] PDF can be emailed

[ ] PDF can be printed

[ ] PDF filename is professional

[ ] Document numbering is backend generated

[ ] PDF uses real transaction data

[ ] Currency is correct

[ ] Exchange rate is correct

[ ] LKR base equivalent is correct where applicable

[ ] Unauthorized users cannot download PDFs

[ ] PDF generation is audited

[ ] Historical financial documents are preserved

[ ] No hardcoded company information

[ ] No fake financial values

===============================================================
FINAL OBJECTIVE
===============================================================

The final Billing / Quotation / Invoice document experience must
look and behave like a professional enterprise accounting and
ERP platform.

A customer should be able to receive a PDF and immediately
recognize it as an official corporate document.

The document must contain:

REAL COMPANY LOGO
REAL COMPANY INFORMATION
REAL CUSTOMER INFORMATION
REAL TRANSACTION INFORMATION
REAL DOCUMENT NUMBER
REAL DATE
REAL LINE ITEMS
REAL TAX/DISCOUNT
REAL TOTAL
REAL PAYMENT INFORMATION
REAL TERMS

Everything must be dynamic and database-driven.

===============================================================
END
===============================================================