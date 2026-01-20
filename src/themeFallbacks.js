// Minimal theme fallbacks used when ThemeContext has been removed.
// Keeps components rendering with sensible defaults and prevents ESLint no-undef errors.
export const gradients = {
  default: {
    background: 'transparent',
    textColor: '#0b1220',
    transition: 'none',
  },
};

export const theme = 'default';
export const textColor = gradients[theme].textColor;
export const background = gradients[theme].background;
export const changeTheme = () => {}; // noop

const fallbacks = { gradients, theme, textColor, background, changeTheme };

export default fallbacks;
