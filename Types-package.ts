export interface GeneratedType {
  name: string;
  version: string;
  main: string;
  scripts: Scripts;
  dependencies: Dependencies;
  devDependencies: DevDependencies;
  private: boolean;
}

export interface Dependencies {
  '@expo-google-fonts/inter': string;
  '@hookform/resolvers': string;
  '@hugeicons/core-free-icons': string;
  '@hugeicons/react-native': string;
  '@react-native-vector-icons/ionicons': string;
  '@react-navigation/drawer': string;
  '@react-navigation/native': string;
  '@tanstack/react-query': string;
  axios: string;
  'class-variance-authority': string;
  clsx: string;
  'crypto-js': string;
  expo: string;
  'expo-blur': string;
  'expo-constants': string;
  'expo-crypto': string;
  'expo-dev-client': string;
  'expo-device': string;
  'expo-font': string;
  'expo-linking': string;
  'expo-local-authentication': string;
  'expo-network': string;
  'expo-notifications': string;
  'expo-router': string;
  'expo-secure-store': string;
  'expo-splash-screen': string;
  'expo-status-bar': string;
  'expo-system-ui': string;
  'expo-updates': string;
  lodash: string;
  nativewind: string;
  react: string;
  'react-hook-form': string;
  'react-native': string;
  'react-native-css-interop': string;
  'react-native-gesture-handler': string;
  'react-native-get-random-values': string;
  'react-native-keyboard-aware-scroll-view': string;
  'react-native-reanimated': string;
  'react-native-safe-area-context': string;
  'react-native-screens': string;
  'react-native-svg': string;
  'react-native-worklets': string;
  'rn-fetch-blob': string;
  'sonner-native': string;
  'tailwind-merge': string;
  zod: string;
  zustand: string;
}

export interface DevDependencies {
  '@babel/core': string;
  '@commitlint/cli': string;
  '@commitlint/config-conventional': string;
  '@tanstack/eslint-plugin-query': string;
  '@types/crypto-js': string;
  '@types/react': string;
  eslint: string;
  'eslint-config-expo': string;
  'eslint-config-prettier': string;
  'eslint-plugin-unused-imports': string;
  husky: string;
  'lint-staged': string;
  prettier: string;
  'prettier-plugin-tailwindcss': string;
  tailwindcss: string;
  typescript: string;
}

export interface Scripts {
  android: string;
  dev: string;
  start: string;
  lint: string;
  format: string;
  'format:check': string;
  prepare: string;
  ios: string;
}
