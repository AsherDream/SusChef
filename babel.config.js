module.exports = function (api) {
  // Use cache invalidation based on environment
  api.cache(() => process.env.BABEL_ENV || process.env.NODE_ENV);

  return {
    presets: ['babel-preset-expo'],
  };
};
