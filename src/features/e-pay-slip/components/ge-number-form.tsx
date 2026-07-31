import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Button, Input } from '@components/ui';
import { Container } from '@components/layout';

const GE_NUMBER_REGEX = /^\d+$/;

interface GeNumberFormProps {
  onSubmit: (geNumber: string) => void;
  /** Inline validation / fetch error message. */
  error?: string | null;
}

/**
 * Entry form shown when the signed-in user has no GE number stored.
 * Collects a numeric GE number, strips non-digits on input, and validates
 * before submitting.
 */
export const GeNumberForm = ({ onSubmit, error }: GeNumberFormProps) => {
  const [geNumber, setGeNumber] = useState('');
  const trimmed = geNumber.trim();
  const isValid = GE_NUMBER_REGEX.test(trimmed);

  return (
    <Container className="flex-1 justify-center">
      <View className="gap-y-6 px-2">
        <View className="gap-y-2">
          <Text className="text-2xl font-bold text-foreground">E-Pay Slip</Text>
          <Text className="text-base leading-6 text-graphite">
            Please enter your GE Number to fetch your e-pay slip.
          </Text>
        </View>

        <View className="gap-y-2">
          <Text className="text-sm font-medium text-graphite">GE Number</Text>
          <Input
            value={geNumber}
            onChangeText={(text) => setGeNumber(text.replace(/[^\d]/g, ''))}
            keyboardType="number-pad"
            placeholder="Enter GE number"
            maxLength={10}
            error={!!error}
            autoFocus
          />
          {error && <Text className="text-sm text-destructive">{error}</Text>}
        </View>

        <Button title="Fetch E-Pay Slip" onPress={() => onSubmit(trimmed)} disabled={!isValid} />
      </View>
    </Container>
  );
};
