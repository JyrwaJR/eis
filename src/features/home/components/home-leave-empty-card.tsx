import React from 'react';
import { View } from 'react-native';
import { Card, CardContent } from '@components/ui/card';
import { Text } from '@components/ui/text';
import { Icon } from '@components/ui/icon';

/**
 * Empty-state card for the Recent History section.
 *
 * Shown when the user has no leave history, styled per EIS design tokens.
 */
export const HomeLeaveEmptyCard = () => (
  <Card variant="default" className="bg-surface-container-lowest rounded-2xl shadow-sm">
    <CardContent className="p-4">
      <View className="flex-row items-center gap-3">
        <Icon name="calendar-number-outline" size={22} color="#747686" />
        <Text variant="caption-md" className="text-on-surface-variant">
          No leave history
        </Text>
      </View>
    </CardContent>
  </Card>
);
