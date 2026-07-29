import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Card, CardContent } from '@components/ui/card';
import type { GPFMonthlyData } from '../types';

/** Column definition for the monthly data table. */
interface Column {
  /** The key in GPFMonthlyData to display. */
  key: keyof GPFMonthlyData;
  /** The human-readable column header label. */
  label: string;
  /** Minimum width in px to keep columns readable when scrolling. */
  minWidth: number;
  /** When true, renders the cell with emphasis styling (bold, primary color). */
  emphasis?: boolean;
}

const COLUMNS: Column[] = [
  { key: 'month', label: 'Month', minWidth: 100 },
  { key: 'subscription', label: 'Subscription', minWidth: 120 },
  { key: 'refund', label: 'Refund', minWidth: 100 },
  { key: 'other', label: 'Other', minWidth: 100 },
  { key: 'category', label: 'Category', minWidth: 100 },
  { key: 'total', label: 'Total', minWidth: 100, emphasis: true },
  { key: 'debit', label: 'Debit', minWidth: 100 },
  { key: 'type', label: 'Type', minWidth: 100 },
];

/**
 * Renders a horizontally scrollable table of monthly GPF data.
 *
 * Displays rows (one per month) with alternating background colors
 * using the HP design system tokens. The header uses `bg-primary`
 * with white uppercase text. The Total column is visually emphasised
 * with a semibold weight and primary color.
 *
 * @param data - Array of GPFMonthlyData objects to display.
 */
export const MonthlyTable = ({ data }: { data: GPFMonthlyData[] }) => {
  if (!data || data.length === 0) return null;

  return (
    <Card variant="bordered" className="overflow-hidden">
      {/* ── Accent strip ── */}
      <View className="h-1 bg-primary" />

      <CardContent className="p-0">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            {/* ── Header row ── */}
            <View className="flex-row bg-primary">
              {COLUMNS.map((col) => (
                <View key={col.key} style={{ minWidth: col.minWidth }} className="px-sm py-md">
                  <Text className="text-caption-sm font-semibold uppercase tracking-wider text-white">
                    {col.label}
                  </Text>
                </View>
              ))}
            </View>

            {/* ── Data rows ── */}
            {data.map((row, index) => (
              <View
                key={row.month}
                className={`flex-row border-t border-border ${
                  index % 2 === 0 ? 'bg-surface' : 'bg-muted/20'
                }`}>
                {COLUMNS.map((col) => {
                  const value = row[col.key] || '-';
                  return (
                    <View key={col.key} style={{ minWidth: col.minWidth }} className="px-sm py-md">
                      <Text
                        className={`text-caption-md ${col.emphasis ? 'font-semibold text-primary' : 'font-medium text-ink'}`}>
                        {value}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        </ScrollView>
      </CardContent>
    </Card>
  );
};
