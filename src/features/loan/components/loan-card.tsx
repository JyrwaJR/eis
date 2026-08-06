import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { cn } from '@utils/helpers/cn';
import { useRouter } from 'expo-router';
import { PAGE_ROUTES } from '@utils/constants';
import { LoanT } from '../types';
import { getStatusColor } from '@utils/helpers';

/**
 * Displays a single loan row in the loan list and navigates to the loan detail
 * screen when pressed. The pressed loan's `loan_id` is forwarded as the dynamic
 * `/loans/:loanId` route segment so the detail screen can resolve the full record.
 *
 * Shows the loan description, loan number, recovery status badge (color-coded
 * by open/close), disbursed amount, and the recovery type (Principal/Interest).
 */
export function LoanCard({ item }: { item: LoanT }) {
  const router = useRouter();

  const onPressLoan = () => {
    if (item.loan_id) {
      router.push(PAGE_ROUTES.LOAN.DETAILS(item.loan_id));
    }
  };

  return (
    <TouchableOpacity
      onPress={onPressLoan}
      className="flex-col rounded-md border border-border p-4">
      <View className="mb-3 flex-row items-start justify-between">
        <View className="flex-1 pr-2">
          <Text className="text-lg font-bold">{item.loan_desc}</Text>
          <Text className="text-sm text-primary">Loan No. {item.loan_id}</Text>
        </View>
        <View
          className={cn(
            'rounded-md px-2.5 py-1',
            getStatusColor(item.recovery_status).bg,
            getStatusColor(item.recovery_status).border
          )}>
          <Text className={cn('text-xs font-medium', getStatusColor(item.recovery_status).text)}>
            {item.recovery_status}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between">
        <Text className="text-base text-graphite">Rs {item.amt_dis}</Text>
        <Text className="text-sm text-graphite">Recovery of {item.recovery_of}</Text>
      </View>
    </TouchableOpacity>
  );
}
