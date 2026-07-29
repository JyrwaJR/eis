import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from '@components/ui/text';
import { ScrollView } from 'react-native-gesture-handler';
import { GPFSummary } from '../types';
import { cn } from '@utils/helpers';

/**
 * Renders the GPF summary data in a vertical key-value pair layout.
 *
 * Each Summary item is displayed as a labeled section with fields shown
 * as rows (label on the left, value on the right). Items are separated
 * by a subtle divider line.
 *
 * This is an alternative view of the same data shown in SummaryTable,
 * transposed from horizontal columns to vertical rows.
 *
 * @param data - Array of Summary objects to display.
 */
interface Summary extends GPFSummary {
  id: string;
}

const rowItemStyle = 'w-[130px] p-md text-[14px] text-right text-black font-semibold';
const rowHeaderStyle = 'w-[130px] p-md text-right text-[12px] font-bold uppercase text-white';

export const SummaryVerticalView = ({ data }: { data: Summary[] }) => {
  if (!data || data.length === 0) return null;

  return (
    <View className="mt-4">
      <View className="mb-sm flex-row items-center justify-between px-xs">
        <Text className="text-[18px] font-semibold text-black">GPF Summary Details</Text>
        <TouchableOpacity>
          <Text className="text-[14px] font-semibold text-primary">Download PDF</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-surface overflow-hidden rounded-md border border-border">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} bounces={true}>
          <View>
            {/* Table Header */}
            <View className="flex-row items-center rounded-t-md border-b border-border bg-primary">
              <Text className={cn(rowHeaderStyle)}>Summary</Text>
              <Text className={cn(rowHeaderStyle)}>Balance I</Text>
              <Text className={cn(rowHeaderStyle)}>Balance II</Text>
              <Text className={cn(rowHeaderStyle)}>Total</Text>
              <Text className={cn(rowHeaderStyle)}>Missing Credits</Text>
            </View>

            {/* Table Body (Rows) */}
            {data.map((row) => (
              <View key={row.id} className={`flex-row items-center border-b border-border`}>
                <Text className={cn(rowItemStyle)}>{row.summary}</Text>
                <Text className={cn(rowItemStyle)}>{row.balanceI}</Text>
                <Text className={cn(rowItemStyle)}>{row.balanceII}</Text>
                <Text className={cn(rowItemStyle)}>{row.total}</Text>
                <Text className={cn(rowItemStyle)}>
                  {row.missingCredits ? row.missingCredits : '-'}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
