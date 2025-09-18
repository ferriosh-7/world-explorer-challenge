import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { textStyles } from './textStyles';

export { colors, typography, spacing, textStyles };

export const theme = {
  colors,
  typography,
  spacing,
  textStyles,
} as const;
