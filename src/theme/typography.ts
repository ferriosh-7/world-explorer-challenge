export const typography = {
  // Font sizes
  fontSize: {
    // Body text
    caption: 12,
    body2: 14,
    body1: 16,
    subtitle2: 14,
    subtitle1: 16,
    
    // Headings
    h6: 18,
    h5: 20,
    h4: 24,
    h3: 28,
    h2: 32,
    h1: 36,
    
    // Display
    display3: 48,
    display2: 64,
    display1: 80,
  },
  
  // Font weights
  weight: {
    light: '300' as const,
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
    black: '900' as const,
  },
  
  // Line heights
  lineHeight: {
    tight: 1.2,
    snug: 1.3,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
  
  // Letter spacing
  letterSpacing: {
    tighter: -1,
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
    widest: 1.5,
  },
  
  // Semantic text styles
  textStyles: {
    // Headings
    h1: {
      fontSize: 36,
      fontWeight: '700' as const,
      lineHeight: 1.2,
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 32,
      fontWeight: '700' as const,
      lineHeight: 1.2,
      letterSpacing: -0.5,
    },
    h3: {
      fontSize: 28,
      fontWeight: '600' as const,
      lineHeight: 1.3,
      letterSpacing: -0.5,
    },
    h4: {
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 1.3,
    },
    h5: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: 18,
      fontWeight: '600' as const,
      lineHeight: 1.4,
    },
    
    // Body text
    body1: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 1.6,
    },
    body2: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 1.6,
    },
    
    // Subtitles
    subtitle1: {
      fontSize: 16,
      fontWeight: '500' as const,
      lineHeight: 1.4,
    },
    subtitle2: {
      fontSize: 14,
      fontWeight: '500' as const,
      lineHeight: 1.4,
    },
    
    // Captions and overlines
    caption: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 1.4,
    },
    overline: {
      fontSize: 10,
      fontWeight: '500' as const,
      lineHeight: 1.4,
      letterSpacing: 1.5,
    },
    
    // Buttons
    button: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 1.2,
      letterSpacing: 0.5,
    },
  },
} as const;

export type TypographyKey = keyof typeof typography;