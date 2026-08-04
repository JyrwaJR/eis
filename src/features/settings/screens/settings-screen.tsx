import { View, ScrollView } from 'react-native';
import { Container } from '@components/layout/container';
import { SectionHeader } from '@components/common/section-header';
import { SettingRow } from '@components/common/setting-row';
import { useThemeStore } from '@stores/theme.store';
import { useTheme } from '@hooks/use-theme';
import { Moon01Icon, Sun01Icon } from '@hugeicons/core-free-icons';

/**
 * Settings screen for the app.
 *
 * Displays configuration sections including Appearance and Security. The Security
 * section provides a biometric toggle that requires user confirmation via an alert
 * dialog before enabling or disabling local authentication. A version label is
 * rendered at the bottom of the screen.
 *
 * Navigation is handled by Expo Router; this screen is registered at the
 * `(app)/settings` route.
 *
 * @example
 * ```tsx
 * <SettingsScreen />
 * ```
 */
export const SettingsScreen = () => {
  const { theme, toggleTheme } = useThemeStore();
  const resolvedTheme = useTheme();

  /**
   * Handles the user's confirmation to toggle biometric authentication.
   * Closes the confirmation dialog and flips the biometric enabled state.
   */
  return (
    <Container className="flex-1">
      <ScrollView className="flex-1 px-2">
        <View className="py-6">
          {/* Appearance Section */}
          <SectionHeader title="Appearance" />
          <View className="mb-8 overflow-hidden rounded-md border border-border px-4">
            <SettingRow
              icon={theme === 'dark' ? Moon01Icon : Sun01Icon}
              iconColor={resolvedTheme === 'dark' ? '#FFFFFF' : '#64748B'}
              label="Dark Mode"
              description="Reduce eye strain with a darker color scheme"
              value={theme === 'dark'}
              onValueChange={() => toggleTheme()}
              showBorder={true}
            />
          </View>
        </View>
      </ScrollView>
    </Container>
  );
};
