// ThemeContext implementation removed per request.
// Export minimal fallbacks so components importing `ThemeContext` or
// related values continue to work without runtime errors.
export const gradients = {
  default: {
    background: 'transparent',
    textColor: '#0b1220',
    transition: 'none',
  },
};

export const theme = 'default';
export const changeTheme = () => {};
export const previewTheme = null;
export const background = gradients.default.background;
export const textColor = gradients.default.textColor;

export default { gradients, theme, changeTheme, previewTheme, background, textColor };