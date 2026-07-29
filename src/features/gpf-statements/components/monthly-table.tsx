import React from 'react';
import { View, ScrollView } from 'react-native';
import { Card, CardContent } from '@components/ui/card';
import { Text } from '@components/ui/text';
import type { GPFMonthlyData } from '../types';

const COLUMNS = [
  { key: 'Month', label: 'Month', minWidth: 100 },
  { key: 'Subscription', label: 'Subscription', minWidth: 120 },
  { key: 'Refund', label: 'Refund', minWidth: 100 },
  { key: 'Other', label: 'Other', minWidth: 100 },
  { key: 'Category', label: 'Category', minWidth: 100 },
  { key: 'Total', label: 'Total', minWidth: 100 },
  { key: 'Debit', label: 'Debit', minWidth: 100 },
  { key: 'Type', label: 'Type', minWidth: 100 },
] as const;

/**
 * Renders a horizontally scrollable table of monthly GPF data.
 *
 * Displays 12 rows (one per month) with alternating background colors.
 * The header row scrolls horizontally along with the data rows.
 *
 * @param data - Array of MonthlyData objects to display.
 */
export const MonthlyTable = ({ data }: { data: GPFMonthlyData[] }) => {
  if (!data || data.length === 0) return null;

  return (
    <Card variant="bordered">
      <CardContent className="p-0">
        <ScrollView horizontal showsHorizontalScrollIndicator>
          <View>
            {/* Header row */}
            <View className="flex-row border-b border-gray-300 bg-gray-100">
              {COLUMNS.map((col) => (
                <View key={col.key} style={{ minWidth: col.minWidth }} className="px-3 py-2">
                  <Text variant="caption-bold" className="text-gray-700">
                    {col.label}
                  </Text>
                </View>
              ))}
            </View>

            {/* Data rows */}
            {data.map((row, index) => (
              <View
                key={row.Month}
                className={`flex-row border-b border-gray-200 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}>
                {COLUMNS.map((col) => (
                  <View key={col.key} style={{ minWidth: col.minWidth }} className="px-3 py-2">
                    <Text variant="caption-md" className="text-foreground">
                      {row[col.key as keyof GPFMonthlyData] || '-'}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      </CardContent>
    </Card>
  );
};
