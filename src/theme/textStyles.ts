import { TextStyle } from 'react-native';
import { typography } from './typography';

// Utility function to get text style
export const getTextStyle = (styleName: keyof typeof typography.textStyles): TextStyle => {
  return typography.textStyles[styleName];
};

// Pre-defined text style objects for easy use
export const textStyles = {
  // Headings
  h1: getTextStyle('h1'),
  h2: getTextStyle('h2'),
  h3: getTextStyle('h3'),
  h4: getTextStyle('h4'),
  h5: getTextStyle('h5'),
  h6: getTextStyle('h6'),
  
  // Body text
  body1: getTextStyle('body1'),
  body2: getTextStyle('body2'),
  
  // Subtitles
  subtitle1: getTextStyle('subtitle1'),
  subtitle2: getTextStyle('subtitle2'),
  
  // Captions
  caption: getTextStyle('caption'),
  overline: getTextStyle('overline'),
  
  // Buttons
  button: getTextStyle('button'),
} as const;

export type TextStyleKey = keyof typeof textStyles;
