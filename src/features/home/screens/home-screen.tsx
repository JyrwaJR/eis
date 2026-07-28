import React from 'react';
import { RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import { Container } from '@components/layout/container';
import { useAuthStore } from '@stores/auth.store';
import {
  HomeActiveLeaveCard,
  HomeHeader,
  HomeLeaveEmptyCard,
  HomeLeavePreview,
  HomeQuickActions,
  HomeScreenSkeleton,
} from '../components';
import { Text } from '@components/ui/text';
import { EmptyScreen } from '@components/screens';
import { useLeaves } from '@hooks';
import { isActiveLeave } from '../utils';
import { router } from 'expo-router';
import { PAGE_ROUTES } from '@utils/constants/routes';

export const HomeScreen = () => {
  const { user, isAuthLoading, logout } = useAuthStore();
  const { data, isFetching, isLoading, refetch } = useLeaves();
  const isAfterNoon = new Date().getUTCHours() >= 12;
  const userName = user ? `${user.emp_fname} ${user.emp_lname}` : 'Loading...';
  const greeting = `${isAfterNoon ? 'Good Afternoon' : 'Good Morning'} · ${user?.emp_dept ?? ''}`;

  if (isLoading || isAuthLoading) return <HomeScreenSkeleton />;

  if (!data) {
    return (
      <Container className="flex-1">
        <HomeHeader userName={userName} greeting={greeting} onLogout={logout} />
        <EmptyScreen
          title="Something went wrong"
          message="Unable to fetch data"
          refresh={refetch}
          refreshLabel="Reload"
        />
      </Container>
    );
  }

  const activeLeaves = data.filter((l) => isActiveLeave(l));
  const otherLeaves = data.filter((l) => !isActiveLeave(l));

  return (
    <Container className="flex-1">
      <HomeHeader userName={userName} greeting={greeting} onLogout={logout} />

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}
        refreshControl={<RefreshControl onRefresh={refetch} refreshing={isFetching} />}>
        {/* Active Applications section — shown before Quick Actions per EIS design */}
        <View className="mb-6">
          <Text variant="display-xs" className="text-on-surface mb-4">
            Active Applications
          </Text>
          {activeLeaves.length > 0 ? (
            activeLeaves.map((item) => (
              <View key={item.leave_cd} className="mb-3">
                <HomeActiveLeaveCard leave={item} />
              </View>
            ))
          ) : (
            <Text variant="caption-md" className="text-on-surface-variant">
              No active applications
            </Text>
          )}
        </View>

        {/* Quick Actions section */}
        <View className="mb-6">
          <Text variant="display-xs" className="text-on-surface mb-4">
            Quick Actions
          </Text>
          <HomeQuickActions />
        </View>

        {/* Recent History section */}
        <View className="mb-6">
          <View className="mb-4 flex-row items-center justify-between">
            <Text variant="display-xs" className="text-on-surface">
              Recent History
            </Text>
            <TouchableOpacity
              onPress={() => router.push(PAGE_ROUTES.LEAVE.INDEX)}
              activeOpacity={0.7}>
              <Text variant="caption-md" className="font-semibold text-primary">
                View All
              </Text>
            </TouchableOpacity>
          </View>
          {otherLeaves.length > 0 ? (
            <HomeLeavePreview leave={otherLeaves[0]} />
          ) : (
            <HomeLeaveEmptyCard />
          )}
        </View>
      </ScrollView>
    </Container>
  );
};
