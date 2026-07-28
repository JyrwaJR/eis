import { Container } from '@components/layout';
import { useLeaves } from '@hooks';
import {
  CalendarIcon,
  CalendarUserIcon,
  DocumentAttachmentIcon,
  HelpSquareIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useAuthStore } from '@stores/auth.store';
import { PAGE_ROUTES } from '@utils/constants';
import { cn, getStatusColor } from '@utils/helpers';
import { Link } from 'expo-router';
import React from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { isActiveLeave } from '../utils';

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
    title: 'Salary Statements',
    icon: DocumentAttachmentIcon,
  },
  {
    title: 'Support',
    icon: HelpSquareIcon,
    primary: true,
  },
];

export function HomeScreen() {
  const { user } = useAuthStore();
  const { data: leaves } = useLeaves();
  const activeLeaves = leaves?.filter((leave) => isActiveLeave(leave));

  const leaveHistory = leaves?.filter((leave) => !isActiveLeave(leave));

  return (
    <Container>
      <ScrollView className="flex-1">
        {/* Welcome */}

        <Text className="text-2xl font-bold">
          Welcome, {user?.emp_fname} {user?.emp_mname} {user?.emp_lname}
        </Text>

        <Text className="mt-1 text-gray-500">IT Department</Text>

        {/* Active Applications */}

        <Text className="mb-3 mt-8 text-lg font-semibold">Active Applications</Text>

        {activeLeaves.map((item, index) => (
          <View key={index} className="mb-3 rounded-md border border-gray-200 bg-white p-4">
            <View className="flex-row justify-between">
              <View>
                <Text className="font-semibold text-primary">{item.leave_desc}</Text>

                <Text className="mt-1 text-gray-500">{item.from_dt1}</Text>
              </View>

              <View
                className={cn(
                  'items-center justify-center rounded-md px-3 py-1',
                  getStatusColor(item.verify_flg_desc).bg
                )}>
                <Text>{item.verify_flg_desc}</Text>
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

          <Link href={PAGE_ROUTES.LEAVE.INDEX} asChild>
            <Text className="text-primary">View All</Text>
          </Link>
        </View>

        {leaveHistory.map((item, index) => (
          <View
            key={index}
            className="flex-row items-center justify-between border-b border-gray-200 py-4">
            <View>
              <Text>{item.reason_for_leave}</Text>

              <View className="flex-1 flex-row gap-x-2">
                <Text className="text-gray-500">{item.from_dt1}</Text>
                <Text className="text-gray-500">-</Text>

                <Text className="text-gray-500">{item.to_dt1}</Text>
              </View>
            </View>

            <Text className={getStatusColor(item.verify_flg_desc).text}>
              {item.verify_flg_desc}
            </Text>
          </View>
        ))}
      </ScrollView>
    </Container>
  );
}
