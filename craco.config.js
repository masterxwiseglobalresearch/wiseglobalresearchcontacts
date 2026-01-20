// craco.config.js
const removeConsole = [
  'transform-remove-console',
  { exclude: ['error', 'warn'] },
];

module.exports = {
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
  babel: {
    plugins: process.env.NODE_ENV === 'production' ? [removeConsole] : [],
  },
};
