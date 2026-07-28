import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@components/ui/icon';
import { Text } from '@components/ui/text';

interface HomeHeaderProps {
  /** User's full name — shown in welcome greeting. */
  userName: string;
  /** Greeting subtitle — e.g. "Good Morning · IT Department". */
  greeting: string;
  /** Logout callback. */
  onLogout: () => void;
}

/**
 * Home screen header with government branding.
 *
 * Layout:
 * - 6px Indian tricolor strip (saffron/white/green) at the very top
 * - "Gov Portal" branded row with bank icon and logout button
 * - Welcome greeting with user name and department
 */
export const HomeHeader = ({ userName, greeting, onLogout }: HomeHeaderProps) => (
  <View className="bg-surface">
    {/* Tricolor branding strip */}
    <View className="h-[6px] flex-row">
      <View className="flex-1 bg-[#FF9933]" />
      <View className="flex-1 bg-white" />
      <View className="flex-1 bg-[#138808]" />
    </View>

    {/* Gov Portal header row */}
    <SafeAreaView edges={['top']} className="bg-surface">
      <View className="mx-5 h-[60px] flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Icon name="business-outline" size={24} color="#024ad8" />
          <Text variant="heading" size="lg" weight="semibold" className="text-primary">
            Gov Portal
          </Text>
        </View>
        <TouchableOpacity
          onPress={onLogout}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Icon name="log-out-outline" size={22} color="#434655" />
        </TouchableOpacity>
      </View>

      {/* Welcome greeting */}
      <View className="mx-5 mb-4">
        <Text variant="display-xs" className="text-on-surface">
          Welcome, {userName}
        </Text>
        <Text variant="caption-md" className="text-on-surface-variant mt-1">
          {greeting}
        </Text>
      </View>
    </SafeAreaView>
  </View>
);
