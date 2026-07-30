import React from 'react';
import { View, Text, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Add01Icon } from '@hugeicons/core-free-icons';
import { Container } from '@components/layout';
import { LeaveCard } from '@features/leave';
import { useLeaves } from '@hooks';
import { EmptyScreen } from '@components/screens';
import { router } from 'expo-router';
import { PAGE_ROUTES } from '@utils/constants';

export function LeavesScreen() {
  const { data: leaves, refetch, isFetching } = useLeaves();

  if (leaves.length === 0) {
    const onPress = () => {
      if (leaves.length > 0) {
        refetch();
      }
      router.push(PAGE_ROUTES.LEAVE.CREATE);
    };

    return (
      <Container>
        <EmptyScreen
          refresh={onPress}
          title="No leave history"
          message="You haven't applied for any leave yet. When you do, they will appear here."
          refreshLabel={leaves.length > 0 ? 'Refresh' : 'Apply for leave'}
        />
      </Container>
    );
  }

  return (
    <Container className="flex-1">
      {/* Main Content */}
      <View className="flex-1 pb-20 pt-6">
        <Text className="mb-6 text-2xl font-bold text-graphite dark:text-white">My Leaves</Text>

        <View className="flex-col gap-y-4 space-y-4">
          {/* Leave Card 1 */}
          <FlatList
            data={leaves}
            keyExtractor={(item) => item.id}
            refreshControl={<RefreshControl onRefresh={refetch} refreshing={isFetching} />}
            renderItem={({ item }) => <LeaveCard item={item} />}
            contentContainerClassName="pb-20 gap-2"
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push(PAGE_ROUTES.LEAVE.CREATE)}
        className="absolute bottom-8 right-5 flex h-14 w-14 items-center justify-center rounded-md bg-primary shadow-md active:scale-95">
        <HugeiconsIcon icon={Add01Icon} size={28} color="#ffffff" />
      </TouchableOpacity>
    </Container>
  );
}
