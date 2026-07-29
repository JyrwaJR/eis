import React from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import { Container } from '@components/layout/container';
import { SectionHeader, DetailRow } from '@components/common';
import { Card, CardHeader, CardTitle, CardContent } from '@components/ui/card';
import { Text } from '@components/ui/text';
import { EmptyScreen } from '@components/screens';
import { useGpfStatements } from '../hooks';
import { MonthlyTable, GpfStatementSkeleton } from '../components';

/**
 * Displays a GPF statement for the selected financial year.
 *
 * Renders employee information (treasury, DDO, DOB, interest rate),
 * a horizontally scrollable table of monthly subscription/refund data,
 * and a summary table with balance totals.
 *
 * - Loading state: Skeleton placeholder
 * - Empty state: EmptyScreen with message and refresh action
 * - Data state: Employee info card + monthly data table + summary table
 * - Refreshing: Pull-to-refresh via RefreshControl
 */
export const GpfStatementScreen = () => {
  const {
    data: gpfStatements,
    isFetching,
    isLoading,
    refetch,
  } = useGpfStatements({
    financialYear: '2024-2025',
  });

  if (isLoading) {
    return (
      <Container className="flex-1">
        <GpfStatementSkeleton />
      </Container>
    );
  }

  if (!gpfStatements) {
    return (
      <Container className="flex-1">
        <EmptyScreen
          title="No GPF Statement Found"
          message="No GPF statement is available for the selected financial year."
          refresh={refetch}
        />
      </Container>
    );
  }

  const { emp, monthly_data } = gpfStatements;

  return (
    <Container className="flex-1">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl onRefresh={refetch} refreshing={isFetching} />}>
        <SectionHeader title="GPF Statement" />

        {/* Employee Information Card */}
        <Card variant="bordered" className="mb-4">
          <CardHeader>
            <CardTitle>Employee Information</CardTitle>
          </CardHeader>
          <CardContent>
            <DetailRow label="Treasury" value={emp.treasury} />
            <DetailRow label="DDO" value={emp.ddo} />
            <DetailRow label="Date of Birth" value={emp.dob} />
            <DetailRow label="Interest Rate" value={emp.interest_rate} />
          </CardContent>
        </Card>

        {/* Monthly Statement Section */}
        <Text variant="heading" size="lg" weight="semibold" className="mb-3 text-foreground">
          Monthly Statement
        </Text>

        <MonthlyTable data={monthly_data} />
      </ScrollView>
    </Container>
  );
};
