const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Support for .mjs files and import.meta
config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
  'mjs',
];

config.resolver.unstable_conditionNames = [
  'react-native',
  'browser',
];

module.exports = config;

