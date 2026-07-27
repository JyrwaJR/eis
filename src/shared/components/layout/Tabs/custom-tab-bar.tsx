import { TouchableOpacity, View } from 'react-native';
import { Text } from '@components/ui/text';
import { Icon } from '@components/ui/icon';
import { TabRouteT } from '@sharedTypes/tab';
import { cn } from '@utils/helpers/cn';
import color from 'tailwindcss/colors';

export const CustomTabBar = ({
  state,
  descriptors,
  navigation,
  insets,
  tabConfig,
}: any & { tabConfig: TabRouteT[] }) => {
  const primary = color.blue[500];
  const gray500 = color.gray[500];
  return (
    <View
      className="flex-row items-center justify-center gap-0 border-t border-border bg-background px-4 py-2 shadow-sm dark:border-gray-700 dark:bg-gray-900"
      style={{ paddingBottom: insets.bottom + 8 }}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const config = tabConfig.find((t: TabRouteT) => t.name === route.name);
        const iconName = config?.icon || 'help-circle-outline';
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

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.7}
            testID={`TAB_${route.name.toUpperCase().replace('INDEX', 'HOME')}`}
            className="flex-1 items-center justify-center p-2">
            <Icon name={iconName} size={24} color={isFocused ? primary : gray500} />
            <Text
              size="xs"
              className={cn(
                isFocused ? 'font-semibold' : 'font-medium',
                isFocused ? `text-primary` : `text-muted-foreground`
              )}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
