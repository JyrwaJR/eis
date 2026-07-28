import React from 'react';
import { RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import { Container } from '@components/layout';
import { useAuthStore } from '@stores/auth.store';
import { useLeaves } from '@hooks';
import { isActiveLeave } from '../utils';
import {
  HomeActiveLeaveCard,
  HomeLeaveEmptyCard,
  HomeLeavePreview,
  HomeQuickActions,
  HomeScreenSkeleton,
} from '../components';
import { Text } from '@components/ui/text';
import { router } from 'expo-router';
import { PAGE_ROUTES } from '@utils/constants/routes';

/**
 * Home dashboard screen.
 *
 * Displays a personalised welcome greeting, the employee's active leave
 * applications, quick-action shortcuts, and recent leave history.
 *
 * Data is fetched through `useLeaves()` and split into active / historical
 * buckets via `isActiveLeave()`.  The screen shows a **skeleton placeholder**
 * during the initial load and supports **pull-to-refresh** for background
 * refetches.
 *
 * @example
 * ```tsx
 * <HomeScreen />
 * ```
 */
export function HomeScreen() {
  const { user, isAuthLoading } = useAuthStore();
  const { data, isFetching, isLoading, refetch } = useLeaves();

  /* ── Loading state ─────────────────────────────────────────── */
  if (isLoading || isAuthLoading) return <HomeScreenSkeleton />;

  /* ── Error / no-data state ──────────────────────────────────── */
  if (!data) {
    return (
      <Container className="flex-1">
        <View className="px-5 pt-4">
          <Text className="text-2xl font-bold">
            Welcome, {user?.emp_fname} {user?.emp_lname}
          </Text>
          <Text className="text-on-surface-variant mt-1">{user?.emp_dept ?? ''}</Text>
        </View>

        <View className="flex-1 items-center justify-center px-5">
          <Text className="text-on-surface-variant mb-2 text-center">Something went wrong</Text>
          <Text className="text-on-surface-variant mb-4 text-center">Unable to fetch data</Text>
          <TouchableOpacity
            onPress={() => refetch()}
            className="rounded-md bg-[#024ad8] px-6 py-2"
            activeOpacity={0.7}>
            <Text className="font-semibold text-white">Reload</Text>
          </TouchableOpacity>
        </View>
      </Container>
    );
  }

  /* ── Split leaves into active (currently running) and history ── */
  const activeLeaves = data.filter((l) => isActiveLeave(l));
  const otherLeaves = data.filter((l) => !isActiveLeave(l));

  return (
    <Container>
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 16 }}
        refreshControl={<RefreshControl onRefresh={refetch} refreshing={isFetching} />}>
        {/* ── Welcome header ────────────────────────────────────── */}
        <Text className="text-2xl font-bold">
          Welcome, {user?.emp_fname} {user?.emp_lname}
        </Text>
        <Text className="text-on-surface-variant mt-1">{user?.emp_dept ?? ''}</Text>

        {/* ── Active Applications ───────────────────────────────── */}
        <Text className="mb-3 mt-8 text-lg font-semibold">Active Applications</Text>
        {activeLeaves.length > 0 ? (
          activeLeaves.map((item) => (
            <View key={item.leave_cd} className="mb-3">
              <HomeActiveLeaveCard leave={item} />
            </View>
          ))
        ) : (
          <Text className="text-on-surface-variant">No active applications</Text>
        )}

        {/* ── Quick Actions ─────────────────────────────────────── */}
        <HomeQuickActions />

        {/* ── Recent History (active leaves filtered out) ───────── */}
        <View className="mb-4 mt-2 flex-row items-center justify-between">
          <Text className="text-lg font-semibold">Recent History</Text>
          <TouchableOpacity
            onPress={() => router.push(PAGE_ROUTES.LEAVE.INDEX)}
            activeOpacity={0.7}>
            <Text className="font-semibold text-[#0036a4]">View All</Text>
          </TouchableOpacity>
        </View>
        {otherLeaves.length > 0 ? (
          otherLeaves.map((item) => (
            <View key={item.leave_cd} className="mb-3">
              <HomeLeavePreview leave={item} />
            </View>
          ))
        ) : (
          <HomeLeaveEmptyCard />
        )}
      </ScrollView>
    </Container>
  );
}
