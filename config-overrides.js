const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    stream: require.resolve('stream-browserify'),
    util: require.resolve('util/'),
    url: require.resolve('url/'),
    https: require.resolve('https-browserify'),
    http: require.resolve('stream-http'),
    crypto: require.resolve('crypto-browserify'),
    assert: require.resolve('assert/'),
    process: require.resolve('process/browser.js'), // ✅ Ye fix kar diya
  };

  config.plugins = [
    ...(config.plugins || []),
    new webpack.ProvidePlugin({
      process: 'process/browser.js', // ✅ Extension added
      Buffer: ['buffer', 'Buffer'],
    }),
  ];

  return config;
};

// Silence source-map-loader warnings from @mediapipe which ships a reference to a .map that isn't published.
// We exclude that package from source-map-loader so the dev server doesn't spam warnings.
module.exports = function (config) {
  // apply original override first
  config = (function original(cfg) {
    // original override from above
    cfg.resolve.fallback = {
      ...cfg.resolve.fallback,
      stream: require.resolve('stream-browserify'),
      util: require.resolve('util/'),
      url: require.resolve('url/'),
      https: require.resolve('https-browserify'),
      http: require.resolve('stream-http'),
      crypto: require.resolve('crypto-browserify'),
      assert: require.resolve('assert/'),
      process: require.resolve('process/browser.js'),
    };

    cfg.plugins = [
      ...(cfg.plugins || []),
      new webpack.ProvidePlugin({
        process: 'process/browser.js',
        Buffer: ['buffer', 'Buffer'],
      }),
    ];

    return cfg;
  })(config || {});

  if (config.module && Array.isArray(config.module.rules)) {
    config.module.rules = config.module.rules.map((r) => {
      // source-map-loader usually identifies by enforcing: 'pre' and the loader name
      if (r && r.use) {
        const uses = Array.isArray(r.use) ? r.use : [r.use];
        const hasSourceMapLoader = uses.some((u) => (u.loader || u).includes && (u.loader || u).includes('source-map-loader'));
        if (hasSourceMapLoader) {
          return { ...r, exclude: /node_modules\/@mediapipe\/tasks-vision/ };
        }
      }
      return r;
    });
  }

  return config;
};
