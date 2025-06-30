// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Enable CSS support
config.resolver.sourceExts.push('css');

// Handle additional extensions and transpilation if needed
config.resolver.sourceExts.push('mjs');

module.exports = config;
