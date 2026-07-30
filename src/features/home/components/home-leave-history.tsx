import React from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import { router } from 'expo-router';
import { PAGE_ROUTES } from '@utils/constants/routes';
import type { LeaveListItem } from '@sharedTypes/leave';
import { formatDate } from '@utils/formatters/formatters';
import { getStatusColor } from '@utils/helpers';
import { useLeaves } from '@hooks';
import { isActiveLeave } from '../utils';
import { Button } from '@components/ui';

/**
 * Leave history preview card shown in the "Recent History" section.
 *
 * Displays the most recent leave application — type, dates, status — and navigates
 * to the leave detail screen on press.
 */
export const HomeLeaveHistory = () => {
  const { data: leaves } = useLeaves();
  const leaveHistory = leaves?.filter((leave) => !isActiveLeave(leave));

  const onPressLeave = (leave: LeaveListItem) => {
    const { leave_cd, from_dt1, order_dt1 } = leave;
    const pageUrl = PAGE_ROUTES.LEAVE.DETAILS({
      leave_cd,
      from_dt: from_dt1,
      order_dt: order_dt1,
    });
    router.push(pageUrl);
  };

  if (!leaveHistory || leaveHistory.length === 0) {
    return (
      <View className="flex-1  items-center justify-center gap-y-4 border border-border p-6">
        <Image
          source={require('../../../shared/assets/images/empty-list.jpg')}
          className="aspect-square h-64 object-cover object-center "
        />
        <Text className="text-center text-lg font-bold tracking-wider text-black">
          No leave history
        </Text>
        <Text className="text-center text-lg font-medium tracking-wider text-graphite">
          You {`haven't`} taken any leaves yet. When you do, they will appear here.
        </Text>
        <Button
          size={'lg'}
          variant={'primary'}
          className="font-bold tracking-widest"
          onPress={() => router.push(PAGE_ROUTES.LEAVE.CREATE)}>
          Apply for Your First Leave
        </Button>
      </View>
    );
  }

  return (
    <>
      {leaveHistory.map((item, index) => (
        <View
          key={index}
          className="flex-row items-center justify-between border-b border-border py-4">
          <TouchableOpacity onPress={() => onPressLeave(item)}>
            <Text className="text-sm text-primary">{item.leave_desc}</Text>
            <Text className="text-lg font-semibold">{item.reason_for_leave}</Text>

            <View className="flex-1 flex-row gap-x-2">
              <Text className="text-gray-500">{formatDate(item.from_dt1)}</Text>
              <Text className="text-gray-500">-</Text>

              <Text className="text-gray-500">{formatDate(item.to_dt1)}</Text>
            </View>
          </TouchableOpacity>

          <Text className={getStatusColor(item.verify_flg_desc).text}>{item.verify_flg_desc}</Text>
        </View>
      ))}
    </>
  );
};
