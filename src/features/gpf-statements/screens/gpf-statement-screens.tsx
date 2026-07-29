import { Container } from '@components/layout';
import { EmptyScreen } from '@components/screens';
import { GPFYearSelectSheet } from '@features/gpf-statements/components/gpf-years-select';
import { useGpfStatements } from '@features/gpf-statements/hooks';
import { SummaryVerticalView } from '@features/gpf-statements/components';
import { GPFMonthlyData } from '@features/gpf-statements/types';
import {
  BadgeCheckIcon,
  Calendar02Icon,
  LandmarkIcon,
  TrendingUp,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { transformData } from '@utils/helpers';
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

export function GPFStatementScreen() {
  const [selectedYear, setSelectedYear] = React.useState<string>('');
  const { data: gpfStatement, refetch } = useGpfStatements({ financialYear: selectedYear });

  if (!gpfStatement) {
    return (
      <>
        <View className="flex-col items-center justify-between gap-y-2 py-sm">
          <Text className="text-2xl font-bold leading-[32px]">GPF Statement</Text>
          <GPFYearSelectSheet
            onSelect={(value) => setSelectedYear(value)}
            selectedyear={selectedYear}
          />
        </View>
        <EmptyScreen title="GPF Statement" refresh={refetch} />
      </>
    );
  }

  const { emp, summary, monthly_data } = gpfStatement;

  const monthlyData = transformData<GPFMonthlyData>(monthly_data) ?? [];

  return (
    <Container>
      {/* Main Content Area */}
      <ScrollView
        className="px-margin_horizontal flex-1"
        contentContainerStyle={{ gap: 3 }}
        showsVerticalScrollIndicator={false}>
        {/* Title & Year Selector */}
        <View className="flex-col items-center justify-between gap-y-2 py-sm">
          <Text className="text-2xl font-bold leading-[32px]">GPF Statement</Text>
          <GPFYearSelectSheet
            onSelect={(value) => setSelectedYear(value)}
            selectedyear={selectedYear}
          />
        </View>

        {/* Employee Information Card */}
        <View className="bg-surface mb-5 rounded-md border border-border p-lg">
          <View className="flex-row flex-wrap">
            {/* Treasury */}
            <View className="mb-lg w-full flex-row items-start gap-sm">
              <View className="bg-primary-fixed/30 mt-1 rounded-md p-2">
                <HugeiconsIcon icon={LandmarkIcon} size={20} color="#024ad8" />
              </View>
              <View className="flex-1 gap-y-2">
                <Text className="text-[14px] text-graphite">Treasury</Text>
                <Text className="text-[16px] font-semibold" numberOfLines={1}>
                  {emp?.treasury}
                </Text>
              </View>
            </View>

            {/* DDO */}
            <View className="mb-lg w-full flex-row items-start gap-sm">
              <View className="bg-primary-fixed/30 mt-1 rounded-md p-2">
                <HugeiconsIcon icon={BadgeCheckIcon} size={20} color="#024ad8" />
              </View>
              <View className="flex-1 gap-y-2">
                <Text className="text-[14px] text-graphite">DDO</Text>
                <Text className="text-[14px] font-semibold" numberOfLines={1}>
                  {emp?.ddo}
                </Text>
              </View>
            </View>

            {/* Date of Birth */}
            <View className="w-1/2 flex-row items-start gap-sm pr-sm">
              <View className="bg-primary-fixed/30 mt-1 rounded-md p-2">
                <HugeiconsIcon icon={Calendar02Icon} size={20} color="#024ad8" />
              </View>
              <View className="flex-1 gap-y-2">
                <Text className="text-[14px] text-graphite">Date of Birth</Text>
                <Text className="text-[16px] font-semibold">{emp?.dob}</Text>
              </View>
            </View>

            {/* Interest Rate */}
            <View className="w-1/2 flex-row items-start gap-sm pl-sm">
              <View className="bg-primary-fixed/30 mt-1 rounded-md p-2">
                <HugeiconsIcon icon={TrendingUp} size={20} color="#024ad8" />
              </View>
              <View className="flex-1 gap-y-2">
                <Text className="text-[14px] text-graphite">Interest Rate</Text>
                <Text className="text-[16px] font-semibold">{emp.interest_rate}%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Monthly Statement Section */}
        <View className="flex-col gap-sm">
          <View className="mb-sm flex-row items-end justify-between px-xs">
            <Text className="text-[18px] font-semibold text-graphite">Monthly Details</Text>
            <TouchableOpacity>
              <Text className="text-primary-container text-[14px] font-semibold">Download PDF</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-surface overflow-hidden rounded-md border border-border">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} bounces={true}>
              <View>
                {/* Table Header */}
                <View className="flex-row rounded-t-md border-b border-border bg-primary">
                  <Text className="w-[100px] p-md text-[12px] font-semibold uppercase text-white">
                    Month
                  </Text>
                  <Text className="w-[100px] p-md text-center text-[12px] font-semibold uppercase text-white">
                    Sub
                  </Text>
                  <Text className="w-[90px] p-md text-right text-[12px] font-semibold uppercase text-white">
                    Refund
                  </Text>
                  <Text className="w-[80px] p-md text-right text-[12px] font-semibold uppercase text-white">
                    Other
                  </Text>
                  <Text className="w-[90px] p-md text-center text-[12px] font-semibold uppercase text-white">
                    Category
                  </Text>
                  <Text className="w-[100px] p-md text-right text-[12px] font-semibold uppercase text-white">
                    Total
                  </Text>
                  <Text className="w-[100px] p-md text-right text-[12px] font-semibold uppercase text-white">
                    Debit
                  </Text>
                  <Text className="w-[70px] p-md text-right text-[12px] font-semibold uppercase text-white">
                    Type
                  </Text>
                </View>

                {/* Table Body (Rows) */}
                {monthlyData.map((row) => (
                  <View key={row.id} className={`flex-row items-center border-b border-border`}>
                    <Text className="w-[100px] p-md text-[16px] font-medium text-graphite">
                      {row.month}
                    </Text>
                    <Text className="w-[100px] p-md text-right text-[16px] text-graphite">
                      {row.subscription}
                    </Text>
                    <Text className="w-[90px] p-md text-right text-[16px] text-graphite">
                      {row.refund}
                    </Text>
                    <Text className="w-[80px] p-md text-right text-[16px] text-graphite">
                      {row.other}
                    </Text>
                    <View className="w-[90px] items-center p-md">
                      <View className={`rounded px-2 py-1`}>
                        <Text className={`text-[12px] font-medium`}>{row.category}</Text>
                      </View>
                    </View>
                    <Text className="w-[100px] p-md text-right text-[16px] font-semibold text-graphite">
                      {row.total}
                    </Text>
                    <Text
                      className={`w-[100px] p-md text-right text-[16px] font-medium text-graphite`}>
                      {row.debit}
                    </Text>
                    <Text className={`w-[70px] p-md text-right text-[16px] font-medium uppercase`}>
                      {row.type}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>

        {/* Statement Summary */}
        {summary && summary.length > 0 && <SummaryVerticalView data={summary} />}
      </ScrollView>
    </Container>
  );
}
