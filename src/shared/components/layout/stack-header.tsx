import React, { memo, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@hooks/use-theme';
import { useRoutePath } from '@hooks/use-route-path';
import { matchPageHeader, cn } from '@utils/helpers';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { TricolorStrip } from '@components/common/tricolor';
import { ArrowLeft02FreeIcons } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';

export const StackHeader = memo(() => {
  const path = useRoutePath();
  const config = useMemo(() => matchPageHeader(path), [path]);
  const router = useRouter();
  const navigation = useNavigation();
  const theme = useTheme();
  const isDark = theme === 'dark';
  const iconColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const insets = useSafeAreaInsets();
  const canGoBack = navigation.canGoBack();

  const handleBack = useCallback(() => router.back(), [router]);

  if (!config) return null;

  const showBack = config.showBackButton && canGoBack;

  const showDrawer = config.showDrawer;
  const isShowButton = showBack || showDrawer;

  return (
    <>
      <View
        className={cn('border-b border-gray-300 bg-stone-50 dark:border-gray-700 dark:bg-gray-900')}
        style={{ paddingTop: insets.top }}>
        <TricolorStrip />
        <View className="min-h-[56px] flex-row items-center justify-between gap-x-3 p-3">
          {isShowButton && (
            <View className="flex-row items-center justify-start">
              {showDrawer ? (
                <DrawerToggleButton tintColor={iconColor} />
              ) : (
                showBack && (
                  <TouchableOpacity
                    onPress={handleBack}
                    hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                    activeOpacity={0.7}>
                    <HugeiconsIcon
                      icon={ArrowLeft02FreeIcons}
                      strokeWidth={2}
                      size={26}
                      className="text-primary"
                    />
                  </TouchableOpacity>
                )
              )}
            </View>
          )}

          <View className="flex-[3] items-center justify-center">
            <Text className="text-2xl font-black leading-loose tracking-widest text-primary">
              {config.title}
            </Text>
          </View>

          <View className="flex-1 flex-row items-center justify-end" />
        </View>

        {config.bottomContent && <View className="px-4 pb-3">{config.bottomContent}</View>}
      </View>
    </>
  );
});

StackHeader.displayName = 'StackHeader';
