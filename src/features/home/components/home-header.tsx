import React from 'react';
import { View } from 'react-native';
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
export const HomeHeader = ({ userName, greeting }: HomeHeaderProps) => (
  <View className="bg-surface">
    {/* Gov Portal header row */}
    {/* Welcome greeting */}
    <View className="mx-5 mb-4">
      <Text variant="display-xs" className="text-on-surface">
        Welcome, {userName}
      </Text>
      <Text variant="caption-md" className="text-on-surface-variant mt-1">
        {greeting}
      </Text>
    </View>
  </View>
);
