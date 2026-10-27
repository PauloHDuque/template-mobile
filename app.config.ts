import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'TemplateMobile',
  slug: 'template-mobile',
  version: '1.0.0',
  orientation: 'portrait',
  scheme: 'templatemobile',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  splash: {
    resizeMode: 'contain',
    backgroundColor: '#0f172a',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.template.mobile',
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#0f172a',
    },
    package: 'com.template.mobile',
  },
  web: {
    bundler: 'metro',
    output: 'static',
  },
  plugins: ['expo-router', 'expo-secure-store'],
  experiments: {
    typedRoutes: true,
  },
});
