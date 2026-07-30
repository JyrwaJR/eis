import React from 'react';
import { View } from 'react-native';
import { FormProvider, Controller } from 'react-hook-form';
import { Button } from '@components/ui/button';
import { Text } from '@components/ui/text';
import { Input } from '@components/ui/input';
import { useResetPassword } from '../hooks/use-reset-password';

export const ResetPasswordForm = () => {
  const {
    status,
    phone_no,
    passwordMethods,
    otpMethods,
    sendOtpMutation,
    resetPasswordMutation,
    onPasswordSubmit,
    onOtpSubmit,
  } = useResetPassword();

  return (
    <View className="w-full">
      {status === 'INPUT_PASSWORD' && (
        <FormProvider {...passwordMethods}>
          <Controller
            name="password"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <View className="my-2 w-full">
                <Text variant={error ? 'error' : 'label'} weight="medium" className="mb-2 ml-1">
                  New Password
                </Text>
                <Input
                  value={value?.toString()}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="••••••••"
                  secureTextEntry
                  error={!!error}
                />
                {error && (
                  <Text variant="caption-sm" className="ml-1 mt-2 text-destructive">
                    {error.message}
                  </Text>
                )}
              </View>
            )}
          />
          <Controller
            name="confirm_password"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <View className="my-2 w-full">
                <Text variant={error ? 'error' : 'label'} weight="medium" className="mb-2 ml-1">
                  Confirm Password
                </Text>
                <Input
                  value={value?.toString()}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="••••••••"
                  secureTextEntry
                  error={!!error}
                />
                {error && (
                  <Text variant="caption-sm" className="ml-1 mt-2 text-destructive">
                    {error.message}
                  </Text>
                )}
              </View>
            )}
          />

          <Button
            title="Send OTP"
            onPress={passwordMethods.handleSubmit(onPasswordSubmit)}
            isLoading={sendOtpMutation.isPending}
          />
        </FormProvider>
      )}

      {status === 'INPUT_OTP' && (
        <FormProvider {...otpMethods}>
          <View className="mb-4">
            <Text variant="subtext" className="mb-6 text-center">
              OTP sent to {phone_no}
            </Text>

            <Controller
              name="otp"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <View className="my-2 w-full">
                  <Text variant={error ? 'error' : 'label'} weight="medium" className="mb-2 ml-1">
                    Enter OTP
                  </Text>
                  <Input
                    value={value?.toString()}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="123456"
                    keyboardType="number-pad"
                    maxLength={6}
                    className="text-center text-2xl tracking-widest"
                    error={!!error}
                  />
                  {error && (
                    <Text variant="caption-sm" className="ml-1 mt-2 text-destructive">
                      {error.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>

          <Button
            title="Reset Password"
            onPress={otpMethods.handleSubmit(onOtpSubmit)}
            isLoading={resetPasswordMutation.isPending}
          />
        </FormProvider>
      )}
    </View>
  );
};
