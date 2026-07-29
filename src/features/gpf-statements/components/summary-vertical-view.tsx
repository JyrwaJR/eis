import React from 'react';
import { View, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import type { GPFSummary } from '../types';
import { Button } from '@components/ui';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { DownloadIcon } from '@hugeicons/core-free-icons';

/** Column definition for the summary table. */
interface Column {
  /** The key in GPFSummary to display. */
  key: keyof GPFSummary;
  /** The human-readable column header label. */
  label: string;
  /** Minimum width in px to keep columns readable when scrolling. */
  minWidth: number;
  /** When true, renders the cell with emphasis styling (bold, primary color). */
  emphasis?: boolean;
}

const COLUMNS: Column[] = [
  { key: 'summary', label: 'Summary', minWidth: 130 },
  { key: 'balanceI', label: 'Balance I', minWidth: 130 },
  { key: 'balanceII', label: 'Balance II', minWidth: 130 },
  { key: 'total', label: 'Total', minWidth: 130, emphasis: true },
  { key: 'missingCredits', label: 'Missing Credits', minWidth: 130 },
];

/**
 * Renders the GPF summary data in a horizontally scrollable table.
 *
 * Displays summary rows with alternating background colors using the
 * HP design system tokens. The header uses `bg-primary` with white
 * uppercase text. The Total column is visually emphasised with a
 * semibold weight and primary color. Includes a title bar with
 * a PDF download action.
 *
 * @param data - Array of GPFSummary objects to display.
 */
interface Summary extends GPFSummary {
  id: string;
}

export const SummaryVerticalView = ({ data }: { data: Summary[] }) => {
  if (!data || data.length === 0) return null;

  return (
    <View className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      {/* ── Accent strip ── */}
      <View className="h-1 bg-primary" />

      {/* ── Title bar with PDF action ── */}
      <View className="flex-row items-center justify-between px-md py-md">
        <View className="flex-row items-center gap-sm">
          <View className="h-4 w-0.5 rounded-full bg-primary" />
          <Text className="text-display-xs text-ink">GPF Summary Details</Text>
        </View>
        <Button size="sm" onPress={() => {}} className="gap-x-2">
          <HugeiconsIcon icon={DownloadIcon} strokeWidth={2} className="text-white" size={16} />
          <Text className="text-button-sm uppercase tracking-wider text-white">PDF</Text>
        </Button>
      </View>

      {/* ── Scrollable table ── */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} bounces={false}>
        <View>
          {/* Header row */}
          <View className="flex-row bg-primary">
            {COLUMNS.map((col) => (
              <View key={col.key} style={{ minWidth: col.minWidth }} className="px-sm py-md">
                <Text className="text-caption-sm font-semibold uppercase tracking-wider text-white">
                  {col.label}
                </Text>
              </View>
            ))}
          </View>

          {/* Data rows */}
          {data.map((row, index) => (
            <View
              key={row.id}
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
    </View>
  );
};
