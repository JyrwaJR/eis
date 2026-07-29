import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { cn } from '@utils/helpers/cn';
import { getStatusColor } from '@utils/helpers';
import { useLeaves } from '@hooks';
import { isActiveLeave } from '../utils';
import { formatDate } from '@utils/formatters';
import { LeaveListItem } from '@sharedTypes/leave';
import { router } from 'expo-router';
import { PAGE_ROUTES } from '@utils/constants';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { CalendarRemove02Icon } from '@hugeicons/core-free-icons';

/**
 * Active leave card displayed in the "Active Applications" section.
 *
 * Shows leave type, date range, status badge, and duration.
 * Styled per EIS design: white card, 16px radius, soft shadow, pill-shaped status badge.
 */
export const HomeActiveLeaveCard = () => {
  const { data: leaves } = useLeaves();
  const activeLeaves = leaves?.filter((leave) => isActiveLeave(leave));

  const onPressLeave = (leave: LeaveListItem) => {
    const { leave_cd, from_dt1, order_dt1 } = leave;
    const pageUrl = PAGE_ROUTES.LEAVE.DETAILS({
      leave_cd,
      from_dt: from_dt1,
      order_dt: order_dt1,
    });
    router.push(pageUrl);
  };

  if (!activeLeaves || activeLeaves.length === 0) {
    return (
      <View className="flex-1 flex-col items-center justify-center gap-y-2 border border-border p-6">
        <HugeiconsIcon icon={CalendarRemove02Icon} className="text-graphite/60" size={48} />
        <Text className="text-center text-lg font-medium tracking-wider text-graphite">
          No active leaves at the moment.
        </Text>
      </View>
    );
  }

  return (
    <>
      {activeLeaves.map((item, index) => (
        <View key={index} className="mb-3 rounded-md border border-gray-200 bg-white p-4">
          <TouchableOpacity onPress={() => onPressLeave(item)} className="flex-row justify-between">
            <View>
              <Text className="text-sm text-primary">{item.leave_desc}</Text>
              <Text className="font-semibold text-primary">{item.reason_for_leave}</Text>

              <View className="flex-1 flex-row gap-x-2">
                <Text className="mt-1 text-gray-500">{formatDate(item.from_dt1)}</Text>
                <Text className="mt-1 text-gray-500">-</Text>
                <Text className="mt-1 text-gray-500">{formatDate(item.to_dt1)}</Text>
              </View>
            </View>

            <View
              className={cn(
                'items-center justify-center rounded-md px-3 py-1',
                getStatusColor(item.verify_flg_desc).bg
              )}>
              <Text className="text-base">{item.verify_flg_desc}</Text>
            </View>
          </TouchableOpacity>
        </View>
      ))}
    </>
  );
};
