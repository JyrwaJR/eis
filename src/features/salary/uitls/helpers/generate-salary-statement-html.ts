import { SalaryStatement } from '@sharedTypes/satatement';

/**
 * Optional identity and pay-period fields that a fuller statement payload
 * may provide. These are not (yet) part of the shared `SalaryStatement`
 * type, so they are declared here as an additive, all-optional extension —
 * every field is rendered conditionally, so passing a plain `SalaryStatement`
 * without them is still valid and changes nothing visually. If/when the
 * shared type is updated to include them, this local interface can be
 * removed and `SalaryStatement` used directly.
 */
export interface SalaryStatementWithIdentity extends SalaryStatement {
  /** Full name of the employee this statement belongs to. */
  employeeName?: string;
  /** Employee's designation / post. */
  designation?: string;
  /** Department, office or directorate the employee belongs to. */
  department?: string;
  /** Internal employee / pay code, if distinct from the GPF number. */
  employeeCode?: string;
  /** PAN (Permanent Account Number). */
  panNumber?: string;
  /** Pay period this statement covers, e.g. "July 2026". */
  payPeriod?: string;
}

type SalaryStatementItem = SalaryStatement['s_data'][number];

/**
 * Escapes a string for safe interpolation into HTML content. Replaces the
 * characters `&`, `<`, `>`, `"` and `'` with their corresponding HTML
 * entities so that data (description text, GPF details, bank numbers, etc.)
 * can never break the document structure or inject markup.
 *
 * @param value - The raw string to escape.
 * @returns The escaped string, safe to embed inside HTML text or attributes.
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Formats a numeric value (string or number) as an Indian-grouped currency
 * amount with two decimal places (e.g. 1234567.5 -> "12,34,567.50"), which
 * is the digit-grouping convention used on Indian financial and treasury
 * documents. Falls back to "0.00" when the input is empty, null or not a
 * finite number.
 *
 * @param value - The amount to format.
 * @returns The amount formatted with Indian digit grouping and two decimals.
 */
