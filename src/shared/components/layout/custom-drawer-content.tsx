import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { Link, Route, usePathname } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pressable, View, Text } from 'react-native';
import { cn } from '@utils/helpers/cn';
// import { Icon } from '@components/ui';
import { IoniconsIconName } from '@react-native-vector-icons/ionicons';
import { useAuthStore } from '@stores/auth.store';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { getDrawerIcons } from '@utils/helpers/get-icon';

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

  const menuItems = empType === 'DC' ? dcMenuItems : dbMenuItems;

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        paddingTop: insets.top,
        flex: 1,
      }}
      className="bg-stone">
      <View className="mb-6 flex-col items-center justify-center gap-y-3 pt-4">
        <Text className={cn('text-center text-3xl font-black tracking-[2px] text-primary')}>
          {process.env.EXPO_PUBLIC_APP_NAME}
        </Text>
        <Text className={cn('text-center text-lg font-medium tracking-widest text-gray-500')}>
          Meghalaya Employees Information System
        </Text>
      </View>

      <View className="flex-1 flex-col gap-2 px-3">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href;
          const icon = getDrawerIcons(item.href);
          const isShowDivider = index < menuItems.length - 1;
          return (
            <React.Fragment key={index}>
              <Link key={item.title + item.href} href={item.href} asChild>
                <Pressable className={cn('flex-row items-center gap-2 rounded-md p-4')}>
                  <HugeiconsIcon
                    icon={icon}
                    size={24}
                    className={cn(isActive ? 'text-primary' : 'text-black')}
                  />

                  <Text
                    className={cn(
                      'ml-2 text-lg',
                      isActive ? 'font-bold text-primary' : 'font-semibold text-black'
                    )}>
                    {item.title}
                  </Text>
                </Pressable>
              </Link>
              {isShowDivider && <View className="h-0.5 w-full bg-border" />}
            </React.Fragment>
          );
        })}
      </View>
    </DrawerContentScrollView>
  );
}
