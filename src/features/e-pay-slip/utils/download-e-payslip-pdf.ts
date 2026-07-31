import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { EPayslip } from '../types';

/**
 * Sanitizes the payslip number for safe use in a file name.
 *
 * @param payslipNo - The raw payslip number.
 * @returns An alphanumeric/dash/underscore string, or 'download' if empty.
 */
function safeFileName(payslipNo: string): string {
  return payslipNo.replace(/[^a-zA-Z0-9_-]/g, '') || 'download';
}

/**
 * Downloads the e-pay slip PDF described by `payslip.pdf` into the device
 * document directory (file system) and, when `options.share` is true,
 * opens the native share sheet.
 *
 * Supports two payload shapes:
 * - an HTTP(S) URL (downloaded via `File.downloadFileAsync`), or
 * - a base64 / `data:*;base64,...` string (decoded via `File.write`).
 *
 * Uses the SDK 54 expo-file-system API (`File`, `Paths`, `Directory`).
 *
 * @param payslip - The confirmed e-pay slip record.
 * @param options - Optional behavior flags. `share` (default `true`)
 *   controls whether the share sheet is opened after saving.
 * @returns The local file URI of the generated PDF.
 * @throws If `pdf` is empty, the download fails, or (when sharing) sharing
 *   is unavailable.
 */
export async function downloadEPayslipPdf(
  payslip: EPayslip,
  options: { share?: boolean } = {}
): Promise<string> {
  const { pdf } = payslip;
  if (!pdf?.trim()) {
    throw new Error('E-pay slip PDF is missing');
  }

  const shouldShare = options.share ?? true;
  if (shouldShare) {
    const available = await Sharing.isAvailableAsync();
    if (!available) {
      throw new Error('Sharing is not available on this device');
    }
  }

  const fileName = `e-payslip-${safeFileName(payslip.payslip_no)}-${Date.now()}.pdf`;

  const target = new FileSystem.File(FileSystem.Paths.document, fileName);

  if (/^https?:\/\//i.test(pdf)) {
    // Non-2xx rejects with UnableToDownload; idempotent avoids
    // DestinationAlreadyExists on a same-millisecond retry.
    await FileSystem.File.downloadFileAsync(pdf, target, { idempotent: true });
  } else {
    const base64 = pdf.replace(/^data:[^,]+,?/, '');
    await target.write(base64, { encoding: 'base64' });
  }

  if (shouldShare) {
    await Sharing.shareAsync(target.uri, {
      mimeType: 'application/pdf',
      dialogTitle: 'E-Pay Slip',
      UTI: 'com.adobe.pdf',
    });
  }

  return target.uri;
}
