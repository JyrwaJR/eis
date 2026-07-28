// import React from 'react';
// import { RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
// import { Container } from '@components/layout/container';
// import { useAuthStore } from '@stores/auth.store';
// import {
//   HomeActiveLeaveCard,
//   HomeHeader,
//   HomeLeaveEmptyCard,
//   HomeLeavePreview,
//   HomeQuickActions,
//   HomeScreenSkeleton,
// } from '../components';
// import { Text } from '@components/ui/text';
// import { EmptyScreen } from '@components/screens';
// import { useLeaves } from '@hooks';
// import { isActiveLeave } from '../utils';
// import { router } from 'expo-router';
// import { PAGE_ROUTES } from '@utils/constants/routes';
//
// export const HomeScreen = () => {
//   const { user, isAuthLoading, logout } = useAuthStore();
//   const { data, isFetching, isLoading, refetch } = useLeaves();
//   const isAfterNoon = new Date().getUTCHours() >= 12;
//   const userName = user ? `${user.emp_fname} ${user.emp_lname}` : 'Loading...';
//   const greeting = `${isAfterNoon ? 'Good Afternoon' : 'Good Morning'} · ${user?.emp_dept ?? ''}`;
//
//   if (isLoading || isAuthLoading) return <HomeScreenSkeleton />;
//
//   if (!data) {
//     return (
//       <Container className="flex-1">
//         <HomeHeader userName={userName} greeting={greeting} onLogout={logout} />
//         <EmptyScreen
//           title="Something went wrong"
//           message="Unable to fetch data"
//           refresh={refetch}
//           refreshLabel="Reload"
//         />
//       </Container>
//     );
//   }
//
//   const activeLeaves = data.filter((l) => isActiveLeave(l));
//   const otherLeaves = data.filter((l) => !isActiveLeave(l));
//
//   return (
//     <Container className="flex-1">
//       <HomeHeader userName={userName} greeting={greeting} onLogout={logout} />
//
//       <ScrollView
//         className="flex-1 px-5"
//         contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}
//         refreshControl={<RefreshControl onRefresh={refetch} refreshing={isFetching} />}>
//         {/* Active Applications section — shown before Quick Actions per EIS design */}
//         <View className="mb-6">
//           <Text variant="display-xs" className="text-on-surface mb-4">
//             Active Applications
//           </Text>
//           {activeLeaves.length > 0 ? (
//             activeLeaves.map((item) => (
//               <View key={item.leave_cd} className="mb-3">
//                 <HomeActiveLeaveCard leave={item} />
//               </View>
//             ))
//           ) : (
//             <Text variant="caption-md" className="text-on-surface-variant">
//               No active applications
//             </Text>
//           )}
//         </View>
//
//         {/* Quick Actions section */}
//         <View className="mb-6">
//           <Text variant="display-xs" className="text-on-surface mb-4">
//             Quick Actions
//           </Text>
//           <HomeQuickActions />
//         </View>
//
//         {/* Recent History section */}
//         <View className="mb-6">
//           <View className="mb-4 flex-row items-center justify-between">
//             <Text variant="display-xs" className="text-on-surface">
//               Recent History
//             </Text>
//             <TouchableOpacity
//               onPress={() => router.push(PAGE_ROUTES.LEAVE.INDEX)}
//               activeOpacity={0.7}>
//               <Text variant="caption-md" className="font-semibold text-primary">
//                 View All
//               </Text>
//             </TouchableOpacity>
//           </View>
//           {otherLeaves.length > 0 ? (
//             <HomeLeavePreview leave={otherLeaves[0]} />
//           ) : (
//             <HomeLeaveEmptyCard />
//           )}
//         </View>
//       </ScrollView>
//     </Container>
//   );
// };
// HomeScreen.tsx

import { Container } from '@components/layout';
import {
  CalendarIcon,
  CalendarUserIcon,
  DocumentAttachmentIcon,
  HelpSquareIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useAuthStore } from '@stores/auth.store';
import { cn, getStatusColor } from '@utils/helpers';
import React from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';

const activeApplications = [
  {
    title: 'Sick Leave',
    date: '01/06/2026 - 03/06/2026',
    status: 'Pending',
  },
  {
    title: 'Casual Leave',
    date: '10/06/2026',
    status: 'Verified',
  },
];

const quickActions = [
  {
    title: 'Apply Leave',
    icon: CalendarUserIcon,
    primary: true,
  },
  {
    title: 'Holiday List',
    icon: CalendarIcon,
  },
  {
    title: 'Pay Slips',
    icon: DocumentAttachmentIcon,
  },
  {
    title: 'Support',
    icon: HelpSquareIcon,
  },
];

const history = [
  {
    title: 'Earned Leave',
    date: '15/04/2026 - 20/04/2026',
    status: 'Approved',
  },
  {
    title: 'Compensatory Off',
    date: '02/03/2026',
    status: 'Approved',
  },
];

export function HomeScreen() {
  const { user } = useAuthStore();
  return (
    <Container>
      <ScrollView className="flex-1">
        {/* Welcome */}

        <Text className="text-2xl font-bold">
          Welcome, {user?.emp_fname} {user?.emp_lname}
        </Text>

        <Text className="mt-1 text-gray-500">IT Department</Text>

        {/* Active Applications */}

        <Text className="mb-3 mt-8 text-lg font-semibold">Active Applications</Text>

        {activeApplications.map((item, index) => (
          <View key={index} className="mb-3 rounded-md border border-gray-200 bg-white p-4">
            <View className="flex-row justify-between">
              <View>
                <Text className="font-semibold text-primary">{item.title}</Text>

                <Text className="mt-1 text-gray-500">{item.date}</Text>
              </View>

              <View
                className={cn(
                  'items-center justify-center rounded-md px-3 py-1',
                  getStatusColor(item.status).bg
                )}>
                <Text>{item.status}</Text>
              </View>
            </View>
          </View>
        ))}

        {/* Quick Actions */}

        <Text className="mb-3 mt-6 text-lg font-semibold">Quick Actions</Text>

        <View className="flex-row flex-wrap justify-between">
          {quickActions.map((item, index) => (
            <Pressable
              key={index}
              className={`mb-4 h-28 w-[48%] items-center justify-center rounded-md ${
                item.primary ? 'bg-primary' : 'border border-gray-200 bg-white'
              }`}>
              <HugeiconsIcon icon={item.icon} size={28} color={item.primary ? '#fff' : '#0036a4'} />

              <Text
                className={`mt-2 font-semibold ${item.primary ? 'text-white' : 'text-primary'}`}>
                {item.title}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* History */}

        <View className="mt-4 flex-row items-center justify-between">
          <Text className="text-lg font-semibold">Recent History</Text>

          <Text className="text-primary">View All</Text>
        </View>

        {history.map((item, index) => (
          <View
            key={index}
            className="flex-row items-center justify-between border-b border-gray-200 py-4">
            <View>
              <Text>{item.title}</Text>

              <Text className="text-gray-500">{item.date}</Text>
            </View>

            <Text className="text-green-600">{item.status}</Text>
          </View>
        ))}
      </ScrollView>
    </Container>
  );
}
