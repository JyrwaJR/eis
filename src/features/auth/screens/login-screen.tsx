import React from 'react';
import { View, TouchableOpacity, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Text } from '@components/ui/text';
import { Container, KeyboardSafeView } from '@components/layout';
import { LoginSchema } from '../validators/login.schema';
import { PAGE_ROUTES } from '@utils/constants/routes';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Icon } from '@components/ui/icon';
import { useLoginMutation } from '../hooks/use-login-mutation';
import { useAuthStore } from '@stores/auth.store';
import { AuthFooter, AuthLoginHeader } from '../components';
import { LoginScreenSkeleton } from '../components/skeleton';
import { useGetOAuthToken } from '../hooks/use-get-oauth-token';
import { toast } from 'sonner-native';
import { useRateLimit } from '@hooks';
import { useSnackbar } from '@hooks/use-snackbar';

/** Form field values inferred from the `LoginSchema` Zod validation schema. */
type LoginFormInputs = z.infer<typeof LoginSchema>;

/**
 * Default values for the login form.
 *
 * Reads pre-filled credentials from environment variables for development
 * convenience (`EXPO_PUBLIC_EMP_CD` and `EXPO_PUBLIC_PASSWORD`). Falls back
 * to empty strings when the environment variables are not set.
 */
const formDefaultValue: LoginFormInputs = {
  emp_cd: process.env.EXPO_PUBLIC_EMP_CD || '',
  password: process.env.EXPO_PUBLIC_PASSWORD || '',
};

/**
 * The primary login screen displayed to unauthenticated users.
 *
 * Authentication flow:
 *   1. **OAuth token acquisition (eager)** — On mount, the screen immediately
 *      starts fetching an OAuth bearer token via `useGetOAuthToken`. This
 *      happens in parallel with the user filling out the form so the token
 *      is typically ready by the time they tap "Continue".
 *   2. **Credential validation** — Submits the employee code and password
 *      via `useLoginMutation` using the already-acquired OAuth token. The
 *      `onSubmit` handler is gated on token readiness.
 *
 * ### Rate limiting
 *
 * A sliding-window rate limiter guards the submit handler, allowing only
 * **1 submission per 10 seconds**. When the limit is active the button
 * displays cooldown state and the handler returns early.
 *
 * ### Edge cases
 *
 * - **Already signed in** — The submit button is disabled when
 *   `isSignedIn` is `true` to prevent duplicate submissions.
 * - **OAuth token still loading** — If the user taps "Continue" before the
 *   OAuth token is ready, a snackbar message asks them to wait.
 * - **OAuth token failed** — The button label changes to "Retry Connection".
 *   Tapping retries the OAuth fetch.
 * - **Login API errors** — Backend validation errors are surfaced via
 *   `toast.error()`.
 * - **Developer mode** — A link to the UI Laboratory is rendered below
 *   the form when `__DEV__` is `true`, toggled via `EXPO_PUBLIC_APP_ENV`.
 *
 * @example
 * ```tsx
 * <LoginScreen />
 * ```
 */
