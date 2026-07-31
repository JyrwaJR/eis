import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { generateSalaryStatementHtml } from './generate-salary-statement-html';
import { SalaryStatement } from '@sharedTypes/satatement';

export async function shareSalaryStatementPdf(statement: SalaryStatement) {
  const html = generateSalaryStatementHtml(statement);

  // Generate PDF
  const { uri } = await Print.printToFileAsync({
    html,
    base64: false,
  });

  // Check sharing availability
  const available = await Sharing.isAvailableAsync();

  if (!available) {
    throw new Error('Sharing is not available on this device');
  }

  // Open native share sheet
  await Sharing.shareAsync(uri, {
    mimeType: 'application/pdf',
    dialogTitle: 'Share Salary Statement',
    UTI: 'com.adobe.pdf', // iOS
  });

  return uri;
}
