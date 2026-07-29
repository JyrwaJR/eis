import React from 'react';
import { View, Text } from 'react-native';
import type { GPFMonthlyData } from '../types';
import { ScrollView } from 'react-native-gesture-handler';
import { cn } from '@utils/helpers';
import { Button } from '@components/ui';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { DownloadIcon } from '@hugeicons/core-free-icons';

/**
 * Renders a compact summary table for the GPF statement.
 *
 * Displays each summary row with columns: Description, Balance I,
 * Balance II, Total, and Missing Credits. Alternating row colors
 * improve readability.
 *
 * @param data - Array of Summary objects to display.
 */
interface MonthlyData extends GPFMonthlyData {
  id: string;
}

const rowItemStyle = 'w-[100px] p-md text-[14px] text-right text-black font-semibold';
const rowHeaderStyle = 'w-[100px] p-md text-right text-[12px] font-bold uppercase text-white';

export const GPFMonthlyTable = ({ data }: { data: MonthlyData[] }) => {
  if (!data || data.length === 0) return null;

  return (
    <View className="flex-col gap-sm rounded-md border border-border p-2">
      <View className="flex-row items-center justify-between px-xs">
        <Text className="text-[18px] font-semibold text-black">GPF Monthly Details</Text>
        <Button size={'sm'} onPress={() => {}} className="gap-x-2">
          <HugeiconsIcon icon={DownloadIcon} strokeWidth={2} className="text-white" size={16} />
          <Text className="text-[12px] font-semibold text-white">PDF</Text>
        </Button>
      </View>
      <View className="bg-surface overflow-hidden rounded-md border border-border">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} bounces={true}>
          <View>
            {/* Table Header */}
            <View className="flex-row items-center rounded-t-md border-b border-border bg-primary">
              <Text className={cn(rowHeaderStyle)}>Month</Text>
              <Text className={cn(rowHeaderStyle)}>Sub</Text>
              <Text className={cn(rowHeaderStyle)}>Refund</Text>
              <Text className={cn(rowHeaderStyle, 'w-[80px]')}>Other</Text>
              <Text className={cn(rowHeaderStyle, 'w-[90px]')}>Category</Text>
              <Text className={cn(rowHeaderStyle, 'w-[90px]')}>Total</Text>
              <Text className={cn(rowHeaderStyle)}>Debit</Text>
              <Text className={cn(rowHeaderStyle)}>Type</Text>
            </View>

            {/* Table Body (Rows) */}
            {data.map((row) => (
              <View key={row.id} className={`flex-row items-center border-b border-border`}>
                <Text className={cn(rowItemStyle)}>{row.month}</Text>

                <Text className={cn(rowItemStyle)}>{row.subscription}</Text>
                <Text className={cn(rowItemStyle, 'w-[90px]')}>{row.refund}</Text>
                <Text className={cn(rowItemStyle, 'w-[80px]')}>{row.other}</Text>
                <Text className={cn(rowItemStyle, 'w-[90px]')}>
                  {row.category ? row.category : '-'}
                </Text>
                <Text className={cn(rowItemStyle)}>{row.total}</Text>
                <Text className={cn(rowItemStyle)}>{row.debit}</Text>
                <Text className={cn(rowItemStyle, 'uppercase')}>{row.type}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