function formatCurrency(value: string | number): string {
  const numeric = typeof value === 'number' ? value : parseFloat(value);
  const safe = Number.isFinite(numeric) ? numeric : 0;
  return safe.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Formats the statement's generation timestamp in a readable Indian
 * locale format (e.g. "31 Jul 2026, 10:32 am"). Falls back to an ISO
 * string if locale formatting is unavailable in the runtime.
 *
 * @param date - The moment to format. Defaults to the current time.
 * @returns A human-readable, locale-formatted timestamp string.
 */
function formatGeneratedTimestamp(date: Date = new Date()): string {
  try {
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return date.toISOString();
  }
}

// Generic placeholder seal for the letterhead. It is an original, abstract
// monogram badge — not a reproduction of the National or State Emblem — so
// it is safe to ship as a default. Swap the <td class="seal-cell"> contents
// in generateSalaryStatementHtml for an <img> of your approved letterhead
// crest if/when you have that digital asset.
const OFFICIAL_SEAL_SVG = `<svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation">
  <circle cx="25" cy="25" r="23" fill="none" stroke="#0b3d63" stroke-width="1.6" />
  <circle cx="25" cy="25" r="18.5" fill="none" stroke="#7a1220" stroke-width="1" stroke-dasharray="2,1.6" />
  <text x="25" y="23" text-anchor="middle" font-family="Georgia, 'Noto Serif', serif" font-size="11" font-weight="700" fill="#0b3d63">GoM</text>
  <text x="25" y="32.5" text-anchor="middle" font-family="Arial, sans-serif" font-size="3.8" letter-spacing="0.6" fill="#7a1220">MEGHALAYA</text>
</svg>`;

/**
 * Builds the itemised "Salary Components" table rows.
 *
 * @param items - The line items from `statement.s_data`.
 * @returns HTML `<tr>` markup for each item, joined with newlines.
 */
function buildComponentRows(items: SalaryStatementItem[]): string {
  return items
    .map(
      (item, index) => `        <tr>
          <td class="center">${index + 1}</td>
          <td>${escapeHtml(item.pname)}</td>
          <td class="num">${formatCurrency(item.amount)}</td>
        </tr>`
    )
    .join('\n');
}

/**
 * Builds the optional employee-identity block shown beneath the masthead.
 * Renders nothing (an empty string) unless at least one identity field is
 * present on the statement, so this is fully backward compatible with
 * payloads that only carry the original `SalaryStatement` fields.
 *
 * @param statement - The statement, optionally carrying identity fields.
 * @returns HTML markup for the identity block, or an empty string.
 */
function buildIdentityBlock(statement: SalaryStatementWithIdentity): string {
  const { employeeName, designation, department, employeeCode, panNumber, payPeriod } = statement;

  const hasAnyIdentityField =
    employeeName || designation || department || employeeCode || panNumber || payPeriod;

  if (!hasAnyIdentityField) {
    return '';
  }

  const roleLine = [designation, department]
    .filter((part): part is string => Boolean(part))
    .map(escapeHtml)
    .join(' &middot; ');

  const chips = [
    employeeCode ? { label: 'Employee Code', value: employeeCode } : null,
    panNumber ? { label: 'PAN', value: panNumber } : null,
    payPeriod ? { label: 'Pay Period', value: payPeriod } : null,
  ]
    .filter((chip): chip is { label: string; value: string } => chip !== null)
    .map(
      (chip) =>
        `<span class="chip"><span class="chip-label">${escapeHtml(chip.label)}</span>${escapeHtml(chip.value)}</span>`
    )
    .join('');

  return `
    <div class="identity-block">
      ${employeeName ? `<div class="name">${escapeHtml(employeeName)}</div>` : ''}
      ${roleLine ? `<div class="role">${roleLine}</div>` : ''}
      ${chips ? `<div class="chips">${chips}</div>` : ''}
    </div>`;
}

/**
 * Generates a complete, printable HTML salary statement document for the
 * given salary statement data. The returned HTML is self-contained (it
 * includes its own stylesheet) and is suitable for printing to PDF via
 * `expo-print` or rendering in a WebView.
 *
 * Visual design follows Indian government treasury/payroll document
 * conventions: a gazette-style masthead with letterhead seal, a tricolour
 * accent, a faint security watermark, an Earnings / Net-Pay-Summary split
 * with an accounting-style double-rule total, Indian digit-grouped
 * currency, and a signed-and-sealed footer consistent with the language
 * used by Meghalaya's own digitally-signed e-Payslip system.
 *
 * The document includes: the Government of Meghalaya letterhead, an
 * optional employee-identity strip, payment/account information, a table
 * of salary components, a net-pay summary card, the net pay written out in
 * words, signature lines and a footer note.
 *
 * @param statement - The salary statement data to render. Accepts the
 * standard `SalaryStatement` shape; optional identity fields (employee
 * name, designation, department, employee code, PAN, pay period) are
 * rendered automatically when present.
 * @returns A full HTML document as a string.
 */
export function generateSalaryStatementHtml(statement: SalaryStatementWithIdentity): string {
  const rows = buildComponentRows(statement.s_data);
  const identityBlockHtml = buildIdentityBlock(statement);
  const generatedAt = formatGeneratedTimestamp();

  const tricolorBar = `<table class="tricolor-bar" role="presentation"><tr>
      <td style="background:#FF9933;"></td>
      <td style="background:#ffffff;"></td>
      <td style="background:#128807;"></td>
    </tr></table>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>NIC Salary Statement</title>
  <style>
    /*
     * Colors are intentionally hardcoded (not CSS custom properties).
     * This document is printed via WebViews of varying age (expo-print on
     * older Android devices, or other HTML-to-PDF renderers) and several
     * of those do not support CSS custom properties (var(--x)) — using
     * literal hex values here guarantees the letterhead colors always render.
     *   Ink Navy:     #0b3d63
     *   Seal Maroon:  #7a1220
     *   Graphite:     #1c1c1c
     *   Hairline:     #c7cbd1
     *   Panel tint:   #f4f6f8
     */

    @page {
      size: A4;
      margin: 14mm 12mm;
    }

    * {
      box-sizing: border-box;
    }

    html, body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      color: #1c1c1c;
      font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
      font-size: 11px;
      line-height: 1.4;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .watermark {
      position: fixed;
      top: 46%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-32deg);
      font-family: Georgia, 'Noto Serif', 'Times New Roman', serif;
      font-size: 54px;
      font-weight: 700;
      letter-spacing: 3px;
      color: rgba(11, 61, 99, 0.09);
      white-space: nowrap;
      z-index: 0;
      pointer-events: none;
    }

    .content {
      position: relative;
      z-index: 1;
    }

    .tricolor-bar {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 7px;
    }

    .tricolor-bar td {
      height: 4px;
      padding: 0;
      border: none;
      width: 33.34%;
    }

    .masthead {
      border: 1.5px solid #0b3d63;
      margin-bottom: 10px;
    }

    .masthead-table {
      width: 100%;
      border-collapse: collapse;
    }

    .masthead-table td {
      border: none;
      padding: 9px 12px;
      vertical-align: middle;
    }

    .seal-cell {
      width: 58px;
    }

    .ref-cell {
      width: 150px;
      text-align: right;
      font-size: 9px;
      color: #0b3d63;
      line-height: 1.6;
    }

    .ref-cell .ref-label {
      display: block;
      color: #7a1220;
      font-weight: 700;
      letter-spacing: 0.3px;
    }

    .masthead-center {
      text-align: center;
    }

    .masthead-center h1 {
      margin: 0;
      font-family: Georgia, 'Noto Serif', 'Times New Roman', serif;
      font-size: 19px;
      letter-spacing: 1.1px;
      color: #0b3d63;
    }

    .masthead-center h2 {
      margin: 2px 0 0;
      font-size: 11px;
      font-weight: normal;
      letter-spacing: 0.3px;
      color: #1c1c1c;
    }

    .doc-title {
      display: inline-block;
      margin-top: 7px;
      padding: 3px 16px;
      background: #0b3d63;
      color: #ffffff;
      font-size: 10.5px;
      font-weight: 700;
      letter-spacing: 2px;
    }

    .identity-block {
      border: 1px solid #c7cbd1;
      background: #f4f6f8;
      padding: 8px 12px;
      margin-bottom: 10px;
    }

    .identity-block .name {
      font-size: 13px;
      font-weight: 700;
      color: #0b3d63;
    }

    .identity-block .role {
      font-size: 10.5px;
      margin-top: 1px;
    }

    .identity-block .chips {
      margin-top: 4px;
    }

    .chip {
      display: inline-block;
      margin: 2px 14px 0 0;
      font-size: 10px;
    }

    .chip-label {
      color: #7a1220;
      font-weight: 700;
      margin-right: 4px;
    }

    .info-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 4px;
    }

    .info-table td {
      border: 1px solid #c7cbd1;
      padding: 6px 10px;
      font-size: 10.5px;
    }

    .info-table .label {
      width: 26%;
      font-weight: 700;
      background: #f4f6f8;
      color: #0b3d63;
    }

    .info-table .value {
      width: 24%;
    }

    .eyebrow {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1.6px;
      text-transform: uppercase;
      color: #7a1220;
      border-bottom: 1.5px solid #7a1220;
      padding-bottom: 3px;
      margin: 16px 0 6px;
    }

    table.ledger {
      width: 100%;
      border-collapse: collapse;
    }

    table.ledger th,
    table.ledger td {
      border: 1px solid #c7cbd1;
      padding: 5px 8px;
    }

    table.ledger thead th {
      background: #0b3d63;
      color: #ffffff;
      font-size: 9.5px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      font-weight: 700;
      text-align: left;
    }

    table.ledger tbody tr {
      page-break-inside: avoid;
    }

    table.ledger tbody tr:nth-child(even) {
      background: #f4f6f8;
    }

    .center {
      text-align: center;
    }

    .num {
      text-align: right;
      font-variant-numeric: tabular-nums;
    }

    .summary-card {
      border: 1.5px solid #0b3d63;
      margin-top: 4px;
      page-break-inside: avoid;
    }

    .summary-card table {
      width: 100%;
      border-collapse: collapse;
    }

    .summary-card td {
      border: none;
      border-bottom: 1px solid #c7cbd1;
      padding: 6px 12px;
      font-size: 11px;
    }

    .summary-label {
      font-weight: 600;
    }

    .summary-amount {
      text-align: right;
      font-variant-numeric: tabular-nums;
    }

    .total-rule td {
      border-top: 3px double #1c1c1c;
    }

    .net-pay-row td {
      background: #0b3d63;
      color: #ffffff;
      font-size: 14.5px;
      font-weight: 700;
      padding: 10px 12px;
      border-bottom: none;
      letter-spacing: 0.4px;
    }

    .words-box {
      border: 1px solid #c7cbd1;
      border-left: 3px solid #7a1220;
      background: #f4f6f8;
      padding: 8px 12px;
      margin-top: 12px;
      font-size: 11.5px;
    }

    .words-box .eyebrow-inline {
      display: block;
      font-size: 9.5px;
      font-weight: 700;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      color: #7a1220;
      margin-bottom: 2px;
    }

    .signature-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 46px;
      page-break-inside: avoid;
    }

    .signature-table td {
      border: none;
      text-align: center;
      font-size: 10.5px;
      width: 33.33%;
    }

    .sig-space {
      height: 30px;
    }

    .sig-line {
      border-top: 1px solid #1c1c1c;
      padding-top: 5px;
      font-weight: 700;
    }

    .footer {
      margin-top: 16px;
    }

    .footer .disclaimer {
      font-size: 9.5px;
      font-weight: 700;
    }

    .footer .small-note {
      font-size: 9px;
      color: #555;
      margin-top: 1px;
    }

    .footer-meta {
      display: table;
      width: 100%;
      margin-top: 6px;
      font-size: 8.5px;
      color: #666;
    }

    .footer-meta .cell {
      display: table-cell;
    }

    .footer-meta .right {
      text-align: right;
    }
  </style>
</head>
<body>
  <div class="watermark">GOVERNMENT OF MEGHALAYA</div>
  <div class="content">

    ${tricolorBar}

    <div class="masthead">
      <table class="masthead-table" role="presentation">
        <tr>
          <td class="seal-cell">${OFFICIAL_SEAL_SVG}</td>
          <td class="masthead-center">
            <h1>GOVERNMENT OF MEGHALAYA</h1>
            <h2>Directorate of Accounts &amp; Treasuries</h2>
            <div class="doc-title">NIC PAYROLL &middot; SALARY STATEMENT</div>
          </td>
          <td class="ref-cell">
            <span class="ref-label">Statement No.</span>${escapeHtml(statement.voucher_no)}
            <span class="ref-label" style="margin-top:4px;">Date</span>${escapeHtml(statement.voucher_date)}
          </td>
        </tr>
      </table>
    </div>
    ${identityBlockHtml}

    <table class="info-table">
      <tr>
        <td class="label">GPF Description</td>
        <td class="value">${escapeHtml(statement.gpf_desc)}</td>
        <td class="label">GPF Number</td>
        <td class="value">${escapeHtml(statement.gpf_no)}</td>
      </tr>
      <tr>
        <td class="label">Bank Account Number</td>
        <td class="value">${escapeHtml(statement.bank_no)}</td>
        <td class="label">Voucher Number</td>
        <td class="value">${escapeHtml(statement.voucher_no)}</td>
      </tr>
      <tr>
        <td class="label">Voucher Date</td>
        <td class="value">${escapeHtml(statement.voucher_date)}</td>
        <td class="label">Pay in Pay Band</td>
        <td class="value num">${formatCurrency(statement.pay_in_pb)}</td>
      </tr>
      <tr>
        <td class="label">Grade Pay</td>
        <td class="value num">${formatCurrency(statement.grade_pay)}</td>
        <td class="label"></td>
        <td class="value"></td>
      </tr>
    </table>

    <div class="eyebrow">Salary Components</div>
    <table class="ledger">
      <thead>
        <tr>
          <th style="width:10%">Sl.</th>
          <th>Description</th>
          <th style="width:26%" class="num">Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
${rows}
      </tbody>
    </table>

    <div class="eyebrow">Net Pay Summary</div>
    <div class="summary-card">
      <table role="presentation">
        <tr>
          <td class="summary-label">Total Emoluments</td>
          <td class="summary-amount">₹ ${formatCurrency(statement.totalEmolument)}</td>
        </tr>
        <tr>
          <td class="summary-label">Total Deductions</td>
          <td class="summary-amount">₹ ${formatCurrency(statement.totalPayItem)}</td>
        </tr>
        <tr class="total-rule">
          <td class="summary-label">Net Amount (TotalNG)</td>
          <td class="summary-amount">₹ ${formatCurrency(statement.totalng)}</td>
        </tr>
        <tr class="net-pay-row">
          <td>NET PAY</td>
          <td class="summary-amount">₹ ${formatCurrency(statement.net_pay)}</td>
        </tr>
      </table>
    </div>

    <div class="words-box">
      <span class="eyebrow-inline">Amount in Words</span>
      <strong>${escapeHtml(statement.net_pay_in_word)}</strong>
    </div>

    <table class="signature-table" role="presentation">
      <tr>
        <td class="sig-space"></td>
        <td class="sig-space"></td>
        <td class="sig-space"></td>
      </tr>
      <tr>
        <td class="sig-line">Drawing &amp; Disbursing Officer</td>
        <td class="sig-line">Treasury Officer</td>
        <td class="sig-line">Employee Signature</td>
      </tr>
    </table>

    <div style="margin-top:16px;">${tricolorBar}</div>

    <div class="footer">
      <div class="disclaimer">This is a computer-generated, digitally signed salary statement issued through the NIC Payroll System and does not require a physical signature.</div>
      <div class="small-note">In case of any discrepancy, please contact your Drawing &amp; Disbursing Officer or the concerned Treasury Office.</div>
      <div class="footer-meta">
        <div class="cell">Generated on: ${generatedAt}</div>
        <div class="cell right">Statement Ref: ${escapeHtml(statement.voucher_no)}</div>
      </div>
    </div>

  </div>
</body>
</html>`;
}
