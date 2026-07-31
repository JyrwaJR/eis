import { SalaryStatement } from '@sharedTypes/satatement';

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
 * Formats a numeric value (string or number) as a fixed two-decimal amount.
 * Falls back to "0.00" when the input is empty, null or not a finite number.
 *
 * @param value - The amount to format.
 * @returns The amount formatted with two decimal places, e.g. "1250.50".
 */
function formatAmount(value: string | number): string {
  const numeric = typeof value === 'number' ? value : parseFloat(value);
  return (Number.isFinite(numeric) ? numeric : 0).toFixed(2);
}

/**
 * Generates a complete, printable HTML salary statement document for the
 * given salary statement data. The returned HTML is self-contained (it
 * includes its own stylesheet) and is suitable for printing to PDF via
 * `expo-print` or rendering in a WebView.
 *
 * The document includes: the Government of Meghalaya header, employee /
 * payment information, a table of salary components with totals, the net
 * pay written out in words, signature lines and a footer note.
 *
 * @param statement - The salary statement data to render.
 * @returns A full HTML document as a string.
 */
export function generateSalaryStatementHtml(statement: SalaryStatement): string {
  const rows = statement.s_data
    .map(
      (item, index) => `      <tr>
        <td class="center">${index + 1}</td>
        <td>${escapeHtml(item.pname)}</td>
        <td class="right">${formatAmount(item.amount)}</td>
      </tr>`
    )
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>NIC Salary Statement</title>
  <style>
    @page {
      size: A4;
      margin: 12mm;
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 11px;
      color: #000;
      margin: 0;
      padding: 0;
    }

    .header {
      text-align: center;
      border: 2px solid #000;
      padding: 10px;
      margin-bottom: 10px;
    }

    .header h1 {
      margin: 0;
      font-size: 18px;
      letter-spacing: 0.5px;
    }

    .header h2 {
      margin: 4px 0;
      font-size: 14px;
      font-weight: normal;
    }

    .header h3 {
      margin: 4px 0 0;
      font-size: 13px;
      font-weight: bold;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
    }

    th,
    td {
      border: 1px solid #000;
      padding: 5px 6px;
      vertical-align: middle;
    }

    th {
      background: #f2f2f2;
      font-weight: bold;
    }

    .info-table td {
      border: 1px solid #000;
      padding: 6px;
    }

    .label {
      width: 28%;
      font-weight: bold;
      background: #fafafa;
    }

    .value {
      width: 22%;
    }

    .center {
      text-align: center;
    }

    .right {
      text-align: right;
    }

    .section-title {
      margin-top: 12px;
      font-weight: bold;
      font-size: 12px;
    }

    .summary td {
      font-weight: bold;
    }

    .net-pay {
      font-size: 13px;
      font-weight: bold;
    }

    .footer {
      margin-top: 18px;
      font-size: 10px;
    }

    .signature {
      width: 100%;
      margin-top: 35px;
    }

    .signature td {
      border: none;
      text-align: center;
      padding-top: 28px;
      font-weight: bold;
    }

    .small {
      font-size: 10px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Government of Meghalaya</h1>
    <h2>Directorate of Accounts &amp; Treasuries</h2>
    <h3>NIC Payroll Salary Statement</h3>
  </div>

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
      <td class="value right">${formatAmount(statement.pay_in_pb)}</td>
    </tr>
    <tr>
      <td class="label">Grade Pay</td>
      <td class="value right">${formatAmount(statement.grade_pay)}</td>
      <td class="label"></td>
      <td class="value"></td>
    </tr>
  </table>

  <div class="section-title">Salary Components</div>

  <table>
    <tr>
      <th style="width:10%">Sl.</th>
      <th>Description</th>
      <th style="width:28%" class="right">Amount (₹)</th>
    </tr>
${rows}
    <tr class="summary">
      <td colspan="2">Total Emoluments</td>
      <td class="right">${formatAmount(statement.totalEmolument)}</td>
    </tr>
    <tr class="summary">
      <td colspan="2">Total Deductions</td>
      <td class="right">${formatAmount(statement.totalPayItem)}</td>
    </tr>
    <tr class="summary">
      <td colspan="2">Net Amount (TotalNG)</td>
      <td class="right">${formatAmount(statement.totalng)}</td>
    </tr>
    <tr class="summary net-pay">
      <td colspan="2">Net Pay</td>
      <td class="right">${formatAmount(statement.net_pay)}</td>
    </tr>
  </table>

  <div class="section-title">Net Pay in Words</div>

  <table>
    <tr>
      <td><strong>${escapeHtml(statement.net_pay_in_word)}</strong></td>
    </tr>
  </table>

  <table class="signature">
    <tr>
      <td>Drawing &amp; Disbursing Officer</td>
      <td>Treasury Officer</td>
      <td>Employee Signature</td>
    </tr>
  </table>

  <div class="footer">
    <div><strong>Note:</strong> This is a computer-generated salary statement generated through the NIC Payroll System.</div>
    <div class="small">No signature is required if generated electronically.</div>
  </div>
</body>
</html>`;
}
