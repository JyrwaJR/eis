import { TouchableOpacity, View, Text } from 'react-native';
import { TabRouteT } from '@sharedTypes/tab';
import { cn } from '@utils/helpers/cn';
import { HugeiconsIcon } from '@hugeicons/react-native';
import React from 'react';
import { getTabIcons } from '@utils/helpers/get-icon';

export const CustomTabBar = ({
  state,
  descriptors,
  navigation,
  insets,
  tabConfig,
}: any & { tabConfig: TabRouteT[] }) => {
  return (
    <View
      className="flex-row items-center justify-between gap-0 border-t border-border bg-background px-4 py-2 shadow-sm dark:border-gray-700 dark:bg-gray-900"
      style={{ paddingBottom: insets.bottom + 6 }}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const config = tabConfig.find((t: TabRouteT) => t.name === route.name);
        const label =
          (options.tabBarLabel as string) || options.title || config?.title || route.name;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const icon = getTabIcons(route.name);

        const isShowDivider = index < state.routes.length - 1;
        return (
          <React.Fragment key={route.key}>
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.7}
              testID={`TAB_${route.name.toUpperCase().replace('INDEX', 'HOME')}`}
              className={cn(
                'mx-2 flex-1 items-center justify-center gap-2 rounded-md p-2',
                isFocused ? 'border border-primary bg-primary/20' : ''
              )}>
              <HugeiconsIcon
                className={cn(isFocused ? 'text-primary' : 'text-black')}
                icon={icon}
                size={24}
              />
              <Text
                className={cn(
                  isFocused ? 'text-md font-bold text-primary' : 'font-semibold text-black'
                )}>
                {label}
              </Text>
            </TouchableOpacity>
            {isShowDivider && <View className="h-full w-[1px] bg-gray-300" />}
          </React.Fragment>
        );
      })}
    </View>
  );
};
