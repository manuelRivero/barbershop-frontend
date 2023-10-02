// gluestack-ui.config.ts
import {createConfig, config as defaultConfig} from '@gluestack-ui/themed';

export const config = createConfig({
  ...defaultConfig.theme,
  tokens: {
    ...defaultConfig.theme.tokens,

    colors: {
      ...defaultConfig.theme.tokens.colors,

      primary50: '#f9f3ea',
      primary100: '#f1e2ca',
      primary200: '#e8cfa6',
      primary300: '#debb82',
      primary400: '#d7ad68',
      primary500: '#d09e4d',
      primary600: '#cb9646',
      primary700: '#c48c3d',
      primary800: '#be8234',
      primary900: '#b37025',
      textDark900: '#1f3d56',
      textDark500: '#367187',
      textDark100: '#6ba4b3',
    },
  },
});

// Get the type of Config
type ConfigType = typeof config;

// Extend the internal ui config
declare module '@gluestack-ui/themed' {
  interface UIConfig extends ConfigType {}
}
