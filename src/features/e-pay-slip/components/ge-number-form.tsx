import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  ArrowRight01Icon,
  HelpCircleIcon,
  DocumentAttachmentIcon,
  HashtagIcon,
} from '@hugeicons/core-free-icons';
import { Container, KeyboardSafeView } from '@components/layout';
import { Input, Button } from '@components/ui';

const GE_NUMBER_REGEX = /^\d+$/;

interface GeNumberFormProps {
  onSubmit: (geNumber: string) => void;
  /** Inline validation / fetch error message. */
  error?: string | null;
}

/**
 * Entry form shown when the signed-in user has no GE number stored.
 * Collects a numeric GE number, strips non-digits on input, and validates
 * before submitting. Layout follows the E-Pay Slip design mockup: graphic
 * badge, header copy, input card with trailing tag icon and the primary
 * fetch action with an arrow affordance.
 */
export const GeNumberForm = ({ onSubmit, error }: GeNumberFormProps) => {
  const [geNumber, setGeNumber] = useState('');
  const trimmed = geNumber.trim();
  const isValid = GE_NUMBER_REGEX.test(trimmed);

  const hasInput = geNumber.length > 0;

  return (
    <Container className="flex-1">
      <KeyboardSafeView contentContainerClassName="flex-1 justify-center">
        {/* Graphic Element */}
        <View className="mb-8 w-full flex-row justify-center">
          <View className="h-32 w-32 items-center justify-center rounded-full bg-primary/5">
            <HugeiconsIcon icon={DocumentAttachmentIcon} size={52} color="#2563eb" />
          </View>
        </View>

        {/* Header Text */}
        <View className="mb-8 items-center">
          <Text className="mb-2 text-2xl font-bold">E-Pay Slip</Text>
          <Text className="max-w-[280px] text-center text-base text-graphite">
            Please enter your GE Number to fetch your e-pay slip.
          </Text>
        </View>

        {/* Input Card */}
        <View className="rounded-md border border-border bg-white p-4">
          <Text className="mb-1.5 text-sm font-medium">GE Number</Text>

          <View className="relative mb-1.5 justify-center">
            <Input
              placeholder="Enter GE number"
              placeholderTextColor="#9ca3af"
              keyboardType="number-pad"
              maxLength={10}
              autoFocus
              value={geNumber}
              onChangeText={(text) => setGeNumber(text.replace(/[^\d]/g, ''))}
            />
            <View className="pointer-events-none absolute right-4 justify-center">
              <HugeiconsIcon
                icon={HashtagIcon}
                size={20}
                color={hasInput ? '#2563eb' : '#9ca3af'}
              />
            </View>
          </View>

          {error ? <Text className="mb-2 text-xs text-destructive">{error}</Text> : null}

          <Text className="mb-5 text-xs text-graphite">
            Your 8-digit unique Government Employee ID.
          </Text>

          <Button
            activeOpacity={0.8}
            disabled={!isValid}
            size={'lg'}
            onPress={() => onSubmit(trimmed)}
            accessibilityRole="button">
            <Text className="mr-2 text-sm font-semibold uppercase tracking-wide text-white">
              Fetch E-Pay Slip
            </Text>
            <HugeiconsIcon icon={ArrowRight01Icon} size={20} className="text-white" />
          </Button>
        </View>

        {/* Help Section */}
        <View className="mt-8 items-center">
          <TouchableOpacity
            disabled
            className="flex-row items-center justify-center disabled:opacity-50"
            activeOpacity={0.7}>
            <View className="mr-2">
              <HugeiconsIcon icon={HelpCircleIcon} size={20} className="text-primary" />
            </View>
            <Text className="text-base font-medium text-primary">Forgot your GE Number?</Text>
          </TouchableOpacity>
        </View>
      </KeyboardSafeView>
    </Container>
  );
};
