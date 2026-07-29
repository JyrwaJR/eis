import React from 'react';
import { View } from 'react-native';
import { Card, CardContent } from '@components/ui/card';
import { Text } from '@components/ui/text';
import type { Summary } from '../types';

/**
 * Renders a compact summary table for the GPF statement.
 *
 * Displays each summary row with columns: Description, Balance I,
 * Balance II, Total, and Missing Credits. Alternating row colors
 * improve readability.
 *
 * @param data - Array of Summary objects to display.
 */
export const SummaryTable = ({ data }: { data: Summary[] }) => {
  if (!data || data.length === 0) return null;

  return (
    <Card variant="bordered" className="mt-4">
      <CardContent className="p-0">
        {/* Header row */}
        <View className="flex-row border-b border-gray-300 bg-gray-100">
          <View style={{ minWidth: 120 }} className="px-3 py-2">
            <Text variant="caption-bold" className="text-gray-700">
              Description
            </Text>
          </View>
          <View style={{ minWidth: 100 }} className="px-3 py-2">
            <Text variant="caption-bold" className="text-gray-700">
              Balance I
            </Text>
          </View>
          <View style={{ minWidth: 100 }} className="px-3 py-2">
            <Text variant="caption-bold" className="text-gray-700">
              Balance II
            </Text>
          </View>
          <View style={{ minWidth: 100 }} className="px-3 py-2">
            <Text variant="caption-bold" className="text-gray-700">
              Total
            </Text>
          </View>
          <View style={{ minWidth: 100 }} className="px-3 py-2">
            <Text variant="caption-bold" className="text-gray-700">
              Missing Credits
            </Text>
          </View>
        </View>

        {/* Data rows */}
        {data.map((row, index) => (
          <View
            key={row.summary}
            className={`flex-row border-b border-gray-200 ${
              index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
            }`}>
            <View style={{ minWidth: 120 }} className="px-3 py-2">
              <Text variant="caption-md" className="text-foreground">
                {row.summary || '-'}
              </Text>
            </View>
            <View style={{ minWidth: 100 }} className="px-3 py-2">
              <Text variant="caption-md" className="text-foreground">
                {row.balanceI || '-'}
              </Text>
            </View>
            <View style={{ minWidth: 100 }} className="px-3 py-2">
              <Text variant="caption-md" className="text-foreground">
                {row.balanceII || '-'}
              </Text>
            </View>
            <View style={{ minWidth: 100 }} className="px-3 py-2">
              <Text variant="caption-md" className="text-foreground">
                {row.total || '-'}
              </Text>
            </View>
            <View style={{ minWidth: 100 }} className="px-3 py-2">
              <Text variant="caption-md" className="text-foreground">
                {row.missingCredits || '-'}
              </Text>
            </View>
          </View>
        ))}
      </CardContent>
    </Card>
  );
};
