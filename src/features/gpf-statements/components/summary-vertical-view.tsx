import React from 'react';
import { View } from 'react-native';
import { Text } from '@components/ui/text';
import type { Summary } from '../types/gpf-statement';

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
export const SummaryVerticalView = ({ data }: { data: Summary[] }) => {
  if (!data || data.length === 0) return null;

  return (
    <View className="mt-4">
      <Text variant="heading" size="lg" weight="semibold" className="mb-3 text-foreground">
        Summary Details
      </Text>
      {data.map((row, index) => (
        <View key={row.summary}>
          {index > 0 && <View className="my-3 border-t border-gray-200" />}
          <View className="gap-y-3">
            <View className="flex-row items-center border-b border-gray-100 pb-2">
              <Text className="w-32 text-sm font-medium text-muted-foreground">Description</Text>
              <Text className="flex-1 text-sm font-semibold text-foreground">
                {row.summary || '-'}
              </Text>
            </View>
            <View className="flex-row items-center border-b border-gray-100 pb-2">
              <Text className="w-32 text-sm font-medium text-muted-foreground">Balance I</Text>
              <Text className="flex-1 text-sm font-semibold text-foreground">
                {row.balanceI || '-'}
              </Text>
            </View>
            <View className="flex-row items-center border-b border-gray-100 pb-2">
              <Text className="w-32 text-sm font-medium text-muted-foreground">Balance II</Text>
              <Text className="flex-1 text-sm font-semibold text-foreground">
                {row.balanceII || '-'}
              </Text>
            </View>
            <View className="flex-row items-center border-b border-gray-100 pb-2">
              <Text className="w-32 text-sm font-medium text-muted-foreground">Total</Text>
              <Text className="flex-1 text-sm font-semibold text-foreground">
                {row.total || '-'}
              </Text>
            </View>
            <View className="flex-row items-center pb-2">
              <Text className="w-32 text-sm font-medium text-muted-foreground">
                Missing Credits
              </Text>
              <Text className="flex-1 text-sm font-semibold text-foreground">
                {row.missingCredits || '-'}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};
