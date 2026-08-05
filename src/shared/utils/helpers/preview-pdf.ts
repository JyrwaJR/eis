import { PAGE_ROUTES } from '@utils/constants';
import { Directory, File, Paths } from 'expo-file-system';
import { Route, router } from 'expo-router';

export function previewBase64PDF(base64Pdf: string, name: string) {
  const base64 = base64Pdf.replace(/^data:application\/pdf;base64,/, '');

  // Ensure the cache directory exists
  const cacheDir = new Directory(Paths.cache);
  cacheDir.create({ idempotent: true, intermediates: true });

  const pdfName = `${name}.pdf`;

  const fileName = [pdfName]
    .filter(Boolean)
    .join('-')
    .replace(/[^\w.-]+/g, '-'); // remove invalid filename characters

  const file = new File(cacheDir, fileName);

  // Create or overwrite the file
  file.create({ intermediates: true, overwrite: true });

  // Write the PDF bytes
  file.write(base64, { encoding: 'base64' });

  // Navigate to your preview screen
  router.push(PAGE_ROUTES.PREVIEW.PDF.replace(':uri', file.uri) as Route);
}
