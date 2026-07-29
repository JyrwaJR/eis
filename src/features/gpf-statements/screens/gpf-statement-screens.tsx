import { Container } from '@components/layout';
import { EmptyScreen } from '@components/screens';
import { GPFYearSelectSheet } from '@features/gpf-statements/components/gpf-years-select';
import { useGpfStatements } from '@features/gpf-statements/hooks';
import { GPFMonthlyTable, SummaryVerticalView } from '@features/gpf-statements/components';
import { GPFMonthlyData, GPFSummary } from '@features/gpf-statements/types';
import {
  BadgeCheckIcon,
  Calendar02Icon,
  IdentityCardIcon,
  LandmarkIcon,
  TrendingUp,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { transformData } from '@utils/helpers';
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useAuthStore } from '@stores/auth.store';

export function GPFStatementScreen() {
  const [selectedYear, setSelectedYear] = React.useState<string>('');
  const { user } = useAuthStore();
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
  const summaryData = transformData<GPFSummary>(summary) ?? [];

  return (
    <Container>
      {/* Main Content Area */}
      <ScrollView
        className="px-margin_horizontal flex-1"
        contentContainerStyle={{ gap: 3, paddingBlock: 20 }}
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

            <View className="mb-lg w-1/2 flex-row items-start gap-sm">
              <View className="bg-primary-fixed/30 mt-1 rounded-md p-2">
                <HugeiconsIcon icon={IdentityCardIcon} size={20} color="#024ad8" />
              </View>
              <View className="flex-1 gap-y-2">
                <Text className="text-[14px] text-graphite">GPF Number</Text>
                <Text className="text-[14px] font-semibold" numberOfLines={1}>
                  {user?.pf_no}
                </Text>
              </View>
            </View>
            <View className="mb-lg w-1/2 flex-row items-start gap-sm">
              <View className="bg-primary-fixed/30 mt-1 rounded-md p-2">
                <HugeiconsIcon icon={BadgeCheckIcon} size={20} color="#024ad8" />
              </View>
              <View className="flex-1 gap-y-2">
                <Text className="text-[14px] text-graphite">GPF Series</Text>
                <Text className="text-[14px] font-semibold" numberOfLines={1}>
                  {user?.pf_series}
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

        <GPFMonthlyTable data={monthlyData} />

        {/* Statement Summary */}
        {summary && summary.length > 0 && <SummaryVerticalView data={summaryData} />}
      </ScrollView>
    </Container>
  );
}
