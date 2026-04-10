// src/theme/colors.ts
// Static palette objects; dynamic selection happens via ThemeProvider/useThemeColors.

export const lightPalette = {
  primary: '#2D6A4F', // Forest Green
  secondary: '#FF9F1C', // Carrot Orange
  background: '#F8F9FA', // Off-White
  surface: '#FFFFFF',
  text: {
    primary: '#1B4332', // Dark Ivy
    secondary: '#6C757D', // Slate Gray
    disabled: '#D1D5DB',
  },
  status: {
    error: '#E63946', // Berry Red
    success: '#10B981',
  },
  border: '#E5E7EB',
};

export const darkPalette = {
  primary: '#52B788', // Sage Green
  secondary: '#FDFFB6', // Soft Lemon
  background: '#121212', // Deep Charcoal
  surface: '#1E1E1E', // Elevated Gray
  text: {
    primary: '#EDF2F4', // Cool White
    secondary: '#ADB5BD', // Muted Silver
    disabled: '#4B5563',
  },
  status: {
    error: '#FF4D6D', // Bright Rose
    success: '#34D399',
  },
  border: '#2C2C2C',
};

export type AppColors = typeof lightPalette;

// Legacy export for existing components; defaults to light palette.
export const colors: AppColors = lightPalette;
