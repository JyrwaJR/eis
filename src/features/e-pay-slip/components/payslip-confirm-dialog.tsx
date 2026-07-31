import React from 'react';
import { Text, View } from 'react-native';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@components/ui';
import { EPayslip } from '../types';

interface PayslipConfirmDialogProps {
  open: boolean;
  payslip: EPayslip | null;
  userName: string;
  isConfirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Confirmation dialog shown after a newly entered GE number returns a
 * payslip. Displays the payslip identity alongside the signed-in user's
 * name so the user can verify ownership before the GE number is persisted
 * and the PDF download is unlocked.
 */
export const PayslipConfirmDialog = ({
  open,
  payslip,
  userName,
  isConfirming = false,
  onConfirm,
  onCancel,
}: PayslipConfirmDialogProps) => (
  <AlertDialog open={open} onOpenChange={(next) => !next && !isConfirming && onCancel()}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Confirm Your Payslip</AlertDialogTitle>
        <AlertDialogDescription>
          Please confirm this payslip belongs to you ({userName}) before downloading.
        </AlertDialogDescription>
      </AlertDialogHeader>

      {payslip && (
        <View className="gap-y-2 rounded-md border border-border bg-gray-50 p-4 dark:bg-white/5">
          <Row label="Name" value={payslip.name} />
          <Row label="Designation" value={payslip.designation} />
          <Row label="GE Number" value={payslip.ge_number} />
          <Row label="Payslip No." value={payslip.payslip_no} />
          <Row label="Payslip Date" value={payslip.payslip_date} />
        </View>
      )}

      <AlertDialogFooter>
        <AlertDialogCancel
          variant={'outline'}
          title="No"
          onPress={onCancel}
          disabled={isConfirming}
        />
        <AlertDialogAction
          title={isConfirming ? 'Saving...' : 'Yes'}
          onPress={onConfirm}
          isLoading={isConfirming}
        />
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

/** Renders a single label/value row inside the confirmation body. */
const Row = ({ label, value }: { label: string; value: string }) => (
  <View className="flex-row justify-between gap-x-4">
    <Text className="text-sm text-graphite">{label}</Text>
    <Text className="shrink text-sm font-semibold text-foreground">{value}</Text>
  </View>
);
