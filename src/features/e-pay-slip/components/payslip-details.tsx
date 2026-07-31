import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Button } from '@components/ui';
import { useSnackbar } from '@hooks';
import { cn } from '@utils/helpers/cn';
import { EPayslip } from '../types';
import { downloadEPayslipPdf } from '../utils/download-e-payslip-pdf';

interface PayslipDetailsProps {
  payslip: EPayslip;
  /** When false (before ownership confirmation) the download button is disabled. */
  downloadEnabled?: boolean;
}

/**
 * Shows the confirmed e-pay slip identity fields and the Download PDF
 * action. When `downloadEnabled` is false (before ownership confirmation)
 * the download button is disabled.
 */
export const PayslipDetails = ({ payslip, downloadEnabled = true }: PayslipDetailsProps) => {
  const { showSnackbar } = useSnackbar();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (isDownloading || !downloadEnabled) return;
    setIsDownloading(true);
    try {
      await downloadEPayslipPdf(payslip);
      showSnackbar('E-pay slip downloaded', 'checkmark-circle');
    } catch (err) {
      showSnackbar(err instanceof Error ? err.message : 'Download failed', 'alert-circle');
    } finally {
      setIsDownloading(false);
    }
  };

  const rows = [
    { label: 'Payslip Number', value: payslip.payslip_no },
    { label: 'Payslip Date', value: payslip.payslip_date },
    { label: 'Sign Date', value: payslip.sign_date },
    { label: 'GE Number', value: payslip.ge_number },
    { label: 'Name', value: payslip.name },
    { label: 'Designation', value: payslip.designation },
  ];

  return (
    <View className="gap-y-6 pt-2">
      <View className="overflow-hidden rounded-md border border-border bg-white dark:bg-gray-800">
        {rows.map((row, index) => (
          <View
            key={row.label}
            className={cn(
              'flex-row items-center justify-between gap-x-4 px-4 py-3',
              index < rows.length - 1 && 'border-b border-border'
            )}>
            <Text className="text-sm text-graphite">{row.label}</Text>
            <Text className="shrink text-sm font-semibold text-foreground">{row.value}</Text>
          </View>
        ))}
      </View>

      <Button
        title={isDownloading ? 'Downloading...' : 'Download PDF'}
        onPress={handleDownload}
        disabled={!downloadEnabled}
        isLoading={isDownloading}
      />
    </View>
  );
};
