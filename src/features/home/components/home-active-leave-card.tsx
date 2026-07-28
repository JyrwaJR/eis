import React from 'react';
import { View } from 'react-native';
import { Card, CardContent } from '@components/ui/card';
import { Text } from '@components/ui/text';
import { Icon } from '@components/ui/icon';
import { cn } from '@utils/helpers/cn';
import type { LeaveListItem } from '@sharedTypes/leave';
import { formatDate } from '@utils/formatters/formatters';
import { getStatusColor } from '@utils/helpers';

interface HomeActiveLeaveCardProps {
  leave: LeaveListItem;
}

/**
 * Active leave card displayed in the "Active Applications" section.
 *
 * Shows leave type, date range, status badge, and duration.
 * Styled per EIS design: white card, 16px radius, soft shadow, pill-shaped status badge.
 */
export const HomeActiveLeaveCard = ({ leave }: HomeActiveLeaveCardProps) => (
  <Card variant="default" className="bg-surface-container-lowest mb-3 rounded-2xl shadow-sm">
    <CardContent className="p-4">
      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Icon name="umbrella" size={20} color="#024ad8" />
          <Text variant="caption-md" weight="semibold" className="text-on-surface">
            {leave.leave_cd}
          </Text>
        </View>
        <View className={cn('rounded-full px-3 py-1', getStatusColor(leave.verify_flg_desc).bg)}>
          <Text className="text-xs font-semibold">{leave.verify_flg_desc}</Text>
        </View>
      </View>
      <View className="flex-row items-center justify-between">
        <Text variant="caption-md" className="text-on-surface-variant">
          {formatDate(leave.from_dt1)} — {formatDate(leave.to_dt1)}
        </Text>
        <Text variant="caption-md" weight="bold" className="text-on-surface">
          {leave.no_days} {parseInt(leave.no_days) === 1 ? 'day' : 'days'}
        </Text>
      </View>
    </CardContent>
  </Card>
);
