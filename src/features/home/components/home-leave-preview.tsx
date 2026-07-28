import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@components/ui/text';
import { Icon } from '@components/ui/icon';
import { Card } from '@components/ui/card';
import { router } from 'expo-router';
import { PAGE_ROUTES } from '@utils/constants/routes';
import type { LeaveListItem } from '@sharedTypes/leave';
import { formatDate } from '@utils/formatters/formatters';
import { cn } from '@utils/helpers/cn';
import { getStatusColor } from '@utils/helpers';

interface HomeLeavePreviewProps {
  leave: LeaveListItem;
}

/**
 * Leave history preview card shown in the "Recent History" section.
 *
 * Displays the most recent leave application — type, dates, status — and navigates
 * to the leave detail screen on press.
 */
export const HomeLeavePreview = ({ leave }: HomeLeavePreviewProps) => {
  const onPressLeave = () => {
    const { leave_cd, from_dt1, order_dt1 } = leave;
    const pageUrl = PAGE_ROUTES.LEAVE.DETAILS({
      leave_cd,
      from_dt: from_dt1,
      order_dt: order_dt1,
    });
    router.push(pageUrl);
  };

  return (
    <Card variant="default" className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm">
      <TouchableOpacity onPress={onPressLeave} activeOpacity={0.7}>
        <View className="flex-row items-center justify-between">
          <View className="flex-1 flex-row items-center gap-2">
            <Text
              variant="caption-md"
              weight="semibold"
              className="text-on-surface"
              numberOfLines={1}>
              {leave.leave_desc}
            </Text>
            <View
              className={cn('rounded-full px-3 py-1', getStatusColor(leave.verify_flg_desc).bg)}>
              <Text className="text-xs font-semibold">{leave.verify_flg_desc}</Text>
            </View>
          </View>
          <Icon name="chevron-forward" size={18} color="#747686" />
        </View>
        <Text variant="caption-md" className="text-on-surface-variant mt-2">
          {formatDate(leave.from_dt1)} — {formatDate(leave.to_dt1)}
        </Text>
      </TouchableOpacity>
    </Card>
  );
};
