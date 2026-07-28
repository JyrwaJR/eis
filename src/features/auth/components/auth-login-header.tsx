import React from 'react';
import { View } from 'react-native';
import { Text } from '@components/ui/text';
import { Icon } from '@components/ui/icon';

interface AuthLoginHeaderProps {
  title: string;
  subtitle?: string;
}

/**
 * Renders a 6px Indian tricolor gradient strip (saffron, white, green).
 */
const TricolorStrip = () => (
  <View className="h-[6px] w-full flex-row">
    <View className="flex-1 bg-[#FF9933]" />
    <View className="flex-1 bg-white" />
    <View className="flex-1 bg-[#138808]" />
  </View>
);

/**
 * Branded login header matching the Stitch mockup.
 *
 * Renders:
 * 1. Indian tricolor gradient strip (6px)
 * 2. Institutional branding bar (60px) with `business-outline` icon
 *    and "GovAuth India" heading
 * 3. Centered page title and subtitle
 *
 * This component is auth-screen-specific and intentionally does NOT replace
 * the shared `GovtHeader` component used on other screens.
 *
 * @example
 * ```tsx
 * <AuthLoginHeader title="Authentication" subtitle="Please sign in to continue" />
 * ```
 */
export const AuthLoginHeader = ({ title, subtitle }: AuthLoginHeaderProps) => (
  <View>
    <TricolorStrip />
    <View className="h-[60px] flex-row items-center border-b border-[#c3c5d7] bg-white px-5 dark:border-gray-700 dark:bg-gray-900">
      <Icon name="business-outline" size={22} color="#024ad8" />
      <Text className="ml-2 text-display-xs font-bold text-[#024ad8]">GovAuth India</Text>
    </View>
    <View className="mb-8 mt-8 items-center">
      <Text variant="display-xs" className="mb-2 text-center">
        {title}
      </Text>
      {subtitle && (
        <Text variant="body-md" className="text-center text-muted-foreground">
          {subtitle}
        </Text>
      )}
    </View>
  </View>
);
