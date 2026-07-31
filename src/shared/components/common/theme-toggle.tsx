import { useThemeStore } from '@stores/theme.store';
import { TouchableOpacity } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Moon01Icon, Sun01Icon } from '@hugeicons/core-free-icons';

/**
 * A small icon button that toggles the app colour theme.
 *
 * Shows a sun icon in light mode and a moon icon in dark mode; tapping
 * it flips the theme via `useThemeStore().toggleTheme`.
 */
export const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeStore();
  return (
    <TouchableOpacity onPress={toggleTheme}>
      <HugeiconsIcon
        icon={theme === 'dark' ? Moon01Icon : Sun01Icon}
        size={24}
        color={theme === 'dark' ? '#FFFFFF' : '#000000'}
      />
    </TouchableOpacity>
  );
};
