import { Container } from '@components/layout';
import { useAuthStore } from '@stores/auth.store';
import { PAGE_ROUTES } from '@utils/constants';
import { Link } from 'expo-router';
import React from 'react';
import { ScrollView, View, Text, RefreshControl } from 'react-native';
import { HomeActiveLeaveCard, HomeLeaveHistory, HomeQuickActions } from '../components';
import { useLeaves } from '@hooks';

export function HomeScreen() {
  const { user } = useAuthStore();
  const { isFetching, refetch } = useLeaves();

  return (
    <Container>
      <ScrollView
        refreshControl={<RefreshControl onRefresh={refetch} refreshing={isFetching} />}
        showsVerticalScrollIndicator={false}
        className="flex-1">
        {/* Welcome */}

        <Text className="text-2xl font-bold">
          Welcome, {user?.emp_fname} {user?.emp_mname} {user?.emp_lname}
        </Text>

        <Text className="mt-1 text-gray-500">{user?.emp_dept}</Text>

        {/* Active Applications */}

        <Text className="mb-3 mt-8 text-lg font-semibold">Active Applications</Text>

        <HomeActiveLeaveCard />
        {/* Quick Actions */}

        <Text className="mb-3 mt-6 text-lg font-semibold">Quick Actions</Text>

        <HomeQuickActions />

        {/* History */}

        <View className="mt-4 flex-row items-center justify-between">
          <Text className="text-lg font-semibold">Recent History</Text>

          <Link href={PAGE_ROUTES.LEAVE.INDEX} asChild>
            <Text className="text-primary">View All</Text>
          </Link>
        </View>
        <HomeLeaveHistory />
      </ScrollView>
    </Container>
  );
}
