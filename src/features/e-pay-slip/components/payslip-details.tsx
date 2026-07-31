import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { CheckmarkBadge01Icon, File01Icon, Download01Icon } from '@hugeicons/core-free-icons';
import { useSnackbar } from '@hooks';
import { EPayslip } from '../types';
import { downloadEPayslipPdf } from '../utils/download-e-payslip-pdf';
import { Container } from '@components/layout';
import { cn } from '@utils/helpers';

interface PayslipDetailsProps {
  payslip: EPayslip;
  /** When false (before ownership confirmation) the download button is disabled. */
  downloadEnabled?: boolean;
}

/**
 * Shows the confirmed e-pay slip identity fields and the Download PDF /
 * Share Slip actions. When `downloadEnabled` is false (before ownership
 * confirmation) both actions are disabled.
 */
export const PayslipDetails = ({ payslip, downloadEnabled = true }: PayslipDetailsProps) => {
  const { showSnackbar } = useSnackbar();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownlaodEPaySlip = async () => {
    if (isDownloading || !downloadEnabled) return;
    setIsDownloading(true);
    try {
      await downloadEPayslipPdf(payslip);
      showSnackbar('Share sheet opened', 'checkmark-circle');
    } catch (err) {
      showSnackbar(err instanceof Error ? err.message : 'Share failed', 'alert-circle');
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
    <Container>
      <ScrollView contentContainerClassName=" pt-6 pb-10" showsVerticalScrollIndicator={false}>
        {/* Header Text Section */}
        <View className="mb-6">
          <Text className="mb-1 text-2xl font-bold text-gray-900">Slip Details</Text>
          <Text className="text-sm text-graphite">Review your monthly earnings statement</Text>
        </View>

        {/* Institutional Detail Card */}
        <View className="mb-6 flex-col overflow-hidden rounded-md border border-border bg-white">
          {/* Institutional Badge Header */}
          <View className="flex-row items-center justify-between border-b border-border bg-primary/5 px-4 py-3">
            <Text className="text-sm font-semibold uppercase tracking-wider text-primary">
              Official Document
            </Text>
            <HugeiconsIcon icon={CheckmarkBadge01Icon} size={20} color="#2563eb" />
          </View>

          {/* Detail Rows */}
          <View className="flex-col">
            {rows.map((row, index) => (
              <DetailRow
                key={row.label}
                label={row.label}
                value={row.value}
                isLast={index === rows.length - 1}
              />
            ))}
          </View>
        </View>

        {/* Illustration / Visual Decorative Element */}
        <View className="mb-6 flex h-40 w-full items-center justify-center rounded-md border border-primary bg-primary/5">
          <View className="flex-col items-center">
            <View className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <HugeiconsIcon icon={File01Icon} size={24} color="#ffffff" />
            </View>
            <Text className="text-sm font-semibold text-primary">Digital Signature Encrypted</Text>
          </View>
        </View>

        {/* Action Section */}
        <View className="flex-col gap-y-4">
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={!downloadEnabled || isDownloading}
            className={cn(
              'flex h-16 w-full flex-row items-center justify-center rounded-md bg-primary',
              !downloadEnabled || isDownloading ? 'opacity-50' : ''
            )}
            onPress={handleDownlaodEPaySlip}>
            <View className="mr-2">
              <HugeiconsIcon icon={Download01Icon} size={20} color="#ffffff" />
            </View>
            <Text className="text-sm font-semibold uppercase tracking-wide text-white">
              {isDownloading ? 'Downloading...' : 'Download PDF'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Container>
  );
};

/** Renders a single label/value row inside the institutional detail card. */
const DetailRow = ({
  label,
  value,
  isLast = false,
}: {
  label: string;
  value: string;
  isLast?: boolean;
}) => (
  <View
    className={`min-h-[56px] flex-row items-center justify-between bg-white px-4 py-4 ${
      !isLast ? 'border-b border-border' : ''
    }`}>
    <Text className="text-sm text-graphite">{label}</Text>
    <Text className="text-base font-bold">{value}</Text>
  </View>
);
