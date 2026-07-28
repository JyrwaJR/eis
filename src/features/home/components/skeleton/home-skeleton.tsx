import React from 'react';
import { ScrollView, View } from 'react-native';
import { Container } from '@components/layout/container';
import { Skeleton } from '@components/ui/skeleton';

/**
 * Skeleton placeholder that mimics the {@link HomeHeader} component.
 *
 * Renders the section-header shape with a subtitle for the greeting text.
 */
const HomeHeaderSkeleton = () => (
  <View className="bg-surface">
    <View className="h-[6px] flex-row">
      <View className="flex-1 bg-gray-200" />
      <View className="flex-1 bg-gray-100" />
      <View className="flex-1 bg-gray-200" />
    </View>
    <View className="mx-5 mb-4 mt-14">
      <Skeleton className="mb-2 h-5 w-28 rounded-md" />
      <Skeleton className="h-5 w-44 rounded-md" />
    </View>
    <View className="mx-5 mb-4">
      <Skeleton className="mb-1 h-7 w-48 rounded-md" />
      <Skeleton className="h-4 w-36 rounded" />
    </View>
  </View>
);

/**
 * Skeleton placeholder that mimics an {@link HomeActiveLeaveCard}.
 *
 * Renders a card shape with leave type + status badge and date range.
 */
const ActiveLeaveCardSkeleton = () => (
  <View className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm">
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center gap-2">
        <Skeleton className="h-5 w-24 rounded-md" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </View>
    </View>
    <Skeleton className="mt-2 h-4 w-40 rounded" />
  </View>
);

/**
 * Skeleton placeholder that mimics the {@link HomeQuickActions} component.
 *
 * Renders a 2×2 grid of action-icon placeholders inside a white card.
 */
const QuickActionsSkeleton = () => (
  <View className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm">
    <View className="flex-row flex-wrap justify-between">
      {Array.from({ length: 4 }).map((_, i) => (
        <View key={i} className="mb-4 w-[48%] items-center">
          <Skeleton className="mb-2 h-12 w-12 rounded-2xl" />
          <Skeleton className="h-3 w-20 rounded" />
        </View>
      ))}
    </View>
  </View>
);

/**
 * Skeleton placeholder that mimics a {@link HomeLeavePreview} row.
 *
 * Renders a card with leave description + status badge and date range.
 */
const LeavePreviewSkeleton = () => (
  <View className="bg-surface-container-lowest mb-3 rounded-2xl p-4 shadow-sm">
    <View className="flex-row items-center justify-between">
      <View className="flex-1 flex-row items-center gap-2">
        <Skeleton className="h-5 w-36 rounded-md" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </View>
      <Skeleton className="ml-2 h-4 w-4 rounded" />
    </View>
    <Skeleton className="mt-2 h-3 w-44 rounded" />
  </View>
);

/**
 * Full-page skeleton loading state for the home dashboard screen.
 *
 * Mirrors the EIS layout order:
 * - HomeHeader (tricolor strip + gov portal + welcome)
 * - Active Applications section (leave cards)
 * - Quick Actions section (2×2 grid)
 * - Recent History section (view all heading + preview rows)
 */
export const HomeScreenSkeleton = () => (
  <Container className="flex-1">
    <ScrollView
      className="flex-1 px-5"
      contentContainerStyle={{ paddingTop: 0, paddingBottom: 40 }}>
      {/* HomeHeader placeholder */}
      <HomeHeaderSkeleton />

      {/* Active Applications section */}
      <View className="mb-6 mt-6">
        <Skeleton className="mb-4 h-6 w-40 rounded-md" />
        <ActiveLeaveCardSkeleton />
      </View>

      {/* Quick Actions section */}
      <View className="mb-6">
        <Skeleton className="mb-4 h-6 w-32 rounded-md" />
        <QuickActionsSkeleton />
      </View>

      {/* Recent History section */}
      <View className="mb-6">
        <View className="mb-4 flex-row items-center justify-between">
          <Skeleton className="h-6 w-36 rounded-md" />
          <Skeleton className="h-4 w-16 rounded" />
        </View>
        <LeavePreviewSkeleton />
      </View>
    </ScrollView>
  </Container>
);
