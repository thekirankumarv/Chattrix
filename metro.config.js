const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.assetExts = defaultConfig.resolver.assetExts.filter(
  (ext) => ext !== "svg"
);
defaultConfig.resolver.sourceExts.push("svg");
defaultConfig.transformer.babelTransformerPath = require.resolve(
  "react-native-svg-transformer"
);

module.exports = defaultConfig;
