import React from 'react';
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Invoice01Icon } from '@hugeicons/core-free-icons';
import { Container } from '@components/layout';
import { EmptyScreen } from '@components/screens';
import { LoanListSkeleton } from '../components';
import { useLoans } from '../hooks';
import { PAGE_ROUTES } from '@utils/constants';
import { LoanT } from '../types';

/**
 * Formats a raw disbursed amount string as `Rs <number>` with thousands
 * grouping (e.g. `500000` → `Rs 500,000`). Values already carrying a `Rs`
 * prefix are returned unchanged so the currency symbol is never doubled;
 * non-numeric values fall back to `Rs <raw>`.
 */
const formatAmount = (value: string) => {
  if (value.includes('Rs')) return value;
  const num = Number(value);
  return value.trim() !== '' && Number.isFinite(num)
    ? `Rs ${num.toLocaleString('en-US')}`
    : `Rs ${value}`;
};

/**
 * Loan list screen. Queries the signed-in employee's loans via `useLoans()`
 * and renders them as a pull-to-refresh `FlatList` of cards, styled with a
 * section header ("Recent Loans") and a color-coded status badge per loan.
 *
 * Loading shows `LoanListSkeleton`; an empty result shows `EmptyScreen` with a
 * refresh action. Each card navigates to the loan detail screen.
 */
export function LoansScreen() {
  const { data: loans, isLoading, refetch, isFetching } = useLoans();

  if (isLoading) return <LoanListSkeleton />;

  if (!loans || loans.length === 0) {
    return (
      <Container>
        <EmptyScreen
          refresh={refetch}
          title="No loans found"
          message="You don't have any loans yet. Loans assigned to you will appear here."
        />
      </Container>
    );
  }

  return (
    <Container className="flex-1 bg-gray-50 px-5 pt-6 dark:bg-neutral-900">
      <View className="flex-1">
        {/* Section Header */}
        <View className="mb-5 flex-row items-center">
          <View className="mr-3 h-6 w-1 rounded-full bg-blue-700 dark:bg-blue-500" />
          <Text className="text-xl font-bold text-gray-900 dark:text-white">Recent Loans</Text>
        </View>

        {/* Loan List */}
        <FlatList
          data={loans}
          keyExtractor={(item) => item.loan_id}
          refreshControl={<RefreshControl onRefresh={refetch} refreshing={isFetching} />}
          renderItem={({ item }) => <LoanCard item={item} />}
          contentContainerClassName="gap-y-4 pb-20"
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Container>
  );
}

/**
 * Displays a single loan row and navigates to the loan detail screen when
 * pressed, forwarding the loan's `loan_id` as the dynamic `/loans/:loanId`
 * route segment.
 *
 * Shows the loan description, loan number (with an invoice icon), a
 * color-coded status badge (green for open, orange for close), the disbursed
 * amount, and the recovery type (Principal/Interest).
 */
function LoanCard({ item }: { item: LoanT }) {
  const router = useRouter();

  const isOpen = item.recovery_status.toLowerCase() === 'open';
  const badgeBg = isOpen ? 'bg-green-600' : 'bg-orange-500';

  const onPressLoan = () => {
    if (item.loan_id) {
      router.push(PAGE_ROUTES.LOAN.DETAILS(item.loan_id));
    }
  };

  return (
    <TouchableOpacity
      onPress={onPressLoan}
      activeOpacity={0.8}
      className="flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
      {/* Top Row: Title, Loan No, and Badge */}
      <View className="flex-row items-start justify-between">
        <View className="flex-col">
          <Text className="mb-0.5 text-base font-semibold text-gray-900 dark:text-white">
            {item.loan_desc}
          </Text>
          <View className="flex-row items-center">
            <HugeiconsIcon icon={Invoice01Icon} size={14} color="#1d4ed8" className="mr-1" />
            <Text className="text-sm font-medium text-blue-700 dark:text-blue-400">
              Loan No. {item.loan_id}
            </Text>
          </View>
        </View>

        <View className={`${badgeBg} rounded-full px-3 py-1`}>
          <Text className="text-xs font-bold uppercase tracking-wider text-white">
            {item.recovery_status}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View className="my-3 h-[1px] w-full bg-gray-100 dark:bg-neutral-700/50" />

      {/* Bottom Row: Amount and Type */}
      <View className="flex-row items-end justify-between">
        <View className="flex-col">
          <Text className="mb-0.5 text-sm text-gray-500 dark:text-gray-400">Amount</Text>
          <Text className="text-base font-bold text-gray-900 dark:text-white">
            {formatAmount(item.amt_dis)}
          </Text>
        </View>
        <Text className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Recovery of {item.recovery_of}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
