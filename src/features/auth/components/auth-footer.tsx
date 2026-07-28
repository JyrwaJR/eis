import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@components/ui/text';
import { cn } from '@utils/helpers/cn';

interface AuthFooterProps {
  text: string;
  linkText: string;
  linkHref: any;
  testID?: string;
  className?: string;
  replace?: boolean;
}

export const AuthFooter = ({
  text,
  linkText,
  linkHref,
  testID,
  className,
  replace,
}: AuthFooterProps) => (
  <View className={cn('mt-10 flex-row items-center justify-center', className)}>
    <Text variant="subtext">{text} </Text>
    <TouchableOpacity
      hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
      testID={testID}
      onPress={() => {
        if (replace) {
          router.replace(linkHref);
        } else {
          router.push(linkHref);
        }
      }}>
      <Text variant="link" weight="semibold" className="underline underline-offset-2">
        {linkText}
      </Text>
    </TouchableOpacity>
  </View>
);
