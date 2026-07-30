import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { cn } from '@utils/helpers/cn';

type Props = {
  selected: boolean;
  year: string;
  onPress: () => void;
};

export const YearFilter = ({ selected, year, onPress }: Props) => (
  <TouchableOpacity
    onPress={onPress}
    className={cn(
      'mr-3 rounded-md border px-5 py-2',
      selected ? 'border-blue-600 bg-blue-600' : 'border-border bg-card'
    )}>
    <Text className={cn('text-sm font-semibold', selected ? 'text-white' : 'text-charcoal')}>
      {year}
    </Text>
  </TouchableOpacity>
);
