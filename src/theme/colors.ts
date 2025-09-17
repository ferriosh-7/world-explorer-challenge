export const colors = {
  // Primary colors
  primary: '#8b5cf6',
  primaryDark: '#6b21a8',
  primaryLight: '#c4b5fd',
  
  // Secondary colors
  secondary: '#c026d3',
  secondaryLight: '#e879f9',
  secondaryBackground: '#fef7ff',
  
  // Neutral colors
  white: '#fff',
  background: '#faf9ff',
  surface: '#fff',
  border: '#e5e7eb',
  borderLight: '#f3f4f6',
  
  // Text colors
  textPrimary: '#6b21a8',
  textSecondary: '#6b7280',
  textError: '#dc2626',
  textPlaceholder: '#999',
  
  // Status colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#dc2626',
  info: '#3b82f6',
  
  // Shadow colors
  shadow: '#8b5cf6',
  shadowLight: '#c4b5fd',
} as const;

export type ColorKey = keyof typeof colors;
