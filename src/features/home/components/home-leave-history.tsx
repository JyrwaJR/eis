import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@components/ui/text';
import { router } from 'expo-router';
import { PAGE_ROUTES } from '@utils/constants/routes';
import type { LeaveListItem } from '@sharedTypes/leave';
import { formatDate } from '@utils/formatters/formatters';
import { getStatusColor } from '@utils/helpers';
import { useLeaves } from '@hooks';
import { isActiveLeave } from '../utils';

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

  return (
    <>
      {leaveHistory.map((item, index) => (
        <View
          key={index}
          className="flex-row items-center justify-between border-b border-gray-200 py-4">
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
