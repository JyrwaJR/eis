import React from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { Container } from '@components/layout';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { LoanDetailSkeleton } from '../components';
import { useLoan } from '../hooks';
import { EmptyScreen } from '@components/screens';
import { PAGE_ROUTES } from '@utils/constants';
import { Card } from '@components/ui';
import { DetailRow } from '@components/common';
import { cn } from '@utils/helpers/cn';
import { getStatusColor } from '@utils/helpers';

type LoanDetailSearchParamsT = {
  /** Unique identifier of the loan record (read from the `loanId` route segment). */
  loanId?: string;
};

/**
 * Prefixes a raw amount string with `Rs ` unless it is already prefixed, so the
 * UI never renders a doubled currency symbol.
 */
const formatAmount = (value: string) => (value.includes('Rs') ? value : `Rs ${value}`);

/**
 * Loan detail screen. Resolves the loan by the `loanId` route segment via
 * `useLoan()` and renders every field of the record (description, loan number,
 * disbursed amount, recovery type/status, and interest balance/installment data).
 *
 * Redirects to the list when `loanId` is missing, shows `LoanDetailSkeleton`
 * while loading, renders `EmptyScreen` when the record is missing,
 * and is otherwise the scrollable detail view with pull-to-refresh.
 */
export function LoanDetailScreen() {
  const { loanId } = useLocalSearchParams<LoanDetailSearchParamsT>();

  const { data, isLoading, isFetching, refetch } = useLoan({ loanId: loanId ?? '' });

  if (!loanId) return <Redirect href={PAGE_ROUTES.LOAN.LIST} />;

  if (isLoading && !data) return <LoanDetailSkeleton />;

  if (!data) {
    return (
      <EmptyScreen
        refresh={refetch}
        title="Loan Not Found"
        message="The loan you're looking for doesn't exist"
      />
    );
  }

  return (
    <Container className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl onRefresh={refetch} refreshing={isFetching} />}
        showsVerticalScrollIndicator={false}>
        {/* Recovery status banner */}
        <View
          className={cn(
            'mb-6 w-full flex-row items-center justify-center gap-2 rounded-md border p-4',
            getStatusColor(data.recovery_status).bg,
            getStatusColor(data.recovery_status).border
          )}>
          <Text
            className={cn(
              'text-sm font-bold uppercase tracking-widest',
              getStatusColor(data.recovery_status).text
            )}>
            {data.recovery_status}
          </Text>
        </View>

        {/* Loan header card */}
        <View className="flex-col rounded-t-md bg-primary p-4">
          <Text className="text-sm font-medium text-white">Loan Description</Text>
          <Text className="mt-1 text-lg font-bold text-white">{data.loan_desc}</Text>
          <Text className="mt-1 text-sm text-white/80">Loan No. {data.loan_id}</Text>
        </View>

        {/* Loan summary */}
        <View className="mb-6 flex-col overflow-hidden rounded-b-md border border-border bg-white p-4">
          <View className="gap-y-2 pt-2">
            <DetailRow label="Amount Disbursed" value={formatAmount(data.amt_dis)} />
            <DetailRow label="Recovery Of" value={data.recovery_of} />
            <DetailRow label="Recovery Status" value={data.recovery_status} />
          </View>
        </View>

        {/* Interest & recovery details */}
        <Card variant="bordered" className="mb-6 p-5">
          <Text className="mb-4 text-xs font-bold uppercase tracking-wider text-graphite">
            Interest &amp; Recovery
          </Text>
          <DetailRow label="Interest Balance" value={formatAmount(data.int_balance)} />
          <DetailRow label="Interest Installment Amount" value={formatAmount(data.int_inst_amt)} />
          <DetailRow
            label="Last Installment Recovered"
            value={formatAmount(data.int_lst_inst_rec)}
          />
        </Card>
      </ScrollView>
    </Container>
  );
}
