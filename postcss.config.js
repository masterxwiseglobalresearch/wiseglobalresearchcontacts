const plugins = [];

try {
  // Try to load Tailwind if it's available in node_modules
  // This prevents the dev server from crashing when the package
  // hasn't been installed yet (useful for CI or incomplete installs).
  plugins.push(require('tailwindcss'));
} catch (err) {
  // eslint-disable-next-line no-console
  console.warn('tailwindcss not found. Skipping Tailwind plugin in PostCSS.');
}

try {
  plugins.push(require('autoprefixer'));
} catch (err) {
  // eslint-disable-next-line no-console
  console.warn('autoprefixer not found. Skipping Autoprefixer plugin in PostCSS.');
}

module.exports = {
  plugins,
};
