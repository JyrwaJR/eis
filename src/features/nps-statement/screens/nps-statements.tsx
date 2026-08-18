import { Container } from '@components/layout';
import { EmptyScreen } from '@components/screens';
import React, { useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import {
  NPSMemberInfoCard,
  NPSMonthlyTable,
  NPSSummaryCard,
  NpsStatementSkeleton,
} from '../components';
import { useNpsStatements } from '../hooks';
import { buildMonthlyRows, buildSummaryRows } from '../utils';
import { NpsFinYearSelectSheet } from '../components/nps-fin-years';
import { router } from 'expo-router';

/**
 * NPS Statement (Annexure-5) screen.
 *
 * Fetches the current financial year's NPS statement via `get_annex5` RPC and
 * renders: member info card, monthly contribution table, and summary card.
 * Loading shows a skeleton; no data shows an empty state with a refresh action;
 * pull-to-refresh triggers a refetch.
 */
export const NpsStatementsScreen = () => {
  const [financialYear, setFinancialYear] = useState<string | null>('');
  const { data, isLoading, refetch, isFetching } = useNpsStatements({ finYear: financialYear });

  if (!financialYear) {
    return (
      <Container>
        <NpsFinYearSelectSheet
          selectedyear={financialYear || ''}
          onSelect={(value) => setFinancialYear(value)}
          disabled={isFetching}
        />
        <EmptyScreen
          title="No NPS Statement"
          message={'Please select a year to continue'}
          refresh={() => router.back()}
          refreshLabel="Go Back"
        />
      </Container>
    );
  }
  if (isLoading) {
    return (
      <Container>
        <NpsStatementSkeleton />
      </Container>
    );
  }

  if (!data) {
    return (
      <Container>
        <NpsFinYearSelectSheet
          selectedyear={financialYear || ''}
          onSelect={(value) => setFinancialYear(value)}
          disabled={isFetching}
        />
        <EmptyScreen
          title="No NPS Statement"
          message={`No NPS Statement found for financial year ${financialYear}.`}
          refresh={refetch}
        />
      </Container>
    );
  }

  const monthlyRows = buildMonthlyRows(data);
  const summaryRows = buildSummaryRows(data);

  return (
    <Container>
      <NpsFinYearSelectSheet
        selectedyear={financialYear || ''}
        onSelect={(value) => setFinancialYear(value)}
        disabled={isFetching}
      />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ gap: 16 }}
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
        showsVerticalScrollIndicator={false}>
        <NPSMemberInfoCard data={data} />
        {monthlyRows.length > 0 && <NPSMonthlyTable data={monthlyRows} />}
        {summaryRows.length > 0 && <NPSSummaryCard rows={summaryRows} />}
      </ScrollView>
    </Container>
  );
};