export const LoginScreen = () => {
  const { isSignedIn, isAuthLoading } = useAuthStore();
  const { startCooldown, isLimited } = useRateLimit('LOGIN_BUTTON_RATE_LIMIT', {
    limit: 1,
    ms: 10000,
  });

  const { showSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = React.useState(false);

  const methods = useForm<LoginFormInputs>({
    resolver: zodResolver(LoginSchema),
    defaultValues: formDefaultValue,
    shouldFocusError: true,
    shouldUnregister: true,
  });

  const { mutate: loginMutate, isPending: isLoginPending } = useLoginMutation();

  const {
    refetch: fetchOAuthToken,
    isLoading: isOAuthFetching,
    isSuccess: isTokenReady,
    isError: isOAuthError,
  } = useGetOAuthToken();

  // Pre-fetch OAuth token eagerly on mount — parallel with user input
  React.useEffect(() => {
    if (!isTokenReady && !isOAuthFetching && !isOAuthError) {
      fetchOAuthToken();
    }
  }, [fetchOAuthToken, isTokenReady, isOAuthFetching, isOAuthError]);

  const onSubmit = (data: LoginFormInputs) => {
    if (isLimited) return;

    // If the OAuth token fetch failed, retry on button tap
    if (isOAuthError) {
      fetchOAuthToken();
      return;
    }

    // If the OAuth token is still being fetched, inform the user
    if (!isTokenReady) {
      showSnackbar('Preparing authentication, please wait...');
      return;
    }

    startCooldown();

    loginMutate(data, {
      onSuccess: (sData) => {
        if (sData.success) {
          showSnackbar(sData.message);
          return sData;
        }
        toast.error(sData.message);
        return sData;
      },
    });
  };

  // Only show skeleton during cold-start auth hydration
  if (isAuthLoading) return <LoginScreenSkeleton />;

  const isButtonLoading = isOAuthFetching || isLoginPending;

  return (
    <Container className="p-0">
      <KeyboardSafeView>
        <AuthLoginHeader title="Authentication" subtitle="Please sign in to continue" />

        {/* Form Section */}
        <FormProvider {...methods}>
          <View className="flex-1 px-5">
            {/* Employee Code */}
            <View className="my-2 w-full">
              <Text
                variant={methods.formState.errors.emp_cd ? 'error' : 'label'}
                weight="medium"
                className="mb-2 ml-1">
                Employee Code
              </Text>
              <View className="relative">
                <View className="absolute left-3 top-0 z-10 h-[44px] justify-center">
                  <Icon name="card-outline" size={20} color="#747686" />
                </View>
                <Controller
                  name="emp_cd"
                  control={methods.control}
                  render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <Input
                      value={value?.toString()}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={!!error}
                      placeholder="Enter your code"
                      keyboardType="default"
                      autoCapitalize="none"
                      autoCorrect={false}
                      testID="PHONE_INPUT"
                      returnKeyType="next"
                      className="pl-10"
                    />
                  )}
                />
              </View>
              {methods.formState.errors.emp_cd?.message && (
                <Text variant="caption-sm" className="ml-1 mt-2 text-destructive">
                  {methods.formState.errors.emp_cd.message}
                </Text>
              )}
            </View>

            {/* Password */}
            <View className="my-2 w-full">
              <Text
                variant={methods.formState.errors.password ? 'error' : 'label'}
                weight="medium"
                className="mb-2 ml-1">
                Password
              </Text>
              <View className="relative">
                <View className="absolute left-3 top-0 z-10 h-[44px] justify-center">
                  <Icon name="lock-closed-outline" size={20} color="#747686" />
                </View>
                <Controller
                  name="password"
                  control={methods.control}
                  render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <Input
                      value={value?.toString()}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={!!error}
                      placeholder="Enter password"
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      spellCheck={false}
                      autoComplete="password"
                      returnKeyType="done"
                      onSubmitEditing={methods.handleSubmit(onSubmit)}
                      testID="PASSWORD_INPUT"
                      className="pl-10 pr-12"
                    />
                  )}
                />
                <Pressable
                  className="absolute right-3 top-0 z-10 h-[44px] justify-center"
                  onPress={() => setShowPassword((prev) => !prev)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Icon
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color="#747686"
                  />
                </Pressable>
              </View>
              {methods.formState.errors.password?.message && (
                <Text variant="caption-sm" className="ml-1 mt-2 text-destructive">
                  {methods.formState.errors.password.message}
                </Text>
              )}
            </View>

            <View className="mb-8 mr-2 items-end">
              <Link href={PAGE_ROUTES.AUTH.FORGOT_PASSWORD()} asChild>
                <TouchableOpacity
                  className="mt-2"
                  hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}>
                  <Text variant={'link'}>Forgot Password?</Text>
                </TouchableOpacity>
              </Link>
            </View>
            <Button
              testID="SIGN_IN_BUTTON"
              onPress={methods.handleSubmit(onSubmit)}
              isLoading={isButtonLoading}
              disabled={isSignedIn || isLimited}>
              <View className="flex-row items-center gap-x-2">
                <Text className="text-button-md uppercase tracking-wide text-primary-foreground">
                  {isOAuthError ? 'Retry Connection' : isLimited ? 'Please wait' : 'Continue'}
                </Text>
                {!isButtonLoading && <Icon name="arrow-forward" size={18} color="#FFFFFF" />}
              </View>
            </Button>
          </View>
        </FormProvider>

        <AuthFooter
          text="By signing in, you agree to our"
          linkText="Terms of Service"
          linkHref={PAGE_ROUTES.HOME}
          testID="SIGNUP_BUTTON"
        />
      </KeyboardSafeView>
    </Container>
  );
};
