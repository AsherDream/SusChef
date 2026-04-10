// src/theme/layout.ts

export const layout = {
  // SPACING: consistent gaps
  spacing: {
    xs: 4, // Tiny gaps
    sm: 8, // Elements inside a card
    md: 12, // Gap between list items (Rice vs Eggs)
    lg: 16, // Standard screen padding
    xl: 24, // Section separation
    xxl: 48, // Large empty spaces
  },

  // RADIUS: rounding the corners
  radius: {
    sm: 8, // Small inputs
    md: 12, // Ingredient Cards
    lg: 16, // Larger containers
    full: 9999, // "Pill" Buttons like 'Generate'
  },

  // ICON SIZES
  icon: {
    sm: 16,
    md: 24, // Standard icons (Trash can, Checkbox)
    lg: 32,
  },
};

export const typography = {
  // FONT SIZES
  size: {
    h1: 24,
    h2: 18,
    body: 16,
    caption: 14,
    small: 12,
  },
  // FONT WEIGHTS
  weight: {
    regular: '400',
    medium: '500',
    bold: '700',
  },
};
