import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Icon } from '@components/ui/icon';
import { Text } from '@components/ui/text';
import { Route, router } from 'expo-router';
import { HOME_QUICK_ACTIONS } from '@features/home/utils/constants';

/**
 * Quick-action shortcut buttons displayed in a 2x2 grid.
 *
 * Each action shows a rounded icon button with a centered icon and label below.
 * Matches the EIS design — 44px minimum touch targets, 16px card radius.
 */
export const HomeQuickActions = () => {
  const topRow = HOME_QUICK_ACTIONS.slice(0, 2);
  const bottomRow = HOME_QUICK_ACTIONS.slice(2, 4);

  const renderAction = (action: (typeof HOME_QUICK_ACTIONS)[number]) => (
    <TouchableOpacity
      key={action.label}
      onPress={() => action.route && router.push(action.route as Route)}
      activeOpacity={0.7}
      className="flex-1 items-center">
      <View className="mb-2 h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
        <Icon name={action.icon} size={26} color="#024ad8" />
      </View>
      <Text variant="caption-md" className="text-on-surface-variant text-center font-medium">
        {action.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="mx-5">
      <Text variant="display-xs" className="text-on-surface mb-4">
        Quick Actions
      </Text>
      <View className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm">
        <View className="mb-6 flex-row justify-between gap-4">{topRow.map(renderAction)}</View>
        <View className="flex-row justify-between gap-4">{bottomRow.map(renderAction)}</View>
      </View>
    </View>
  );
};
