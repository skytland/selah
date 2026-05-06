const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Support for crypto polyfills required by @solana/web3.js
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  crypto: require.resolve('expo-crypto'),
  stream: require.resolve('stream-browserify'),
  url: require.resolve('url'),
  zlib: require.resolve('browserify-zlib'),
  http: require.resolve('@tradle/react-native-http'),
  https: require.resolve('https-browserify'),
  os: require.resolve('os-browserify/browser'),
  path: require.resolve('path-browserify'),
  buffer: require.resolve('@craftzdog/react-native-buffer'),
};

module.exports = config;
