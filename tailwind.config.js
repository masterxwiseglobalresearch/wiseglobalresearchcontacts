const plugin = require('tailwindcss/plugin');

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      fontFamily: {
        josefin: ['"Josefin Sans"', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern': "url('../assets/images/grid-pattern.svg')",
        'dots-pattern': "url('../assets/images/dots-pattern.svg')",
      },
      colors: {
        transparent: 'transparent',
        dark: '#111827',
        secondaryDark: '#1f2937',
        primaryBlue: '#1e40af',
        secondaryBlue: '#1e3a8a',
      },
      height: {
        'screen-80': '80vh',
        'screen-90': '90vh',
        'screen-95': '95vh',
        'screen-full': '100vh',
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        shineSpin: 'shine-spin 2s linear infinite',
        glowPulse: 'glow-pulse 2s ease-in-out infinite',
        fadeIn: 'fadeIn 1s ease-in-out forwards',
        fadeUp: 'fadeUp 1s ease-out forwards',
        rotateSlow: 'rotate-slow 6s linear infinite',
        slideTextIn: 'slideTextIn 1s ease-out forwards',
        zoomIn: 'zoomIn 1.2s ease-out forwards',
        textReveal: 'textReveal 1.5s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'shine-spin': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'glow-pulse': {
          '0%, 100%': {
            textShadow: '0 0 6px rgba(255,255,255,0.7), 0 0 12px rgba(255,255,255,0.3)',
          },
          '50%': {
            textShadow: '0 0 18px rgba(255,255,255,0.5), 0 0 36px rgba(255,255,255,0.2)',
          },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(30px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'rotate-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        slideTextIn: {
          '0%': { opacity: 0, transform: 'translateX(-50px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        zoomIn: {
          '0%': { opacity: 0, transform: 'scale(0.8)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        textReveal: {
          '0%': {
            opacity: 0,
            clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)',
          },
          '100%': {
            opacity: 1,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
          },
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.shine-hover': {
          position: 'relative',
          boxShadow: '0 0 10px rgba(255,255,255,0.1)',
        },
        '.glow-text': {
          color: '#fff',
          textShadow:
            '0 0 6px rgba(255,255,255,0.7), 0 0 12px rgba(255,255,255,0.3), 0 0 18px rgba(255,255,255,0.2)',
        },
        '.text-stroke': {
          '-webkit-text-stroke': '1px white',
          'text-stroke': '1px white',
          color: 'transparent',
        },
        '.text-gradient': {
          background: 'linear-gradient(to right, #ffffff, #c2d1f0)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        },
      });
    }),
  ],
};