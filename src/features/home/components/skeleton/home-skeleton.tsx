import React from 'react';
import { ScrollView, View } from 'react-native';
import { Container } from '@components/layout/container';
import { SectionHeaderSkeleton } from '@components/skeleton/section-header';
import { Skeleton } from '@components/ui/skeleton';

/**
 * Skeleton placeholder that mimics the {@link HomeHeader} component.
 *
 * Renders the section-header shape with a subtitle for the greeting text.
 */
const HomeHeaderSkeleton = () => (
  <SectionHeaderSkeleton hasSubtitle titleWidth="w-48" subtitleWidth="w-36" />
);

/**
 * Skeleton placeholder that mimics the {@link HomeQuickActions} component.
 *
 * Renders a "Quick Actions" heading and four circular action-icon
 * placeholders arranged in a horizontal row.
 */
const QuickActionsSkeleton = () => (
  <View className="px-5">
    <View className="bg-surface-container-lowest rounded-2xl p-4">
      <Skeleton className="mb-4 h-5 w-32 rounded-md" />
      <View className="flex-row justify-between">
        {Array.from({ length: 4 }).map((_, i) => (
          <View key={i} className="items-center gap-y-2">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-3 w-16 rounded" />
          </View>
        ))}
      </View>
    </View>
  </View>
);

/**
 * Skeleton placeholder that mimics a {@link HomeActiveLeaveCard}.
 *
 * Renders a card shape leave type + status badge and date range.
 */
const ActiveLeaveCardSkeleton = () => (
  <View className="bg-surface-container-lowest mb-3 rounded-2xl p-4 shadow-sm">
    {/* Header row: title + badge */}
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center gap-x-2">
        <Skeleton className="h-5 w-32 rounded-md" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </View>
    </View>
    {/* Date range */}
    <Skeleton className="mt-2 h-4 w-44 rounded" />
  </View>
);

/**
 * Skeleton placeholder that mimics a {@link HomeLeavePreview} row.
 *
 * Renders a card-like row with a leave description + status badge on the
 * left, a chevron icon on the right, and date subtext below.
 */
const LeavePreviewSkeleton = () => (
  <View className="bg-surface-container-lowest mb-3 rounded-2xl p-4 shadow-sm">
    {/* Top row: description + badge */}
    <View className="mb-2 flex-row items-center justify-between">
      <View className="flex-1 flex-row items-center gap-x-2">
        <Skeleton className="h-5 w-40 rounded-md" />
        <Skeleton className="h-5 w-16 rounded-md" />
      </View>
      <Skeleton className="ml-2 h-5 w-5 rounded" />
    </View>
    {/* Date range */}
    <Skeleton className="h-3 w-36 rounded" />
  </View>
);

/**
 * Full-page skeleton loading state for the home dashboard screen.
 *
 * Mirrors the layout of {@link HomeScreen} with shimmer placeholders for:
 * - HomeHeader (greeting + user name)
 * - Active Applications section (one leave card skeleton)
 * - Quick Actions section (4 circular button placeholders)
 * - Recent History section (heading + "View All" + one leave preview)
 *
 * @example
 * ```tsx
 * if (isLoading) return <HomeScreenSkeleton />;
 * ```
 */
export const HomeScreenSkeleton = () => (
  <Container className="flex-1">
    {/* HomeHeader placeholder (full width, outside scroll) */}
    <HomeHeaderSkeleton />

    <ScrollView
      className="flex-1 px-5"
      contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}>
      {/* Active Applications section */}
      <View className="mb-6">
        <Skeleton className="mb-4 h-5 w-40 rounded-md" />
        <ActiveLeaveCardSkeleton />
      </View>

      {/* Quick Actions section */}
      <View className="mb-6">
        <QuickActionsSkeleton />
      </View>

      {/* Recent History section */}
      <View className="mb-6">
        <View className="mb-4 flex-row items-center justify-between">
          <Skeleton className="h-5 w-36 rounded-md" />
          <Skeleton className="h-4 w-16 rounded" />
        </View>
        <LeavePreviewSkeleton />
      </View>
    </ScrollView>
  </Container>
);
