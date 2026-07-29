import React from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { Container } from '@components/layout/container';
import { SectionHeader } from '@components/common';
import { Card, CardHeader, CardTitle, CardContent } from '@components/ui/card';
import { Text } from '@components/ui/text';
import { EmptyScreen } from '@components/screens';
import { useGpfStatements } from '../hooks';
import { MonthlyTable, SummaryTable, GpfStatementSkeleton } from '../components';

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
        <SectionHeader title="GPF Statement" />
        <GpfStatementSkeleton />
      </Container>
    );
  }

  if (!gpfStatements) {
    return (
      <Container className="flex-1">
        <SectionHeader title="GPF Statement" />
        <EmptyScreen
          title="No GPF Statement Found"
          message="No GPF statement is available for the selected financial year."
          refresh={refetch}
        />
      </Container>
    );
  }

  const { emp, monthly_data, summary } = gpfStatements;

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
            <View className="gap-y-3">
              <View className="flex-row items-center border-b border-gray-100 pb-2">
                <Text className="w-32 text-sm font-medium text-muted-foreground">Treasury</Text>
                <Text className="flex-1 text-sm font-semibold text-foreground">{emp.treasury}</Text>
              </View>
              <View className="flex-row items-center border-b border-gray-100 pb-2">
                <Text className="w-32 text-sm font-medium text-muted-foreground">DDO</Text>
                <Text className="flex-1 text-sm font-semibold text-foreground">{emp.ddo}</Text>
              </View>
              <View className="flex-row items-center border-b border-gray-100 pb-2">
                <Text className="w-32 text-sm font-medium text-muted-foreground">
                  Date of Birth
                </Text>
                <Text className="flex-1 text-sm font-semibold text-foreground">{emp.dob}</Text>
              </View>
              <View className="flex-row items-center pb-2">
                <Text className="w-32 text-sm font-medium text-muted-foreground">
                  Interest Rate
                </Text>
                <Text className="flex-1 text-sm font-semibold text-foreground">
                  {emp.interest_rate}
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Monthly Statement Section */}
        <Text variant="heading" size="lg" weight="semibold" className="mb-3 text-foreground">
          Monthly Statement
        </Text>

        <MonthlyTable data={monthly_data} />

        {/* Statement Summary */}
        {summary && summary.length > 0 && (
          <>
            <Text
              variant="heading"
              size="lg"
              weight="semibold"
              className="mb-3 mt-6 text-foreground">
              Summary
            </Text>
            <SummaryTable data={summary} />
          </>
        )}
      </ScrollView>
    </Container>
  );
};
