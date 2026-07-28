import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { Link, Route, usePathname } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pressable, View } from 'react-native';
import { cn } from '@utils/helpers/cn';
// import { Icon } from '@components/ui';
import { IoniconsIconName } from '@react-native-vector-icons/ionicons';
import { Text } from '@components/ui/text';
import color from 'tailwindcss/colors';
import { useTheme } from '@hooks/use-theme';
import { useAuthStore } from '@stores/auth.store';

export type MenuItemsT = {
  id?: number;
  title: string;
  href: Route;
  icon: IoniconsIconName;
};

const fotterMenuItems: MenuItemsT[] = [
  { title: 'Settings', href: '/settings' as Route, icon: 'settings-outline' },
];

const commonMenuItems: MenuItemsT[] = [
  { title: 'Home', href: '/' as Route, icon: 'home-outline' },
  { title: 'Announcements', href: '/announcements' as Route, icon: 'home-outline' },
  // { title: 'Income Tax', href: '/tax' as Route, icon: 'cash-outline' },
];

const dbMenuItems: MenuItemsT[] = [
  ...commonMenuItems,
  { title: 'GPF Statements', href: '/gpf-statements' as Route, icon: 'cash' },
  ...fotterMenuItems,
];

const dcMenuItems: MenuItemsT[] = [
  ...commonMenuItems,
  { title: 'NPS Statements', href: '/nps-statements' as Route, icon: 'cash-sharp' },
  ...fotterMenuItems,
];

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { user } = useAuthStore();
  const empType = user?.emp_type;
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const gray900 = color.gray[900];
  const theme = useTheme();
  const isDark = theme === 'dark';
  // const iconColor = isDark ? color.white : color.black;
  // const iconActiveColor = isDark ? color.blue[500] : color.blue[400];

  const menuItems = empType === 'dc' ? dcMenuItems : dbMenuItems;

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        paddingTop: insets.top,
        flex: 1,
        backgroundColor: isDark ? gray900 : '#ffffff',
      }}
      className="bg-background dark:bg-gray-900">
      <View className="mb-6 flex-row items-center justify-center pt-4">
        <Text className={cn('text-center text-4xl font-semibold')}>
          {process.env.EXPO_PUBLIC_APP_NAME}
        </Text>
      </View>

      <View className="flex-1 flex-col gap-2 px-3">
        {menuItems.map((item, i) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.title + item.href} href={item.href} asChild>
              <Pressable
                className={cn(
                  'flex-row items-center gap-2 rounded-md p-4',
                  isActive ? 'border border-blue-500 bg-transparent' : 'bg-transparent'
                )}>
                {/* <Icon name={item.icon} size={24} color={isActive ? iconActiveColor : iconColor} /> */}

                <Text
                  className={cn(
                    'ml-2',
                    isActive
                      ? 'text-lg font-bold text-blue-500 dark:text-blue-400'
                      : 'text-base font-semibold'
                  )}>
                  {`${i + 1}. ${item.title}`}
                </Text>
              </Pressable>
            </Link>
          );
        })}
      </View>
    </DrawerContentScrollView>
  );
}
